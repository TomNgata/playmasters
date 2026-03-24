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

export default function PlayerDashboard() {
    const [allPlaymasters, setAllPlaymasters] = useState<UBLBowler[]>([]);
    const [selectedBowlerName, setSelectedBowlerName] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [hallOfFame, setHallOfFame] = useState<any[]>([]);
    const [teamStats, setTeamStats] = useState<any[]>([]);

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                const supabase = createClient();
                
                // 1. Fetch Bowler Stats
                const { data: allBowlerData } = await supabase
                    .from('ubl_bowler_stats')
                    .select('*')
                    .order('average', { ascending: false });

                // 2. Fetch Hall of Fame (Records)
                const { data: records } = await supabase
                    .from('league_records')
                    .select('*')
                    .eq('is_active', true);

                // 3. Fetch Team Stats
                const { data: stats } = await supabase
                    .from('team_stats')
                    .select('*');

                if (isMounted) {
                    if (allBowlerData) {
                        const playmasters = allBowlerData.filter(b => (b.team_name || '').toUpperCase().includes('PLAYMASTERS'));
                        setAllPlaymasters(playmasters);
                        if (playmasters.length > 0) {
                            setSelectedBowlerName(playmasters[0].bowler_name);
                        }
                    }
                    if (records) setHallOfFame(records);
                    if (stats) setTeamStats(stats);
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

    const selectedPlayer = allPlaymasters.find(b => b.bowler_name === selectedBowlerName) || null;

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
            const stepTime = Math.abs(Math.floor(duration / range));
            const timer = setInterval(() => {
                current += increment;
                setCount(current);
                if (current === end) clearInterval(timer);
            }, stepTime);
            return () => clearInterval(timer);
        }, [value, mounted]);
        return <span>{count}</span>;
    }

    const handleBowlerChange = (name: string) => {
        setMounted(false);
        setSelectedBowlerName(name);
        setTimeout(() => setMounted(true), 50);
    };

    if (loading) return (
        <div className="min-h-screen bg-navy-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-strike border-t-transparent rounded-full animate-spin" />
        </div>
    );

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
                                    <a href="/dashboard/comparison" className="px-6 py-3 bg-bat-blue/20 border border-bat-blue/40 rounded-xl text-[10px] font-ui font-black uppercase tracking-[2px] hover:bg-bat-blue hover:text-white transition-all">
                                        Compare Rivals ⚔️
                                    </a>
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

                        {/* Performance Tracker — sourced from UBL per-player data */}
                        <section className="bg-navy border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-navy to-navy-dark">
                                <h3 className="text-2xl font-black uppercase text-white flex items-center gap-3">
                                    <span className="text-strike text-3xl">📈</span>
                                    Performance Tracker
                                </h3>
                                <p className="text-gray-400 text-[10px] mt-1 font-bold uppercase tracking-widest italic">
                                    {selectedPlayer?.bowler_name || 'Select a player'} {'//'} UBL Season Data
                                </p>
                            </div>

                            {selectedPlayer ? (
                                <>
                                    {/* Season Summary Strip */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5">
                                        <div className="p-5 text-center border-r border-white/5">
                                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Games</p>
                                            <p className="text-2xl font-wordmark text-white">{selectedPlayer.games}</p>
                                        </div>
                                        <div className="p-5 text-center border-r border-white/5">
                                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Average</p>
                                            <p className="text-2xl font-wordmark text-bat-blue">{selectedPlayer.average}</p>
                                        </div>
                                        <div className="p-5 text-center border-r border-white/5">
                                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">High Game</p>
                                            <p className="text-2xl font-wordmark text-strike">{selectedPlayer.high_game}</p>
                                        </div>
                                        <div className="p-5 text-center">
                                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Total Pins</p>
                                            <p className="text-2xl font-wordmark text-white">{selectedPlayer.total_pins.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Game Results — only real data */}
                                    <div className="p-6 space-y-4">
                                        {playerGameData.length > 0 ? (
                                            <>
                                                {playerGameData.map((game, idx) => {
                                                    const barWidth = maxScoreForBars > 0 ? Math.max(8, (game.score / maxScoreForBars) * 100) : 0;
                                                    const isHighGame = game.label === 'High Game';
                                                    return (
                                                        <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl ${isHighGame ? 'bg-strike/5 border border-strike/20' : 'border border-white/5'}`}>
                                                            <div className="w-24 flex-shrink-0">
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{game.label}</span>
                                                            </div>

                                                            <div className="flex-1">
                                                                <div className="relative h-6 bg-navy-dark rounded-full overflow-hidden border border-white/5">
                                                                    <div 
                                                                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                                                                            isHighGame ? 'bg-gradient-to-r from-strike to-strike/60' : 
                                                                            game.score >= selectedPlayer.average ? 'bg-gradient-to-r from-bat-blue to-bat-blue/40' : 
                                                                            'bg-gradient-to-r from-gray-600 to-gray-700/40'
                                                                        }`}
                                                                        style={{ width: `${barWidth}%` }}
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center px-3">
                                                                        <span className="text-[9px] font-black text-white/80 drop-shadow-lg">{game.score} pins</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="text-right flex-shrink-0 w-16">
                                                                <p className={`text-xl font-wordmark ${isHighGame ? 'text-strike' : 'text-white'}`}>{game.score}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Series breakdown if available */}
                                                {selectedPlayer.series && selectedPlayer.series > 0 && (
                                                    <div className="mt-6 p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                                                        <div>
                                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Latest Series Total</p>
                                                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">
                                                                {selectedPlayer.game1 && selectedPlayer.game1 > 0 ? `${selectedPlayer.game1}` : '—'} + {selectedPlayer.game2 && selectedPlayer.game2 > 0 ? `${selectedPlayer.game2}` : '—'} = {selectedPlayer.series}
                                                            </p>
                                                        </div>
                                                        <p className="text-3xl font-wordmark text-white">{selectedPlayer.series}</p>
                                                    </div>
                                                )}

                                                {/* High Series */}
                                                {selectedPlayer.high_series > 0 && selectedPlayer.high_series !== selectedPlayer.series && (
                                                    <div className="p-4 bg-strike/5 border border-strike/10 rounded-xl flex items-center justify-between">
                                                        <div>
                                                            <p className="text-[10px] text-strike font-black uppercase tracking-widest">Season Best Series</p>
                                                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">🔥 Career highlight this season</p>
                                                        </div>
                                                        <p className="text-3xl font-wordmark text-strike">{selectedPlayer.high_series}</p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-center">
                                                <span className="text-3xl mb-2 opacity-50">🎳</span>
                                                <p className="text-gray-dark font-ui uppercase text-sm tracking-widest">No game data recorded yet</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="p-12 text-center text-gray-dark italic text-sm font-ui uppercase tracking-widest">Select a player to view their performance data</div>
                            )}
                        </section>

                        {/* Squad Prowess: Team Achievements (hardcoded from PDF results) */}
                        <section className="bg-navy border border-strike/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(232,32,48,0.1)] relative">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="bg-strike text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white animate-pulse">#1 Rank</span>
                            </div>
                            <div className="p-8 border-b border-white/5 bg-gradient-to-br from-navy via-navy to-strike/10">
                                <h3 className="text-3xl font-wordmark uppercase text-white flex items-center gap-4">
                                    Squad Prowess
                                </h3>
                                <p className="text-strike text-[10px] mt-1 font-black uppercase tracking-widest italic">UBL Monday Division Dominance {'//'} Week 11 Snapshot</p>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/5">
                                <div className="bg-navy-dark/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center hover:border-strike/30 transition-all group">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 group-hover:text-strike transition-colors">League Record</p>
                                    <div className="text-5xl font-wordmark text-white mb-2">{teamStats.find(s => s.label === 'League Record')?.value || '26 - 4'}</div>
                                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Team Standing: {teamStats.find(s => s.label === 'Team Standing')?.value || '1st'}</p>
                                </div>

                                <div className="bg-navy-dark/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center hover:border-strike/30 transition-all group">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 group-hover:text-strike transition-colors">Season High Game</p>
                                    <div className="text-5xl font-wordmark text-strike mb-2">{teamStats.find(s => s.label === 'Season High Game')?.value || '806'}</div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic tracking-[2px]">League Leader</p>
                                </div>

                                <div className="bg-navy-dark/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center hover:border-strike/30 transition-all group">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 group-hover:text-strike transition-colors">Season High Series</p>
                                    <div className="text-5xl font-wordmark text-strike mb-2">{teamStats.find(s => s.label === 'Season High Series')?.value || '1498'}</div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic tracking-[2px]">League Leader</p>
                                </div>
                            </div>

                            <div className="px-8 py-8">
                                <div className="bg-strike/5 border border-strike/20 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-full bg-strike/20 flex items-center justify-center text-2xl drop-shadow-[0_0_10px_rgba(232,32,48,0.5)]">🔥</div>
                                        <div>
                                            <h4 className="text-xl font-wordmark uppercase text-white">Clean Sweep (Last Week)</h4>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Playmasters took 1st in Game, Series, and Standing this week.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="px-4 py-2 bg-navy rounded-lg border border-white/5 text-center">
                                            <p className="text-[9px] text-gray-600 font-black uppercase mb-1">Game High</p>
                                            <p className="text-lg font-wordmark text-strike">806</p>
                                        </div>
                                        <div className="px-4 py-2 bg-navy rounded-lg border border-white/5 text-center">
                                            <p className="text-[9px] text-gray-600 font-black uppercase mb-1">Series High</p>
                                            <p className="text-lg font-wordmark text-strike">1498</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        {/* Hall of Fame: Individual PDF Highlights */}
                        <section className="bg-navy border border-white/5 p-8 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 -mr-16 -mt-16 rounded-full blur-3xl" />
                            <h3 className="text-xl font-black uppercase text-white mb-8 flex items-center gap-3">
                                <span className="text-yellow-500 animate-bounce">🏆</span>
                                Hall of Fame
                            </h3>
                            <div className="space-y-6">
                                {hallOfFame.length > 0 ? (
                                    hallOfFame.map((record, i) => (
                                        <div key={i} className="group">
                                            <div className={`p-4 bg-white/[0.02] border-l-4 rounded-r-xl group-hover:bg-white/[0.04] transition-all ${
                                                i === 0 ? 'border-strike' : i === 1 ? 'border-bat-blue' : i === 2 ? 'border-emerald-500' : 'border-yellow-500'
                                            }`}>
                                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{record.record_type}</p>
                                                <div className="flex justify-between items-end">
                                                    <p className="text-xl font-wordmark text-white">{record.bowler_name}</p>
                                                    <p className={`text-3xl font-wordmark ${
                                                        i === 0 ? 'text-strike' : i === 1 ? 'text-bat-blue' : i === 2 ? 'text-emerald-500' : 'text-white'
                                                    }`}>{record.value}</p>
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-gray-600 font-bold uppercase mt-2 px-1 tracking-wider opacity-60">{record.sub_label}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center text-gray-dark italic text-[10px] uppercase tracking-widest">
                                        Records Syncing...
                                    </div>
                                )}
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[4px] italic opacity-50 underline decoration-strike/20">Authorized Squad Records</p>
                            </div>
                        </section>

                        <section className="bg-navy border border-white/5 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-ball-pink/5 -mr-16 -mt-16 rounded-full blur-3xl" />
                            <h3 className="text-xl font-black uppercase text-white mb-8 flex items-center gap-3 font-ui tracking-widest">
                                <span className="text-ball-pink animate-pulse">🎖️</span>
                                Achievement Unit
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { name: "Verified", sub: "Core Playmaster", unlocked: true, icon: "🎖️" },
                                    { name: "Squad", sub: "Unit Member", unlocked: true, icon: "🏅" },
                                    { name: "Challenger", sub: "Sync 5 Matches", unlocked: false, icon: "⏳" },
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
                                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎳</span>
                                <span className="font-ui text-xs uppercase tracking-[3px] text-gray-mid group-hover:text-white transition-colors">Enter Game Data</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
