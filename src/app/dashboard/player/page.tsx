'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// Mock stats — to be replaced with real Supabase fetch in a future task
const mockStats = {
    name: 'Dillan Mandalia',
    avgScore: 184,
    highScore: 245,
    gamesPlayed: 12,
};

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function PlayerDashboard() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [uploadMessage, setUploadMessage] = useState('');

    // ── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    // ── CSV Upload ───────────────────────────────────────────────────────────
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
            }
        } catch {
            setUploadStatus('error');
            setUploadMessage('Network error. Please check your connection.');
        }

        // Reset file input so same file can be re-uploaded
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const uploadStatusColors: Record<UploadStatus, string> = {
        idle: 'border-white/20',
        uploading: 'border-bat-blue/60 animate-pulse',
        success: 'border-emerald-500/60',
        error: 'border-strike/60',
    };

    return (
        <div className="min-h-screen bg-navy-void text-white">
            <div className="max-w-5xl mx-auto px-6 py-12">

                {/* Header */}
                <header className="mb-10 flex items-end justify-between border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-5xl font-wordmark tracking-wide text-white">PLAYER HQ</h1>
                        <p className="text-playgray-mid mt-2 font-sans font-medium">
                            Welcome back, {mockStats.name}.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                            <p className="font-ui text-sm text-playgray-mid uppercase tracking-[2px]">Current Avg</p>
                            <p className="font-wordmark text-5xl text-strike">{mockStats.avgScore}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="font-ui text-xs uppercase tracking-[3px] text-playgray-mid hover:text-strike transition-colors border border-white/10 hover:border-strike/40 px-3 py-1.5 rounded"
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                {/* Frame 7 Headline — Front and Center per architecture SOP */}
                <section className="mb-12">
                    <div className="w-full bg-navy-deep border-l-4 border-strike rounded-xl p-8 relative overflow-hidden shadow-xl">
                        <div className="absolute top-[-20px] right-2 p-4 opacity-[0.03] pointer-events-none text-[180px] font-wordmark leading-none text-white">
                            7
                        </div>
                        <h2 className="font-ui text-3xl font-bold tracking-wider text-white mb-2 flex items-center gap-3 uppercase">
                            <span className="w-3 h-3 rounded-full bg-strike animate-pulse shadow-[0_0_10px_#E82030]" />
                            Critical Focus Drop
                        </h2>
                        <p className="text-playgray-mid font-sans text-lg max-w-2xl leading-relaxed">
                            Your strike probability drops by{' '}
                            <span className="text-strike font-bold text-xl">34%</span> after{' '}
                            <span className="text-white font-bold">Frame 7</span>. This focus fatigue is costing
                            you an average of 18 pins per game.
                        </p>
                        <button className="mt-6 px-6 py-3 bg-strike/10 hover:bg-strike/20 text-strike font-ui text-lg tracking-widest uppercase border border-strike/50 rounded-md transition-all duration-200">
                            View Frame Breakdown
                        </button>
                    </div>
                </section>

                {/* Rivalry & Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* CSV Upload Card — wired to /api/upload-csv */}
                    <div className="bg-navy-deep border border-white/5 p-6 rounded-xl flex flex-col justify-between">
                        <div>
                            <h3 className="font-ui text-2xl uppercase tracking-widest text-ball-pink mb-2">
                                Upload Scores
                            </h3>
                            <p className="text-sm font-sans text-playgray-mid mb-1">
                                Drop your CSV from your last session. Takes less than 2 minutes.
                            </p>
                            <p className="text-xs font-ui text-playgray-dark uppercase tracking-wider mb-6">
                                Columns: player_name, match_id, f1–f10, total_score
                            </p>
                        </div>

                        {/* Drop Zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-strike/50 transition-colors cursor-pointer group bg-navy-void ${uploadStatusColors[uploadStatus]}`}
                        >
                            {uploadStatus === 'uploading' ? (
                                <p className="font-ui text-sm uppercase tracking-wider text-bat-blue">Uploading...</p>
                            ) : (
                                <p className="font-ui text-lg uppercase tracking-wider text-playgray-mid group-hover:text-strike transition-colors">
                                    Tap to select CSV file...
                                </p>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Status Message */}
                        {uploadMessage && (
                            <div
                                className={`mt-4 text-sm font-sans px-4 py-3 rounded-lg border ${uploadStatus === 'success'
                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                    : 'bg-strike/10 border-strike/40 text-strike'
                                    }`}
                            >
                                {uploadMessage}
                            </div>
                        )}
                    </div>

                    {/* Active Rivalries Card */}
                    <div className="bg-navy-deep border border-white/5 p-6 rounded-xl">
                        <h3 className="font-ui text-2xl uppercase tracking-widest text-ball-pink mb-4">
                            Active Rivalries
                        </h3>
                        <div className="flex items-center justify-between p-4 bg-navy-void rounded-lg border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-bat-blue/20 flex items-center justify-center font-ui text-2xl text-bat-blue">
                                    VM
                                </div>
                                <div>
                                    <p className="font-sans font-bold">Viraj Mistry</p>
                                    <p className="font-sans text-xs text-playgray-mid">Trailing by 4 Avg Pins</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-wordmark text-2xl text-white">188 Avg</p>
                                <p className="font-sans text-xs text-emerald-400 font-bold">+2 this week</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
