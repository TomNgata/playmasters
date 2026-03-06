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
};

export default function CompetitiveDashboard() {
    const supabase = createClient();
    const [teams, setTeams] = useState<TeamStanding[]>([]);
    const [bowlers, setBowlers] = useState<BowlerStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDivision, setActiveDivision] = useState<'Monday' | 'Tuesday'>('Monday');

    useEffect(() => {
        async function fetchUBLData() {
            setLoading(true);
            const [{ data: teamData }, { data: bowlerData }] = await Promise.all([
                supabase.from('ubl_team_standings')
                    .select('*')
                    .eq('division', activeDivision)
                    .order('won', { ascending: false }),
                supabase.from('ubl_bowler_stats')
                    .select('*')
                    .eq('division', activeDivision)
                    .order('average', { ascending: false })
                    .limit(10)
            ]);

            setTeams(teamData || []);
            setBowlers(bowlerData || []);
            setLoading(false);
        }

        fetchUBLData();
    }, [activeDivision, supabase]);

    return (
        <div className="py-8 space-y-8 animate-fade-in pb-24">
            <header className="mb-10 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-playmasters-light">
                    Rivalry Matrix
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
                                                    className={`hover:bg-gray-800/30 transition-colors ${isPlaymasters ? 'bg-playmasters-red/10 group' : ''}`}
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

                    {/* Top Threats */}
                    <div className="glass-panel rounded-2xl border border-gray-800/60 overflow-hidden relative">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-orange-500 to-transparent"></div>
                        <div className="p-6">
                            <h2 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-orange-500 inline-block rounded-sm"></span>
                                Top Threats (Avg)
                            </h2>
                            <ul className="space-y-4">
                                {bowlers.map((b, i) => {
                                    const isPlaymasters = b.team_name.includes('PLAYMASTERS');
                                    return (
                                        <li key={b.id} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-bold w-4 text-right ${i < 3 ? 'text-orange-500' : 'text-gray-600'}`}>
                                                    {i + 1}
                                                </span>
                                                <div>
                                                    <p className={`font-bold ${isPlaymasters ? 'text-playmasters-red' : 'text-gray-200'}`}>
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
            )}
        </div>
    );
}
