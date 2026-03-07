'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

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

type BowlerStat = {
    id: string;
    bowler_name: string;
    team_name: string;
    games: number;
    average: number;
    high_game: number;
    high_series: number;
    division: string;
    gender?: string;
    game1?: number;
    game2?: number;
    series?: number;
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
};

export default function CompetitionAnalysis() {
    const supabase = createClient();
    const [teams, setTeams] = useState<TeamStanding[]>([]);
    const [bowlers, setBowlers] = useState<BowlerStat[]>([]);
    const [womenBowlers, setWomenBowlers] = useState<BowlerStat[]>([]);
    const [divMetrics, setDivMetrics] = useState<Record<string, DivisionMetrics>>({});
    const [projections, setProjections] = useState<TeamProjection[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDivision, setActiveDivision] = useState<'Monday' | 'Tuesday'>('Monday');

    const WOMEN_PLAYERS = [
        'DOROTHY', 'DARSHI', // Monday
        'SONIKA', 'JUSTINE', 'ROSE', 'NILMA', 'DASHNI', 'AMRIT', 'ALEXA' // Tuesday
    ];

    useEffect(() => {
        async function fetchUBLData() {
            setLoading(true);
            const [{ data: teamData }, { data: allBowlerData }] = await Promise.all([
                supabase.from('ubl_team_standings')
                    .select('*')
                    .eq('division', activeDivision)
                    .order('won', { ascending: false }),
                supabase.from('ubl_bowler_stats')
                    .select('*')
                    .order('average', { ascending: false })
            ]);

            const currentDivBowlers = (allBowlerData || []).filter(b => b.division === activeDivision);
            const sortedBowlers = [...currentDivBowlers].sort((a, b) => b.average - a.average);
            
            // Filter Women's Leaderboard
            const women = (allBowlerData || []).filter(b => WOMEN_PLAYERS.includes((b.bowler_name || '').trim().toUpperCase()));
            
            // Calculate Division Metrics (Analysis 9)
            const divisions = ['Monday', 'Tuesday'];
            const metrics: Record<string, DivisionMetrics> = {};
            
            divisions.forEach(div => {
                const divBowlers = (allBowlerData || []).filter(b => b.division === div);
                if (divBowlers.length > 0) {
                    const avgs = divBowlers.map(b => b.average).sort((a, b) => a - b);
                    const sum = avgs.reduce((a, b) => a + b, 0);
                    
                    const g1Scores = divBowlers.map(b => b.game1 || 0).filter(s => s > 0);
                    const g2Scores = divBowlers.map(b => b.game2 || 0).filter(s => s > 0);
                    
                    metrics[div] = {
                        avgScore: sum / avgs.length,
                        medianScore: avgs[Math.floor(avgs.length / 2)],
                        topScore: avgs[avgs.length - 1],
                        totalBowlers: divBowlers.length,
                        avgG1: g1Scores.length > 0 ? g1Scores.reduce((a, b) => a + b, 0) / g1Scores.length : 0,
                        avgG2: g2Scores.length > 0 ? g2Scores.reduce((a, b) => a + b, 0) / g2Scores.length : 0
                    };
                }
            });

            setTeams(teamData || []);
            setBowlers(sortedBowlers.slice(0, 10));
            setWomenBowlers(women.slice(0, 10));
            setDivMetrics(metrics);

            // Calculate Projections (Analysis 1)
            if (teamData && teamData.length > 0) {
                const leaderWon = Math.max(...teamData.map(t => t.won));
                const proj = teamData.map(t => ({
                    team_name: t.team_name,
                    current_won: t.won,
                    max_possible_won: t.won + 4, // 4 weeks remaining
                    status: (t.won + 4 >= leaderWon) ? ('In Contention' as const) : ('Eliminated' as const),
                    gap: leaderWon - t.won
                }));
                setProjections(proj);
            }

            setLoading(false);
        }

        fetchUBLData();
    }, [activeDivision, supabase]);

    return (
        <div className="py-8 space-y-8 animate-fade-in pb-24">
            <header className="mb-10 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-playmasters-light">
                    Competition Analysis
                </h1>
                <p className="text-gray-400 mt-2 font-medium tracking-wide">
                    Live UBL analytics. Compare Playmasters vs the Field.
                </p>
            </header>

            <div className="flex justify-center md:justify-start gap-4 mb-6">
                <button
                    onClick={() => setActiveDivision('Monday')}
                    className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 border ${
                        activeDivision === 'Monday'
                            ? 'bg-playmasters-red text-white border-playmasters-red shadow-[0_0_15px_rgba(224,31,61,0.5)]'
                            : 'bg-transparent text-gray-400 border-gray-600 hover:text-white hover:border-gray-400'
                    }`}
                >
                    Monday Div
                </button>
                <button
                    onClick={() => setActiveDivision('Tuesday')}
                    className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 border ${
                        activeDivision === 'Tuesday'
                            ? 'bg-playmasters-red text-white border-playmasters-red shadow-[0_0_15px_rgba(224,31,61,0.5)]'
                            : 'bg-transparent text-gray-400 border-gray-600 hover:text-white hover:border-gray-400'
                    }`}
                >
                    Tuesday Div
                </button>
            </div>

            {loading ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 animate-pulse">
                    <div className="h-96 bg-gray-800/50 rounded-2xl border border-gray-700/50"></div>
                    <div className="h-96 bg-gray-800/50 rounded-2xl border border-gray-700/50"></div>
                </div>
            ) : (
                <>
                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 items-start">
                        {/* Team Standings (Spans 2 columns) */}
                        <div className="lg:col-span-2 glass-panel rounded-2xl border border-gray-800/60 overflow-hidden relative">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-playmasters-red to-transparent"></div>
                            <div className="p-6">
                                <h2 className="text-2xl font-black uppercase text-white mb-6 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-playmasters-red inline-block rounded-sm"></span>
                                    Division Standings
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-800 text-gray-400 uppercase text-xs tracking-wider font-bold">
                                                <th className="pb-3 pr-4">Pos</th>
                                                <th className="pb-3 pr-4 w-full">Team</th>
                                                <th className="pb-3 px-4 text-center">Won</th>
                                                <th className="pb-3 px-4 text-center">Lost</th>
                                                <th className="pb-3 px-4 text-right">Pins</th>
                                                <th className="pb-3 px-4 text-right hidden sm:table-cell">HGS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800/50 text-sm font-medium">
                                            {teams.map((t, index) => {
                                                const isPlaymasters = t.team_name.includes('PLAYMASTERS');
                                                return (
                                                    <tr 
                                                        key={t.id} 
                                                        className={`transition-all ${isPlaymasters ? 'bg-gradient-to-r from-playmasters-red/30 to-playmasters-red/5 shadow-[0_0_20px_rgba(224,31,61,0.4)] relative z-10 ring-1 ring-playmasters-red/50 group block sm:table-row my-2 sm:my-0 rounded-lg sm:rounded-none overflow-hidden' : 'hover:bg-gray-800/30 font-medium'}`}
                                                    >
                                                        <td className={`py-4 pr-4 font-black ${index < 3 ? 'text-playmasters-red' : 'text-gray-500'}`}>
                                                            {index + 1}
                                                        </td>
                                                        <td className={`py-4 pr-4 font-black tracking-wide ${isPlaymasters ? 'text-playmasters-red' : 'text-gray-200'}`}>
                                                            {t.team_name}
                                                        </td>
                                                        <td className="py-4 px-4 text-center text-green-400 font-bold">{t.won}</td>
                                                        <td className="py-4 px-4 text-center text-gray-500">{t.lost}</td>
                                                        <td className="py-4 px-4 text-right text-gray-300 tabular-nums">{t.total_pins.toLocaleString()}</td>
                                                        <td className="py-4 px-4 text-right text-gray-500 tabular-nums hidden sm:table-cell">{t.high_game}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Top Threats (Analysis 3) */}
                        <div className="glass-panel rounded-2xl border border-gray-800/60 overflow-hidden relative">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-orange-500 to-transparent"></div>
                            <div className="p-6">
                                <h2 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-orange-500 inline-block rounded-sm"></span>
                                    Top Threats (Avg)
                                </h2>
                                <ul className="space-y-4">
                                    {bowlers.map((b, i) => {
                                        const isPm = b.team_name.includes('PLAYMASTERS');
                                        return (
                                            <li key={b.id} className={`flex items-center justify-between group p-2 rounded-lg transition-all ${isPm ? 'bg-playmasters-red/20 ring-1 ring-playmasters-red/50 shadow-[0_0_15px_rgba(224,31,61,0.3)] transform scale-[1.02] z-10 relative' : 'hover:bg-gray-800/30'}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs font-bold w-4 text-right ${i < 3 ? 'text-orange-500' : 'text-gray-600'}`}>
                                                        {i + 1}
                                                    </span>
                                                    <div>
                                                        <p className={`font-bold ${isPm ? 'text-playmasters-red' : 'text-gray-200'}`}>
                                                            {b.bowler_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-medium truncate max-w-[120px]">
                                                            {b.team_name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-extrabold text-white tabular-nums bg-gray-800 px-2 py-1 rounded-md text-sm border border-gray-700">
                                                        {b.average.toFixed(1)}
                                                    </p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                        {/* Analysis 9: Division Comparison */}
                        <div className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-playmasters-red/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-playmasters-red/10"></div>
                            <h2 className="text-2xl font-black uppercase text-white mb-8 flex items-center gap-3">
                                <span className="text-playmasters-red text-3xl">⚖️</span>
                                Division Benchmarks
                            </h2>

                            <div className="space-y-8">
                                {['Monday', 'Tuesday'].map(div => {
                                    const m = divMetrics[div];
                                    if (!m) return null;
                                    return (
                                        <div key={div} className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="font-ui text-xs font-bold uppercase tracking-[2px] text-gray-500">{div} Division</span>
                                                <span className="text-2xl font-black text-white">{m.avgScore.toFixed(1)} <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Avg</span></span>
                                            </div>
                                            <div className="h-4 bg-navy-dark rounded-full overflow-hidden border border-white/5 p-0.5">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-1000 ${div === 'Monday' ? 'bg-gradient-to-r from-blue-500 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-gradient-to-r from-playmasters-red to-orange-500 shadow-[0_0_10px_rgba(224,31,61,0.5)]'}`}
                                                    style={{ width: `${(m.avgScore / 200) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="bg-white/5 p-2 rounded-lg text-center">
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Median</p>
                                                    <p className="text-sm font-black text-white">{m.medianScore.toFixed(1)}</p>
                                                </div>
                                                <div className="bg-white/5 p-2 rounded-lg text-center">
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Peak</p>
                                                    <p className="text-sm font-black text-white">{m.topScore.toFixed(0)}</p>
                                                </div>
                                                <div className="bg-white/5 p-2 rounded-lg text-center">
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Field</p>
                                                    <p className="text-sm font-black text-white">{m.totalBowlers}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Analysis 13: Women's Leaderboard */}
                        <div className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-pink-500/10"></div>
                            <h2 className="text-2xl font-black uppercase text-white mb-8 flex items-center gap-3">
                                <span className="text-pink-500 text-3xl">👑</span>
                                Women's Elite
                            </h2>

                            <div className="space-y-4">
                                {womenBowlers.length > 0 ? womenBowlers.map((b, i) => (
                                    <div key={b.id} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.06] transition-all group/item">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center font-black text-pink-500 text-xs shadow-inner">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover/item:text-pink-400 transition-colors uppercase tracking-tight">{b.bowler_name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{b.team_name} • {b.division}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-white tracking-tighter">{b.average.toFixed(1)}</p>
                                            <p className="text-[9px] text-pink-500/70 font-black uppercase tracking-widest">League Avg</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 text-center py-10 font-medium italic">Scanning historical records for women's division data...</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Analysis 1: Title Race Projections */}
                    <div className="glass-panel p-8 rounded-2xl border border-playmasters-red/20 relative overflow-hidden bg-gradient-to-br from-navy via-navy to-playmasters-red/5">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl font-black uppercase text-white flex items-center gap-3">
                                    <span className="text-strike animate-pulse">🏁</span>
                                    Title Race Projections
                                </h2>
                                <p className="text-gray-400 text-sm mt-1 font-medium italic">Mathematical probability based on 4 weeks remaining (Max +12pts/4 Wins)</p>
                            </div>
                            <div className="px-4 py-2 bg-playmasters-red/10 border border-playmasters-red/30 rounded-lg">
                                <span className="text-xs font-bold text-playmasters-red uppercase tracking-widest leading-none">Status: 10/14 Weeks Played</span>
                            </div>
                        </div>

                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            {projections.map((p, i) => (
                                <div key={p.team_name} className={`p-5 rounded-xl border transition-all duration-500 hover:translate-y-[-4px] ${
                                    p.status === 'In Contention' 
                                        ? 'bg-white/[0.03] border-white/10' 
                                        : 'bg-black/20 border-white/5 opacity-60'
                                }`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-8 h-8 rounded-full bg-navy-dark flex items-center justify-center text-xs font-black text-gray-500 border border-white/5">
                                            {i + 1}
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                                            p.status === 'In Contention' ? 'bg-green-500/20 text-green-400' : 'bg-playmasters-red/20 text-playmasters-red'
                                        }`}>
                                            {p.status}
                                        </span>
                                    </div>
                                    <h3 className={`font-black uppercase tracking-tight mb-2 truncate ${p.team_name.includes('PLAYMASTERS') ? 'text-playmasters-red' : 'text-white'}`}>
                                        {p.team_name}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Win Progress</span>
                                            <span className="text-lg font-black text-white leading-none">{p.current_won}<span className="text-gray-600">/{p.max_possible_won}</span></span>
                                        </div>
                                        <div className="h-2 bg-navy-dark rounded-full overflow-hidden p-[1px] border border-white/5">
                                            <div className="h-full bg-gray-800 rounded-full w-full relative">
                                                <div 
                                                    className={`h-full rounded-full absolute top-0 left-0 transition-all duration-1000 ${
                                                        p.team_name.includes('PLAYMASTERS') ? 'bg-playmasters-red' : 'bg-strike'
                                                    }`}
                                                    style={{ width: `${(p.current_won / p.max_possible_won) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                                            <span className="text-gray-500">Gap to Lead</span>
                                            <span className={p.gap === 0 ? 'text-green-400' : 'text-orange-400'}>{p.gap === 0 ? 'LEADER' : `-${p.gap} Wins`}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Analysis 3: Game 1 vs Game 2 Splits */}
                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                        <div className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                           <h2 className="text-2xl font-black uppercase text-white mb-8 flex items-center gap-3">
                               <span className="text-blue-400 text-3xl">🌓</span>
                               Performance Splits
                           </h2>
                           
                           <div className="space-y-6">
                               {['Monday', 'Tuesday'].map(div => {
                                   const m = divMetrics[div];
                                   if (!m || m.avgG1 === 0) return null;
                                   const isStrongerG2 = m.avgG2 > m.avgG1;
                                   
                                   return (
                                       <div key={div + '-split'} className="bg-white/[0.03] p-6 rounded-2xl border border-white/5">
                                           <div className="flex justify-between items-center mb-4">
                                               <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{div} Division</span>
                                               <span className={`text-[10px] font-black px-2 py-0.5 rounded ${isStrongerG2 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                   {isStrongerG2 ? 'Stronger Finish' : 'Stronger Start'}
                                               </span>
                                           </div>
                                           
                                           <div className="grid grid-cols-2 gap-8">
                                               <div className="space-y-2">
                                                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Game 1 Avg</p>
                                                   <p className="text-3xl font-black text-white">{m.avgG1.toFixed(1)}</p>
                                                   <div className="h-1.5 bg-navy-dark rounded-full overflow-hidden">
                                                       <div className="h-full bg-blue-500/50" style={{ width: `${(m.avgG1 / 250) * 100}%` }}></div>
                                                   </div>
                                               </div>
                                               <div className="space-y-2">
                                                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Game 2 Avg</p>
                                                   <p className="text-3xl font-black text-white">{m.avgG2.toFixed(1)}</p>
                                                   <div className="h-1.5 bg-navy-dark rounded-full overflow-hidden">
                                                       <div className={`h-full ${isStrongerG2 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${(m.avgG2 / 250) * 100}%` }}></div>
                                                   </div>
                                               </div>
                                           </div>
                                           
                                           <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                               <span className="text-[10px] text-gray-600 font-bold uppercase">Sustainability Gap</span>
                                               <span className={`text-sm font-black ${isStrongerG2 ? 'text-green-400' : 'text-orange-400'}`}>
                                                   {isStrongerG2 ? '+' : ''}{(m.avgG2 - m.avgG1).toFixed(1)} Pins
                                               </span>
                                           </div>
                                       </div>
                                   );
                               })}
                           </div>
                        </div>

                        {/* Top Playmasters Breakdown */}
                        <div className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-playmasters-red/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                           <h2 className="text-2xl font-black uppercase text-white mb-8 flex items-center gap-3">
                               <span className="text-playmasters-red text-3xl">🎯</span>
                               Playmaster Focus
                           </h2>
                           
                           <div className="space-y-3">
                               {bowlers.filter(b => b.team_name.includes('PLAYMASTERS')).slice(0, 5).map(b => {
                                   const diff = (b.game2 || 0) - (b.game1 || 0);
                                   const isPositive = diff >= 0;
                                   
                                   return (
                                       <div key={b.id} className="flex items-center justify-between p-4 bg-navy-dark/50 border border-white/5 rounded-xl">
                                           <div>
                                               <p className="font-bold text-white uppercase text-sm">{b.bowler_name}</p>
                                               <p className="text-[10px] text-gray-500 font-medium">G1: {b.game1} | G2: {b.game2}</p>
                                           </div>
                                           <div className={`text-right px-3 py-1 rounded-lg ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-playmasters-red/10 text-playmasters-red'}`}>
                                               <p className="text-xs font-black uppercase tracking-tighter">{isPositive ? 'Gain' : 'Drop'}</p>
                                               <p className="text-lg font-black leading-none">{isPositive ? '+' : ''}{diff}</p>
                                           </div>
                                       </div>
                                   );
                               })}
                           </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
