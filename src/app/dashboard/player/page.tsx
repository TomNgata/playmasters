'use client';

import { useState, useEffect } from 'react';
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
                    const playmasters = allBowlerData.filter(b => (b.team_name || '').toUpperCase().includes('PLAYMASTERS'));
                    setAllPlaymasters(playmasters);

                    if (playmasters.length > 0) {
                        setSelectedBowlerName(playmasters[0].bowler_name);
                    }
                }
            } catch (err) {
                console.error("Dashboard Fetch Exception:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();
        return () => { isMounted = false; };
    }, []);

    const selectedPlayer = allPlaymasters.find(b => b.bowler_name === selectedBowlerName) || null;

    const handleBowlerChange = (name: string) => {
        setSelectedBowlerName(name);
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

    return (
        <div className="min-h-screen bg-navy-dark text-white font-sans pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-4xl sm:text-6xl font-wordmark tracking-tight text-white uppercase leading-none mb-2">PLAYER HUB</h1>
                        <p className="text-gray-mid font-ui uppercase tracking-[4px] text-sm md:text-base italic">Strike like Playmasters {'//'} System Online</p>
                    </div>
                    <div className="flex items-center gap-3 bg-navy-dark/50 p-2 rounded-xl border border-white/5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="text-[10px] font-ui font-black uppercase tracking-widest text-emerald-500">Live</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Profile & Squad Summary */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-navy border border-white/5 p-8 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-strike/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-strike/10 transition-colors" />
                                <h3 className="text-gray-dark font-ui uppercase tracking-[3px] text-xs mb-6">Active Profile</h3>
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-strike to-bat-blue p-[2px] shadow-2xl">
                                        <div className="w-full h-full bg-navy rounded-[14px] flex items-center justify-center text-3xl">🎳</div>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-wordmark uppercase tracking-tight">{selectedPlayer?.bowler_name || 'PLAYMASTER'}</h2>
                                        <p className="text-strike font-ui font-black uppercase text-[10px] tracking-[2px]">Playmasters Kenya</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-navy border border-white/5 p-8 rounded-2xl">
                                <h3 className="text-gray-dark font-ui uppercase tracking-[3px] text-xs mb-6">Squad Roster</h3>
                                <div className="flex -space-x-3 mb-4">
                                    {allPlaymasters.slice(0, 5).map((b) => (
                                        <div key={b.bowler_name} className="w-10 h-10 rounded-full bg-navy-dark border-2 border-navy flex items-center justify-center text-xs font-bold" title={b.bowler_name}>
                                            {b.bowler_name.charAt(0)}
                                        </div>
                                    ))}
                                    {allPlaymasters.length > 5 && (
                                        <div className="w-10 h-10 rounded-full bg-strike/20 border-2 border-navy flex items-center justify-center text-[10px] font-black text-strike">
                                            +{allPlaymasters.length - 5}
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-mid font-bold uppercase tracking-widest">{allPlaymasters.length} Active Playmasters</p>
                            </div>
                        </section>

                        {/* Focus Engine: UBL Data — linked to selected player */}
                        <section className="bg-navy border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-navy to-navy-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-2xl font-black uppercase text-white flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-strike shadow-[0_0_8px_#E82030]" />
                                        Focus Engine
                                    </h3>
                                    <p className="text-gray-400 text-[10px] mt-1 font-bold uppercase tracking-widest italic">Live UBL League Stats {'//'} Playmasters Roster</p>
                                </div>
                                <select 
                                    className="bg-navy-dark/80 border border-white/10 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-strike transition-all"
                                    value={selectedBowlerName}
                                    onChange={(e) => handleBowlerChange(e.target.value)}
                                >
                                    {allPlaymasters.map(b => (
                                        <option key={b.bowler_name + b.division} value={b.bowler_name} className="bg-navy text-white">{b.bowler_name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {selectedPlayer ? (
                                <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Average</p>
                                        <p className="text-4xl font-wordmark text-white">{selectedPlayer.average}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">High Series</p>
                                        <p className="text-4xl font-wordmark text-strike">{selectedPlayer.high_series}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Handicap</p>
                                        <p className="text-4xl font-wordmark text-bat-blue">{selectedPlayer.handicap}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Last Week</p>
                                        <p className="text-4xl font-wordmark text-white">{selectedPlayer.last_week_score}</p>
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
                                    <div className="text-5xl font-wordmark text-white mb-2">26 - 4</div>
                                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Team Standing: 1st</p>
                                </div>

                                <div className="bg-navy-dark/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center hover:border-strike/30 transition-all group">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 group-hover:text-strike transition-colors">Season High Game</p>
                                    <div className="text-5xl font-wordmark text-strike mb-2">806</div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic tracking-[2px]">League Leader</p>
                                </div>

                                <div className="bg-navy-dark/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center hover:border-strike/30 transition-all group">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 group-hover:text-strike transition-colors">Season High Series</p>
                                    <div className="text-5xl font-wordmark text-strike mb-2">1498</div>
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
                                <div className="group">
                                    <div className="p-4 bg-white/[0.02] border-l-4 border-strike rounded-r-xl group-hover:bg-white/[0.04] transition-all">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">High Series (Season)</p>
                                        <div className="flex justify-between items-end">
                                            <p className="text-xl font-wordmark text-white">DEEPEN</p>
                                            <p className="text-3xl font-wordmark text-strike">444</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase mt-2 px-1 tracking-wider opacity-60">Avg: 180.25 {'//'} Form: Apex</p>
                                </div>

                                <div className="group">
                                    <div className="p-4 bg-white/[0.02] border-l-4 border-bat-blue rounded-r-xl group-hover:bg-white/[0.04] transition-all">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Season Average Leader</p>
                                        <div className="flex justify-between items-end">
                                            <p className="text-xl font-wordmark text-white">HARSH</p>
                                            <p className="text-3xl font-wordmark text-bat-blue">180.25</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase mt-2 px-1 tracking-wider opacity-60">Consistency Matrix: Diamond</p>
                                </div>

                                <div className="group">
                                    <div className="p-4 bg-white/[0.02] border-l-4 border-emerald-500 rounded-r-xl group-hover:bg-white/[0.04] transition-all">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Individual Scratch High</p>
                                        <div className="flex justify-between items-end">
                                            <p className="text-xl font-wordmark text-white">PARTH</p>
                                            <p className="text-3xl font-wordmark text-emerald-500">429</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase mt-2 px-1 tracking-wider opacity-60">High Game: 237 {'//'} Power Strike</p>
                                </div>

                                <div className="group">
                                    <div className="p-4 bg-white/[0.02] border-l-4 border-yellow-500 rounded-r-xl group-hover:bg-white/[0.04] transition-all">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Weekly Highs (Wk 11)</p>
                                        <div className="flex justify-between items-end">
                                            <p className="text-xl font-wordmark text-white">BISMARK</p>
                                            <p className="text-3xl font-wordmark text-white">235</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase mt-2 px-1 tracking-wider opacity-60">Rank: 1st (Scratch High Game)</p>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[4px] italic opacity-50 underline decoration-strike/20">Authorized Squad Records</p>
                            </div>
                        </section>

                        <a href="/dashboard/player/log-game" className="block bg-navy border border-white/5 p-8 rounded-2xl group hover:border-strike/30 transition-all">
                            <h3 className="font-ui text-2xl uppercase tracking-widest text-ball-pink mb-2">Log Score</h3>
                            <p className="text-sm font-sans text-gray-mid mb-6">Record your latest game results after any session.</p>
                            <div className="w-full h-32 bg-navy-dark/50 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center group-hover:border-strike/30 group-hover:bg-white/[0.02] transition-all">
                                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎳</span>
                                <span className="font-ui text-xs uppercase tracking-[3px] text-gray-mid group-hover:text-white transition-colors">Enter Game Data</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
