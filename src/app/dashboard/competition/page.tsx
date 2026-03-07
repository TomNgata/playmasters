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

const MON_STANDINGS = [
  { rank:1, name:"PLAYMASTERS",          w:26, l:4,  pins:13700, hgs:806, hss:1498, pts:52 },
  { rank:2, name:"AMIGOS SEGUNDO",       w:24, l:6,  pins:13649, hgs:750, hss:1486, pts:48 },
  { rank:3, name:"4BAGGERZ NATION",      w:20, l:10, pins:13814, hgs:804, hss:1522, pts:40 },
  { rank:4, name:"PLAYMASTERS MAVERICK", w:19, l:11, pins:13190, hgs:739, hss:1383, pts:38 },
  { rank:5, name:"PLAYMASTERS RISING",   w:12, l:18, pins:12512, hgs:739, hss:1361, pts:24 },
  { rank:6, name:"BALLBARIANS STRIKERS", w:8,  l:22, pins:12211, hgs:758, hss:1431, pts:16 },
  { rank:7, name:"MAHADEV STRIKERS",     w:8,  l:22, pins:11825, hgs:661, hss:1254, pts:16 },
  { rank:8, name:"NDOVU STRIKERS",       w:3,  l:27, pins:11056, hgs:645, hss:1181, pts:6  },
];

const TUE_STANDINGS = [
  { rank:1, name:"EASTLINE STARS",       w:22, l:8,  pins:13608, hgs:840, hss:1532, pts:44 },
  { rank:2, name:"AMIGOS ESTRELLA",      w:22, l:5,  pins:12265, hgs:774, hss:1437, pts:44 },
  { rank:3, name:"THE UNBOWLIVABLES",    w:20, l:10, pins:13416, hgs:778, hss:1487, pts:40 },
  { rank:4, name:"254 BOWLERS",          w:19, l:11, pins:13447, hgs:772, hss:1486, pts:38 },
  { rank:5, name:"NOISY KINGS",          w:16, l:14, pins:13259, hgs:786, hss:1521, pts:32 },
  { rank:6, name:"UNBOWLIVABLE STRIK",   w:8,  l:19, pins:10912, hgs:731, hss:1325, pts:16 },
  { rank:7, name:"TEAM 55",              w:4,  l:20, pins:9165,  hgs:687, hss:1244, pts:8  },
  { rank:8, name:"AMIGOS SENORAS",       w:3,  l:27, pins:11381, hgs:684, hss:1278, pts:6  },
];

export default function CompetitionHQ() {
  const [division, setDivision] = useState("monday");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const standings = division === "monday" ? MON_STANDINGS : TUE_STANDINGS;
  const leader = standings[0];
  const topPts = leader.pts;

  const titleRace = standings.slice(0, 6).map(t => {
    const gap = topPts - t.pts;
    return {
      ...t,
      maxPts: t.pts + 12,
      gap: gap,
      status: t.pts + 12 >= topPts ? (gap <= 2 ? "IN CONTENTION" : gap <= 6 ? "POSSIBLE" : "SLIM CHANCE") : "ELIMINATED",
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
                          {t.name}
                          {isPlaymasters(t.name) && <span className="ml-3 bg-bat-blue text-[9px] px-2 py-0.5 rounded align-middle">PM</span>}
                        </td>
                        <td className="p-6 font-wordmark text-emerald-500">{t.w}</td>
                        <td className="p-6 font-wordmark text-strike">{t.l}</td>
                        <td className="p-6 font-ui text-gray-mid">{t.pins.toLocaleString()}</td>
                        <td className={`p-6 font-wordmark text-2xl ${t.rank === 1 ? 'text-ball-pink' : 'text-white'}`}>{t.pts}</td>
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

            <div className="p-8 bg-gradient-to-br from-strike to-navy border border-strike/30 rounded-2xl shadow-2xl relative overflow-hidden">
                <h3 className="text-3xl font-wordmark uppercase mb-2">Strike!</h3>
                <p className="font-ui font-black uppercase tracking-[2px] text-xs text-white/70 italic">Join the next sessions</p>
                <div className="mt-8">
                   <button className="w-full py-4 bg-white text-navy font-ui font-black uppercase tracking-[4px] rounded-xl hover:bg-strike hover:text-white transition-all shadow-xl">Register Now</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
