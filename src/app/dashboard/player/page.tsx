'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';

type UBLBowler = {
    bowler_name: string;
    team_name: string;
    games: number;
    average: number;
    high_game: number;
    high_series: number;
    total_pins: number;
    division: string;
    week_number: number;
    last_week_score: number;
    last_week_avg: number;
    game1: number | null;
    game2: number | null;
    series: number | null;
    handicap: number;
};

type ScoreRecord = {
    id: string;
    player_id: string;
    player_name: string;
    event_name: string | null;
    alley: string | null;
    game_number: number;
    tournament_tier: string | null;
    frame_scores: number[][];
    total_score: number;
    created_at: string;
    updated_at: string;
};

type LeagueRecord = {
    id: string;
    bowler_name: string;
    record_type: string;
    value: string;
    sub_label: string;
};

type TeamStanding = {
    team_name: string;
    won: number;
    lost: number;
    total_pins: number;
    division: string;
};

// Counter Hook helper
function Counter({ value, duration = 1000, mounted }: { value: number; duration?: number; mounted: boolean }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!mounted) {
            setCount(0);
            return;
        }
        let start = 0;
        const end = Math.floor(value);
        if (end <= 0) {
            setCount(0);
            return;
        }
        const range = end - start;
        let current = start;
        const stepTime = Math.abs(Math.floor(duration / (range || 1)));
        const timer = setInterval(() => {
            current += Math.ceil(range / 50); // Faster increment for large numbers
            if (current >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(current);
            }
        }, Math.max(stepTime, 20));
        return () => clearInterval(timer);
    }, [value, mounted, duration]);
    return <span>{count.toLocaleString()}</span>;
}

