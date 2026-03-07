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
    division: string;
};

type GameRecord = {
    total_score: number;
    player_name: string | null;
    match_type: string | null;
    updated_at: string;
};

const MATCH_TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
    practice: { label: 'Practice', color: 'bg-gray-500/20 text-gray-400', icon: '🎯' },
    league: { label: 'League', color: 'bg-bat-blue/20 text-bat-blue', icon: '🏆' },
    tournament_singles: { label: 'Tournament', color: 'bg-strike/20 text-strike', icon: '⚡' },
    tournament_team: { label: 'Team Event', color: 'bg-emerald-500/20 text-emerald-400', icon: '🤝' },
};

export default function PlayerDashboard() {
    const [ublProfile, setUblProfile] = useState<UBLBowler | null>(null);
    const [allPlaymasters, setAllPlaymasters] = useState<UBLBowler[]>([]);
    const [selectedBowlerName, setSelectedBowlerName] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
    const [seasonStats, setSeasonStats] = useState({
        totalGames: 0,
        seasonAvg: 0,
        totalPins: 0,
        highGame: 0,
        trend: 0 // positive = improving, negative = declining
    });

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                const supabase = createClient();

                // Fetch UBL stats
                const { data: allBowlerData } = await supabase
                    .from('ubl_bowler_stats')
                    .select('*')
                    .order('average', { ascending: false });

                if (isMounted && allBowlerData) {
                    const playmasters = allBowlerData.filter(b => (b.team_name || '').toUpperCase().includes('PLAYMASTERS'));
                    setAllPlaymasters(playmasters);

                    if (playmasters.length > 0) {
                        setUblProfile(playmasters[0]);
                        setSelectedBowlerName(playmasters[0].bowler_name);
                    }
                }

                // Fetch game history
                const { data: scoresData } = await supabase
                    .from('scores')
                    .select('total_score, player_name, match_type, updated_at')
                    .order('updated_at', { ascending: false })
                    .limit(20);

                if (scoresData && scoresData.length > 0 && isMounted) {
                    setGameHistory(scoresData);

                    const totalPins = scoresData.reduce((sum, s) => sum + (s.total_score || 0), 0);
                    const highGame = Math.max(...scoresData.map(s => s.total_score || 0));
                    const seasonAvg = Math.round(totalPins / scoresData.length);

                    // Calculate trend: compare last 5 avg vs previous 5 avg
                    const recent5 = scoresData.slice(0, 5);
                    const prev5 = scoresData.slice(5, 10);
                    const recentAvg = recent5.reduce((s, g) => s + (g.total_score || 0), 0) / (recent5.length || 1);
                    const prevAvg = prev5.length > 0 ? prev5.reduce((s, g) => s + (g.total_score || 0), 0) / prev5.length : recentAvg;
                    const trend = Math.round(recentAvg - prevAvg);

                    setSeasonStats({ totalGames: scoresData.length, seasonAvg, totalPins, highGame, trend });
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

    const handleBowlerChange = (name: string) => {
        const found = allPlaymasters.find(b => b.bowler_name === name);
        if (found) {
            setUblProfile(found);
            setSelectedBowlerName(name);
        }
    };



    if (loading) return (
        <div className="min-h-screen bg-navy-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-strike border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const displayName = ublProfile?.bowler_name || 'PLAYMASTER';

    // For the visual bar chart, normalize scores
    const maxScore = gameHistory.length > 0 ? Math.max(...gameHistory.map(g => g.total_score || 0)) : 300;

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
                                        <h2 className="text-3xl font-wordmark uppercase tracking-tight">{displayName}</h2>
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

                        {/* Focus Engine: UBL Data */}
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
                                        <option key={b.bowler_name} value={b.bowler_name} className="bg-navy text-white">{b.bowler_name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {ublProfile ? (
                                <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Average</p>
                                        <p className="text-4xl font-wordmark text-white">{ublProfile.average}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">High Series</p>
                                        <p className="text-4xl font-wordmark text-strike">{ublProfile.high_series}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Handicap</p>
                                        <p className="text-4xl font-wordmark text-bat-blue">{ublProfile.handicap}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Last Week</p>
                                        <p className="text-4xl font-wordmark text-white">{ublProfile.last_week_score}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center text-gray-dark italic text-sm font-ui uppercase tracking-widest">Initialising roster data...</div>
                            )}
                        </section>

                        {/* Performance Tracker — Game History */}
                        <section className="bg-navy border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-navy to-navy-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-2xl font-black uppercase text-white flex items-center gap-3">
                                        <span className="text-strike text-3xl">📈</span>
                                        Performance Tracker
                                    </h3>
                                    <p className="text-gray-400 text-[10px] mt-1 font-bold uppercase tracking-widest italic">Recent Game Results {'//'} Season Trend</p>
                                </div>
                                {seasonStats.totalGames > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                            seasonStats.trend > 0 ? 'bg-emerald-500/20 text-emerald-400' : 
                                            seasonStats.trend < 0 ? 'bg-strike/20 text-strike' : 
                                            'bg-white/5 text-gray-400'
                                        }`}>
                                            {seasonStats.trend > 0 ? `▲ +${seasonStats.trend}` : seasonStats.trend < 0 ? `▼ ${seasonStats.trend}` : '— Steady'} trend
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Season Summary Strip */}
                            {seasonStats.totalGames > 0 && (
                                <div className="grid grid-cols-4 border-b border-white/5">
                                    <div className="p-5 text-center border-r border-white/5">
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Games</p>
                                        <p className="text-2xl font-wordmark text-white">{seasonStats.totalGames}</p>
                                    </div>
                                    <div className="p-5 text-center border-r border-white/5">
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Season Avg</p>
                                        <p className="text-2xl font-wordmark text-bat-blue">{seasonStats.seasonAvg}</p>
                                    </div>
                                    <div className="p-5 text-center border-r border-white/5">
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">High Game</p>
                                        <p className="text-2xl font-wordmark text-strike">{seasonStats.highGame}</p>
                                    </div>
                                    <div className="p-5 text-center">
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Total Pins</p>
                                        <p className="text-2xl font-wordmark text-white">{seasonStats.totalPins.toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            {/* Game Log with Visual Bars */}
                            <div className="p-6">
                                {gameHistory.length > 0 ? (
                                    <div className="space-y-3">
                                        {gameHistory.slice(0, 10).map((game, idx) => {
                                            const mt = MATCH_TYPE_LABELS[game.match_type || 'practice'] || MATCH_TYPE_LABELS.practice;
                                            const barWidth = maxScore > 0 ? Math.max(8, (game.total_score / maxScore) * 100) : 0;
                                            const isHighGame = game.total_score === seasonStats.highGame;
                                            const dateStr = new Date(game.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                                            return (
                                                <div key={idx} className={`group flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/[0.02] ${isHighGame ? 'bg-strike/5 border border-strike/20' : 'border border-transparent'}`}>
                                                    {/* Rank */}
                                                    <div className="w-8 text-center">
                                                        <span className="text-[10px] font-black text-gray-600">{(idx + 1).toString().padStart(2, '0')}</span>
                                                    </div>

                                                    {/* Main content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {game.player_name && (
                                                                <span className="text-[10px] font-black text-white uppercase tracking-tight truncate">{game.player_name}</span>
                                                            )}
                                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wide ${mt.color}`}>
                                                                {mt.icon} {mt.label}
                                                            </span>
                                                            {isHighGame && (
                                                                <span className="px-2 py-0.5 bg-strike/30 text-strike rounded text-[8px] font-black uppercase animate-pulse">
                                                                    🔥 Season Best
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Score Bar */}
                                                        <div className="relative h-5 bg-navy-dark rounded-full overflow-hidden border border-white/5">
                                                            <div 
                                                                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                                                                    isHighGame ? 'bg-gradient-to-r from-strike to-strike/60' : 
                                                                    game.total_score >= seasonStats.seasonAvg ? 'bg-gradient-to-r from-bat-blue to-bat-blue/40' : 
                                                                    'bg-gradient-to-r from-gray-600 to-gray-700/40'
                                                                }`}
                                                                style={{ width: `${barWidth}%` }}
                                                            />
                                                            <div className="absolute inset-0 flex items-center px-3">
                                                                <span className="text-[9px] font-black text-white/80 drop-shadow-lg">{game.total_score} pins</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Score + Date */}
                                                    <div className="text-right flex-shrink-0">
                                                        <p className={`text-xl font-wordmark ${isHighGame ? 'text-strike' : 'text-white'}`}>{game.total_score}</p>
                                                        <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">{dateStr}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-center">
                                        <span className="text-4xl mb-3 opacity-50">🎳</span>
                                        <p className="text-gray-dark font-ui uppercase text-sm tracking-widest mb-1">No game history yet</p>
                                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Log your first score to see your performance tracker</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
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
