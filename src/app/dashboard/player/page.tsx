'use client';

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';

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
    total_pins: number;
    division: string;
    game1: number | null;
    game2: number | null;
    series: number | null;
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

export default function PlayerDashboard() {
    const [allPlaymasters, setAllPlaymasters] = useState<UBLBowler[]>([]);
    const [selectedBowlerName, setSelectedBowlerName] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                const supabase = createClient();
                const { data: allBowlerData } = await supabase
                    .from('ubl_bowler_stats')
                    .select('*')
                    .order('average', { ascending: false });

                if (isMounted && allBowlerData) {
                    const playmasters = (allBowlerData as any[]).filter((b: any) => (b.team_name || '').toUpperCase().includes('PLAYMASTERS')) as UBLBowler[];
                    setAllPlaymasters(playmasters);
                    if (playmasters.length > 0) {
                        setSelectedBowlerName(playmasters[0].bowler_name);
                    }
                }
            } catch (err) {
                console.error("Dashboard Fetch Exception:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setTimeout(() => setMounted(true), 100);
                }
            }
        }
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const selectedPlayer = allPlaymasters.find((b: UBLBowler) => b.bowler_name === selectedBowlerName) || null;

    // Counter Hook helper
    function Counter({ value, duration = 1000 }: { value: number; duration?: number }) {
        const [count, setCount] = useState(0);
        useEffect(() => {
            if (!mounted) return;
            let start = 0;
            const end = value;
            const range = end - start;
            let current = start;
            const increment = end > start ? 1 : -1;
            const stepTime = Math.abs(Math.floor(duration / (range || 1)));
            const timer = setInterval(() => {
                current += increment;
                setCount(current);
                if (current === end) clearInterval(timer);
            }, Math.max(stepTime, 10));
            return () => clearInterval(timer);
        }, [value, mounted]);
        return <span>{count}</span>;
    }

    const handleBowlerChange = (name: string) => {
        setMounted(false);
        setSelectedBowlerName(name);
        setTimeout(() => setMounted(true), 50);
    };

    // Build performance data for the selected player
    const playerGameData: { label: string; score: number }[] = [];
    if (selectedPlayer) {
        if (selectedPlayer.game1 && selectedPlayer.game1 > 0) playerGameData.push({ label: 'Game 1', score: selectedPlayer.game1 });
        if (selectedPlayer.game2 && selectedPlayer.game2 > 0) playerGameData.push({ label: 'Game 2', score: selectedPlayer.game2 });
        if (selectedPlayer.high_game > 0) playerGameData.push({ label: 'High Game', score: selectedPlayer.high_game });
    }

    const maxScoreForBars = selectedPlayer ? Math.max(selectedPlayer.high_game || 0, 300) : 300;

    // G1 vs G2 Split Calculation
    const g1 = selectedPlayer?.game1 || 0;
    const g2 = selectedPlayer?.game2 || 0;
    const splitDiff = g2 - g1;
    const splitType = splitDiff > 15 ? "Strong Finisher" : splitDiff < -15 ? "Quick Starter" : "Consistent";
    const splitColor = splitDiff > 15 ? "text-ball-pink border-ball-pink" : splitDiff < -15 ? "text-strike border-strike" : "text-bat-light border-bat-light";

    // Match History Logic
    const [matchHistory, setMatchHistory] = useState<ScoreRecord[]>([]);
    const [expandedSession, setExpandedSession] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedBowlerName) return;
        async function fetchHistory() {
            const supabase = createClient();
            const { data } = await supabase
                .from('scores')
                .select('*')
                .eq('player_name', selectedBowlerName)
                .order('updated_at', { ascending: false });
            if (data) setMatchHistory(data);
        }
        fetchHistory();
    }, [selectedBowlerName]);

    const handleDeleteGame = async (gameId: string) => {
        if (!window.confirm('Are you sure you want to delete this game? This cannot be undone.')) return;

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('scores')
                .delete()
                .eq('id', gameId);

            if (error) throw error;

            // Update local state to remove the game immediately
            setMatchHistory(prev => prev.filter(g => g.id !== gameId));
        } catch (err) {
            console.error("Delete Game Error:", err);
            alert("Failed to delete game. Please try again.");
        }
    };

    const groupedHistory = useMemo(() => {
        const groups: Record<string, ScoreRecord[]> = {};
        matchHistory.forEach(score => {
            const date = new Date(score.updated_at || score.created_at).toLocaleDateString();
            const event = score.event_name || 'Practice / Ungrouped';
            const alleyName = score.alley || 'Unknown Alley';
            const key = `${date}|${event}|${alleyName}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(score);
        });
        return groups;
    }, [matchHistory]);

    if (loading) return (
        <div className="min-h-screen bg-navy-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-strike border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const calculateRunningTotals = (currentRolls: number[][]): number[] => {
        const totals: number[] = [];
        let cumulative = 0;
        const flatRolls: number[] = [];
        for (const frame of currentRolls) {
            flatRolls.push(...frame);
        }
        
        let rollIndex = 0;
        for (let frameIndex = 0; frameIndex < 10; frameIndex++) {
            const frame = currentRolls[frameIndex];
            if (!frame || frame.length === 0) {
                totals.push(cumulative);
                continue;
            }
            if (frameIndex === 9) {
                const frameSum = frame.reduce((a, b) => a + b, 0);
                cumulative += frameSum;
                totals.push(cumulative);
                break;
            }
            const isStrike = frame[0] === 10;
            const isSpare = !isStrike && frame.length > 1 && frame[0] + frame[1] === 10;
            
            if (isStrike) {
                let bonus = 0;
                const next1 = flatRolls[rollIndex + 1];
                const next2 = flatRolls[rollIndex + 2];
                if (next1 !== undefined) bonus += next1;
                if (next2 !== undefined) bonus += next2;
                cumulative += 10 + bonus;
                rollIndex += 1; 
            } else if (isSpare) {
                let bonus = 0;
                const next1 = flatRolls[rollIndex + 2];
                if (next1 !== undefined) bonus += next1;
                cumulative += 10 + bonus;
                rollIndex += 2;
            } else {
                const frameSum = frame.reduce((a, b) => a + b, 0);
                cumulative += frameSum;
                rollIndex += frame.length; 
            }
            totals.push(cumulative);
        }
        return totals;
    };

    const renderRollValue = (frameIndex: number, rollIndex: number, rolls: number[][]) => {
        const frame = rolls[frameIndex];
        if (!frame || frame[rollIndex] === undefined || frame[rollIndex] === -1) return '';
        const val = frame[rollIndex];
        
        if (frameIndex < 9) {
            // Frames 1-9
            if (val === 10 && rollIndex === 0) return ''; // Standard scorecard: Cell 1 empty on strike
            if (val === 10 && rollIndex === 1) return 'X'; // Standard scorecard: Cell 2 has 'X'
            if (rollIndex === 1 && frame[0] + val === 10) return '/';
            return val === 0 ? '-' : val.toString();
        } else {
            // Frame 10
            if (rollIndex === 0 && val === 10) return 'X';
            if (rollIndex === 1) {
                if (val === 10) return 'X';
                if (frame[0] !== 10 && frame[0] + val === 10) return '/';
                return val === 0 ? '-' : val.toString();
            }
            if (rollIndex === 2) {
                if (val === 10) return 'X';
                if (frame[1] === 10 && val === 10) return 'X'; // X X X case
                if (frame[1] !== 10 && (frame[0] === 10 || frame[0] + frame[1] === 10) && frame[1] + val === 10) return '/';
                return val === 0 ? '-' : val.toString();
            }
            return val === 0 ? '-' : val.toString();
        }
    };

    return (
        <div className="min-h-screen bg-navy-dark text-white font-sans pb-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-5xl sm:text-7xl font-wordmark tracking-tighter text-white uppercase leading-none mb-2">
                            PLAYER HUB
                        </h1>
                        <p className="text-gray-mid font-ui uppercase tracking-[5px] text-xs md:text-sm italic">
                            Strike like Playmasters {'//'} System Online
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile & Squad Summary */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-navy border border-white/10 p-8 rounded-2xl relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-ball-pink/5 -mr-24 -mt-24 rounded-full blur-[80px] group-hover:bg-ball-pink/10 transition-all duration-700" />
                                <h3 className="text-gray-mid font-ui uppercase tracking-[4px] text-[10px] mb-6">Active Profile</h3>
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-ball-purple to-ball-pink p-[2px] shadow-2xl transform group-hover:rotate-3 transition-transform">
                                        <div className="w-full h-full bg-navy rounded-[14px] flex items-center justify-center text-3xl font-wordmark">
                                            {selectedPlayer?.bowler_name.slice(0, 2).toUpperCase() || 'PM'}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-wordmark uppercase tracking-tight leading-none mb-1">
                                            {selectedPlayer?.bowler_name || 'PLAYMASTER'}
                                        </h2>
                                        <p className="text-bat-light font-ui font-bold uppercase text-[11px] tracking-[3px] italic">
                                            {selectedPlayer?.team_name || 'Kenya Unit'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-navy border border-white/10 p-8 rounded-2xl shadow-2xl">
                                <h3 className="text-gray-mid font-ui uppercase tracking-[4px] text-[10px] mb-6">Squad Status</h3>
                                <div className="flex -space-x-3 mb-6">
                                    {allPlaymasters.slice(0, 8).map((b) => (
                                        <div key={b.bowler_name} className="w-10 h-10 rounded-xl bg-navy-mid border-2 border-navy flex items-center justify-center text-[10px] font-wordmark hover:-translate-y-2 transition-transform cursor-help" title={b.bowler_name}>
                                            {b.bowler_name.slice(0, 2).toUpperCase()}
                                        </div>
                                    ))}
                                    {allPlaymasters.length > 8 && (
                                        <div className="w-10 h-10 rounded-xl bg-strike/20 border-2 border-navy flex items-center justify-center text-[10px] font-black text-strike">
                                            +{allPlaymasters.length - 8}
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-mid font-bold uppercase tracking-widest">{allPlaymasters.length} Active Playmasters</p>
                            </div>
                        </section>

                        {/* Focus Engine: UBL Data */}
                        <section className="bg-navy border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-strike" />
                            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-navy to-navy-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-wordmark uppercase text-white flex items-center gap-4">
                                        <span className="text-strike animate-pulse">⚡</span>
                                        Focus Engine
                                    </h3>
                                    <p className="text-gray-mid text-[10px] mt-1 font-bold uppercase tracking-[3px] italic">Live UBL Stats {'//'} Unit Data Stream</p>
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                    <select 
                                        className="bg-navy-dark border border-white/10 rounded-xl px-6 py-3 text-[11px] font-ui font-black uppercase tracking-[2px] outline-none focus:border-strike transition-all"
                                        value={selectedBowlerName}
                                        onChange={(e) => handleBowlerChange(e.target.value)}
                                    >
                                        {allPlaymasters.map(b => (
                                            <option key={b.bowler_name + b.division} value={b.bowler_name} className="bg-navy text-white">{b.bowler_name}</option>
                                        ))}
                                    </select>
                                    <Link href="/comparison" className="px-6 py-3 bg-bat-blue/20 border border-bat-blue/40 rounded-xl text-[10px] font-ui font-black uppercase tracking-[2px] hover:bg-bat-blue hover:text-white transition-all">
                                        Compare Rivals ⚔️
                                    </Link>
                                </div>
                            </div>
                            
                            {selectedPlayer ? (
                                <div className="p-8">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                        {[
                                            { label: 'Average', value: selectedPlayer.average, color: 'text-white' },
                                            { label: 'High Series', value: selectedPlayer.high_series, color: 'text-ball-pink', highlight: true },
                                            { label: 'Weekly High', value: Math.max(selectedPlayer.game1 || 0, selectedPlayer.game2 || 0), color: 'text-white' }
                                        ].map((stat, i) => (
                                            <div key={i} className={`bg-white/5 border border-white/10 p-5 rounded-xl border-t-4 ${stat.highlight ? 'border-t-ball-pink bg-gradient-to-br from-ball-pink/[0.08] to-transparent' : 'border-t-strike'}`}>
                                                <div className={`text-4xl font-wordmark ${stat.color} mb-1`}>
                                                    <Counter value={stat.value} />
                                                </div>
                                                <p className="text-[10px] text-gray-mid font-ui font-black uppercase tracking-widest">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* G1 vs G2 Split Bar */}
                                    <div className="pt-8 border-t border-white/5">
                                        <div className="flex justify-between items-center mb-6">
                                            <p className="text-[10px] text-gray-mid font-ui font-black uppercase tracking-[3px]">G1 vs G2 Heat Gradient</p>
                                            <div className={`px-4 py-1 border rounded-lg text-[10px] font-ui font-black uppercase tracking-widest ${splitColor}`}>
                                                {splitType}
                                            </div>
                                        </div>
                                        <div className="flex items-end gap-10 h-32 px-4">
                                            {[
                                                { label: 'G1', val: selectedPlayer.game1 || 0, col: 'bg-bat-blue' },
                                                { label: 'G2', val: selectedPlayer.game2 || 0, col: splitDiff > 0 ? 'bg-ball-pink' : 'bg-strike' }
                                            ].map((game, i) => {
                                                const pct = Math.max(10, (game.val / 300) * 100);
                                                return (
                                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                                        <div className="text-xl font-wordmark text-white opacity-0 group-hover:opacity-100 transition-opacity">{game.val}</div>
                                                        <div className={`w-full rounded-t-lg ${game.col} transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(232,32,48,0.1)]`} style={{ height: mounted ? `${pct}%` : '0%' }}>
                                                            <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent" />
                                                        </div>
                                                        <div className="text-[11px] font-ui font-black text-gray-mid tracking-[2px]">{game.label}</div>
                                                    </div>
                                                );
                                            })}
                                            <div className="flex-[2] flex flex-col gap-4 pb-4">
                                                {[
                                                    { label: 'Season Best', val: selectedPlayer.high_game, col: 'text-strike' },
                                                    { label: 'Games Played', val: selectedPlayer.games, col: 'text-bat-light' },
                                                    { label: 'Total Pins', val: selectedPlayer.total_pins.toLocaleString(), col: 'text-white' }
                                                ].map((row, i) => (
                                                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                                                        <span className="text-[10px] font-ui text-gray-mid uppercase tracking-widest">{row.label}</span>
                                                        <span className={`text-sm font-wordmark ${row.col}`}>{row.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center text-gray-dark italic text-sm font-ui uppercase tracking-widest">Select a player above</div>
                            )}
                        </section>

                        {/* Match History & Verification Hub */}
                        <section className="bg-navy border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                             <div className="p-8 border-b border-white/5 bg-gradient-to-r from-navy to-navy-dark">
                                 <h3 className="text-2xl font-black uppercase text-white flex items-center gap-3">
                                     <span className="text-strike text-3xl">🗓️</span>
                                     Match History & Verification
                                 </h3>
                                 <p className="text-gray-400 text-[10px] mt-1 font-bold uppercase tracking-widest italic">
                                     {selectedBowlerName} {'//'} Unit Service Record
                                 </p>
                             </div>
                             <div className="p-6 space-y-4">
                                 {Object.keys(groupedHistory).length > 0 ? (
                                     Object.entries(groupedHistory).map(([key, scores]) => {
                                         const [date, event, alley] = key.split('|');
                                         const isExpanded = expandedSession === key;
                                         return (
                                             <div key={key} className="border border-white/5 rounded-2xl overflow-hidden transition-all bg-white/[0.02]">
                                                 <button 
                                                     onClick={() => setExpandedSession(isExpanded ? null : key)}
                                                     className="w-full p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition-colors"
                                                 >
                                                     <div className="text-left">
                                                         <p className="text-[10px] text-strike font-black uppercase tracking-[3px] mb-1">{date}</p>
                                                         <h4 className="text-xl font-wordmark text-white uppercase">{event}</h4>
                                                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{alley}</p>
                                                     </div>
                                                     <div className="flex items-center gap-8">
                                                         <div className="text-right">
                                                             <p className="text-[10px] text-gray-600 font-black uppercase mb-1">Total Games</p>
                                                             <p className="text-2xl font-wordmark text-white">{scores.length}</p>
                                                         </div>
                                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180 bg-strike/10 text-strike' : 'bg-white/5 text-gray-400'}`}>
                                                             ↓
                                                         </div>
                                                     </div>
                                                 </button>

                                                 {isExpanded && (
                                                     <div className="p-6 border-t border-white/5 space-y-8 animate-in slide-in-from-top-4 duration-300">
                                                         {scores.sort((a: ScoreRecord, b: ScoreRecord) => a.game_number - b.game_number).map((game, idx) => {
                                                             const frameTotals = calculateRunningTotals(game.frame_scores);
                                                             return (
                                                                 <div key={idx} className="space-y-4 border-b border-white/5 pb-8 last:border-0 last:pb-0">
                                                                     <div className="flex justify-between items-center">
                                                                         <div>
                                                                             <span className="text-[10px] font-black uppercase text-strike tracking-widest">Game {game.game_number}</span>
                                                                             <span className="mx-3 text-gray-700">|</span>
                                                                             <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{game.tournament_tier?.replace('_', ' ') || 'REGULAR'}</span>
                                                                         </div>
                                                                         <div className="text-right flex items-center gap-4">
                                                                            <div className="text-right">
                                                                                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest mr-2">Total</span>
                                                                                <span className="text-3xl font-wordmark text-white">{game.total_score}</span>
                                                                            </div>
                                                                            <button 
                                                                                onClick={() => handleDeleteGame(game.id)}
                                                                                className="p-2 text-gray-400 hover:text-strike transition-colors hover:bg-strike/5 rounded-lg group"
                                                                                title="Delete Game"
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                                                            </button>
                                                                        </div>
                                                                     </div>

                                                                     {/* Frame by Frame Scorecard */}
                                                                     <div className="overflow-x-auto pb-2 custom-scrollbar">
                                                                         <div className="min-w-[700px] flex gap-1 bg-navy-dark/50 p-1 rounded-xl border border-white/5">
                                                                             {Array.from({length: 10}).map((_, fIdx) => (
                                                                                 <div key={fIdx} className="flex-1 bg-navy border border-white/5 rounded flex flex-col overflow-hidden min-h-[80px]">
                                                                                     <div className="text-[8px] font-black text-center py-1 border-b border-white/5 bg-white/5 text-gray-500 uppercase">
                                                                                         {fIdx + 1}
                                                                                     </div>
                                                                                     <div className="flex border-b border-white/5 h-6">
                                                                                         <div className="flex-1 border-r border-white/5 flex items-center justify-center text-[10px] font-wordmark">
                                                                                             {renderRollValue(fIdx, 0, game.frame_scores)}
                                                                                         </div>
                                                                                         <div className={`flex-1 flex items-center justify-center text-[10px] font-wordmark ${fIdx === 9 ? 'border-r border-white/5' : ''}`}>
                                                                                              {renderRollValue(fIdx, fIdx === 9 && game.frame_scores[fIdx]?.[0] === 10 ? 1 : (game.frame_scores[fIdx]?.length > 1 ? 1 : -1), game.frame_scores)}
                                                                                         </div>
                                                                                         {fIdx === 9 && (
                                                                                             <div className="flex-1 flex items-center justify-center text-[10px] font-wordmark">
                                                                                                 {renderRollValue(fIdx, 2, game.frame_scores)}
                                                                                             </div>
                                                                                         )}
                                                                                     </div>
                                                                                     <div className="flex-1 flex items-center justify-center font-wordmark text-base text-strike">
                                                                                         {frameTotals[fIdx] || '-'}
                                                                                     </div>
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
                                     <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                                         <p className="text-gray-dark font-ui uppercase tracking-widest text-sm">No match history found for this unit.</p>
                                     </div>
                                 )}
                             </div>
                         </section>
                     </div>

                     <div className="space-y-8">
                         {/* Hall of Fame Highlights */}
                         <section className="bg-navy border border-white/5 p-8 rounded-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 -mr-16 -mt-16 rounded-full blur-3xl" />
                             <h3 className="text-xl font-black uppercase text-white mb-8 flex items-center gap-3">
                                 <span className="text-yellow-500 animate-bounce">🏆</span>
                                 Hall of Fame
                             </h3>
                             <div className="space-y-6">
                                 <div className="group">
                                     <div className="p-4 bg-white/[0.02] border-l-4 border-strike rounded-r-xl group-hover:bg-white/[0.04] transition-all">
                                         <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">High Series (Season)</p>
                                         <div className="flex justify-between items-end">
                                             <p className="text-xl font-wordmark text-white">DEEPEN</p>
                                             <p className="text-3xl font-wordmark text-strike">444</p>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="group">
                                     <div className="p-4 bg-white/[0.02] border-l-4 border-bat-blue rounded-r-xl group-hover:bg-white/[0.04] transition-all">
                                         <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Season Average Leader</p>
                                         <div className="flex justify-between items-end">
                                             <p className="text-xl font-wordmark text-white">HARSH</p>
                                             <p className="text-3xl font-wordmark text-bat-blue">180.25</p>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </section>

                         <section className="bg-navy border border-white/5 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
                             <h3 className="text-xl font-black uppercase text-white mb-8 flex items-center gap-3 font-ui tracking-widest">
                                 <span className="text-ball-pink animate-pulse">🎖️</span>
                                 Achievement Unit
                             </h3>
                             <div className="space-y-4">
                                 {[
                                     { name: "Verified", sub: "Core Playmaster", unlocked: true, icon: "🎖️" },
                                     { name: "Squad", sub: "Unit Member", unlocked: true, icon: "🏅" },
                                     { name: "On Fire", sub: "+20 This Season", unlocked: (selectedPlayer?.average || 0) > 170, icon: "🔥" },
                                     { name: "High Series", sub: "Bowled 400+", unlocked: (selectedPlayer?.high_series || 0) >= 400, icon: "⚡" }
                                 ].map((a, i) => (
                                     <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${a.unlocked ? 'bg-ball-pink/5 border-ball-pink/20 opacity-100' : 'bg-white/5 border-white/5 opacity-40'}`}>
                                         <span className="text-2xl">{a.icon}</span>
                                         <div className="flex-1">
                                             <p className={`font-ui font-black uppercase tracking-widest text-xs ${a.unlocked ? 'text-ball-pink' : 'text-gray-mid'}`}>{a.name}</p>
                                             <p className="text-[9px] font-ui uppercase tracking-widest text-gray-dark">{a.sub}</p>
                                         </div>
                                         {a.unlocked && <span className="text-ball-pink text-xs">✓</span>}
                                     </div>
                                 ))}
                             </div>
                         </section>

                         <Link href="/dashboard/player/log-game" className="block bg-navy border border-white/5 p-8 rounded-2xl group hover:border-strike/30 transition-all">
                             <h3 className="font-ui text-2xl uppercase tracking-widest text-ball-pink mb-2">Log Score</h3>
                             <p className="text-sm font-sans text-gray-mid mb-6">Record your latest game results after any session.</p>
                             <div className="w-full h-32 bg-navy-dark/50 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center group-hover:border-strike/30 group-hover:bg-white/[0.02] transition-all text-center">
                                 <span className="text-4xl mb-2 group-hover:scale-110 transition-transform"> bowling 🎳</span>
                                 <span className="font-ui text-xs uppercase tracking-[3px] text-gray-mid group-hover:text-white transition-colors">Enter Game Data</span>
                             </div>
                         </Link>
                     </div>
                 </div>
             </div>
         </div>
     );
}
