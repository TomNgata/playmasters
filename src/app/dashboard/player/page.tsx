'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type PlayerStats = {
    name: string;
    avgScore: number;
    highScore: number;
    gamesPlayed: number;
};

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function PlayerDashboard() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [stats, setStats] = useState<PlayerStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [uploadMessage, setUploadMessage] = useState('');
    const [fatigueLevel, setFatigueLevel] = useState(34); // Mock data for now, will be calc'd from DB

    useEffect(() => {
        async function fetchUserData() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            // In a real app, we'd fetch from a 'profiles' table. 
            // For now, we use the user metadata or name from email.
            setStats({
                name: user.email?.split('@')[0].toUpperCase() || 'PLAYER',
                avgScore: 184, // Real calc would go here
                highScore: 245,
                gamesPlayed: 112,
            });
            setLoading(false);
        }
        fetchUserData();
    }, [router]);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
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
                // Refresh stats after upload
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

    const uploadStatusColors: Record<UploadStatus, string> = {
        idle: 'border-white/20',
        uploading: 'border-bat-blue/60 animate-pulse',
        success: 'border-emerald-500/60',
        error: 'border-strike/60',
    };

    return (
        <div className="min-h-screen bg-navy-dark text-white font-sans selection:bg-strike selection:text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-8">
                    <div className="flex items-center gap-6">
                        <img src="/logo.png" alt="Playmasters" className="w-20 h-20 object-contain" />
                        <div>
                            <h1 className="text-4xl sm:text-6xl font-wordmark tracking-tight text-white uppercase leading-none">PLAYER HQ</h1>
                            <p className="text-gray-mid mt-2 font-ui uppercase tracking-[4px] text-sm md:text-base">
                                Welcome back, <span className="text-white font-bold">{stats?.name}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 bg-navy/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm self-start md:self-auto">
                        <div className="text-right">
                            <p className="font-ui text-[10px] text-gray-mid uppercase tracking-[3px] mb-1">Season Avg</p>
                            <p className="font-wordmark text-5xl text-strike leading-none">{stats?.avgScore}</p>
                        </div>
                        <div className="h-12 w-px bg-white/10" />
                        <button
                            onClick={handleLogout}
                            className="group flex flex-col items-center gap-1"
                        >
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-strike/50 group-hover:bg-strike/10 transition-all">
                                <svg className="w-5 h-5 text-gray-mid group-hover:text-strike transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <span className="font-ui text-[10px] uppercase tracking-widest text-gray-mid group-hover:text-strike">Sign Out</span>
                        </button>
                    </div>
                </header>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Analytics */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Frame 7 Fatigue Gauge - BIG VISUAL */}
                        <section className="bg-navy border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
                                <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2" strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - fatigueLevel / 100)} />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                <h2 className="font-ui text-2xl font-bold tracking-[4px] text-white mb-6 uppercase flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-strike shadow-[0_0_8px_#E82030]" />
                                    Focus Fatigue Analysis
                                </h2>

                                <div className="flex flex-col md:flex-row items-center gap-12">
                                    {/* The Gauge */}
                                    <div className="relative w-48 h-48 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            {/* Track */}
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                            {/* Progress */}
                                            <circle
                                                cx="50" cy="50" r="40" fill="none"
                                                stroke="url(#strikeGradient)" strokeWidth="8" strokeLinecap="round"
                                                strokeDasharray="251.2"
                                                strokeDashoffset={251.2 * (1 - fatigueLevel / 100)}
                                                className="transition-all duration-1000 ease-out"
                                            />
                                            <defs>
                                                <linearGradient id="strikeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#E82030" />
                                                    <stop offset="100%" stopColor="#D42080" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute flex flex-col items-center bg-navy-dark w-32 h-32 rounded-full border border-white/5 shadow-inner justify-center">
                                            <span className="font-wordmark text-5xl leading-none text-white">{fatigueLevel}%</span>
                                            <span className="font-ui text-[10px] uppercase tracking-widest text-strike mt-1">Dip Level</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <p className="text-gray-mid text-lg leading-relaxed">
                                            Your <span className="text-white font-bold uppercase underline decoration-strike/50 underline-offset-4 tracking-tighter">Frame 7 Crisis</span> is detected.
                                            Strike probability drops significantly as physical fatigue sets in.
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                            <div className="bg-navy-dark p-4 rounded-lg border border-white/5">
                                                <span className="block font-ui text-[10px] text-gray-mid uppercase mb-1">Avg Score F1-6</span>
                                                <span className="font-wordmark text-2xl text-emerald-400">192</span>
                                            </div>
                                            <div className="bg-navy-dark p-4 rounded-lg border border-white/5">
                                                <span className="block font-ui text-[10px] text-gray-mid uppercase mb-1">Avg Score F7-10</span>
                                                <span className="font-wordmark text-2xl text-strike">164</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Recent Matches Visual List */}
                        <div className="bg-navy border border-white/5 rounded-2xl p-8">
                            <h2 className="font-ui text-2xl font-bold tracking-[4px] text-white mb-6 uppercase flex items-center justify-between">
                                <span>Rivalry Pulse</span>
                                <span className="text-[10px] text-gray-mid tracking-widest">Live Updates</span>
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { name: 'Viraj Mistry', score: 188, trend: '+2', color: 'bat-blue' },
                                    { name: 'Dillan Mandalia', score: 201, trend: '-4', color: 'ball-pink' },
                                ].map((rival, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-5 bg-navy-dark/50 rounded-xl border border-white/5 hover:border-strike/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full bg-${rival.color}/20 flex items-center justify-center font-wordmark text-xl text-${rival.color}`}>
                                                {rival.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-title italic text-white group-hover:text-strike transition-colors">{rival.name}</p>
                                                <p className="font-ui text-[10px] text-gray-mid uppercase tracking-widest">Team Primary Roster</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-wordmark text-3xl text-white">{rival.score}</p>
                                            <p className={`font-ui text-xs ${rival.trend.startsWith('+') ? 'text-emerald-400' : 'text-strike'} font-bold`}>{rival.trend} avg</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Actions & Secondary Stats */}
                    <div className="space-y-8">

                        {/* Quick Action: CSV Upload */}
                        <div className="bg-navy border border-white/5 p-8 rounded-2xl flex flex-col gap-6">
                            <div>
                                <h3 className="font-ui text-2xl uppercase tracking-widest text-ball-pink mb-2">Sync Scores</h3>
                                <p className="text-sm font-sans text-gray-mid">Upload your CSV from Westgate sessions. Ingests data in <span className="text-white font-bold">{"<"}60s</span>.</p>
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

                        {/* Medal Wall / Achievements */}
                        <div className="bg-navy border border-white/5 p-8 rounded-2xl">
                            <h3 className="font-ui text-2xl uppercase tracking-widest text-bat-blue mb-6">Achievement Unit</h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-4 bg-navy-dark/50 rounded-xl border border-white/5">
                                    <div className="text-3xl mb-1">👑</div>
                                    <div className="font-wordmark text-white">MVP</div>
                                    <div className="text-[8px] text-gray-mid uppercase tracking-[2px]">Wk 04 Winner</div>
                                </div>
                                <div className="p-4 bg-navy-dark/50 rounded-xl border border-white/5">
                                    <div className="text-3xl mb-1">🔥</div>
                                    <div className="font-wordmark text-white">HOT</div>
                                    <div className="text-[8px] text-gray-mid uppercase tracking-[2px]">5 Strike Streak</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Disclaimer */}
                <footer className="mt-16 text-center border-t border-white/5 pt-8">
                    <p className="font-ui text-gray-dark text-[10px] tracking-[5px] uppercase">Official Playmasters Analytics Unit // Performance Gated</p>
                </footer>
            </div>
        </div>
    );
}
