'use client';

import { useState, useEffect } from "react";
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
};

// Brand tokens matching mockup aesthetics
const T = {
  navyDark:   "#080B3A",
  navy:       "#0E1260",
  navyMid:    "#1A2280",
  red:        "#E82030",
  redDeep:    "#B81828",
  ballPink:   "#D42080",
  ballMid:    "#B0245C",
  ballPurple: "#8B1FA2",
  batBlue:    "#4A52B8",
  batLight:   "#6870CC",
  border:     "#3A3B8E",
  textNavy:   "#1C1E6E",
  grayMid:    "#8A8EBB",
  grayDark:   "#2E3160",
  white:      "#FFFFFF",
  offWhite:   "#F4F5FA",
};

export default function CompetitionHQ() {
  const [division, setDivision] = useState("monday");
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function fetchStandings() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('division_standings')
          .select('*')
          .eq('division', division)
          .order('rank', { ascending: true });

        if (error) throw error;
        if (data) setStandings(data);
      } catch (err) {
        console.error("Error fetching standings:", err);
      } finally {
        setLoading(false);
        setMounted(true);
      }
    }
    fetchStandings();
  }, [division]);

  if (loading && !mounted) return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-strike border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const leader = standings[0] || { pts: 0 };
  const topPts = (leader as any).points || (leader as any).pts || 0;

  const titleRace = standings.slice(0, 6).map(t => {
    const currentPts = (t as any).points || (t as any).pts || 0;
    const gap = topPts - currentPts;
    return {
      ...t,
      maxPts: currentPts + 12,
      gap: gap,
      pts: currentPts,
      status: currentPts + 12 >= topPts ? (gap <= 2 ? "IN CONTENTION" : gap <= 6 ? "POSSIBLE" : "SLIM CHANCE") : "ELIMINATED",
    };
  });

  const isPlaymasters = (name: string) => name.toUpperCase().includes("PLAYMASTERS");

  return (
    <div className="min-h-screen bg-navy-dark text-white font-sans pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-5xl sm:text-7xl font-wordmark tracking-tighter text-white uppercase leading-none mb-2">
              COMPETITION HQ
            </h1>
            <p className="text-gray-mid font-ui uppercase tracking-[5px] text-xs md:text-sm italic">
              League-Wide Analytics {'//'} Real-Time Threat Analysis
            </p>
          </div>
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            {["monday", "tuesday"].map(d => (
              <button
                key={d}
                onClick={() => { setMounted(false); setDivision(d); setTimeout(() => setMounted(true), 50); }}
                className={`px-6 py-2 rounded-lg font-ui font-black uppercase tracking-[2px] transition-all ${
                  division === d ? 'bg-strike text-white shadow-[0_0_15px_rgba(232,32,48,0.4)]' : 'text-gray-mid hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Standings Table */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-navy border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-strike" />
              <div className="p-6 border-b border-white/5 bg-navy-dark/40 flex items-center gap-4">
                <span className="text-2xl">🏆</span>
                <h3 className="text-xl font-wordmark uppercase tracking-wider">Division Standings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 font-ui text-[10px] uppercase tracking-[3px] text-gray-mid">
                      <th className="p-6">#</th>
                      <th className="p-6">Team</th>
                      <th className="p-6">Won</th>
                      <th className="p-6">Lost</th>
                      <th className="p-6">Pins</th>
                      <th className="p-6">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((t, i) => (
                      <tr key={t.name} className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${isPlaymasters(t.name) ? 'bg-navy-mid/30 border-l-4 border-l-bat-blue' : ''}`}>
                        <td className="p-6 font-wordmark text-2xl text-bat-light">{t.rank}</td>
                        <td className="p-6 font-ui font-black text-lg tracking-widest uppercase">
                          {t.name || (t as any).team_name}
                          {isPlaymasters(t.name || (t as any).team_name) && <span className="ml-3 bg-bat-blue text-[9px] px-2 py-0.5 rounded align-middle">PM</span>}
                        </td>
                        <td className="p-6 font-wordmark text-emerald-500">{(t as any).wins || (t as any).w}</td>
                        <td className="p-6 font-wordmark text-strike">{(t as any).losses || (t as any).l}</td>
                        <td className="p-6 font-ui text-gray-mid">{t.pins.toLocaleString()}</td>
                        <td className={`p-6 font-wordmark text-2xl ${t.rank === 1 ? 'text-ball-pink' : 'text-white'}`}>{(t as any).points || (t as any).pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Title Race Projections */}
            <section className="bg-navy border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative p-8">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-wordmark uppercase tracking-wider">Title Race Projections</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {titleRace.map(t => {
                  const sc = t.status === "IN CONTENTION" ? "text-ball-pink" : t.status === "POSSIBLE" ? "text-bat-light" : "text-gray-mid";
                  const sb = t.status === "IN CONTENTION" ? "bg-ball-pink" : t.status === "POSSIBLE" ? "bg-bat-light" : "bg-gray-mid";
                  return (
                    <div key={t.name} className="bg-navy-dark/40 border border-white/10 p-6 rounded-2xl group hover:border-white/30 transition-all">
                      <div className="flex justify-between items-start mb-4">
                         <span className={`font-ui font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-current ${sc}`}>
                           {t.status}
                         </span>
                         <span className="text-[10px] text-gray-dark font-black">POS #{t.rank}</span>
                      </div>
                      <h4 className="text-xl font-wordmark uppercase mb-4 leading-tight">{t.name}</h4>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-[10px] font-ui uppercase tracking-widest text-gray-mid">
                          <span>Progress</span>
                          <span>{t.pts} PTS</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${sb} transition-all duration-1000`} 
                            style={{ width: mounted ? `${(t.pts/topPts)*100}%` : '0%' }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-ui uppercase tracking-widest">
                        <span className="text-gray-dark">Gap To Lead</span>
                        <span className={t.gap === 0 ? "text-ball-pink" : "text-white"}>{t.gap === 0 ? "LEADER" : `-${t.gap} WINS`}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Side Panels */}
          <div className="space-y-8">
            <section className="bg-navy border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-bat-blue/5 -mr-16 -mt-16 rounded-full blur-3xl" />
               <div className="flex items-center gap-4 mb-8">
                 <span className="text-xl">📊</span>
                 <h3 className="text-lg font-wordmark uppercase tracking-wider">Consistency Matrix</h3>
               </div>
               <div className="space-y-6">
                 {standings.slice(0, 4).map((t, i) => {
                   const variance = [63, 84, 77, 100][i];
                   const status = variance < 75 ? "STABLE" : "VOLATILE";
                   return (
                     <div key={t.name} className="space-y-3">
                       <div className="flex justify-between items-center">
                         <span className="font-ui font-black uppercase text-sm tracking-widest">{t.name}</span>
                         <span className={`font-ui font-black text-[9px] px-2 py-0.5 rounded border ${status === 'STABLE' ? 'text-bat-blue border-bat-blue' : 'text-strike border-strike'}`}>
                           {status}
                         </span>
                       </div>
                       <div className="h-2 bg-navy-dark border border-white/5 rounded-full overflow-hidden">
                         <div 
                           className={`h-full transition-all duration-1000 ${status === 'STABLE' ? 'bg-bat-blue' : 'bg-strike'}`}
                           style={{ width: mounted ? `${(variance/120)*100}%` : '0%' }}
                         />
                       </div>
                       <div className="flex justify-between text-[9px] font-ui uppercase tracking-[2px] text-gray-dark">
                         <span>Variance {variance} Pins</span>
                         <span>σ {[32, 41, 38, 52][i]}</span>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </section>

            <section className="bg-navy border border-white/10 p-8 rounded-2xl shadow-2xl group hover:border-ball-pink/30 transition-all">
               <div className="flex items-center gap-4 mb-8 text-ball-pink">
                 <span className="text-xl">🚀</span>
                 <h3 className="text-lg font-wordmark uppercase tracking-wider">Overperformers</h3>
               </div>
               <div className="space-y-4">
                 {[
                   { name: "DUFLA", delta: "+31.85", team: "AMIGOS SEGUNDO" },
                   { name: "IAN", delta: "+23.37", team: "PLAYMASTERS MAVERIC" },
                   { name: "JOSLINE", delta: "+22.56", team: "4BAGGERZ NATION" }
                 ].map((p, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <div>
                        <p className="font-wordmark text-lg leading-tight">{p.name}</p>
                        <p className="text-[9px] font-ui font-black uppercase tracking-widest text-gray-dark">{p.team}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-wordmark text-xl text-ball-pink">{p.delta}</p>
                        <p className="text-[8px] font-ui font-black uppercase tracking-tighter text-gray-dark">Pins Over Avg</p>
                      </div>
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
