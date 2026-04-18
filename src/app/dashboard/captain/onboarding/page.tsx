'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function CaptainOnboarding() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        async function checkCaptain() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'captain') {
                router.push('/dashboard/player');
                return;
            }
            setLoading(false);
        }
        checkCaptain();
    }, [router]);

    const handleOnboard = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch('/api/captain/onboard-player', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.error });
            } else {
                setMessage({ type: 'success', text: data.message });
                setName('');
                setEmail('');
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Connection error. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-navy-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-strike border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-navy-dark text-white font-sans selection:bg-strike selection:text-white pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

                <Link href="/dashboard/player" className="inline-flex items-center gap-2 text-gray-mid hover:text-strike transition-colors mb-12 uppercase font-ui text-xs tracking-[3px]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to HQ
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl sm:text-6xl font-wordmark tracking-tight text-white uppercase leading-none mb-4">ONBOARDING UNIT</h1>
                    <p className="font-ui text-strike uppercase tracking-[6px] text-sm font-bold">New Roster Assignment</p>
                </div>

                <div className="bg-navy border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-strike/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                    <form onSubmit={handleOnboard} className="relative z-10 flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="font-ui text-xs uppercase tracking-[3px] text-gray-mid">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="JAYDEN NJOROGE"
                                    className="bg-navy-dark border border-white/15 rounded-lg px-4 py-4 text-white font-sans focus:outline-none focus:border-strike transition-colors placeholder:text-gray-dark uppercase"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-ui text-xs uppercase tracking-[3px] text-gray-mid">Email Identity</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="JAYDEN@PLAYMASTERS.CO.KE"
                                    className="bg-navy-dark border border-white/15 rounded-lg px-4 py-4 text-white font-sans focus:outline-none focus:border-ball-pink transition-colors placeholder:text-gray-dark"
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl border font-ui text-xs uppercase tracking-widest text-center ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-strike/10 border-strike/30 text-strike'}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-5 bg-strike hover:bg-strike-deep text-white font-ui font-extrabold text-xl tracking-[4px] uppercase transition-all shadow-[0_6px_0_theme(colors.strike-deep)] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                        >
                            {submitting ? 'Verifying Roster...' : 'Confirm Assignment'}
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                            <div className="text-center">
                                <p className="font-wordmark text-2xl text-white">4-8</p>
                                <p className="font-ui text-[10px] text-gray-mid uppercase tracking-[2px]">Team Capacity</p>
                            </div>
                            <div className="text-center">
                                <p className="font-wordmark text-2xl text-ball-pink">UNIT</p>
                                <p className="font-ui text-[10px] text-gray-mid uppercase tracking-[2px]">Grouping Policy</p>
                            </div>
                            <div className="text-center">
                                <p className="font-wordmark text-2xl text-bat-blue">CAP</p>
                                <p className="font-ui text-[10px] text-gray-mid uppercase tracking-[2px]">Access Gated</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
