'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ModernHero() {
    const [stats, setStats] = useState({
        highSeries: '444',
        leagueRank: '1st',
        activeMembers: '12+'
    });

    useEffect(() => {
        async function fetchHeroStats() {
            const supabase = createClient();
            
            // Fetch High Series from league_records
            const { data: recordData } = await supabase
                .from('league_records')
                .select('value')
                .eq('record_type', 'High Series (Season)')
                .single();
            
            // Fetch Team Standing from team_stats
            const { data: teamData } = await supabase
                .from('team_stats')
                .select('label, value');

            if (recordData) {
                setStats(prev => ({ ...prev, highSeries: recordData.value }));
            }
            if (teamData) {
                const rank = teamData.find(s => s.label === 'Team Standing')?.value || '1st';
                const members = teamData.find(s => s.label === 'Active Roster')?.value || '12+';
                setStats(prev => ({ ...prev, leagueRank: rank, activeMembers: members }));
            }
        }
        fetchHeroStats();
    }, []);

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-navy-dark pt-20">
            {/* Background Compositional Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(232,32,48,0.05),transparent_70%)]" />
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-strike/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-ball-pink/10 blur-[120px] rounded-full" />
            </div>

            {/* Main Content Grid */}
            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Text Content - Left Aligned */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                        <div className="h-px w-12 bg-strike" />
                        <span className="font-ui text-strike uppercase tracking-[6px] text-xs font-black">Nairobi Elite Unit</span>
                    </div>

                    <h1 className="font-wordmark text-[clamp(60px,10vw,120px)] leading-[0.85] uppercase text-white tracking-tighter">
                        STRIKE LIKE <br />
                        <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '2px white' }}>PLAYMASTERS</span>
                    </h1>

                    <p className="font-ui text-gray-mid text-lg max-w-xl leading-relaxed uppercase tracking-wider italic">
                        Precision Analytics. Elite Competition. <br />
                        The standard of Kenyan Bowling since 1994.
                    </p>

                    <div className="flex flex-wrap gap-6 pt-4">
                        <Link href="/dashboard/player" className="px-10 py-5 bg-strike hover:bg-strike-deep text-white font-ui font-black uppercase tracking-[4px] transition-all transform hover:scale-105 hover:-rotate-1 shadow-2xl">
                            The Hub →
                        </Link>
                        <Link href="#contact" className="px-10 py-5 border border-white/20 hover:border-white/40 text-white font-ui font-black uppercase tracking-[4px] transition-all backdrop-blur-sm">
                            Join Unit
                        </Link>
                    </div>
                </div>

                {/* Anti-Grid Visual Element - Right Aligned with Skew */}
                <div className="lg:col-span-5 relative hidden lg:block">
                    <div className="relative w-full aspect-[4/5] transform skew-x-3 rotate-3 bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl group">
                        <img 
                            src="/5860367998361734483.jpg" 
                            alt="Playmasters Unit" 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-80" />
                        
                        {/* Floating Data Panels */}
                        <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-4 transform -skew-x-3 -rotate-3">
                            <div className="bg-navy/90 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-2xl translate-x-4">
                                <p className="font-ui text-[10px] text-gray-mid uppercase tracking-widest mb-1">Session Best</p>
                                <div className="flex justify-between items-end">
                                    <span className="font-wordmark text-4xl text-strike">{stats.highSeries}</span>
                                    <span className="font-ui text-[8px] text-gray-dark uppercase tracking-widest italic">Live Sync Active</span>
                                </div>
                            </div>
                            <div className="bg-strike/90 backdrop-blur-xl p-6 rounded-xl shadow-2xl -translate-x-4">
                                <p className="font-ui text-[10px] text-white/60 uppercase tracking-widest mb-1">Unit Ranking</p>
                                <div className="flex justify-between items-end">
                                    <span className="font-wordmark text-4xl text-white">{stats.leagueRank}</span>
                                    <span className="font-ui text-[8px] text-white/40 uppercase tracking-widest">UBL Division 1</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 border-t-2 border-r-2 border-strike/30" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 border-b-2 border-l-2 border-ball-pink/30" />
                </div>
            </div>

            {/* Stats Bar (Phase 1 Dynamic) */}
            <div className="absolute bottom-0 left-0 w-full border-t border-white/5 bg-navy/40 backdrop-blur-xl py-8">
                <div className="container mx-auto px-6 flex justify-around items-center">
                    {[
                        { label: 'Active Roster', val: stats.activeMembers },
                        { label: 'UBL Wins', val: '14' },
                        { label: 'Est.', val: '1994' }
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className="font-wordmark text-2xl text-white">{s.val}</span>
                            <span className="font-ui text-[9px] text-gray-mid uppercase tracking-[4px]">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
