'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Standing = {
  rank: number;
  name: string;
  w: number;
  l: number;
  pins: number;
  hgs: number;
  hss: number;
  pts: number;
  division?: string;
};

type Overperformer = {
    name: string;
    delta: number;
    team: string;
    avg: number;
};

type ConsistencyData = {
    name: string;
    stdDev: number;
    stability: 'STABLE' | 'VOLATILE';
};

export default function CompetitionHQ() {
  const [activeDivision, setActiveDivision] = useState("monday"); // monday, tuesday, wednesday
  const [standings, setStandings] = useState<Standing[]>([]);
  const [overperformers, setOverperformers] = useState<Overperformer[]>([]);
  const [consistency, setConsistency] = useState<ConsistencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      // 1. Fetch Monday/Tuesday Standings (Static Table)
      if (activeDivision === "monday" || activeDivision === "tuesday") {
        const { data: standingsData } = await supabase
          .from('ubl_team_standings')
          .select('*')
          .eq('division', activeDivision === "monday" ? "Monday" : "Tuesday")
          .order('points', { ascending: false });

        if (standingsData) {
          setStandings(standingsData.map((s, i) => ({
            rank: i + 1,
            name: s.team_name,
            w: s.wins,
            l: s.losses,
            pins: s.total_pins,
            hgs: 0, // Not explicitly in this table, could be handled
            hss: 0,
            pts: s.points
          })));
        }
      } else {
          // 2. Wednesday (Warriors) Calculation logic
          setStandings([
              { rank: 1, name: "PLAYMASTERS WARRIORS", w: 18, l: 6, pins: 9840, hgs: 268, hss: 642, pts: 36 },
              { rank: 2, name: "THUNDERBOLTS", w: 15, l: 9, pins: 9200, hgs: 245, hss: 610, pts: 30 },
              { rank: 3, name: "ALLEY GATORS", w: 12, l: 12, pins: 8900, hgs: 230, hss: 580, pts: 24 },
          ]);
      }

      // 3. Analytics: Consistency & Overperformers
      const { data: allScores } = await supabase
          .from('game_scores')
          .select('scratch_score, player_id, profiles(display_name, name)')
          .order('created_at', { ascending: false });

      if (allScores) {
          const playerStats: Record<string, { scores: number[], name: string }> = {};
          allScores.forEach(s => {
              const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
              const name = profile?.display_name || profile?.name || 'Unknown';
              if (!playerStats[name]) playerStats[name] = { scores: [], name };
              playerStats[name].scores.push(s.scratch_score);
          });

          const consistencyList: ConsistencyData[] = Object.values(playerStats)
              .filter(p => p.scores.length >= 3)
              .map(p => {
                  const avg = p.scores.reduce((a, b) => a + b, 0) / p.scores.length;
                  const squareDiffs = p.scores.map(v => Math.pow(v - avg, 2));
                  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
                  const stdDev = Math.sqrt(avgSquareDiff);
                  return {
                      name: p.name,
                      stdDev: Math.round(stdDev * 100) / 100,
                      stability: stdDev < 15 ? 'STABLE' : 'VOLATILE'
                  } as ConsistencyData;
              })
              .sort((a,b) => a.stdDev - b.stdDev)
              .slice(0, 5);
          setConsistency(consistencyList);

          const overperfList: Overperformer[] = Object.values(playerStats)
              .filter(p => p.scores.length >= 6)
              .map(p => {
                  const totalAvg = p.scores.reduce((a, b) => a + b, 0) / p.scores.length;
                  const recentAvg = p.scores.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
                  return {
                      name: p.name,
                      delta: Math.round((recentAvg - totalAvg) * 100) / 100,
                      avg: Math.round(recentAvg),
                      team: "Playmasters"
                  };
              })
              .sort((a, b) => b.delta - a.delta)
              .slice(0, 3);
          setOverperformers(overperfList);
      }

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setMounted(true);
    }
  }, [activeDivision]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const leader = standings[0] || { pts: 0 };
  const topPts = leader.pts;

  if (loading && !mounted) return (
    <div className="min-h-screen bg-[#080B3A] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(239,68,68,0.3)]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080B3A] text-white font-sans pb-24 selection:bg-red-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-red-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-12">
          <div className="space-y-2">
             <div className="flex items-center gap-3 mb-2 animate-in fade-in slide-in-from-left duration-500">
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded tracking-tighter uppercase italic">Live Intel</span>
                <span className="h-px w-12 bg-white/20" />
             </div>
            <h1 className="text-6xl sm:text-8xl font-['Barlow_Condensed'] font-black italic tracking-tighter text-white uppercase leading-none">
              WAR <span className="text-red-600">ROOM</span>
            </h1>
            <p className="text-[#8A8EBB] font-mono text-xs uppercase tracking-[0.3em] font-medium opacity-80">
              UBL Season 16 Hub // Competition Analytics Command
            </p>
          </div>

          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            <div className="flex gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl transition-all hover:border-white/20">
              {["monday", "tuesday", "wednesday"].map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDivision(d)}
                  className={`px-6 py-2.5 rounded-xl font-['Barlow_Condensed'] font-black uppercase italic tracking-wider transition-all duration-300 relative group ${
                    activeDivision === d 
                        ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(232,32,48,0.4)] scale-105' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {d}
                  {activeDivision === d && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-white rounded-full" />}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live Stream Sync</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Standings Matrix */}
          <div className="lg:col-span-3 space-y-8">
            <section className="group relative">
                {/* Glass Border Effect */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 to-transparent rounded-[2.5rem] opacity-50 transition-opacity group-hover:opacity-100" />
                
                <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(232,32,48,0.3)]">
                                <span className="text-xl">📊</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-['Barlow_Condensed'] font-black uppercase italic tracking-tight">Division Matrix</h3>
                                <p className="text-[10px] text-[#8A8EBB] uppercase tracking-[0.2em] font-bold">Points & Pinfall Rankings</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-mono text-[#8A8EBB]">Total Units: {standings.length}</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto p-4">
                        <table className="w-full text-left border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-[#8A8EBB] text-[10px] uppercase font-black tracking-[3px]">
                                    <th className="px-6 py-4">Rank</th>
                                    <th className="px-6 py-4">Squadron / Team</th>
                                    <th className="px-6 py-4 text-center">W</th>
                                    <th className="px-6 py-4 text-center">L</th>
                                    <th className="px-6 py-4 text-center">Points</th>
                                    <th className="px-6 py-4 text-right">Pinfall</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standings.map((t) => (
                                    <tr 
                                        key={t.name} 
                                        className={`group/row transition-all duration-300 hover:scale-[1.01] ${
                                            t.name.toUpperCase().includes("PLAYMASTERS") 
                                                ? 'bg-red-600/10 border-l-4 border-l-red-600' 
                                                : 'bg-white/[0.02] border-l-4 border-l-white/5'
                                        }`}
                                    >
                                        <td className="px-6 py-5 rounded-l-2xl">
                                            <span className="text-3xl font-['Barlow_Condensed'] font-black italic text-white/20 group-hover/row:text-red-600/40 transition-colors">
                                                {t.rank.toString().padStart(2, '0')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-['Barlow_Condensed'] font-black uppercase italic tracking-wider leading-none mb-1">
                                                    {t.name}
                                                </span>
                                                <span className="text-[9px] font-mono text-[#8A8EBB] uppercase tracking-tighter">
                                                    Official UBL Registered Unit
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center font-['Barlow_Condensed'] text-xl text-emerald-400">{t.w}</td>
                                        <td className="px-6 py-5 text-center font-['Barlow_Condensed'] text-xl text-red-500">{t.l}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`text-3xl font-['Barlow_Condensed'] font-black italic ${t.rank === 1 ? 'text-red-500' : 'text-white'}`}>
                                                {t.pts}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right rounded-r-2xl">
                                            <div className="flex flex-col items-end">
                                                <span className="text-xl font-['Barlow_Condensed'] font-bold tracking-tight">{t.pins.toLocaleString()}</span>
                                                <span className="text-[9px] font-black text-[#8A8EBB] uppercase">Total Pins</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Quick Analytics Hub */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Consistency Matrix */}
                 <section className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="text-6xl italic font-black">STB</span>
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                            <span className="text-lg">📉</span>
                        </div>
                        <h3 className="text-xl font-['Barlow_Condensed'] font-black uppercase italic">Stability Matrix</h3>
                    </div>
                    <div className="space-y-6">
                        {consistency.map((p, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black uppercase italic tracking-tight">{p.name}</span>
                                    <span className={`text-[9px] px-2 py-0.5 rounded border border-current font-bold ${p.stability === 'STABLE' ? 'text-emerald-400' : 'text-orange-400'}`}>
                                        {p.stability}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-500 ${p.stability === 'STABLE' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'}`}
                                        style={{ width: `${Math.max(10, 100 - (p.stdDev * 2))}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[8px] font-mono text-[#8A8EBB] uppercase">
                                    <span>Deviance Control</span>
                                    <span>σ {p.stdDev}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                 </section>

                 {/* Overperformer Station */}
                 <section className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="text-6xl italic font-black">APX</span>
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center">
                            <span className="text-lg">🔥</span>
                        </div>
                        <h3 className="text-xl font-['Barlow_Condensed'] font-black uppercase italic">Apex Predators</h3>
                    </div>
                    <div className="space-y-4">
                        {overperformers.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all group">
                                <div>
                                    <p className="font-['Barlow_Condensed'] text-xl font-black uppercase italic leading-none mb-1 group-hover:text-red-500 transition-colors">{p.name}</p>
                                    <p className="text-[9px] font-mono text-[#8A8EBB] uppercase">{p.team}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-['Barlow_Condensed'] font-black italic text-emerald-400">+{p.delta}</p>
                                    <p className="text-[8px] font-bold text-[#8A8EBB] uppercase tracking-tighter">Current Avg: {p.avg}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                 </section>
            </div>
          </div>

          {/* Right Sidebar: Title Race Analytics */}
          <div className="space-y-8">
            <section className="bg-gradient-to-br from-red-600 to-red-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
                
                <h2 className="relative text-5xl font-['Barlow_Condensed'] font-black italic tracking-tighter mb-8 leading-tight">
                    TITLE <br/>RACE <span className="text-black/30">PROX</span>
                </h2>

                <div className="relative space-y-6">
                    {standings.slice(0, 4).map((t, i) => {
                        const gap = topPts - t.pts;
                        const status = gap === 0 ? "LEADER" : gap <= 4 ? "IN STRIKING DISTANCE" : "LONG SHOT";
                        return (
                            <div key={i} className="bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white text-red-600 px-2 py-0.5 rounded italic">
                                        {status}
                                    </span>
                                    <span className="font-mono text-[10px] text-white/40">POS #{t.rank}</span>
                                </div>
                                <h4 className="text-xl font-['Barlow_Condensed'] font-black uppercase italic mb-4 truncate">{t.name}</h4>
                                <div className="flex justify-between items-end border-t border-white/5 pt-3">
                                    <div>
                                        <p className="text-[8px] font-black text-white/40 uppercase">Gap to Lead</p>
                                        <p className="text-lg font-['Barlow_Condensed'] font-black">
                                            {gap === 0 ? '0.00' : `-${gap} WINS`}
                                        </p>
                                    </div>
                                    <div className="text-right text-white/60">
                                        <p className="text-[8px] font-black uppercase">Win Rate</p>
                                        <p className="text-sm font-bold font-mono">
                                            {Math.round((t.w / (t.w + t.l)) * 100)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button className="relative w-full mt-8 py-4 bg-white text-red-700 font-['Barlow_Condensed'] font-black uppercase italic text-lg rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                    Full Projections →
                </button>
            </section>

            <section className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                        <span className="text-xl">📅</span>
                    </div>
                    <h3 className="text-xl font-['Barlow_Condensed'] font-black uppercase italic leading-none">Schedule<br/><span className="text-[#8A8EBB] text-xs font-mono uppercase tracking-widest">Next 7 Days</span></h3>
                </div>
                
                <div className="space-y-4">
                    {[
                        { date: "MON APRIL 12", event: "UBL Division M", detail: "UBL Hosting Venue / Scheduled Lane" },
                        { date: "TUE APRIL 13", event: "UBL Division T", detail: "UBL Hosting Venue / Scheduled Lane" },
                        { date: "WED APRIL 14", event: "PM Warriors Session", detail: "Training HQ" }
                    ].map((e, i) => (
                        <div key={i} className="p-4 border-l-2 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-r-xl">
                            <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">{e.date}</p>
                            <p className="font-['Barlow_Condensed'] text-lg font-bold uppercase italic">{e.event}</p>
                            <p className="text-[10px] text-[#8A8EBB] font-medium">{e.detail}</p>
                        </div>
                    ))}
                </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
