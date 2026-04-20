import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Team Login | PlayMasters Hub',
  description: 'Authentication portal for PlayMasters players, captains, and management.',
};

export default function LoginPage() {
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

          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="font-ui text-xs text-gray-mid tracking-[2px] uppercase block mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="player@playmasters.co.ke"
                className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-3 font-sans text-sm text-white placeholder-gray-dark focus:outline-none focus:border-strike transition-colors"
                disabled
              />
            </div>

            <div>
              <label className="font-ui text-xs text-gray-mid tracking-[2px] uppercase block mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-navy-dark border border-white/10 rounded-lg px-4 py-3 font-sans text-sm text-white placeholder-gray-dark focus:outline-none focus:border-strike transition-colors"
                disabled
              />
            </div>

            <button 
              type="button" 
              disabled
              className="mt-2 w-full px-6 py-4 bg-strike/50 text-white/50 font-ui font-bold text-lg tracking-[3px] uppercase rounded-lg border border-strike/50 transition-all flex items-center justify-center gap-2 cursor-not-allowed"
            >
              System Offline
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="font-sans text-sm text-gray-mid leading-relaxed inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-strike animate-pulse" />
              OAuth infrastructure currently undergoing scheduled updates for Season 16.
            </p>
          </div>
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
