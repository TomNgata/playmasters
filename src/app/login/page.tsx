'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { login, signup } from './actions';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);
    const actionType = (e.nativeEvent as SubmitEvent).submitter?.getAttribute('data-action');

    try {
      const result = actionType === 'login' 
        ? await login(formData) 
        : await signup(formData);
        
      if (result && 'error' in result) {
        setErrorMsg(result.error as string);
      } else if (result && 'success' in result) {
        setSuccessMsg(result.success as string);
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy-dark text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background styling for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-strike/10 via-navy-dark to-navy-dark pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-bat-blue/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="group inline-block">
            <Image 
              src="/logo-lg.svg" 
              alt="Playmasters Logo" 
              width={80} 
              height={80} 
              className="drop-shadow-[0_0_15px_#E82030] group-hover:scale-105 transition-transform duration-300" 
            />
          </Link>
        </div>

        {/* Login Box */}
        <div className="bg-navy border border-white/10 rounded-2xl p-8 glass-glow shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-strike via-ball-pink to-bat-blue" />
          
          <div className="text-center mb-8 mt-2">
            <h1 className="font-wordmark text-3xl uppercase tracking-wider text-white">Team Portal</h1>
            <p className="font-ui text-xs text-gray-mid tracking-[2px] uppercase mt-2">Authorized Access Only</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="font-ui text-xs text-gray-mid tracking-[2px] uppercase block mb-2" htmlFor="email">Email Address</label>
              <input 
                id="email"
                name="email"
                type="email" 
                placeholder="player@playmasters.co.ke"
                required
                className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-3 font-sans text-sm text-white placeholder-gray-dark focus:outline-none focus:border-strike transition-colors"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="font-ui text-xs text-gray-mid tracking-[2px] uppercase block mb-2" htmlFor="password">Password</label>
              <input 
                id="password"
                name="password"
                type="password" 
                placeholder="••••••••"
                required
                className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-3 font-sans text-sm text-white placeholder-gray-dark focus:outline-none focus:border-strike transition-colors"
                disabled={isLoading}
              />
            </div>

            {errorMsg && (
              <div aria-live="polite" className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm font-sans text-center">
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div aria-live="polite" className="p-3 bg-green-500/10 border border-green-500/50 rounded text-green-500 text-sm font-sans text-center">
                {successMsg}
              </div>
            )}

            <div className="flex flex-col gap-3 mt-2">
              <button 
                type="submit" 
                data-action="login"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-strike text-white font-ui font-bold text-lg tracking-[3px] uppercase rounded-lg border border-transparent hover:bg-strike/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Authenticating...' : 'Log In'}
              </button>
              
              <button 
                type="submit" 
                data-action="signup"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-transparent text-white font-ui font-bold text-sm tracking-[2px] uppercase rounded-lg border border-white/20 hover:border-white/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign Up
              </button>
            </div>
          </form>

        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <Link href="/" className="font-ui text-xs text-gray-dark hover:text-white tracking-[2px] uppercase transition-colors">
            ← Return to Public Site
          </Link>
        </div>
      </div>
    </main>
  );
}
