'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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

export default function CompetitionAnalysis() {
    const router = useRouter();
    const [activeDivision, setActiveDivision] = useState<'Monday' | 'Tuesday'>('Monday');
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState<TeamStanding[]>([]);
    const [divMetrics, setDivMetrics] = useState<Record<string, DivisionMetrics>>({});
    const [projections, setProjections] = useState<TeamProjection[]>([]);
    const [teamConsistency, setTeamConsistency] = useState<TeamConsistency[]>([]);
    const [topPOA, setTopPOA] = useState<UBLBowler[]>([]);
    const [womenElite, setWomenElite] = useState<UBLBowler[]>([]);

    const WOMEN_PLAYERS = [
        'DOROTHY', 'DARSHI', // Monday
        'SONIKA', 'JUSTINE', 'ROSE', 'NILMA', 'DASHNI', 'AMRIT', 'ALEXA' // Tuesday
    ];

    useEffect(() => {
        let isMounted = true;

        async function fetchCompetitionData() {
            setLoading(true);
            try {
                const supabase = createClient();
                
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
                    
                    // Women's Elite
                    const women = allBowlerData.filter(b => WOMEN_PLAYERS.includes((b.bowler_name || '').trim().toUpperCase()));
                    setWomenElite(women.slice(0, 10));

                    // Division Metrics
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

                    // POA Tracker (Top 5 Overall for the division)
                    const poaList = currentDivBowlers
                        .filter(b => (b as any).series && (b as any).last_week_avg)
                        .map(b => ({
                            ...b,
                            poa: ((b as any).series || 0) - (((b as any).last_week_avg || 0) * 2)
                        }))
                        .sort((a, b) => (b as any).poa - (a as any).poa);
                    setTopPOA(poaList.slice(0, 5));

                    // Consistency Matrix
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

                    // Projections
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
                console.error("Competition Analysis Fetch Exception:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchCompetitionData();

        return () => { isMounted = false; };
    }, [activeDivision]);

    if (loading) return (
        <div className="min-h-screen bg-navy-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-strike border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-navy-dark text-white font-sans pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-4xl sm:text-6xl font-wordmark tracking-tight text-white uppercase leading-none mb-2">COMPETITION HQ</h1>
                        <p className="text-gray-mid font-ui uppercase tracking-[4px] text-sm md:text-base italic">League-wide Analytics // Real-Time Threat Analysis</p>
                    </div>
                    <div className="flex gap-2 bg-navy-dark/50 p-1.5 rounded-xl border border-white/5">
                        <button
                            onClick={() => setActiveDivision('Monday')}
                            className={`px-6 py-2 rounded-lg font-ui font-black uppercase tracking-widest text-[10px] transition-all ${
                                activeDivision === 'Monday'
                                    ? 'bg-strike text-white shadow-[0_4px_15px_rgba(232,32,48,0.3)]'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            Monday
                        </button>
                        <button
                            onClick={() => setActiveDivision('Tuesday')}
                            className={`px-6 py-2 rounded-lg font-ui font-black uppercase tracking-widest text-[10px] transition-all ${
                                activeDivision === 'Tuesday'
                                    ? 'bg-strike text-white shadow-[0_4px_15px_rgba(232,32,48,0.3)]'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            Tuesday
                        </button>
                    </div>
                </header>

                <div className="space-y-12">
                    {/* League Standings Table */}
                    <section className="bg-navy border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                         <div className="p-8 border-b border-white/5 bg-gradient-to-r from-navy to-navy-dark">
                            <h2 className="text-2xl font-black uppercase text-white flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-bat-blue shadow-[0_0_8px_#3B82F6]" />
                                Division Standings
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-ui">
                                <thead>
                                    <tr className="bg-navy-dark/50 text-[10px] text-gray-500 font-black uppercase tracking-[3px] border-b border-white/5">
                                        <th className="py-4 px-8">Team</th>
                                        <th className="py-4 px-4 text-center">Won</th>
                                        <th className="py-4 px-4 text-center">Lost</th>
                                        <th className="py-4 px-4 text-center">Pins</th>
                                        <th className="py-4 px-4 text-center">HGS</th>
                                        <th className="py-4 px-8 text-right">Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {teams.map((team, idx) => (
                                        <tr key={team.id} className={`hover:bg-white/[0.02] transition-colors group ${team.team_name.includes('PLAYMASTERS') ? 'bg-strike/5' : ''}`}>
                                            <td className="py-4 px-8">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-gray-600 font-wordmark text-lg group-hover:text-strike transition-colors">{(idx + 1).toString().padStart(2, '0')}</span>
                                                    <span className={`font-black uppercase tracking-tight ${team.team_name.includes('PLAYMASTERS') ? 'text-strike' : 'text-white'}`}>{team.team_name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center font-wordmark text-xl text-emerald-400">{team.won}</td>
                                            <td className="py-4 px-4 text-center font-wordmark text-xl text-strike">{team.lost}</td>
                                            <td className="py-4 px-4 text-center font-wordmark text-xl text-gray-300">{team.total_pins}</td>
                                            <td className="py-4 px-4 text-center font-wordmark text-xl text-bat-blue">{team.high_game}</td>
                                            <td className="py-4 px-8 text-right font-wordmark text-3xl text-white">{team.won * 2}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Threat Analysis Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Title Race Projections */}
                        <div className="lg:col-span-2 space-y-8">
                             <section className="glass-panel p-8 rounded-2xl border border-strike/20 relative overflow-hidden bg-gradient-to-br from-navy via-navy to-strike/5">
                                <h3 className="text-2xl font-black uppercase text-white mb-8 flex items-center gap-3">
                                    <span className="text-strike animate-pulse">🏁</span>
                                    Title Race Projections
                                </h3>
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

                            {/* Consistency Matrix */}
                            <section className="bg-navy border border-white/5 p-8 rounded-2xl">
                                <h3 className="text-2xl font-black uppercase text-white mb-8 flex items-center gap-3">
                                    <span className="text-purple-400 text-3xl">📊</span>
                                    Consistency Matrix
                                </h3>
                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                    {teamConsistency.slice(0, 4).map((t) => (
                                        <div key={t.team_name + '-cons'} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-purple-500/30 transition-all">
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
                        </div>

                        {/* Sidebar Analytics */}
                        <div className="space-y-8">
                             {/* Overperformers (POA) */}
                             <div className="bg-navy border border-white/5 p-6 rounded-2xl relative overflow-hidden group bg-gradient-to-br from-navy to-emerald-500/5">
                                <h3 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-2">
                                    <span className="text-emerald-400">🚀</span>
                                    Overperformers
                                </h3>
                                <div className="space-y-3">
                                    {topPOA.map((b, i) => (
                                        <div key={b.bowler_name + '-poa'} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl group hover:border-emerald-500/30 transition-all">
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

                            {/* Women's Elite */}
                            <div className="bg-navy border border-white/5 p-6 rounded-2xl relative overflow-hidden group bg-gradient-to-br from-navy to-pink-500/5">
                                <h3 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-2">
                                    <span className="text-pink-500">👑</span>
                                    Women's Elite
                                </h3>
                                <div className="space-y-3">
                                    {womenElite.map((b, i) => (
                                        <div key={b.bowler_name + '-elite'} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl group hover:border-pink-500/30 transition-all">
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

                            {/* Division Benchmarks */}
                            <section className="bg-navy border border-white/5 p-8 rounded-2xl bg-gradient-to-br from-navy to-strike/5">
                                <h3 className="text-xl font-black uppercase text-white mb-8 flex items-center gap-3">
                                    <span className="text-strike">📊</span>
                                    Bench
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Div Avg</p>
                                        <p className="text-2xl font-black text-white">{divMetrics[activeDivision]?.avgScore.toFixed(1) || '---'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Median</p>
                                        <p className="text-2xl font-black text-white">{divMetrics[activeDivision]?.medianScore || '---'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">G1 Avg</p>
                                        <p className="text-2xl font-black text-strike">{divMetrics[activeDivision]?.avgG1.toFixed(1) || '---'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">G2 Avg</p>
                                        <p className="text-2xl font-black text-bat-blue">{divMetrics[activeDivision]?.avgG2.toFixed(1) || '---'}</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
