'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type PlayerProfile = {
    id: string;
    name: string;
    role: string;
    team_id: string | null;
    team_name?: string;
};

type Teammate = {
    id: string;
    name: string;
    role: string;
};

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function PlayerDashboard() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profile, setProfile] = useState<PlayerProfile | null>(null);
    const [teammates, setTeammates] = useState<Teammate[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [uploadMessage, setUploadMessage] = useState('');
    const [stats, setStats] = useState({
        totalMatches: 0,
        seasonAvg: 0,
        totalPins: 0,
        historicalFrameAvgs: Array(10).fill(0),
        recentGameFrames: Array(10).fill(0),
        fatigueFrames: [] as number[]
    });

    useEffect(() => {
        let isMounted = true;

        async function fetchUserData() {
            try {
                const supabase = createClient();
                // 1. Fetch Profile (use a default or try to get session if it exists)
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    if (isMounted) setLoading(false);
                    return;
                }

                // 1. Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*, teams(name)')
                    .eq('id', user.id)
                    .single();

                if (profileError || !profileData) {
                    // Fallback for new users without a profile yet
                    if (isMounted) setProfile({
                        id: user.id,
                        name: user.email?.split('@')[0].toUpperCase() || 'PLAYER',
                        role: 'player',
                        team_id: null
                    });
                } else {
                    if (isMounted) setProfile({
                        ...profileData,
                        team_name: profileData.teams?.name
                    });

                    // 2. Fetch Teammates if in a team
                    if (profileData.team_id) {
                        const { data: teammatesData } = await supabase
                            .from('profiles')
                            .select('id, name, role')
                            .eq('team_id', profileData.team_id)
                            .neq('id', user.id);

                        if (teammatesData && isMounted) setTeammates(teammatesData);
                    }

                    // 3. Fetch Match Stats
                    const { data: scoresData } = await supabase
                        .from('scores')
                        .select('total_score, frame_scores, updated_at')
                        .eq('player_id', user.id);

                    if (scoresData && scoresData.length > 0 && isMounted) {
                        const totalPins = scoresData.reduce((sum, s) => sum + (s.total_score || 0), 0);
                        const seasonAvg = Math.round(totalPins / scoresData.length);

                        const totalFrameScores = new Array(10).fill(0);
                        const frameCounts = new Array(10).fill(0);

                        const sortedScores = [...scoresData].sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());

                        scoresData.forEach(s => {
                            const frames = (s.frame_scores as any[] || []).map(f => typeof f === 'object' && f !== null ? (f.score || 0) : Number(f));
                            for (let i = 0; i < Math.min(10, frames.length); i++) {
                                totalFrameScores[i] += frames[i];
                                frameCounts[i]++;
                            }
                        });

                        const historicalFrameAvgs = totalFrameScores.map((t, i) => frameCounts[i] > 0 ? Math.round(t / frameCounts[i]) : 0);
                        
                        const mostRecentScores = sortedScores[0];
                        const recentGameFrames = (mostRecentScores?.frame_scores as any[] || []).map(f => typeof f === 'object' && f !== null ? (f.score || 0) : Number(f));
                        while (recentGameFrames.length < 10) recentGameFrames.push(0);

                        const fatigueFrames = recentGameFrames.map((score, i) => {
                            if (frameCounts[i] > 0 && score < historicalFrameAvgs[i] - 1) return i;
                            return -1;
                        }).filter(i => i !== -1);

                        setStats({
                            totalMatches: scoresData.length,
                            seasonAvg,
                            totalPins,
                            historicalFrameAvgs,
                            recentGameFrames,
                            fatigueFrames
                        });
                    }
                }
            } catch (err) {
                console.error("Dashboard Fetch Exception:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchUserData();

        return () => { isMounted = false; };
    }, [router]);



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

    const uploadStatusColors: Record<UploadStatus, string> = {
        idle: 'border-white/20',
        uploading: 'border-bat-blue/60 animate-pulse',
        success: 'border-emerald-500/60',
        error: 'border-strike/60',
    };

    return (
        <div className="min-h-screen bg-navy-dark text-white font-sans selection:bg-strike selection:text-white pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-8">
                    <div className="flex items-center gap-6">
                        <img src="/logo-md.png" alt="Playmasters" className="w-20 h-20 object-contain" />
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl sm:text-6xl font-wordmark tracking-tight text-white uppercase leading-none">PLAYER HQ</h1>
                                {profile?.role === 'captain' && (
                                    <span className="bg-strike/20 text-strike border border-strike/30 px-3 py-1 rounded text-[10px] font-bold tracking-[2px] uppercase">Captain</span>
                                )}
                            </div>
                            <p className="text-gray-mid mt-2 font-ui uppercase tracking-[4px] text-sm md:text-base">
                                {profile?.team_name || 'Free Agent'} {' // '} <span className="text-white font-bold">{profile?.name}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 bg-navy/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm self-start md:self-auto">
                        <div className="text-right">
                            <p className="font-ui text-[10px] text-gray-mid uppercase tracking-[3px] mb-1">Season Avg</p>
                            <p className="font-wordmark text-5xl text-strike leading-none">{stats.seasonAvg || '---'}</p>
                        </div>
                        <div className="h-12 w-px bg-white/10" />
                    </div>
                </header>

                {/* Captain's Quick Action Bar */}
                {profile?.role === 'captain' && (
                    <div className="mb-12 p-1 bg-gradient-to-r from-strike via-ball-pink to-bat-blue rounded-xl">
                        <div className="bg-navy-dark rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="font-ui text-xl font-bold tracking-[3px] text-white uppercase">Captain&apos;s Console</h2>
                                <p className="text-gray-mid text-sm font-sans">Manage your team roster and onboard new players.</p>
                            </div>
                            <Link
                                href="/dashboard/captain/onboarding"
                                className="px-8 py-3 bg-white text-navy-dark font-ui font-extrabold text-sm tracking-[3px] uppercase hover:bg-strike hover:text-white transition-all transform hover:-translate-y-1"
                            >
                                Onboard New Player
                            </Link>
                        </div>
                    </div>
                )}

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Analytics */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Focus Fatigue Engine */}
                        <section className="bg-navy border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h2 className="font-ui text-2xl font-bold tracking-[4px] text-white mb-6 uppercase flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-strike shadow-[0_0_8px_#E82030]" />
                                    Focus Engine
                                </h2>
                                
                                <p className="text-gray-mid text-sm leading-relaxed mb-6 font-medium">
                                    Compare your latest game against your personal baseline. Frames dipping below your historical average are flagged to highlight potential pressure gaps or focus loss.
                                </p>

                                <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                                    {stats.historicalFrameAvgs.map((avg, i) => {
                                        const recent = stats.recentGameFrames[i] || 0;
                                        const isDip = stats.fatigueFrames.includes(i);
                                        
                                        return (
                                            <div key={i} className={`flex flex-col items-center bg-navy-dark border ${isDip ? 'border-strike border-b-2 shadow-[0_4px_15px_rgba(224,31,61,0.15)]' : 'border-white/5'} rounded-lg p-3 overflow-hidden relative transition-all`}>
                                                <span className="font-ui text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold flex items-center gap-1">
                                                    {isDip && <span className="w-1.5 h-1.5 rounded-full bg-strike animate-pulse"></span>}
                                                    F{i+1}
                                                </span>
                                                <div className="text-center w-full">
                                                    <div className={`font-wordmark text-2xl mb-1 ${isDip ? 'text-strike' : 'text-white'}`}>{recent}</div>
                                                    <div className="w-full h-px bg-white/10 my-2"></div>
                                                    <div className="font-sans text-[11px] text-gray-400 font-bold" title="Historical Average">
                                                        AVG {avg}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {stats.fatigueFrames.length > 0 && (
                                    <div className="mt-8 p-5 bg-gradient-to-r from-strike/10 to-transparent border-l-4 border-strike rounded-r-xl flex items-start gap-4">
                                        <div className="text-strike mt-0.5 text-xl">⚠️</div>
                                        <div>
                                            <h4 className="font-bold text-white uppercase text-sm mb-1 tracking-wider">Pressure Deviation Detected</h4>
                                            <p className="text-sm text-gray-300 font-medium">
                                                In your last match, performance dropped below your established average in <span className="text-white font-bold">Frames {stats.fatigueFrames.map(f => f + 1).join(', ')}</span>. Re-center your focus during these specific intervals!
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {stats.fatigueFrames.length === 0 && stats.totalMatches > 0 && (
                                    <div className="mt-8 p-5 bg-gradient-to-r from-emerald-500/10 to-transparent border-l-4 border-emerald-500 rounded-r-xl flex items-start gap-4">
                                        <div className="text-emerald-400 mt-0.5 text-xl">🎯</div>
                                        <div>
                                            <h4 className="font-bold text-white uppercase text-sm mb-1 tracking-wider">Focus Locked In</h4>
                                            <p className="text-sm text-gray-300 font-medium">
                                                In your last match, your frame performances stayed at or above your personal historical averages. Excellent consistency!
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Recent Matches Visual List */}
                        <div className="bg-navy border border-white/5 rounded-2xl p-8">
                            <h2 className="font-ui text-2xl font-bold tracking-[4px] text-white mb-6 uppercase flex items-center justify-between">
                                <span>Rivalry Pulse</span>
                                <span className="text-[10px] text-gray-mid tracking-widest">Live Updates</span>
                            </h2>
                            <div className="space-y-4">
                                {teammates.length > 0 ? teammates.map((teammate, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-5 bg-navy-dark/50 rounded-xl border border-white/5 hover:border-strike/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full bg-bat-blue/20 flex items-center justify-center font-wordmark text-xl text-bat-blue`}>
                                                {teammate.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-title italic text-white group-hover:text-strike transition-colors">{teammate.name}</p>
                                                <p className="font-ui text-[10px] text-gray-mid uppercase tracking-widest">Team {profile?.team_name} {' // '} {teammate.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-wordmark text-3xl text-white">188</p>
                                            <p className={`font-ui text-xs text-emerald-400 font-bold`}>+2 avg</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-dark font-ui uppercase tracking-widest text-center py-12 border-2 border-dashed border-white/5 rounded-xl">No team members found.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Actions & Secondary Stats */}
                    <div className="space-y-8">

                        {/* Quick Action: CSV Upload */}
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

                        {/* Achievement Unit */}
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
            </div>
        </div>
    );
}
