'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogGame() {
    const supabase = createClient();
    const router = useRouter();
    
    const [frames, setFrames] = useState<number[]>(Array(10).fill(0));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{type: 'error'|'success', text: string} | null>(null);

    const handleFrameChange = (index: number, value: string) => {
        const num = parseInt(value, 10);
        const newFrames = [...frames];
        newFrames[index] = isNaN(num) ? 0 : Math.min(30, Math.max(0, num));
        setFrames(newFrames);
    };

    const totalScore = frames.reduce((a, b) => a + b, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (totalScore === 0) {
            setMessage({ type: 'error', text: 'Total score cannot be 0. Please enter your frames.' });
            return;
        }

        setIsSubmitting(true);

        const { error } = await supabase.from('scores').insert({
            total_score: totalScore,
            frame_scores: frames,
            version: 1
        });

        setIsSubmitting(false);

        if (error) {
            setMessage({ type: 'error', text: 'Failed to upload score. Try again.' });
            console.error(error);
        } else {
            setMessage({ type: 'success', text: 'Game locked in securely!' });
            setFrames(Array(10).fill(0));
            setTimeout(() => {
                router.push('/dashboard/player');
            }, 2000);
        }
    };

    return (
        <div className="py-12 max-w-3xl mx-auto animate-fade-in pb-24 px-4 text-center">
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">
                    Log <span className="text-strike">Score</span>
                </h1>
                <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">
                    Enter your frame-by-frame data for accurate fatigue analysis
                </p>
            </header>

            <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 border border-gray-800/60 rounded-2xl relative overflow-hidden text-left">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
                
                {message && (
                    <div className={`p-4 rounded-lg mb-6 font-bold text-center ${message.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                    {frames.map((score, index) => (
                        <div key={index} className="bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                            <label className="block text-[10px] text-gray-500 font-black uppercase mb-2">
                                Frame {index + 1}
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="30"
                                value={score || ''}
                                onChange={(e) => handleFrameChange(index, e.target.value)}
                                className="w-full bg-transparent text-2xl font-black text-white outline-none placeholder-gray-700 text-center tabular-nums"
                                placeholder="0"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-800/50 pt-8 mt-4">
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Calculated Total</p>
                        <p className={`text-6xl font-black tabular-nums tracking-tighter ${totalScore > 0 ? 'text-playmasters-red drop-shadow-[0_0_15px_rgba(224,31,61,0.3)]' : 'text-gray-700'}`}>
                            {totalScore}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto bg-white text-playmasters-dark px-10 py-4 rounded-full font-black uppercase tracking-[2px] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isSubmitting ? 'Verifying...' : 'Submit Score'}
                    </button>
                </div>
            </form>
        </div>
    );
}
