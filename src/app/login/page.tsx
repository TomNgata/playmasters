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

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setAuthError(error.message);
            setLoading(false);
        } else {
            router.push(redirectedFrom);
            router.refresh();
        }
    };

    return (
        <div className="bg-navy-deep border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="font-ui text-2xl uppercase tracking-widest text-white mb-1">
                Sign In
            </h2>
            <p className="font-sans text-playgray-mid text-sm mb-8">
                Access is free for all Playmasters roster members.
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-ui text-xs uppercase tracking-[3px] text-playgray-mid">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-navy-void border border-white/15 rounded-lg px-4 py-3 text-white font-sans focus:outline-none focus:border-strike transition-colors placeholder:text-playgray-dark"
                        placeholder="you@playmasters.co.ke"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="font-ui text-xs uppercase tracking-[3px] text-playgray-mid">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-navy-void border border-white/15 rounded-lg px-4 py-3 text-white font-sans focus:outline-none focus:border-strike transition-colors placeholder:text-playgray-dark"
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
                    className="mt-2 w-full px-6 py-4 rounded-lg bg-strike hover:bg-strike-deep text-white font-ui font-semibold text-lg tracking-[2px] uppercase transition-all shadow-[0_4px_0_#B81828] hover:shadow-[0_2px_0_#B81828] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-[0_4px_0_#B81828]"
                >
                    {loading ? 'Entering Hub...' : 'Strike In \u2192'}
                </button>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-navy-void flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-10">
                    <h1 className="font-wordmark text-5xl text-white tracking-wide uppercase">
                        Play<span className="text-strike">masters</span>
                    </h1>
                    <p className="font-ui text-playgray-mid text-sm tracking-[4px] uppercase mt-2">
                        Team Hub Access
                    </p>
                </div>

                <Suspense fallback={
                    <div className="bg-navy-deep border border-white/10 rounded-2xl p-8 text-center text-playgray-mid font-ui">
                        Loading...
                    </div>
                }>
                    <LoginForm />
                </Suspense>

                <p className="text-center font-sans text-xs text-playgray-dark mt-6">
                    Not on the roster yet?{' '}
                    <span className="text-playgray-mid">Contact your team captain.</span>
                </p>
            </div>
        </main>
    );
}
