'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

type UBLBowler = {
    bowler_name: string;
    team_name: string;
    average: number;
    high_game: number;
    high_series: number;
    games_played: number;
    recent_trend?: number[]; // Last 5 games
};

export default function RivalryEngine() {
  const [bowlers, setBowlers] = useState<UBLBowler[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [p1Name, setP1Name] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function initEngine() {
      // 1. Get Current User for Auto-Focus
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, name')
          .eq('id', user.id)
          .single();
        if (profile) setCurrentUser(profile.display_name || profile.name);
      }

      // 2. Fetch All Bowlers (Mon, Tue, Wed)
      const { data: stats } = await supabase
        .from('ubl_bowler_stats')
        .select('*')
        .order('bowler_name');

      // 3. Fetch Game Scores for Recent Trend Calculation
      const { data: scores } = await supabase
        .from('game_scores')
        .select('scratch_score, player_id, profiles(display_name, name)')
        .order('created_at', { ascending: false });

      if (stats) {
        const enrichedStats = stats.map(b => {
            const playerScores = (scores || [])
                .filter(s => {
                    const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
                    return (profile?.display_name || profile?.name) === b.bowler_name;
                })
                .map(s => s.scratch_score)
                .slice(0, 5);
            
            return {
                bowler_name: b.bowler_name,
                team_name: b.team_name,
                average: b.average,
                high_game: b.high_game,
                high_series: b.high_series,
                games_played: b.games_played,
                recent_trend: playerScores
            };
        });

        // 4. Add Wednesday Warriors who might not be in ubl_bowler_stats yet
        const { data: warriorsProfiles } = await supabase
            .from('profiles')
            .select('*, teams(name)')
            .eq('is_warriors', true);

        if (warriorsProfiles) {
            const extraWarriors = warriorsProfiles
                .filter(wp => !enrichedStats.some(es => es.bowler_name === (wp.display_name || wp.name)))
                .map(wp => {
                    const teamObj = Array.isArray(wp.teams) ? wp.teams[0] : wp.teams;
                    return {
                        bowler_name: wp.display_name || wp.name,
                        team_name: teamObj?.name || 'Playmasters Warriors',
                        average: 0,
                        high_game: 0,
                        high_series: 0,
                        games_played: 0,
                        recent_trend: []
                    };
                });
            enrichedStats.push(...extraWarriors);
        }

        setBowlers(enrichedStats);
        
        // Auto-set selects
        const defaultP1 = enrichedStats.find(b => b.bowler_name === currentUser)?.bowler_name || enrichedStats[0]?.bowler_name;
        const defaultP2 = enrichedStats.find(b => b.bowler_name !== defaultP1)?.bowler_name || enrichedStats[1]?.bowler_name;
        
        setP1Name(defaultP1 || "");
        setP2Name(defaultP2 || "");
      }

      setLoading(false);
      setMounted(true);
    }
    initEngine();
  }, [currentUser, supabase]);

  const p1 = useMemo(() => bowlers.find(b => b.bowler_name === p1Name), [p1Name, bowlers]);
  const p2 = useMemo(() => bowlers.find(b => b.bowler_name === p2Name), [p2Name, bowlers]);

  const getVerdict = () => {
    if (!p1 || !p2) return { title: "Awaiting Intel", color: "text-white" };
    const diff = p1.average - p2.average;
    const p1Recent = (p1.recent_trend?.reduce((a,b) => a+b, 0) || 0) / (p1.recent_trend?.length || 1);
    const p2Recent = (p2.recent_trend?.reduce((a,b) => a+b, 0) || 0) / (p2.recent_trend?.length || 1);
    const recentDiff = p1Recent - p2Recent;

    if (Math.abs(diff) < 3 && Math.abs(recentDiff) < 5) return { title: "Mirror Image Rivalry", color: "text-emerald-400" };
    if (diff > 20) return { title: `${p1.bowler_name}: Total Dominance`, color: "text-red-500" };
    if (diff < -20) return { title: `${p2.bowler_name}: Total Dominance`, color: "text-red-500" };
    if (recentDiff > 10 && diff < 5) return { title: "Momentum Shift: Player 1 Rising", color: "text-blue-400" };
    if (recentDiff < -10 && diff > -5) return { title: "Momentum Shift: Player 2 Rising", color: "text-blue-400" };
    
    return { title: "The Grudge Match", color: "text-orange-400" };
  };

  if (!mounted || loading) return (
    <div className="min-h-screen bg-[#080B3A] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const verdict = getVerdict();

  return (
    <div className="min-h-screen bg-[#080B3A] text-white font-sans selection:bg-red-500/30 overflow-hidden">
      {/* HUD Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative">
        <header className="mb-16 text-center border-b border-white/10 pb-12">
           <div className="inline-block mb-4 px-4 py-1 bg-red-600/10 border border-red-600/30 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 italic">Rivalry Engine v2.1 // Cross-Division Battle</span>
           </div>
           <h1 className="text-7xl md:text-9xl font-['Barlow_Condensed'] font-black italic tracking-tighter uppercase leading-none mb-4 translate-y-2">
             STRIKE <span className="text-red-600">VS</span> STRIKE
           </h1>
           <p className="text-[#8A8EBB] font-mono text-[10px] uppercase tracking-[0.5em] font-bold opacity-60">
             Performance Paradox // Theoretical Outcome Matrix
           </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center mb-16 px-4">
          {/* Combatant 1 */}
          <div className="lg:col-span-5 relative group">
             <div className="absolute -inset-[2px] bg-gradient-to-b from-blue-600 to-transparent rounded-[3rem] opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
             <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl transition-all hover:translate-y-[-4px]">
                <div className="absolute top-0 right-0 p-6 opacity-5 font-black italic text-4xl">C1</div>
                <div className="space-y-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center text-4xl font-['Barlow_Condensed'] font-black italic border-4 border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.3)]">
                            {p1Name.slice(0,2).toUpperCase()}
                        </div>
                    </div>
                    <select 
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-['Barlow_Condensed'] font-black uppercase italic outline-none focus:border-blue-500 transition-all text-center appearance-none cursor-pointer"
                        value={p1Name}
                        onChange={(e) => setP1Name(e.target.value)}
                    >
                        {bowlers.map(b => <option key={b.bowler_name} value={b.bowler_name} className="bg-[#080B3A]">{b.bowler_name}</option>)}
                    </select>
                    <div className="text-center space-y-1">
                        <p className="text-xs font-black uppercase tracking-[4px] text-blue-400 opacity-80">{p1?.team_name || "Free Agent"}</p>
                        <p className="text-4xl font-['Barlow_Condensed'] font-black uppercase italic leading-none">{p1Name}</p>
                    </div>
                </div>
             </div>
          </div>

          {/* Central Nexus (VS) */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center py-12">
             <div className="relative">
                <div className="absolute inset-0 bg-red-600 blur-[40px] opacity-20 animate-pulse" />
                <span className="relative text-6xl md:text-8xl font-['Barlow_Condensed'] font-black italic text-red-600 drop-shadow-[0_0_15px_rgba(232,32,48,0.5)]">VS</span>
             </div>
             <div className="mt-8 text-center min-w-[200px] pointer-events-none">
                <div className="inline-block px-4 py-2 border-y border-white/10 mb-4">
                    <p className={`text-[10px] font-black uppercase tracking-[4px] font-mono ${verdict.color}`}>
                        {verdict.title}
                    </p>
                </div>
             </div>
          </div>

          {/* Combatant 2 */}
          <div className="lg:col-span-5 relative group">
             <div className="absolute -inset-[2px] bg-gradient-to-b from-red-600 to-transparent rounded-[3rem] opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
             <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl transition-all hover:translate-y-[-4px]">
                <div className="absolute top-0 left-0 p-6 opacity-5 font-black italic text-4xl">C2</div>
                <div className="space-y-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-4xl font-['Barlow_Condensed'] font-black italic border-4 border-white/10 shadow-[0_0_50px_rgba(232,32,48,0.3)]">
                            {p2Name.slice(0,2).toUpperCase()}
                        </div>
                    </div>
                    <select 
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-['Barlow_Condensed'] font-black uppercase italic outline-none focus:border-red-600 transition-all text-center appearance-none cursor-pointer"
                        value={p2Name}
                        onChange={(e) => setP2Name(e.target.value)}
                    >
                        {bowlers.map(b => <option key={b.bowler_name} value={b.bowler_name} className="bg-[#080B3A]">{b.bowler_name}</option>)}
                    </select>
                    <div className="text-center space-y-1">
                        <p className="text-xs font-black uppercase tracking-[4px] text-red-500 opacity-80">{p2?.team_name || "Free Agent"}</p>
                        <p className="text-4xl font-['Barlow_Condensed'] font-black uppercase italic leading-none">{p2Name}</p>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* The Matrix */}
        <div className="relative bg-white/[0.02] backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-center gap-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                <h3 className="text-2xl font-['Barlow_Condensed'] font-black uppercase italic tracking-widest text-[#8A8EBB]">Statistical Matrix</h3>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>

            <div className="p-12 space-y-16">
                {[
                    { label: "Season Average", p1: p1?.average || 0, p2: p2?.average || 0, unit: "Pins" },
                    { label: "Apex Game", p1: p1?.high_game || 0, p2: p2?.high_game || 0, unit: "Pins" },
                    { label: "Elite Series", p1: p1?.high_series || 0, p2: p2?.high_series || 0, unit: "Points" },
                    { label: "Combat Experience", p1: p1?.games_played || 0, p2: p2?.games_played || 0, unit: "Games" },
                ].map((stat, i) => {
                    const max = Math.max(stat.p1, stat.p2, 1);
                    const p1Pct = (stat.p1 / max) * 100;
                    const p2Pct = (stat.p2 / max) * 100;

                    return (
                        <div key={i} className="relative group/stat">
                            <div className="flex justify-between items-center mb-6 px-4">
                                <div className="text-left w-32">
                                    <p className="text-5xl font-['Barlow_Condensed'] font-black italic text-blue-400 leading-none">{stat.p1}</p>
                                    <p className="text-[9px] font-black uppercase text-[#8A8EBB] tracking-widest mt-1">Combatant Left</p>
                                </div>
                                <div className="text-center">
                                    <h4 className="text-xs font-black uppercase tracking-[6px] text-white/40 italic">{stat.label}</h4>
                                </div>
                                <div className="text-right w-32">
                                    <p className="text-5xl font-['Barlow_Condensed'] font-black italic text-red-500 leading-none">{stat.p2}</p>
                                    <p className="text-[9px] font-black uppercase text-[#8A8EBB] tracking-widest mt-1">Combatant Right</p>
                                </div>
                            </div>
                            <div className="relative h-2 bg-black/40 rounded-full overflow-hidden flex gap-1 p-0.5 border border-white/10 shadow-[inner_0_2px_4px_rgba(0,0,0,0.5)]">
                                <div className="absolute inset-0 flex justify-center pointer-events-none z-10">
                                    <div className="w-px h-full bg-white/20" />
                                </div>
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-700 to-blue-400 rounded-full transition-all duration-500 origin-left scale-x-100 group-hover/stat:brightness-125 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                    style={{ width: `${p1Pct / 2}%` }}
                                />
                                <div 
                                    className="h-full bg-gradient-to-l from-red-700 to-red-500 rounded-full transition-all duration-500 origin-right ml-auto group-hover/stat:brightness-125 shadow-[0_0_15px_rgba(232,32,48,0.4)]"
                                    style={{ width: `${p2Pct / 2}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Flux Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border-t border-white/5">
                {[p1, p2].map((p, idx) => (
                    <div key={idx} className="p-12 bg-black/20 hover:bg-black/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-400' : 'bg-red-500'} animate-pulse`} />
                            <h5 className="text-sm font-black uppercase tracking-widest italic opacity-50">Recent Flux // Last 5 Games</h5>
                        </div>
                        <div className="flex items-end gap-1.5 h-24">
                            {p?.recent_trend?.map((s, i) => (
                                <div 
                                    key={i} 
                                    className={`flex-1 min-w-[30px] rounded-t-lg transition-all duration-500 hover:brightness-150 ${idx === 0 ? 'bg-blue-600/40' : 'bg-red-600/40'}`} 
                                    style={{ height: `${(s / 300) * 100}%` }}
                                    title={`Game ${i+1}: ${s}`}
                                >
                                    <div className={`h-1 w-full rounded-t-full ${idx === 0 ? 'bg-blue-400' : 'bg-red-500'}`} />
                                </div>
                            )) || <p className="text-xs font-mono text-[#8A8EBB]">No recent game intel found.</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
            <button className="px-12 py-5 bg-gradient-to-r from-red-600 to-red-800 text-white font-['Barlow_Condensed'] font-black uppercase italic text-xl rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all group overflow-hidden relative">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative">Simulate Full Series Battle →</span>
            </button>
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed top-[20%] right-[-10%] w-96 h-96 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[10%] left-[-5%] w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
