import ModernHero from "@/components/layout/Hero";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-navy-void text-white">
      {/* 1. Modern Functional Hero */}
      <section id="hero" className="w-full">
        <ModernHero />
      </section>

      {/* 2. About Club / Playmasters */}
      <section id="about" className="w-full max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-6 justify-center">
          <div className="s-label font-ui text-strike tracking-widest uppercase text-sm font-bold">The Club</div>
          <h2 className="font-title text-[clamp(32px,4vw,52px)] leading-tight text-white mb-4">
            Bowling club in the center of <span className="text-strike">Nairobi</span>
          </h2>
          <div className="w-12 h-1 bg-strike mb-4" />
          <p className="font-sans text-playgray-mid leading-relaxed text-lg mb-8">
            Playmasters is more than a team. We are a family of competitors bound by the lanes at Strikez, Westgate. From casual Thursday nights to high-stakes tournaments, we bowl to win, and we bowl together.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10 mt-4">
            <div className="flex flex-col">
              <span className="font-wordmark text-3xl text-ball-pink">12+</span>
              <span className="font-ui text-playgray-mid uppercase tracking-wide">Active Roster</span>
            </div>
            <div className="h-10 w-px bg-white/10 mx-4" />
            <div className="flex flex-col">
              <span className="font-wordmark text-3xl text-bat-blue">14</span>
              <span className="font-ui text-playgray-mid uppercase tracking-wide">Tournaments Won</span>
            </div>
          </div>
        </div>
        <div className="bg-navy-deep rounded-xl border border-white/5 h-[400px] flex items-center justify-center relative overflow-hidden">
          {/* Placeholder for Club Image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-navy-void to-transparent opacity-80" />
          <p className="font-ui text-playgray-dark text-2xl tracking-[4px] uppercase relative z-10">[ About Image Placeholder ]</p>
        </div>
      </section>

      {/* 3. Performance & Player Analytics Teaser */}
      <section id="performance" className="w-full bg-navy-deep py-24 border-y border-white/5 relative overflow-hidden text-center">
        {/* Subtle Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-wordmark text-[20vw] opacity-[0.02] whitespace-nowrap pointer-events-none select-none">
          PERFORMANCE UNIT
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="s-label font-ui text-ball-pink tracking-widest uppercase text-sm font-bold mb-2">Team Hub</div>
          <h2 className="font-title text-[clamp(40px,5vw,64px)] text-white mb-6 uppercase tracking-tight">
            Stop Guessing. <br /> <span className="text-strike italic">Start Striking.</span>
          </h2>
          <p className="font-sans text-playgray-mid max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
            Our members get access to the exclusive Player HQ. Log your session CSVs instantly to track Frame 7 fatigue and engage in live PvP rivalries.
          </p>

          {/* Functional Grid - Flyer Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 w-full border border-white/10 bg-navy-void/80 mb-12">
            <div className="p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-start text-left group">
              <span className="font-ui text-ball-pink text-xs font-bold tracking-[3px] uppercase mb-4 opacity-70">Metric 01</span>
              <h3 className="font-ui text-3xl uppercase tracking-tighter text-white mb-4 group-hover:text-ball-pink transition-colors">Frame 7 Focus</h3>
              <p className="text-sm font-sans text-playgray-mid leading-relaxed">Pinpoint exactly where your focus drops in the final stretch of the game. Optimized for competitive edge.</p>
            </div>
            <div className="p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-start text-left group">
              <span className="font-ui text-bat-blue text-xs font-bold tracking-[3px] uppercase mb-4 opacity-70">Metric 02</span>
              <h3 className="font-ui text-3xl uppercase tracking-tighter text-white mb-4 group-hover:text-bat-blue transition-colors">PvP Engine</h3>
              <p className="text-sm font-sans text-playgray-mid leading-relaxed">Direct strike-rate comparisons. Build rivalries, spark competition, and climb the team leaderboards.</p>
            </div>
            <div className="p-12 flex flex-col items-start text-left group">
              <span className="font-ui text-strike text-xs font-bold tracking-[3px] uppercase mb-4 opacity-70">Metric 03</span>
              <h3 className="font-ui text-3xl uppercase tracking-tighter text-white mb-4 group-hover:text-strike transition-colors">Auto-Result</h3>
              <p className="text-sm font-sans text-playgray-mid leading-relaxed">One-click PNG generation for tournament brackets. Automated, shareable, and designed for IG.</p>
            </div>
          </div>

          <Link href="/dashboard/player" className="px-10 py-5 bg-strike hover:bg-strike-deep text-white font-ui font-extrabold text-2xl tracking-[4px] uppercase transition-all flex items-center gap-4">
            Access Hub <span className="text-white/40">/</span> Secure Login
          </Link>
        </div>
      </section>

      {/* 4. Gallery & Sponsors */}
      <section id="gallery" className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="s-label font-ui text-strike tracking-widest uppercase text-sm font-bold text-center mb-2">On The Lanes</div>
        <h2 className="font-title text-4xl text-center text-white mb-12">Gallery & Sponsors</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {/* Mock Gallery Grid */}
          <div className="bg-navy-deep aspect-square rounded-lg border border-white/5 flex items-center justify-center"><span className="font-ui text-playgray-dark">IMG_01</span></div>
          <div className="bg-navy-deep aspect-square rounded-lg border border-white/5 flex items-center justify-center md:col-span-2 md:row-span-2"><span className="font-ui text-playgray-dark">IMG_02 (HERO)</span></div>
          <div className="bg-navy-deep aspect-square rounded-lg border border-white/5 flex items-center justify-center"><span className="font-ui text-playgray-dark">IMG_03</span></div>
          <div className="bg-navy-deep aspect-square rounded-lg border border-white/5 flex items-center justify-center"><span className="font-ui text-playgray-dark">IMG_04</span></div>
          <div className="bg-navy-deep aspect-square rounded-lg border border-white/5 flex items-center justify-center"><span className="font-ui text-playgray-dark">IMG_05</span></div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="font-wordmark text-3xl">STRIKEZ</div>
          <div className="font-wordmark text-3xl">WESTGATE</div>
          <div className="font-wordmark text-3xl text-ball-pink">PUMA</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-navy-dark border-t-8 border-strike py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-2">
            <div className="font-wordmark text-4xl tracking-tight text-white uppercase flex flex-col leading-none">
              PLAYMASTERS
              <span className="font-ui text-strike text-lg tracking-[8px] mt-1">KENYA UNIT</span>
            </div>
            <p className="font-ui text-playgray-dark tracking-[3px] uppercase text-xs mt-4">Nairobi Central Center // Westgate Mall</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-8 font-ui text-sm tracking-[4px] uppercase text-playgray-mid">
              <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
              <Link href="#" className="hover:text-white transition-colors">WhatsApp</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            </div>
            <div className="font-ui text-xs text-playgray-dark tracking-widest uppercase">
              © {new Date().getFullYear()} Playmasters Club // All Rights Reserved
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
