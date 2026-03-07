'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type PlayerProfile = {
    id: string;
    name: string;
    role: string;
    team_id: string | null;
    team_name?: string;
};

type Teammate = {
    id: string;
    name: string;
    role: string;
};

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

type UBLBowler = {
    bowler_name: string;
    team_name: string;
    games: number;
    average: number;
    high_game: number;
    high_series: number;
    last_week_score: number;
    handicap: number;
    high_game_hdcp: number;
    high_series_hdcp: number;
    division: string;
};

type TeamStanding = {
    id: string;
    team_name: string;
    won: number;
    lost: number;
    total_pins: number;
    high_game: number;
    high_series: number;
    division: string;
};

type DivisionMetrics = {
    avgScore: number;
    medianScore: number;
    topScore: number;
    totalBowlers: number;
    avgG1: number;
    avgG2: number;
};

type TeamProjection = {
    team_name: string;
    current_won: number;
    max_possible_won: number;
    status: 'In Contention' | 'Eliminated';
    gap: number;
    nextOpponent?: string;
    nextOpponentRank?: number;
};

type TeamConsistency = {
    team_name: string;
    g1_total: number;
    g2_total: number;
    gap: number;
    consistency_label: string;
};

type ScheduleMatch = {
    week: number;
    division: string;
    home_team: string;
    away_team: string;
};

