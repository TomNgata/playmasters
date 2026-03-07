'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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

// Squad Benchmarks — always-available baseline data
const SQUAD_BENCHMARKS = {
    historicalFrameAvgs: [12, 14, 15, 13, 16, 18, 17, 15, 19, 21],
    heatmapData: [
        [15, 20, 10, 25, 12, 18, 22, 15, 28, 30],
        [12, 18, 15, 20, 10, 15, 18, 12, 25, 28],
        [18, 22, 12, 18, 15, 20, 25, 18, 30, 35],
        [10, 15, 10, 15, 12, 12, 15, 10, 20, 22],
        [20, 25, 18, 30, 15, 22, 28, 20, 35, 40]
    ]
};

export default function PlayerDashboard() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ublProfile, setUblProfile] = useState<UBLBowler | null>(null);
    const [allPlaymasters, setAllPlaymasters] = useState<UBLBowler[]>([]);
    const [selectedBowlerName, setSelectedBowlerName] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState('');
    const [stats, setStats] = useState({
        totalMatches: 0,
        seasonAvg: 0,
        totalPins: 0,
        historicalFrameAvgs: SQUAD_BENCHMARKS.historicalFrameAvgs,
        recentGameFrames: Array(10).fill(0),
        recentGameScores: [] as number[],
        recentGameDates: [] as string[],
        heatmapData: SQUAD_BENCHMARKS.heatmapData,
        isUsingBenchmarks: true
    });

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                const supabase = createClient();

                // Fetch UBL stats — the core data source
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

                // Try to fetch personal scores (if any exist in the DB)
                const { data: scoresData } = await supabase
                    .from('scores')
                    .select('total_score, frame_scores, updated_at')
                    .order('updated_at', { ascending: false })
                    .limit(20);

                if (scoresData && scoresData.length > 0 && isMounted) {
                    const totalPins = scoresData.reduce((sum, s) => sum + (s.total_score || 0), 0);
                    const seasonAvg = Math.round(totalPins / scoresData.length);
                    const totalFrameScores = new Array(10).fill(0);
                    const frameCounts = new Array(10).fill(0);

                    scoresData.forEach(s => {
                        const frames = (s.frame_scores as any[] || []).map(f => typeof f === 'object' && f !== null ? (f.score || 0) : Number(f));
                        for (let i = 0; i < Math.min(10, frames.length); i++) {
                            totalFrameScores[i] += frames[i];
                            frameCounts[i]++;
                        }
                    });

                    const historicalFrameAvgs = totalFrameScores.map((t, i) => frameCounts[i] > 0 ? Math.round(t / frameCounts[i]) : 0);

                    const recent10 = scoresData.slice(0, 10).reverse();
                    const recentGameScores = recent10.map(s => s.total_score || 0);
                    const recentGameDates = recent10.map(s => new Date(s.updated_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

                    const recent5 = scoresData.slice(0, 5);
                    const heatmapData = recent5.map(s => {
                        const f = (s.frame_scores as any[] || []).map(frame => typeof frame === 'object' && frame !== null ? (frame.score || 0) : Number(frame));
                        while (f.length < 10) f.push(0);
                        return f;
                    });

                    setStats({
                        totalMatches: scoresData.length,
                        seasonAvg,
                        totalPins,
                        historicalFrameAvgs,
                        recentGameFrames: heatmapData[0] || Array(10).fill(0),
                        recentGameScores,
                        recentGameDates,
                        heatmapData,
                        isUsingBenchmarks: false
                    });
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadStatus('uploading');
        setUploadMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload-csv', { method: 'POST', body: formData });
            const data = await res.json();

            if (!res.ok) {
                setUploadStatus('error');
                setUploadMessage(data.error || 'Upload failed. Please try again.');
            } else {
                setUploadStatus('success');
                setUploadMessage(data.message);
                router.refresh();
            }
        } catch {
            setUploadStatus('error');
            setUploadMessage('Network error. Please check your connection.');
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (loading) return (
        <div className="min-h-screen bg-navy-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-strike border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const uploadStatusColors = {
        idle: 'border-white/20',
        uploading: 'border-bat-blue/60 animate-pulse',
        success: 'border-emerald-500/60',
        error: 'border-strike/60',
    };

    const displayName = ublProfile?.bowler_name || 'PLAYMASTER';

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

                        {/* Performance Heatmap */}
                        <section className="bg-navy border border-white/5 p-8 rounded-2xl relative overflow-hidden">
                            <div className="flex justify-between items-start mb-8">
                                <h3 className="text-2xl font-black uppercase text-white flex items-center gap-3">
                                    <span className="text-ball-pink text-3xl">🔥</span>
                                    Frame Consistency Heatmap
                                </h3>
                                {stats.isUsingBenchmarks && (
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-[2px] text-gray-400 italic">
                                        Squad Benchmarks
                                    </span>
                                )}
                            </div>
                            
                            <div className="space-y-6">
                                <div className="overflow-x-auto pb-4">
                                    <div className="min-w-[500px] relative">
                                        <div className="grid grid-cols-11 gap-2 mb-2">
                                            <div className="col-span-1"></div>
                                            {Array.from({length: 10}).map((_, i) => (
                                                <div key={i} className="text-center font-ui text-[9px] font-black text-gray-500 uppercase">F{i+1}</div>
                                            ))}
                                        </div>
                                        {stats.heatmapData.map((frames, rowIdx) => (
                                            <div key={rowIdx} className="grid grid-cols-11 gap-2 mb-2">
                                                <div className="col-span-1 flex items-center">
                                                    <span className="font-ui text-[8px] font-black text-gray-600 uppercase">
                                                        {stats.isUsingBenchmarks ? `REF 0${rowIdx + 1}` : `G${stats.heatmapData.length - rowIdx}`}
                                                    </span>
                                                </div>
                                                {frames.map((score, colIdx) => {
                                                    let bgColor = 'bg-white/5';
                                                    let textColor = 'text-gray-400';
                                                    if (score >= 20) { bgColor = 'bg-strike/80'; textColor = 'text-white font-bold shadow-sm'; }
                                                    else if (score >= 10) { bgColor = 'bg-bat-blue/60'; textColor = 'text-white'; }
                                                    return (
                                                        <div key={colIdx} className={`col-span-1 h-10 ${bgColor} rounded-sm flex items-center justify-center font-wordmark text-sm ${textColor} transition-colors hover:brightness-125`} title={`Frame ${colIdx+1}: ${score} pins`}>
                                                            {score}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                        <div className="absolute -bottom-8 right-0 flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 font-ui text-[9px] text-gray-400 uppercase tracking-widest"><div className="w-3 h-3 rounded-sm bg-strike/80"></div> Closed (20+)</div>
                                            <div className="flex items-center gap-1.5 font-ui text-[9px] text-gray-400 uppercase tracking-widest"><div className="w-3 h-3 rounded-sm bg-bat-blue/60"></div> Mark (10-19)</div>
                                            <div className="flex items-center gap-1.5 font-ui text-[9px] text-gray-400 uppercase tracking-widest"><div className="w-3 h-3 rounded-sm bg-white/5 border border-white/10"></div> Open (&lt;10)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-navy border border-white/5 p-8 rounded-2xl flex flex-col gap-6">
                            <div>
                                <h3 className="font-ui text-2xl uppercase tracking-widest text-ball-pink mb-2">Sync Scores</h3>
                                <p className="text-sm font-sans text-gray-mid">Upload your CSV from Westgate sessions.</p>
                            </div>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center hover:bg-white/[0.02] hover:border-strike/40 transition-all cursor-pointer group bg-navy-dark/50 ${uploadStatusColors[uploadStatus]}`}
                            >
                                <svg className="w-10 h-10 text-gray-mid mb-3 group-hover:text-strike group-hover:-translate-y-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="font-ui text-xs uppercase tracking-[3px] text-gray-mid group-hover:text-white transition-colors">Select CSV Data</span>
                                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                            </div>
                            {uploadMessage && (
                                <div className={`text-xs font-ui uppercase tracking-widest p-4 rounded-lg border text-center ${uploadStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-strike/10 border-strike/30 text-strike'}`}>
                                    {uploadMessage}
                                </div>
                            )}
                        </div>

                        <div className="bg-navy border border-white/5 p-8 rounded-2xl">
                            <h3 className="font-ui text-2xl uppercase tracking-widest text-bat-blue mb-6">Achievement Unit</h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-4 bg-navy-dark/50 rounded-xl border border-white/5">
                                    <div className="text-3xl mb-1">🛡️</div>
                                    <div className="font-wordmark text-white">VERIFIED</div>
                                    <div className="text-[8px] text-gray-mid uppercase tracking-[2px]">Core Playmaster</div>
                                </div>
                                <div className="p-4 bg-navy-dark/50 rounded-xl border border-white/5">
                                    <div className="text-3xl mb-1">🤝</div>
                                    <div className="font-wordmark text-white">SQUAD</div>
                                    <div className="text-[8px] text-gray-mid uppercase tracking-[2px]">Unit Member</div>
                                </div>
                                <div className="p-4 bg-navy-dark/50 rounded-xl border border-white/5 col-span-2 mt-2">
                                    <div className="text-3xl mb-1">⏳</div>
                                    <div className="font-wordmark text-white">CHALLENGER</div>
                                    <div className="text-[8px] text-gray-mid uppercase tracking-[2px]">Sync 5 Matches for Tier 1</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