export default function PlayerDashboard() {
    const [userProfile, setUserProfile] = useState<any>(null);
    const [selectedBowler, setSelectedBowler] = useState<UBLBowler | null>(null);
    const [allPlaymasters, setAllPlaymasters] = useState<UBLBowler[]>([]);
    const [leagueRecords, setLeagueRecords] = useState<LeagueRecord[]>([]);
    const [teamStandings, setTeamStandings] = useState<TeamStanding[]>([]);
    const [matchHistory, setMatchHistory] = useState<ScoreRecord[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [expandedSession, setExpandedSession] = useState<string | null>(null);

    const supabase = useMemo(() => createClient(), []);

    const initDashboard = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Get Auth User & Profile
            const { data: { user } } = await supabase.auth.getUser();
            let profileName = "";
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();
                if (profile) {
                    setUserProfile(profile);
                    profileName = profile.display_name || profile.name || "";
                }
            }

            // 2. Fetch All Playmasters Stats (Monday/Tuesday)
            const { data: ublStats } = await supabase
                .from('ubl_bowler_stats')
                .select('*')
                .eq('is_playmaster', true)
                .order('average', { ascending: false });

            // 3. Fetch Warriors Data (Wednesday)
            const { data: warriorsProfiles } = await supabase
                .from('profiles')
                .select('id, name, display_name, team_id, teams(name)')
                .eq('is_active', true);
            
            const playmasterWarriorsOnly = warriorsProfiles?.filter((p: any) => {
                const teamObj = Array.isArray(p.teams) ? p.teams[0] : p.teams;
                return teamObj?.name?.toUpperCase()?.includes('WARRIORS');
            }) || [];

            const warriorsStats: UBLBowler[] = [];
            for (const p of playmasterWarriorsOnly) {
                const { data: scores } = await supabase
                    .from('game_scores')
                    .select('scratch_score, week_number')
                    .eq('player_id', p.id);
                
                if (scores && scores.length > 0) {
                    const totalPins = scores.reduce((sum, s) => sum + s.scratch_score, 0);
                    const highGame = Math.max(...scores.map(s => s.scratch_score));
                    const avg = totalPins / scores.length;
                    const latestWeek = Math.max(...scores.map(s => s.week_number));
                    
                    const latestWeekScores = scores.filter(s => s.week_number === latestWeek);
                    const latestSeries = latestWeekScores.reduce((sum, s) => sum + s.scratch_score, 0);

                    const teamObj = Array.isArray(p.teams) ? p.teams[0] : p.teams;
                    warriorsStats.push({
                        bowler_name: p.display_name || p.name,
                        team_name: teamObj?.name || 'PLAYMASTERS WARRIORS',
                        games: scores.length,
                        average: Math.round(avg * 100) / 100,
                        high_game: highGame,
                        high_series: latestSeries, 
                        total_pins: totalPins,
                        division: 'Wednesday',
                        week_number: latestWeek,
                        last_week_score: latestWeekScores[0]?.scratch_score || 0,
                        last_week_avg: avg,
                        game1: latestWeekScores[0]?.scratch_score || 0,
                        game2: latestWeekScores[1]?.scratch_score || 0,
                        series: latestSeries,
                        handicap: 0
                    });
                }
            }

            const combinedStats = [...(ublStats || []), ...warriorsStats].sort((a, b) => b.average - a.average);
            setAllPlaymasters(combinedStats);

            // 4. Auto-select current player
            const playerMatch = combinedStats.find(b => 
                profileName && (b.bowler_name.toLowerCase() === profileName.toLowerCase() || 
                profileName.toLowerCase().includes(b.bowler_name.toLowerCase()))
            );
            setSelectedBowler(playerMatch || combinedStats[0] || null);

            // 5. Fetch Support Data
            const [{ data: records }, { data: standings }] = await Promise.all([
                supabase.from('league_records').select('*').eq('is_active', true),
                supabase.from('ubl_team_standings').select('*')
            ]);

            if (records) setLeagueRecords(records);
            if (standings) setTeamStandings(standings);

        } catch (err) {
            console.error("Dashboard Init Error:", err);
        } finally {
            setLoading(false);
            setTimeout(() => setMounted(true), 100);
        }
    }, [supabase]);

    useEffect(() => {
        initDashboard();
    }, [initDashboard]);

    const fetchHistory = useCallback(async (bowlerName: string) => {
        const { data } = await supabase
            .from('scores')
            .select('*')
            .eq('player_name', bowlerName)
            .order('updated_at', { ascending: false });
        if (data) setMatchHistory(data);
    }, [supabase]);

    useEffect(() => {
        if (selectedBowler) {
            fetchHistory(selectedBowler.bowler_name);
        }
    }, [selectedBowler, fetchHistory]);

    const teamStanding = useMemo(() => {
        if (!selectedBowler) return null;
        return teamStandings.find(s => s.team_name.toUpperCase().includes(selectedBowler.team_name.split(' ')[1]?.toUpperCase() || selectedBowler.team_name.toUpperCase()));
    }, [selectedBowler, teamStandings]);

    const rivals = useMemo(() => {
        if (!selectedBowler || allPlaymasters.length < 2) return [];
        const index = allPlaymasters.findIndex(b => b.bowler_name === selectedBowler.bowler_name);
        const peers = [];
        if (index > 0) peers.push(allPlaymasters[index - 1]);
        if (index < allPlaymasters.length - 1) peers.push(allPlaymasters[index + 1]);
        return peers;
    }, [selectedBowler, allPlaymasters]);

    const calculateRunningTotals = (currentRolls: number[][]): number[] => {
        const totals: number[] = [];
        let cumulative = 0;
        const flatRolls: number[] = [];
        for (const frame of currentRolls) flatRolls.push(...frame);
        
        let rollIndex = 0;
        for (let f = 0; f < 10; f++) {
            const frame = currentRolls[f];
            if (!frame || frame.length === 0) { totals.push(cumulative); continue; }
            if (f === 9) {
                cumulative += frame.reduce((a, b) => a + b, 0);
                totals.push(cumulative);
                break;
            }
            const isStrike = frame[0] === 10;
            const isSpare = !isStrike && frame.length > 1 && frame[0] + frame[1] === 10;
            if (isStrike) {
                cumulative += 10 + (flatRolls[rollIndex + 1] || 0) + (flatRolls[rollIndex + 2] || 0);
                rollIndex += 1;
            } else if (isSpare) {
                cumulative += 10 + (flatRolls[rollIndex + 2] || 0);
                rollIndex += 2;
            } else {
                cumulative += frame.reduce((a, b) => a + b, 0);
                rollIndex += frame.length;
            }
            totals.push(cumulative);
        }
        return totals;
    };

    const renderRollValue = (f: number, r: number, rolls: number[][]) => {
        const frame = rolls[f];
        if (!frame || frame[r] === undefined || frame[r] === -1) return '';
        const v = frame[r];
        if (f < 9) {
            if (v === 10 && r === 0) return '';
            if (v === 10 && r === 1) return 'X';
            if (r === 1 && frame[0] + v === 10) return '/';
            return v === 0 ? '-' : v.toString();
        }
        if (r === 0 && v === 10) return 'X';
        if (r === 1) {
            if (v === 10) return 'X';
            if (frame[0] !== 10 && frame[0] + v === 10) return '/';
            return v === 0 ? '-' : v.toString();
        }
        if (v === 10) return 'X';
        if (frame[1] !== 10 && (frame[0] === 10 || frame[0] + frame[1] === 10) && frame[1] + v === 10) return '/';
        return v === 0 ? '-' : v.toString();
    };

    const groupedHistory = useMemo(() => {
        const groups: Record<string, ScoreRecord[]> = {};
        matchHistory.forEach(s => {
            const d = new Date(s.updated_at || s.created_at).toLocaleDateString();
            const e = s.event_name || 'Practice / Ungrouped';
            const a = s.alley || 'Nairobi Lanes (Various)';
            const k = `${d}|${e}|${a}`;
            if (!groups[k]) groups[k] = [];
            groups[k].push(s);
        });
        return groups;
    }, [matchHistory]);

    if (loading) return (
        <div className="min-h-screen bg-[#080B3A] flex items-center justify-center font-sans">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(232,32,48,0.3)]" />
        </div>
    );

    const splitDiff = (selectedBowler?.game2 || 0) - (selectedBowler?.game1 || 0);
    const splitType = splitDiff > 15 ? "Strong Finisher" : splitDiff < -15 ? "Quick Starter" : "Consistent";
    const splitColor = splitDiff > 15 ? "text-pink-400 border-pink-400 bg-pink-400/10" : splitDiff < -15 ? "text-red-500 border-red-500 bg-red-500/10" : "text-blue-300 border-blue-300 bg-blue-300/10";

    return (
        <div className="min-h-screen bg-[#080B3A] text-white font-sans pb-32 overflow-x-hidden selection:bg-red-500/30">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-red-600 blur-[200px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-purple-600 blur-[200px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero Header */}
                <header className="mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-white/5">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-red-600 text-[10px] font-black uppercase tracking-[2px] rounded italic">Live Core</span>
                                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[2px]">Season 16 · Week {selectedBowler?.week_number || 11}</span>
                            </div>
                            <h1 className="text-6xl sm:text-8xl font-['Barlow_Condensed'] font-black italic tracking-tighter text-white uppercase leading-none">
                                WELCOME, <span className="text-red-600">{selectedBowler?.bowler_name || 'MASTER'}</span>
                            </h1>
                            <p className="text-blue-200 font-bold uppercase tracking-[6px] text-xs italic opacity-80">
                                {selectedBowler?.team_name || 'UNASSIGNED UNIT'} {'//'} UNIT STATUS: ACTIVE
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-4">
                            <select 
                                className="bg-[#0D1245] border border-white/10 rounded-xl px-6 py-4 text-[11px] font-bold uppercase tracking-[3px] outline-none focus:border-red-600 hover:bg-white/5 transition-all cursor-pointer shadow-2xl appearance-none pr-12"
                                value={selectedBowler?.bowler_name || ""}
                                onChange={(e) => {
                                    const match = allPlaymasters.find(b => b.bowler_name === e.target.value);
                                    if (match) setSelectedBowler(match);
                                }}
                            >
                                {allPlaymasters.map(b => (
                                    <option key={b.bowler_name} value={b.bowler_name} className="bg-[#080B3A]">{b.bowler_name} ({b.team_name})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content (3 cols) */}
                    <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        {/* 4-Stat Cockpit */}
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Average', val: selectedBowler?.average || 0, trend: (selectedBowler?.average || 0) - (selectedBowler?.last_week_avg || 0), color: 'text-white' },
                                { label: 'High Series', val: selectedBowler?.high_series || 0, color: 'text-pink-400', icon: '🔥' },
                                { label: 'High Game', val: selectedBowler?.high_game || 0, color: 'text-red-600', icon: '⚡' },
                                { label: 'Total Pins', val: selectedBowler?.total_pins || 0, color: 'text-blue-200' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group shadow-2xl hover:border-white/20 transition-all">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 text-2xl group-hover:opacity-30 transition-opacity">{stat.label === 'Average' ? '🎳' : '🎖️'}</div>
                                    <div className={`text-4xl md:text-5xl font-['Barlow_Condensed'] font-black italic ${stat.color} mb-2`}>
                                        <Counter value={stat.val} mounted={mounted} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
                                        {stat.trend !== undefined && stat.trend !== 0 && (
                                            <span className={`text-[10px] font-bold ${stat.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {stat.trend > 0 ? '↑' : '↓'} {Math.abs(Math.round(stat.trend * 10) / 10)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Performance Grid: G1 vs G2 + Team Rank */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-['Barlow_Condensed'] font-black uppercase italic text-white flex items-center gap-3">
                                        <span className="text-red-600 animate-pulse">◈</span>
                                        G1 vs G2 Split
                                    </h3>
                                    <span className={`px-4 py-1 border rounded-full text-[9px] font-black uppercase tracking-widest ${splitColor}`}>
                                        {splitType}
                                    </span>
                                </div>
                                <div className="flex items-end gap-12 h-40 px-4">
                                    {[
                                        { label: 'Game 1', val: selectedBowler?.game1 || 0, col: 'bg-blue-600' },
                                        { label: 'Game 2', val: selectedBowler?.game2 || 0, col: splitDiff > 0 ? 'bg-pink-500' : 'bg-red-600' }
                                    ].map((g, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                            <div className="text-2xl font-['Barlow_Condensed'] font-black text-white">{g.val}</div>
                                            <div className="w-full relative h-[100%]">
                                                <div 
                                                    className={`absolute bottom-0 w-full rounded-t-xl ${g.col} transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(255,255,255,0.05)]`}
                                                    style={{ height: mounted ? `${Math.min(100, (g.val / 300) * 100)}%` : '0%' }}
                                                >
                                                    <div className="w-full h-full bg-gradient-to-tr from-black/20 to-transparent flex items-start justify-center pt-2">
                                                        <div className="w-1 h-2/3 bg-white/10 rounded-full" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{g.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative group overflow-hidden">
                                <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-pink-500/5 rounded-full blur-3xl group-hover:bg-pink-500/10 transition-all duration-700" />
                                <h3 className="text-xl font-['Barlow_Condensed'] font-black uppercase italic text-white mb-8 flex items-center gap-3">
                                    <span className="text-pink-500 animate-spin-slow">❂</span>
                                    Team Context
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Team Standing</p>
                                            <h4 className="text-3xl font-['Barlow_Condensed'] font-black uppercase italic text-white">{selectedBowler?.team_name}</h4>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-5xl font-['Barlow_Condensed'] font-black italic text-red-600">
                                                {selectedBowler?.division === 'Wednesday' ? '--' : (teamStandings.findIndex(t => t.team_name.toUpperCase().includes(selectedBowler?.team_name.split(' ')[1]?.toUpperCase() || '')) + 1 || '--')}
                                            </p>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Division Rank</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'Won', val: teamStanding?.won || 0, col: 'text-emerald-400' },
                                            { label: 'Lost', val: teamStanding?.lost || 0, col: 'text-red-500' },
                                            { label: 'TPins', val: (teamStanding?.total_pins || 0).toLocaleString(), col: 'text-white' }
                                        ].map((s, i) => (
                                            <div key={i} className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                                                <p className={`text-xl font-['Barlow_Condensed'] font-black italic ${s.col}`}>{s.val}</p>
                                                <p className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Rivalry Module */}
                        <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                             <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-['Barlow_Condensed'] font-black uppercase italic text-white flex items-center gap-3">
                                    <span className="text-blue-400">⚔️</span>
                                    Rivalry Radar
                                </h3>
                                <Link href="/dashboard/comparison" className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">Compare All ➔</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {rivals.map((rival, i) => {
                                    const diff = (selectedBowler?.average || 0) - rival.average;
                                    return (
                                        <div key={i} className="flex items-center gap-6 p-6 bg-white/[0.03] border border-white/5 rounded-3xl group hover:bg-white/[0.05] transition-all">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0D1245] to-[#080B3A] border border-white/10 flex items-center justify-center text-xl font-['Barlow_Condensed'] font-black italic text-gray-400 group-hover:text-white transition-colors">
                                                {rival.bowler_name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-['Barlow_Condensed'] font-black uppercase italic text-white leading-none">{rival.bowler_name}</h4>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 italic leading-none">{rival.team_name}</p>
                                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-blue-400 h-full" style={{ width: `${Math.min(100, (rival.average / 300) * 100)}%` }} />
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-xl font-['Barlow_Condensed'] font-black italic ${diff >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                                    {diff >= 0 ? '+' : ''}{diff.toFixed(1)}
                                                </div>
                                                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Avg Gap</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Match History Hub */}
                         <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                             <div className="p-8 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                                <h3 className="text-xl font-['Barlow_Condensed'] font-black uppercase italic text-white flex items-center gap-3">
                                    <span className="text-red-600 text-2xl">🗓️</span>
                                    Service Record
                                </h3>
                                <p className="text-gray-400 text-[9px] mt-1 font-bold uppercase tracking-[4px] italic opacity-60">Verified Mission Logs</p>
                            </div>
                            <div className="p-6 space-y-4">
                                {Object.keys(groupedHistory).length > 0 ? (
                                    Object.entries(groupedHistory).map(([key, scores]) => {
                                        const [date, event, alley] = key.split('|');
                                        const isExpanded = expandedSession === key;
                                        return (
                                            <div key={key} className={`border ${isExpanded ? 'border-red-600/30 bg-red-600/5' : 'border-white/5 bg-white/[0.02]'} rounded-3xl overflow-hidden transition-all duration-300`}>
                                                <button 
                                                    onClick={() => setExpandedSession(isExpanded ? null : key)}
                                                    className="w-full p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="text-left">
                                                        <p className="text-[10px] text-red-600 font-black uppercase tracking-[3px] mb-1 italic">{date}</p>
                                                        <h4 className="text-2xl font-['Barlow_Condensed'] font-black uppercase italic text-white tracking-tight leading-none">{event}</h4>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{alley}</p>
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <div className="text-right">
                                                            <p className="text-[10px] text-gray-600 font-black uppercase mb-1">Session Avg</p>
                                                            <p className="text-4xl font-['Barlow_Condensed'] font-black italic text-white leading-none">
                                                                {Math.round(scores.reduce((a, b) => a + b.total_score, 0) / scores.length)}
                                                            </p>
                                                        </div>
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'rotate-180 bg-red-600 text-white shadow-[0_0_15px_rgba(232,32,48,0.3)]' : 'bg-white/5 text-gray-400'}`}>
                                                            ↓
                                                        </div>
                                                    </div>
                                                </button>

                                                {isExpanded && (
                                                    <div className="p-8 border-t border-white/5 space-y-12 animate-in slide-in-from-top-4 duration-300 bg-black/20">
                                                        {scores.sort((a, b) => a.game_number - b.game_number).map((game, idx) => {
                                                            const frameTotals = calculateRunningTotals(game.frame_scores);
                                                            return (
                                                                <div key={idx} className="space-y-6">
                                                                    <div className="flex justify-between items-end">
                                                                        <div className="space-y-1">
                                                                            <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase text-red-600 tracking-widest italic border border-white/5">GAME {game.game_number}</span>
                                                                            <p className="text-[10px] font-bold uppercase text-gray-600 tracking-widest ml-1">{game.tournament_tier?.replace('_', ' ') || 'REGULAR SZN'}</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest mr-3">FINAL SCORE</span>
                                                                            <span className="text-6xl font-['Barlow_Condensed'] font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{game.total_score}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="overflow-x-auto pb-4 custom-scrollbar">
                                                                        <div className="min-w-[800px] flex gap-2">
                                                                            {Array.from({length: 10}).map((_, f) => (
                                                                                <div key={f} className="flex-1 bg-[#0D1245] border border-white/5 rounded-2xl flex flex-col overflow-hidden min-h-[100px] shadow-lg">
                                                                                    <div className="text-[9px] font-black text-center py-2 bg-white/5 text-gray-500 uppercase tracking-tighter">{f + 1}</div>
                                                                                    <div className="flex h-8 border-b border-white/5">
                                                                                        <div className="flex-1 border-r border-white/5 flex items-center justify-center text-sm font-['Barlow_Condensed'] font-black italic">{renderRollValue(f, 0, game.frame_scores)}</div>
                                                                                        <div className={`flex-1 flex items-center justify-center text-sm font-['Barlow_Condensed'] font-black italic ${f === 9 ? 'border-r border-white/5' : ''}`}>{renderRollValue(f, (f === 9 && game.frame_scores[f]?.[0] === 10 ? 1 : (game.frame_scores[f]?.length > 1 ? 1 : -1)), game.frame_scores)}</div>
                                                                                        {f === 9 && <div className="flex-1 flex items-center justify-center text-sm font-['Barlow_Condensed'] font-black italic">{renderRollValue(f, 2, game.frame_scores)}</div>}
                                                                                    </div>
                                                                                    <div className="flex-1 flex items-center justify-center font-['Barlow_Condensed'] font-black italic text-3xl text-red-600 py-2">{frameTotals[f] || ''}</div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-16 text-center border-2 border-dashed border-white/5 rounded-3xl mx-4 opacity-40">
                                        <p className="text-gray-400 font-bold uppercase tracking-[4px] text-xs">No active mission logs found.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Components (1 col) */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
                        {/* Hall of Fame Highlights */}
                        <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                            <h3 className="text-xl font-['Barlow_Condensed'] font-black uppercase italic text-white mb-8 flex items-center gap-3">
                                <span className="text-yellow-500 animate-bounce">🏆</span>
                                Hall of Fame
                            </h3>
                            <div className="space-y-4">
                                {leagueRecords.map((rec) => (
                                    <div key={rec.id} className="p-5 bg-white/[0.03] border-l-4 border-red-600 rounded-r-2xl hover:bg-white/[0.05] transition-all group">
                                         <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">{rec.record_type}</p>
                                         <div className="flex justify-between items-end">
                                             <p className="text-lg font-['Barlow_Condensed'] font-black uppercase italic text-white group-hover:text-red-600 transition-colors">{rec.bowler_name}</p>
                                             <p className="text-3xl font-['Barlow_Condensed'] font-black italic text-red-600">{rec.value}</p>
                                         </div>
                                         <p className="text-[8px] text-gray-600 uppercase tracking-tighter mt-1">{rec.sub_label}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Achievements */}
                        <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                             <h3 className="text-xl font-['Barlow_Condensed'] font-black uppercase italic text-white mb-8 flex items-center gap-3">
                                <span className="text-pink-400 animate-pulse">🎖️</span>
                                Badges
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { name: "Verified", sub: "Core Playmaster", unlocked: true, icon: "🎖️" },
                                    { name: "Centurion", sub: "Avg 150+", unlocked: (selectedBowler?.average || 0) >= 150, icon: "🏅" },
                                    { name: "Apex Striker", sub: "Avg 175+", unlocked: (selectedBowler?.average || 0) >= 175, icon: "🔥" },
                                    { name: "Power 400", sub: "Series 400+", unlocked: (selectedBowler?.high_series || 0) >= 400, icon: "⚡" },
                                    { name: "Vet Status", sub: "20+ Sessions", unlocked: (selectedBowler?.games || 0) >= 20, icon: "🛡️" }
                                ].map((a, i) => (
                                    <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${a.unlocked ? 'bg-pink-400/5 border-pink-400/20 shadow-[0_0_15px_rgba(244,114,182,0.1)]' : 'bg-black/20 border-white/5 opacity-30 grayscale'}`}>
                                        <span className="text-2xl">{a.icon}</span>
                                        <div className="flex-1">
                                            <p className={`font-bold uppercase tracking-widest text-[10px] ${a.unlocked ? 'text-pink-400' : 'text-gray-400'}`}>{a.name}</p>
                                            <p className="text-[8px] uppercase tracking-widest text-gray-500">{a.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Quick Actions */}
                        <Link href="/dashboard/player/log-game" className="block bg-red-600 p-0.5 rounded-3xl group shadow-[0_0_20px_rgba(232,32,48,0.2)] hover:shadow-[0_0_40px_rgba(232,32,48,0.4)] transition-all">
                             <div className="bg-[#080B3A] rounded-[22px] p-8 group-hover:bg-transparent transition-colors">
                                <h3 className="font-['Barlow_Condensed'] font-black italic text-3xl uppercase tracking-tighter text-white mb-2 group-hover:text-white transition-colors leading-none">Log Mission</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white/80 transition-colors mb-6 italic opacity-60">Record unit output data</p>
                                <div className="w-full h-24 bg-black/20 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/5">
                                    <span className="text-4xl text-red-600 group-hover:scale-125 transition-all">🎳</span>
                                </div>
                             </div>
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Global Nav CTA */}
            <div className="fixed bottom-0 left-0 w-full p-6 flex justify-center pointer-events-none z-50">
                <div className="flex gap-4 p-2 bg-[#0D1245]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl pointer-events-auto">
                    <Link href="/dashboard" className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Global Intel</Link>
                    <div className="w-px h-4 bg-white/10 my-auto" />
                    <Link href="/dashboard/player" className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-red-500">My Station</Link>
                    <div className="w-px h-4 bg-white/10 my-auto" />
                    <Link href="/dashboard/competition" className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">War Room</Link>
                </div>
            </div>
        </div>
    );
}