export default function PlayerDashboard() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profile, setProfile] = useState<PlayerProfile | null>(null);
    const [teammates, setTeammates] = useState<Teammate[]>([]);
    const [ublProfile, setUblProfile] = useState<UBLBowler | null>(null);
    const [allPlaymasters, setAllPlaymasters] = useState<UBLBowler[]>([]);
    const [selectedBowlerName, setSelectedBowlerName] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [uploadMessage, setUploadMessage] = useState('');
    const [activeDivision, setActiveDivision] = useState<'Monday' | 'Tuesday'>('Monday');
    const [teams, setTeams] = useState<TeamStanding[]>([]);
    const [divMetrics, setDivMetrics] = useState<Record<string, DivisionMetrics>>({});
    const [projections, setProjections] = useState<TeamProjection[]>([]);
    const [teamConsistency, setTeamConsistency] = useState<TeamConsistency[]>([]);
    const [topPOA, setTopPOA] = useState<UBLBowler[]>([]);
    const [womenElite, setWomenElite] = useState<UBLBowler[]>([]);
    const [stats, setStats] = useState({
        totalMatches: 0,
        seasonAvg: 0,
        totalPins: 0,
        historicalFrameAvgs: Array(10).fill(0),
        recentGameFrames: Array(10).fill(0),
        fatigueFrames: [] as number[],
        recentGameScores: [] as number[],
        recentGameDates: [] as string[],
        heatmapData: [] as number[][]
    });

    const WOMEN_PLAYERS = [
        'DOROTHY', 'DARSHI', // Monday
        'SONIKA', 'JUSTINE', 'ROSE', 'NILMA', 'DASHNI', 'AMRIT', 'ALEXA' // Tuesday
    ];

    useEffect(() => {
        let isMounted = true;

        async function fetchUserData() {
            try {
                const supabase = createClient();
                // 1. Fetch Profile (use a default or try to get session if it exists)
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    if (isMounted) setLoading(false);
                    return;
                }

                // 1. Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*, teams(name)')
                    .eq('id', user.id)
                    .single();

                if (profileError || !profileData) {
                    // Fallback for new users without a profile yet
                    if (isMounted) setProfile({
                        id: user.id,
                        name: user.email?.split('@')[0].toUpperCase() || 'PLAYER',
                        role: 'player',
                        team_id: null
                    });
                } else {
                    if (isMounted) setProfile({
                        ...profileData,
                        team_name: profileData.teams?.name
                    });

                    // 2. Fetch Teammates if in a team
                    if (profileData.team_id) {
                        const { data: teammatesData } = await supabase
                            .from('profiles')
                            .select('id, name, role')
                            .eq('team_id', profileData.team_id)
                            .neq('id', user.id);

                        if (teammatesData && isMounted) setTeammates(teammatesData);
                    }

                    // 3. Fetch Match Stats
                    const { data: scoresData } = await supabase
                        .from('scores')
                        .select('total_score, frame_scores, updated_at')
                        .eq('player_id', user.id);

                    if (scoresData && scoresData.length > 0 && isMounted) {
                        const totalPins = scoresData.reduce((sum, s) => sum + (s.total_score || 0), 0);
                        const seasonAvg = Math.round(totalPins / scoresData.length);

                        const totalFrameScores = new Array(10).fill(0);
                        const frameCounts = new Array(10).fill(0);

                        const sortedScores = [...scoresData].sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());

                        scoresData.forEach(s => {
                            const frames = (s.frame_scores as any[] || []).map(f => typeof f === 'object' && f !== null ? (f.score || 0) : Number(f));
                            for (let i = 0; i < Math.min(10, frames.length); i++) {
                                totalFrameScores[i] += frames[i];
                                frameCounts[i]++;
                            }
                        });

                        const historicalFrameAvgs = totalFrameScores.map((t, i) => frameCounts[i] > 0 ? Math.round(t / frameCounts[i]) : 0);
                        
                        const mostRecentScores = sortedScores[0];
                        const recentGameFrames = (mostRecentScores?.frame_scores as any[] || []).map(f => typeof f === 'object' && f !== null ? (f.score || 0) : Number(f));
                        while (recentGameFrames.length < 10) recentGameFrames.push(0);

                        const fatigueFrames = recentGameFrames.map((score, i) => {
                            if (frameCounts[i] > 0 && score < historicalFrameAvgs[i] - 1) return i;
                            return -1;
                        }).filter(i => i !== -1);

                        // Form Trend Data (Last 10 Games)
                        const recent10 = sortedScores.slice(0, 10).reverse();
                        const recentGameScores = recent10.map(s => s.total_score || 0);
                        const recentGameDates = recent10.map(s => new Date(s.updated_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

                        // Heatmap Data (Last 5 Games, 10 Frames)
                        const recent5 = sortedScores.slice(0, 5);
                        const heatmapData = recent5.map(s => {
                            const f = (s.frame_scores as any[] || []).map(frame => typeof frame === 'object' && frame !== null ? (frame.score || 0) : Number(frame));
                            while (f.length < 10) f.push(0);
                            return f;
                        });

                        setStats({
                            totalMatches: scoresData.length,
                            seasonAvg,
                            totalPins,
                            historicalFrameAvgs,
                            recentGameFrames,
                            fatigueFrames,
                            recentGameScores,
                            recentGameDates,
                            heatmapData
                        });
                    }

                }

                // 4. Fetch Multi-Entity UBL Analytics (Migrated from Standings)
                const [
                    { data: teamData }, 
                    { data: allBowlerData },
                    { data: scheduleData }
                ] = await Promise.all([
                    supabase.from('ubl_team_standings')
                        .select('*')
                        .eq('division', activeDivision)
                        .order('won', { ascending: false }),
                    supabase.from('ubl_bowler_stats')
                        .select('*')
                        .order('average', { ascending: false }),
                    supabase.from('ubl_schedule')
                        .select('*')
                        .eq('division', activeDivision)
                ]);

                if (isMounted && allBowlerData) {
                    const currentDivBowlers = allBowlerData.filter(b => b.division === activeDivision);
                    const playmasters = allBowlerData.filter(b => (b.team_name || '').toUpperCase().includes('PLAYMASTERS'));
                    
                    setAllPlaymasters(playmasters);
                    
                    // Profile Match
                    const match = playmasters.find(b => b.bowler_name.toLowerCase() === (profile?.name || '').toLowerCase());
                    if (match) {
                        setUblProfile(match);
                        setSelectedBowlerName(match.bowler_name);
                    } else if (playmasters.length > 0) {
                        setUblProfile(playmasters[0]);
                        setSelectedBowlerName(playmasters[0].bowler_name);
                    }

                    // Calculation Logic (Analysis 9, 10, 13, 14, 1, 12)
                    
                    // Analysis 13: Women's Elite
                    const women = allBowlerData.filter(b => WOMEN_PLAYERS.includes((b.bowler_name || '').trim().toUpperCase()));
                    setWomenElite(women.slice(0, 10));

                    // Analysis 9: Division Metrics
                    const divisions = ['Monday', 'Tuesday'];
                    const metrics: Record<string, DivisionMetrics> = {};
                    divisions.forEach(div => {
                        const divBowlers = allBowlerData.filter(b => b.division === div);
                        if (divBowlers.length > 0) {
                            const avgs = divBowlers.map(b => b.average).sort((a, b) => a - b);
                            const g1Scores = divBowlers.map(b => (b as any).game1 || 0).filter(s => s > 0);
                            const g2Scores = divBowlers.map(b => (b as any).game2 || 0).filter(s => s > 0);
                            
                            metrics[div] = {
                                avgScore: avgs.reduce((a, b) => a + b, 0) / avgs.length,
                                medianScore: avgs[Math.floor(avgs.length / 2)],
                                topScore: avgs[avgs.length - 1],
                                totalBowlers: divBowlers.length,
                                avgG1: g1Scores.length > 0 ? g1Scores.reduce((a, b) => a + b, 0) / g1Scores.length : 0,
                                avgG2: g2Scores.length > 0 ? g2Scores.reduce((a, b) => a + b, 0) / g2Scores.length : 0
                            };
                        }
                    });
                    setDivMetrics(metrics);

                    // Analysis 14: POA Tracker (Playmasters Focus)
                    const poaList = playmasters
                        .filter(b => (b as any).series && (b as any).last_week_avg)
                        .map(b => ({
                            ...b,
                            poa: ((b as any).series || 0) - (((b as any).last_week_avg || 0) * 2)
                        }))
                        .sort((a, b) => (b as any).poa - (a as any).poa);
                    setTopPOA(poaList.slice(0, 5));

                    // Analysis 10: Consistency Matrix
                    const teamNames = Array.from(new Set(currentDivBowlers.map(b => b.team_name)));
                    const consistency = teamNames.map(name => {
                        const tb = currentDivBowlers.filter(b => b.team_name === name);
                        const g1 = tb.reduce((sum, b) => sum + ((b as any).game1 || 0), 0);
                        const g2 = tb.reduce((sum, b) => sum + ((b as any).game2 || 0), 0);
                        const gap = Math.abs(g2 - g1);
                        let label = 'Steady';
                        if (gap > 50) label = 'Volatile';
                        if (gap < 20) label = 'Machine-like';
                        return { team_name: name, g1_total: g1, g2_total: g2, gap, consistency_label: label };
                    }).sort((a, b) => a.gap - b.gap);
                    setTeamConsistency(consistency);

                    // Analysis 1 & 12: Projections
                    if (teamData && teamData.length > 0) {
                        const leaderWon = Math.max(...teamData.map(t => t.won));
                        const scheduleMatchups = (scheduleData || []) as ScheduleMatch[];
                        const proj = teamData.map((t, index) => {
                            const match = scheduleMatchups.find(m => m.home_team === t.team_name || m.away_team === t.team_name);
                            const nextOpp = match ? (match.home_team === t.team_name ? match.away_team : match.home_team) : undefined;
                            const nextOppRank = nextOpp ? teamData.findIndex(td => td.team_name === nextOpp) + 1 : undefined;

                            return {
                                team_name: t.team_name,
                                current_won: t.won,
                                max_possible_won: t.won + 4,
                                status: (t.won + 4 >= leaderWon) ? ('In Contention' as const) : ('Eliminated' as const),
                                gap: leaderWon - t.won,
                                nextOpponent: nextOpp,
                                nextOpponentRank: nextOppRank
                            };
                        });
                        setProjections(proj);
                    }
                    setTeams(teamData || []);
                }
            } catch (err) {
                console.error("Dashboard Fetch Exception:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchUserData();

        return () => { isMounted = false; };
    }, [router, activeDivision]);

    const handleBowlerChange = (name: string) => {
        const found = allPlaymasters.find(b => b.bowler_name === name);
        if (found) {
            setUblProfile(found);
            setSelectedBowlerName(name);
        }
    };



    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadStatus('uploading');
        setUploadMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload-csv', { method: 'POST', body: formData });
            const data = await res.json();

            if (!res.ok) {
                setUploadStatus('error');
                setUploadMessage(data.error || 'Upload failed. Please try again.');
            } else {
                setUploadStatus('success');
                setUploadMessage(data.message);
                router.refresh();
            }
        } catch {
            setUploadStatus('error');
            setUploadMessage('Network error. Please check your connection.');
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (loading) return (
        <div className="min-h-screen bg-navy-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-strike border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const uploadStatusColors: Record<UploadStatus, string> = {
        idle: 'border-white/20',
        uploading: 'border-bat-blue/60 animate-pulse',
        success: 'border-emerald-500/60',
        error: 'border-strike/60',
    };

    return (
        <div className="min-h-screen bg-navy-dark text-white font-sans selection:bg-strike selection:text-white pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-8">
                    <div className="flex items-center gap-6">
                        <img src="/logo-md.png" alt="Playmasters" className="w-20 h-20 object-contain" />
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl sm:text-6xl font-wordmark tracking-tight text-white uppercase leading-none">PLAYER HQ</h1>
                                {profile?.role === 'captain' && (
                                    <span className="bg-strike/20 text-strike border border-strike/30 px-3 py-1 rounded text-[10px] font-bold tracking-[2px] uppercase">Captain</span>
                                )}
                            </div>
                            <p className="text-gray-mid mt-2 font-ui uppercase tracking-[4px] text-sm md:text-base">
                                {profile?.team_name || 'Free Agent'} {' // '} <span className="text-white font-bold">{profile?.name}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 bg-navy/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm self-start md:self-auto">
                        <div className="text-right">
                            <p className="font-ui text-[10px] text-gray-mid uppercase tracking-[3px] mb-1">Season Avg</p>
                            <p className="font-wordmark text-5xl text-strike leading-none">{stats.seasonAvg || '---'}</p>
                        </div>
                        <div className="h-12 w-px bg-white/10" />
                    </div>
                </header>

                {/* Captain's Quick Action Bar */}
                {profile?.role === 'captain' && (
                    <div className="mb-12 p-1 bg-gradient-to-r from-strike via-ball-pink to-bat-blue rounded-xl">
                        <div className="bg-navy-dark rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="font-ui text-xl font-bold tracking-[3px] text-white uppercase">Captain&apos;s Console</h2>
                                <p className="text-gray-mid text-sm font-sans">Manage your team roster and onboard new players.</p>
                            </div>
                            <Link
                                href="/dashboard/captain/onboarding"
                                className="px-8 py-3 bg-white text-navy-dark font-ui font-extrabold text-sm tracking-[3px] uppercase hover:bg-strike hover:text-white transition-all transform hover:-translate-y-1"
                            >
                                Onboard New Player
                            </Link>
                        </div>
                    </div>
                )}

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Analytics */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* UBL Personal Profile Card (NEW) */}
                        <section className="bg-navy border border-white/5 rounded-2xl p-8 relative overflow-hidden group bg-gradient-to-br from-navy via-navy to-strike/5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h2 className="font-ui text-2xl font-bold tracking-[4px] text-white uppercase flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-strike shadow-[0_0_8px_#E82030]" />
                                        UBL Profile
                                    </h2>
                                    <p className="text-gray-mid text-xs font-ui tracking-[2px] mt-1 uppercase">Official League Statistics // Season 16</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <label className="font-ui text-[10px] text-gray-500 uppercase tracking-widest font-bold">Switch Player:</label>
                                    <select 
                                        value={selectedBowlerName}
                                        onChange={(e) => handleBowlerChange(e.target.value)}
                                        className="bg-navy-dark border border-white/10 text-white font-ui text-xs px-3 py-2 rounded-lg focus:border-strike outline-none transition-all"
                                    >
                                        <option value="">Select a Bowler</option>
                                        {allPlaymasters.map(b => (
                                            <option key={b.bowler_name} value={b.bowler_name}>{b.bowler_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {ublProfile ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* Stats Grid */}
                                    <div className="p-4 bg-navy-dark border border-white/5 rounded-xl group hover:border-strike/30 transition-all">
                                        <p className="font-ui text-[9px] text-gray-mid uppercase tracking-widest mb-1">League Avg</p>
                                        <p className="font-wordmark text-4xl text-strike italic">{ublProfile.average}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-[10px] text-gray-500 font-bold">{ublProfile.games} Games</span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 bg-navy-dark border border-white/5 rounded-xl group hover:border-bat-blue/30 transition-all">
                                        <p className="font-ui text-[9px] text-gray-mid uppercase tracking-widest mb-1">Weekly Focus (LW)</p>
                                        <p className={`font-wordmark text-4xl italic ${ublProfile.last_week_score >= ublProfile.average ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {ublProfile.last_week_score}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-[10px] text-gray-500 font-bold">
                                                {ublProfile.last_week_score >= ublProfile.average ? '↑ Pacing Up' : '↓ Below Avg'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-navy-dark border border-white/5 rounded-xl group hover:border-white/20 transition-all">
                                        <p className="font-ui text-[9px] text-gray-mid uppercase tracking-widest mb-1">Handicap</p>
                                        <p className="font-wordmark text-4xl text-white italic">{ublProfile.handicap}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-[10px] text-gray-500 font-bold font-ui">Competition Buffer</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-navy-dark border border-white/5 rounded-xl group hover:border-ball-pink/30 transition-all">
                                        <p className="font-ui text-[9px] text-gray-mid uppercase tracking-widest mb-1">Peak Game (HGS)</p>
                                        <p className="font-wordmark text-4xl text-ball-pink italic">{ublProfile.high_game}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-[10px] text-gray-500 font-bold">HDCP: {ublProfile.high_game_hdcp}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-xl">
                                    <p className="text-gray-dark font-ui uppercase text-sm tracking-widest">Select a Playmaster to view UBL stats</p>
                                </div>
                            )}

                            {ublProfile && (
                                <div className="mt-8">
                                    <h3 className="font-ui text-[10px] text-gray-500 uppercase tracking-[4px] mb-4 font-bold flex items-center gap-2">
                                        <div className="w-4 h-[1px] bg-white/10"></div>
                                        Teammate Standings ({ublProfile.division})
                                    </h3>
                                    <div className="overflow-hidden rounded-xl border border-white/5 bg-navy-dark/30">
                                        <table className="w-full text-left font-ui text-xs">
                                            <thead>
                                                <tr className="bg-navy-dark/50 border-b border-white/5">
                                                    <th className="py-3 px-4 text-gray-mid font-bold uppercase tracking-widest">Player</th>
                                                    <th className="py-3 px-4 text-gray-mid font-bold uppercase tracking-widest text-center">Avg</th>
                                                    <th className="py-3 px-4 text-gray-mid font-bold uppercase tracking-widest text-center">HGS</th>
                                                    <th className="py-3 px-4 text-gray-mid font-bold uppercase tracking-widest text-right">Trend</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {allPlaymasters
                                                    .filter(b => b.division === ublProfile.division)
                                                    .sort((a, b) => b.average - a.average)
                                                    .map((teammate) => (
                                                        <tr key={teammate.bowler_name} className={`hover:bg-white/[0.02] transition-colors ${teammate.bowler_name === selectedBowlerName ? 'bg-strike/5' : ''}`}>
                                                            <td className="py-3 px-4">
                                                                <p className="font-bold text-white">{teammate.bowler_name}</p>
                                                                <p className="text-[9px] text-gray-500 uppercase">{teammate.team_name}</p>
                                                            </td>
                                                            <td className="py-3 px-4 text-center font-wordmark text-lg text-white">{teammate.average}</td>
                                                            <td className="py-3 px-4 text-center text-gray-300 font-bold">{teammate.high_game}</td>
                                                            <td className="py-3 px-4 text-right">
                                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${teammate.last_week_score >= teammate.average ? 'bg-emerald-500/10 text-emerald-400' : 'bg-strike/10 text-strike'}`}>
                                                                    {teammate.last_week_score >= teammate.average ? '+' : ''}{Math.round(teammate.last_week_score - teammate.average)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Focus Fatigue Engine */}
                        <section className="bg-navy border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h2 className="font-ui text-2xl font-bold tracking-[4px] text-white mb-6 uppercase flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-strike shadow-[0_0_8px_#E82030]" />
                                        Focus Engine
                                    </div>
                                </h2>
                                
                                <p className="text-gray-mid text-sm leading-relaxed mb-6 font-medium">
                                    Compare your latest game against your personal baseline. Frames dipping below your historical average are flagged to highlight potential pressure gaps or focus loss.
                                </p>

                                <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                                    {stats.historicalFrameAvgs.map((avg, i) => {
                                        const recent = stats.recentGameFrames[i] || 0;
                                        const isDip = stats.fatigueFrames.includes(i);
                                        
                                        return (
                                            <div key={i} className={`flex flex-col items-center bg-navy-dark border ${isDip ? 'border-strike border-b-2 shadow-[0_4px_15px_rgba(224,31,61,0.15)]' : 'border-white/5'} rounded-lg p-3 overflow-hidden relative transition-all`}>
                                                <span className="font-ui text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                                                    {isDip && <span className="w-1.5 h-1.5 rounded-full bg-strike animate-pulse"></span>}
                                                    F{i+1}
                                                </span>
                                                <div className="text-center w-full">
                                                    <div className={`font-wordmark text-2xl mb-1 ${isDip ? 'text-strike' : 'text-white'}`}>{recent}</div>
                                                    <div className="w-full h-px bg-white/10 my-2"></div>
                                                    <div className="font-sans text-[11px] text-gray-400 font-bold" title="Historical Average">
                                                        AVG {avg}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {stats.fatigueFrames.length > 0 && (
                                    <div className="mt-8 p-5 bg-gradient-to-r from-strike/10 to-transparent border-l-4 border-strike rounded-r-xl flex items-start gap-4">
                                        <div className="text-strike mt-0.5 text-xl">⚠️</div>
                                        <div>
                                            <h4 className="font-bold text-white uppercase text-sm mb-1 tracking-wider">
                                                Pressure Deviation Detected
                                            </h4>
                                            <p className="text-sm text-gray-300 font-medium">
                                                In your last match, performance dropped below your established average in Frames {stats.fatigueFrames.map(f => f + 1).join(', ')}. Re-center your focus during these specific intervals!
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {stats.fatigueFrames.length === 0 && stats.totalMatches > 0 && (
                                    <div className="mt-8 p-5 bg-gradient-to-r from-emerald-500/10 to-transparent border-l-4 border-emerald-500 rounded-r-xl flex items-start gap-4">
                                        <div className="text-emerald-400 mt-0.5 text-xl">🎯</div>
                                        <div>
                                            <h4 className="font-bold text-white uppercase text-sm mb-1 tracking-wider">Focus Locked In</h4>
                                            <p className="text-sm text-gray-300 font-medium">
                                                In your last match, your frame performances stayed at or above your personal historical averages. Excellent consistency!
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* NEW: Form Trend (Rolling Average) */}
                        <section className="bg-navy border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
                            <h2 className="font-ui text-2xl font-bold tracking-[4px] text-white mb-6 uppercase flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-bat-blue shadow-[0_0_8px_#3B82F6]" />
                                    Form Trend (Last 10)
                                </div>
                            </h2>
                            <p className="text-gray-mid text-sm leading-relaxed mb-6 font-medium">
                                Visualizing your pacing and momentum over the last 10 games recorded on the platform.
                            </p>
                            
                            {stats.recentGameScores.length > 0 ? (
                                <div className="flex items-end gap-2 h-40 mt-8 pb-4 border-b border-white/10 relative">
                                    {/* Average Line */}
                                    <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center pointer-events-none">
                                        <div className="w-full border-t border-dashed border-strike/50 absolute" style={{ bottom: `${(stats.seasonAvg / 300) * 100}%` }}></div>
                                        <span className="absolute right-0 text-[10px] font-ui text-strike bg-navy px-2" style={{ bottom: `calc(${(stats.seasonAvg / 300) * 100}% - 6px)` }}>AVG {stats.seasonAvg}</span>
                                    </div>

                                    {stats.recentGameScores.map((score, i) => {
                                        const heightPct = (score / 300) * 100;
                                        const isAboveAvg = score >= stats.seasonAvg;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center justify-end group">
                                                <div className="text-[10px] font-wordmark text-white mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 bg-navy-dark px-2 py-1 rounded border border-white/10 z-10">{score}</div>
                                                <div 
                                                    className={`w-full rounded-t-sm transition-all duration-500 ease-out group-hover:opacity-80 ${isAboveAvg ? 'bg-bat-blue' : 'bg-white/20'}`}
                                                    style={{ height: `${heightPct}%` }}
                                                ></div>
                                                <div className="mt-2 text-[9px] font-ui text-gray-500 uppercase rotate-45 origin-left whitespace-nowrap">{stats.recentGameDates[i]}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-40 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
                                    <p className="text-gray-dark font-ui uppercase text-sm tracking-widest">No recent games logged</p>
                                </div>
                            )}
                        </section>

                        {/* NEW: Per-Frame Performance Heatmap */}
                        <section className="bg-navy border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
                            <h2 className="font-ui text-2xl font-bold tracking-[4px] text-white mb-6 uppercase flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-ball-pink shadow-[0_0_8px_#EC4899]" />
                                Performance Heatmap
                            </h2>
                            <p className="text-gray-mid text-sm leading-relaxed mb-6 font-medium">
                                A 10-frame grid mapping your last 5 matches. Locate consistent weak spots or pressure points across sessions.
                            </p>

                            {stats.heatmapData.length > 0 ? (
                                <div className="overflow-x-auto pb-4">
                                    <div className="min-w-[600px]">
                                        {/* Header Row */}
                                        <div className="grid grid-cols-11 gap-1 mb-2">
                                            <div className="col-span-1"></div>
                                            {[1,2,3,4,5,6,7,8,9,10].map(f => (
                                                <div key={f} className="col-span-1 text-center font-ui text-[10px] text-gray-500 uppercase tracking-widest font-bold">F{f}</div>
                                            ))}
                                        </div>
                                        
                                        {/* Heatmap Rows */}
                                        <div className="space-y-1 relative">
                                            {stats.heatmapData.map((frames, rowIdx) => (
                                                <div key={rowIdx} className="grid grid-cols-11 gap-1 items-center">
                                                    <div className="col-span-1 font-ui text-[9px] text-gray-400 uppercase tracking-widest text-right pr-2">
                                                        Match {stats.totalMatches - rowIdx}
                                                    </div>
                                                    {frames.map((score, colIdx) => {
                                                        // Heatmap Color Logic
                                                        let bgColor = 'bg-white/5'; // <10 points
                                                        let textColor = 'text-gray-400';
                                                        if (score >= 20) { bgColor = 'bg-strike/80'; textColor = 'text-white font-bold shadow-sm'; } // Strike/Double territory
                                                        else if (score >= 10) { bgColor = 'bg-bat-blue/60'; textColor = 'text-white'; } // Spare/Closed frame territory
                                                        
                                                        return (
                                                            <div key={colIdx} className={`col-span-1 h-10 ${bgColor} rounded-sm flex items-center justify-center font-wordmark text-sm ${textColor} transition-colors hover:brightness-125`} title={`Frame ${colIdx+1}: ${score} pins`}>
                                                                {score}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}

                                            {/* Legend */}
                                            <div className="absolute -bottom-8 right-0 flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 font-ui text-[9px] text-gray-400 uppercase tracking-widest"><div className="w-3 h-3 rounded-sm bg-strike/80"></div> Closed (20+)</div>
                                                <div className="flex items-center gap-1.5 font-ui text-[9px] text-gray-400 uppercase tracking-widest"><div className="w-3 h-3 rounded-sm bg-bat-blue/60"></div> Mark (10-19)</div>
                                                <div className="flex items-center gap-1.5 font-ui text-[9px] text-gray-400 uppercase tracking-widest"><div className="w-3 h-3 rounded-sm bg-white/5 border border-white/10"></div> Open (&lt;10)</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-40 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
                                    <p className="text-gray-dark font-ui uppercase text-sm tracking-widest">Insufficient data for heatmap</p>
                                </div>
                            )}
                        </section>

                        {/* Competition Analysis SECTION (Migrated) */}
                        <div id="competition" className="pt-8 border-t border-white/10 mt-12">
                            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-2">Competition Analysis</h2>
                                    <p className="text-gray-mid font-medium tracking-wide uppercase text-xs">League-wide analytics // Compare against the Field</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveDivision('Monday')}
                                        className={`px-4 py-1.5 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all border ${
                                            activeDivision === 'Monday'
                                                ? 'bg-strike text-white border-strike shadow-[0_0_10px_rgba(232,32,48,0.4)]'
                                                : 'bg-transparent text-gray-500 border-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        Monday
                                    </button>
                                    <button
                                        onClick={() => setActiveDivision('Tuesday')}
                                        className={`px-4 py-1.5 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all border ${
                                            activeDivision === 'Tuesday'
                                                ? 'bg-strike text-white border-strike shadow-[0_0_10px_rgba(232,32,48,0.4)]'
                                                : 'bg-transparent text-gray-500 border-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        Tuesday
                                    </button>
                                </div>
                            </header>

                            <div className="space-y-8">
                                {/* Title Race Projections (Analysis 1 & 12) */}
                                <section className="glass-panel p-8 rounded-2xl border border-strike/20 relative overflow-hidden bg-gradient-to-br from-navy via-navy to-strike/5">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                        <div>
                                            <h3 className="text-2xl font-black uppercase text-white flex items-center gap-3">
                                                <span className="text-strike animate-pulse">🏁</span>
                                                Title Race Projections
                                            </h3>
                                            <p className="text-gray-400 text-[10px] mt-1 font-bold uppercase tracking-widest italic">Mathematical probability based on wins gaps</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                        {projections.slice(0, 6).map((p, i) => (
                                            <div key={p.team_name} className={`p-5 rounded-xl border transition-all duration-500 ${
                                                p.status === 'In Contention' 
                                                    ? 'bg-white/[0.03] border-white/10' 
                                                    : 'bg-black/20 border-white/5 opacity-60'
                                            }`}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                                                        p.status === 'In Contention' ? 'bg-green-500/20 text-green-400' : 'bg-strike/20 text-strike'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                    <span className="text-[10px] font-black text-gray-600">POS #{i + 1}</span>
                                                </div>
                                                <h4 className={`font-black uppercase tracking-tight mb-3 truncate ${p.team_name.includes('PLAYMASTERS') ? 'text-strike' : 'text-white'}`}>
                                                    {p.team_name}
                                                </h4>
                                                
                                                <div className="space-y-4">
                                                    {p.nextOpponent && (
                                                        <div className="bg-navy-dark/40 p-2 rounded-lg border border-white/5">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-[8px] text-gray-500 font-bold uppercase">Next match</span>
                                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                                                                    (p.nextOpponentRank || 0) <= 3 ? 'bg-strike/20 text-strike' : 'bg-green-500/20 text-green-400'
                                                                }`}>
                                                                    {(p.nextOpponentRank || 0) <= 3 ? 'HARD' : 'EASY'}
                                                                </span>
                                                            </div>
                                                            <p className="text-[10px] font-black text-gray-300">vs {p.nextOpponent}</p>
                                                        </div>
                                                    )}

                                                    <div className="h-1.5 bg-navy-dark rounded-full overflow-hidden p-[1px] border border-white/5">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                                p.team_name.includes('PLAYMASTERS') ? 'bg-strike' : 'bg-bat-blue'
                                                            }`}
                                                            style={{ width: `${(p.current_won / p.max_possible_won) * 100}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter">
                                                        <span className="text-gray-500">Gap to Lead</span>
                                                        <span className={p.gap === 0 ? 'text-green-400' : 'text-amber-400'}>{p.gap === 0 ? 'LEADER' : `-${p.gap} Wins`}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                                    {/* Overperformers (POA) (Analysis 14) */}
                                    <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group bg-gradient-to-br from-navy to-emerald-500/5">
                                        <h3 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-2">
                                            <span className="text-emerald-400">🚀</span>
                                            Overperformers
                                        </h3>
                                        <div className="space-y-3">
                                            {topPOA.map((b, i) => (
                                                <div key={b.bowler_name + '-poa'} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                                                    <div>
                                                        <p className="font-bold text-white text-xs uppercase tracking-tight">{b.bowler_name}</p>
                                                        <p className="text-[9px] text-gray-500 font-bold uppercase">{b.team_name}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-emerald-400">+{(b as any).poa}</p>
                                                        <p className="text-[8px] text-gray-500 uppercase font-black">Pins Over Avg</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Women's Elite (Analysis 13) */}
                                    <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group bg-gradient-to-br from-navy to-pink-500/5">
                                        <h3 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-2">
                                            <span className="text-pink-500">👑</span>
                                            Women&apos;s Elite
                                        </h3>
                                        <div className="space-y-3">
                                            {womenElite.map((b, i) => (
                                                <div key={b.bowler_name + '-elite'} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded bg-pink-500/20 flex items-center justify-center font-black text-pink-500 text-[10px]">
                                                            #{i + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white text-xs uppercase tracking-tight">{b.bowler_name}</p>
                                                            <p className="text-[9px] text-gray-500 font-bold uppercase">{b.team_name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-white">{b.average}</p>
                                                        <p className="text-[8px] text-pink-500 font-black uppercase tracking-widest">Avg</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Consistency Matrix (Analysis 10) */}
                                <section className="glass-panel p-8 rounded-2xl border border-white/5 bg-navy-dark/30">
                                    <h3 className="text-2xl font-black uppercase text-white mb-8 flex items-center gap-3">
                                        <span className="text-purple-400 text-3xl">📊</span>
                                        Consistency Matrix
                                    </h3>
                                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                        {teamConsistency.slice(0, 4).map((t) => (
                                            <div key={t.team_name + '-cons'} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                                <div className="flex justify-between items-center mb-3">
                                                    <p className="font-black text-xs text-white uppercase">{t.team_name}</p>
                                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                                                        t.consistency_label === 'Machine-like' ? 'bg-emerald-500/20 text-emerald-400' : 
                                                        t.consistency_label === 'Volatile' ? 'bg-strike/20 text-strike' : 
                                                        'bg-bat-blue/20 text-bat-blue'
                                                    }`}>
                                                        {t.consistency_label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-navy-dark rounded-full overflow-hidden">
                                                        <div className="h-full bg-bat-blue/50" style={{ width: `${(t.g1_total / 1000) * 100}%` }}></div>
                                                    </div>
                                                    <div className="flex-1 h-1.5 bg-navy-dark rounded-full overflow-hidden">
                                                        <div className="h-full bg-purple-500/50" style={{ width: `${(t.g2_total / 1000) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                                <p className="text-[8px] text-gray-600 mt-2 font-bold uppercase tracking-widest">
                                                    Variance: <span className="text-gray-400">{t.gap} pins</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Division Benchmarks (Analysis 9) */}
                                <section className="glass-panel p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-navy to-strike/5">
                                    <h3 className="text-xl font-black uppercase text-white mb-8 flex items-center gap-3">
                                        <span className="text-strike">📊</span>
                                        Division Benchmarks
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Div Avg</p>
                                            <p className="text-2xl font-black text-white">{divMetrics[activeDivision]?.avgScore.toFixed(1) || '---'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Median</p>
                                            <p className="text-2xl font-black text-white">{divMetrics[activeDivision]?.medianScore || '---'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Game 1 Avg</p>
                                            <p className="text-2xl font-black text-strike">{divMetrics[activeDivision]?.avgG1.toFixed(1) || '---'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Game 2 Avg</p>
                                            <p className="text-2xl font-black text-bat-blue">{divMetrics[activeDivision]?.avgG2.toFixed(1) || '---'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Based on {divMetrics[activeDivision]?.totalBowlers || 0} active league members</p>
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-strike"></div>
                                            <div className="w-2 h-2 rounded-full bg-bat-blue"></div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Actions & Secondary Stats */}
                    <div className="space-y-8">

                        {/* Quick Action: CSV Upload */}
                        <div className="bg-navy border border-white/5 p-8 rounded-2xl flex flex-col gap-6">
                            <div>
                                <h3 className="font-ui text-2xl uppercase tracking-widest text-ball-pink mb-2">Sync Scores</h3>
                                <p className="text-sm font-sans text-gray-mid">Upload your CSV from Westgate sessions.</p>
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center hover:bg-white/[0.02] hover:border-strike/40 transition-all cursor-pointer group bg-navy-dark/50 ${uploadStatusColors[uploadStatus]}`}
                            >
                                <svg className="w-10 h-10 text-gray-mid mb-3 group-hover:text-strike group-hover:-translate-y-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="font-ui text-xs uppercase tracking-[3px] text-gray-mid group-hover:text-white transition-colors">Select CSV Data</span>
                                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                            </div>

                            {uploadMessage && (
                                <div className={`text-xs font-ui uppercase tracking-widest p-4 rounded-lg border text-center ${uploadStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-strike/10 border-strike/30 text-strike'}`}>
                                    {uploadMessage}
                                </div>
                            )}
                        </div>

                        {/* Achievement Unit */}
                        <div className="bg-navy border border-white/5 p-8 rounded-2xl">
                            <h3 className="font-ui text-2xl uppercase tracking-widest text-bat-blue mb-6">Achievement Unit</h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-4 bg-navy-dark/50 rounded-xl border border-white/5">
                                    <div className="text-3xl mb-1">👑</div>
                                    <div className="font-wordmark text-white">MVP</div>
                                    <div className="text-[8px] text-gray-mid uppercase tracking-[2px]">Wk 04 Winner</div>
                                </div>
                                <div className="p-4 bg-navy-dark/50 rounded-xl border border-white/5">
                                    <div className="text-3xl mb-1">🔥</div>
                                    <div className="font-wordmark text-white">HOT</div>
                                    <div className="text-[8px] text-gray-mid uppercase tracking-[2px]">5 Strike Streak</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
