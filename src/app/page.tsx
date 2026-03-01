import BowlingHero from "@/components/3d/BowlingHero";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-navy-void text-white">
      {/* 1. Spline 3D Hero */}
      <section id="hero" className="w-full">
        <BowlingHero />
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
      <section id="performance" className="w-full bg-navy-deep py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="s-label font-ui text-ball-pink tracking-widest uppercase text-sm font-bold mb-2">Team Hub</div>
          <h2 className="font-title text-[clamp(32px,4vw,52px)] text-white mb-6">
            Stop Guessing. <br /> <span className="italic text-playgray-mid">Start Striking.</span>
          </h2>
          <p className="font-sans text-playgray-mid max-w-2xl mx-auto mb-12 text-lg">
            Our members get access to the exclusive Player HQ. Log your session CSVs instantly to track Frame 7 fatigue, analyze your spare conversion rates, and engage in live PvP rivalries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
            <div className="bg-navy-void border-t-4 border-ball-pink p-8 rounded-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-ball-pink/20 flex items-center justify-center font-ui text-2xl text-ball-pink font-bold mb-4">01</div>
              <h3 className="font-ui text-2xl uppercase tracking-wider text-white mb-2">Frame Analytics</h3>
              <p className="text-sm font-sans text-playgray-mid">Pinpoint exactly when your focus drops during a game.</p>
            </div>
            <div className="bg-navy-void border-t-4 border-bat-blue p-8 rounded-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-bat-blue/20 flex items-center justify-center font-ui text-2xl text-bat-blue font-bold mb-4">02</div>
              <h3 className="font-ui text-2xl uppercase tracking-wider text-white mb-2">PvP Rivalries</h3>
              <p className="text-sm font-sans text-playgray-mid">Compare strike rates directly against teammates.</p>
            </div>
            <div className="bg-navy-void border-t-4 border-strike p-8 rounded-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-strike/20 flex items-center justify-center font-ui text-2xl text-strike font-bold mb-4">03</div>
              <h3 className="font-ui text-2xl uppercase tracking-wider text-white mb-2">Auto-Brackets</h3>
              <p className="text-sm font-sans text-playgray-mid">Generate shareable tournament results for Instagram.</p>
            </div>
          </div>

          <Link href="/dashboard/player" className="px-8 py-4 rounded-md bg-strike hover:bg-strike-deep text-white font-ui font-semibold text-xl tracking-[2px] uppercase transition-all shadow-[0_4px_0_#B81828] hover:shadow-[0_2px_0_#B81828] hover:translate-y-[2px]">
            Enter Team Hub (Auth Required)
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
      <footer className="w-full bg-navy-dark border-t-4 border-strike py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-wordmark text-3xl tracking-wide text-white uppercase flex flex-col">
            PLAYMASTERS
            <span className="font-ui text-sm text-playgray-mid tracking-[4px]">KENYA</span>
          </div>
          <div className="font-sans text-sm text-playgray-mid">
            © {new Date().getFullYear()} Playmasters Bowling Club. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
