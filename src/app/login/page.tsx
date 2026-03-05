'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// Split out so useSearchParams is inside a Suspense boundary (Next.js 14 requirement)
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectedFrom = searchParams.get('redirectedFrom') || '/dashboard/player';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAuthError(null);

        try {
            // Check for missing env variables which could cause silent failures in Vercel
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                throw new Error("System Error: Supabase keys missing. Check Vercel Environment Variables.");
            }

            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                setAuthError(error.message);
                setLoading(false);
            } else {
                // Hard redirect to ensure middleware picks up the new cookie correctly after login
                window.location.href = redirectedFrom;
            }
        } catch (err: any) {
            console.error("Login Exception:", err);
            setAuthError(err.message || "An unexpected system error occurred.");
            setLoading(false);
        }
    };

    return (
        <div className="bg-navy border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="font-ui text-2xl uppercase tracking-widest text-white mb-1">
                Sign In
            </h2>
            <p className="font-sans text-gray-mid text-sm mb-8">
                Access is free for all Playmasters roster members.
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-ui text-xs uppercase tracking-[3px] text-gray-mid">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-navy-dark border border-white/15 rounded-lg px-4 py-3 text-white font-sans focus:outline-none focus:border-strike transition-colors placeholder:text-gray-dark"
                        placeholder="you@playmasters.co.ke"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="font-ui text-xs uppercase tracking-[3px] text-gray-mid">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-navy-dark border border-white/15 rounded-lg px-4 py-3 text-white font-sans focus:outline-none focus:border-strike transition-colors placeholder:text-gray-dark"
                        placeholder="••••••••"
                    />
                </div>

                {authError && (
                    <div className="bg-strike/10 border border-strike/40 text-strike font-sans text-sm px-4 py-3 rounded-lg">
                        {authError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full px-6 py-4 rounded-lg bg-strike hover:bg-strike-deep text-white font-ui font-semibold text-lg tracking-[2px] uppercase transition-all shadow-[0_4px_0_theme(colors.strike-deep)] hover:shadow-[0_2px_0_theme(colors.strike-deep)] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-[0_4px_0_theme(colors.strike-deep)]"
                >
                    {loading ? 'Entering Hub...' : 'Strike In \u2192'}
                </button>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-navy-dark flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-10">
                    <h1 className="font-wordmark text-5xl text-white tracking-wide uppercase text-center">
                        Play<span className="text-strike">masters</span>
                    </h1>
                    <p className="font-ui text-gray-mid text-sm tracking-[4px] uppercase mt-2">
                        Team Hub Access
                    </p>
                </div>

                <Suspense fallback={
                    <div className="bg-navy border border-white/10 rounded-2xl p-8 text-center text-gray-mid font-ui">
                        Loading...
                    </div>
                }>
                    <LoginForm />
                </Suspense>

                <p className="text-center font-sans text-xs text-gray-dark mt-6">
                    Not on the roster yet?{' '}
                    <span className="text-gray-mid">Contact your team captain.</span>
                </p>
            </div>
        </main>
    );
}
