'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type UBLBowler = {
    bowler_name: string;
    team_name: string;
    average: number;
    high_game: number;
    high_series: number;
};

export default function RivalryEngine() {
  const [bowlers, setBowlers] = useState<UBLBowler[]>([]);
  const [p1Name, setP1Name] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function fetchBowlers() {
      const supabase = createClient();
      const { data } = await supabase
        .from('ubl_bowler_stats')
        .select('bowler_name, team_name, average, high_game, high_series')
        .order('bowler_name');
      
      if (data) {
        setBowlers(data);
        if (data.length >= 2) {
          setP1Name(data[0].bowler_name);
          setP2Name(data[1].bowler_name);
        }
      }
      setMounted(true);
    }
    fetchBowlers();
  }, []);

  const p1 = bowlers.find(b => b.bowler_name === p1Name);
  const p2 = bowlers.find(b => b.bowler_name === p2Name);

  const getVerdict = () => {
    if (!p1 || !p2) return "Awaiting Combatants";
    const diff = p1.average - p2.average;
    if (Math.abs(diff) < 2) return "The Twin Souls";
    if (diff > 15) return `${p1.bowler_name} is the Apex Predator`;
    if (diff < -15) return `${p2.bowler_name} is the Apex Predator`;
    return "The Grudge Match";
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-navy-dark text-white font-sans pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-12 border-b border-white/10 pb-8 text-center bg-gradient-to-b from-white/5 to-transparent pt-8 rounded-t-3xl">
          <h1 className="text-6xl md:text-8xl font-wordmark tracking-tighter text-white uppercase italic leading-none mb-4 animate-in fade-in slide-in-from-top duration-700">
            RIVALRY ENGINE
          </h1>
          <p className="text-ball-pink font-ui uppercase tracking-[8px] text-xs md:text-sm font-black">
            Nairobi Unit Comparison {'//'} Head-To-Head Matrix
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 items-center">
          {/* Player 1 */}
          <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-left duration-700">
             <div className="bg-navy border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-bat-blue" />
                <select 
                  className="w-full bg-navy-dark border border-white/10 rounded-xl px-6 py-4 text-xl font-wordmark uppercase outline-none focus:border-bat-blue transition-all mb-8"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                >
                  {bowlers.map(b => <option key={b.bowler_name} value={b.bowler_name}>{b.bowler_name}</option>)}
                </select>
                <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-bat-blue to-navy border-4 border-white/10 flex items-center justify-center text-5xl font-wordmark mb-6 shadow-[0_0_30px_rgba(74,82,184,0.3)] group-hover:scale-105 transition-transform">
                        {p1Name.slice(0,2).toUpperCase()}
                    </div>
                    <h2 className="text-4xl font-wordmark uppercase mb-2">{p1Name}</h2>
                    <p className="text-gray-mid font-ui font-black uppercase text-xs tracking-widest">{p1?.team_name}</p>
                </div>
             </div>
          </div>

          {/* VS Center */}
          <div className="lg:col-span-1 text-center py-8">
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-strike rounded-full blur-2xl opacity-20 animate-pulse" />
                <span className="relative text-7xl md:text-9xl font-wordmark italic text-strike drop-shadow-[0_0_20px_rgba(232,32,48,0.5)]">VS</span>
            </div>
            <div className="mt-8 px-4 py-2 border-y border-white/10 inline-block">
                <p className="text-[10px] font-ui font-black uppercase tracking-[5px] text-gray-mid">{getVerdict()}</p>
            </div>
          </div>

          {/* Player 2 */}
          <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-right duration-700">
             <div className="bg-navy border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-1 bg-ball-pink" />
                <select 
                  className="w-full bg-navy-dark border border-white/10 rounded-xl px-6 py-4 text-xl font-wordmark uppercase outline-none focus:border-ball-pink transition-all mb-8"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                >
                  {bowlers.map(b => <option key={b.bowler_name} value={b.bowler_name}>{b.bowler_name}</option>)}
                </select>
                <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-ball-pink to-navy border-4 border-white/10 flex items-center justify-center text-5xl font-wordmark mb-6 shadow-[0_0_30px_rgba(212,32,128,0.3)] group-hover:scale-105 transition-transform">
                        {p2Name.slice(0,2).toUpperCase()}
                    </div>
                    <h2 className="text-4xl font-wordmark uppercase mb-2">{p2Name}</h2>
                    <p className="text-gray-mid font-ui font-black uppercase text-xs tracking-widest">{p2?.team_name}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Matrix Comparison */}
        <div className="mt-16 bg-navy border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-navy-dark/40 flex items-center justify-center gap-4">
                <span className="text-strike">⚔️</span>
                <h3 className="text-2xl font-wordmark uppercase tracking-widest">Statistical Matrix</h3>
                <span className="text-strike">⚔️</span>
            </div>
            <div className="p-8 space-y-12">
                {[
                    { label: "Season Average", p1: p1?.average || 0, p2: p2?.average || 0, unit: "Pins" },
                    { label: "Season High Game", p1: p1?.high_game || 0, p2: p2?.high_game || 0, unit: "Pins" },
                    { label: "High Series", p1: p1?.high_series || 0, p2: p2?.high_series || 0, unit: "Total" },
                ].map((stat, i) => {
                    const diff = stat.p1 - stat.p2;
                    const p1Pct = (stat.p1 / Math.max(stat.p1, stat.p2)) * 100;
                    const p2Pct = (stat.p2 / Math.max(stat.p1, stat.p2)) * 100;
                    return (
                        <div key={i} className="space-y-6">
                            <div className="flex justify-between items-center px-4">
                                <div className="text-left w-24">
                                    <p className="text-3xl font-wordmark text-bat-light">{stat.p1}</p>
                                    <p className="text-[8px] font-ui font-black uppercase text-gray-mid tracking-widest">Player 1</p>
                                </div>
                                <h4 className="text-sm font-ui font-black uppercase tracking-[4px] text-white italic">{stat.label}</h4>
                                <div className="text-right w-24">
                                    <p className="text-3xl font-wordmark text-ball-pink">{stat.p2}</p>
                                    <p className="text-[8px] font-ui font-black uppercase text-gray-mid tracking-widest">Player 2</p>
                                </div>
                            </div>
                            <div className="relative h-4 bg-navy-dark rounded-full overflow-hidden flex border border-white/5">
                                <div 
                                  className="h-full bg-bat-blue transition-all duration-1000 border-r border-navy" 
                                  style={{ width: `${p1Pct / 2}%` }} 
                                />
                                <div className="h-full w-px bg-white/20 z-10" />
                                <div 
                                  className="h-full bg-ball-pink transition-all duration-1000 border-l border-navy ml-auto" 
                                  style={{ width: `${p2Pct / 2}%` }} 
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
}
