import ModernHero from "@/components/layout/Hero";
import Link from 'next/link';
import TeamStatsSummary from "@/components/layout/TeamStatsSummary";
import ContactForm from "@/components/ui/ContactForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-navy-dark text-white overflow-x-hidden">
      {/* 1. Modern Functional Hero */}
      <section id="hero" className="w-full">
        <ModernHero />
      </section>

      {/* 2. About Club / Playmasters */}
      <section id="about" className="w-full max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 justify-center">
          <div className="s-label font-ui text-strike tracking-widest uppercase text-sm font-bold">The Club</div>
          <h2 className="font-title text-[clamp(28px,5vw,52px)] leading-tight text-white mb-4">
            Bowling club in the center of <span className="text-strike">Nairobi</span>
          </h2>
          <div className="w-12 h-1 bg-strike mb-4" />
          <p className="font-sans text-gray-mid leading-relaxed text-lg mb-8">
            Playmasters is more than a team. We are a family of competitors bound by the lanes. From casual bowling nights to high-stakes tournaments, we bowl to win, and we bowl together.
          </p>
          <TeamStatsSummary />
        </div>
        <div className="bg-navy rounded-2xl border border-white/5 h-[300px] sm:h-[450px] flex items-center justify-center relative overflow-hidden group">
          {/* Real Club Image as background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700">
            <img src="/5860701352248413499.jpg" alt="Playmasters Training" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-navy-dark via-transparent to-transparent opacity-80" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-strike animate-ping" />
            </div>
            <p className="font-ui text-white text-lg tracking-[4px] uppercase drop-shadow-lg">[ Training Session Active ]</p>
          </div>
        </div>
      </section>

      {/* Performance Teaser */}
      <section id="performance" className="w-full bg-navy py-24 border-y border-white/5 relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-wordmark text-[20vw] opacity-[0.02] whitespace-nowrap pointer-events-none select-none">
          PERFORMANCE
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="s-label font-ui text-ball-pink tracking-widest uppercase text-sm font-bold mb-2">Team Hub</div>
          <h2 className="font-title text-[clamp(32px,6vw,64px)] text-white mb-6 uppercase tracking-tight leading-none">
            Stop Guessing. <br /> <span className="text-strike italic">Start Striking.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 w-full border border-white/10 bg-navy-dark/80 mb-12">
            <div className="p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-start text-left group hover:bg-white/[0.02] transition-colors">
              <span className="font-ui text-ball-pink text-xs font-bold tracking-[3px] uppercase mb-4 opacity-70">Focus Engine</span>
              <h3 className="font-ui text-3xl uppercase tracking-tighter text-white mb-4 group-hover:text-ball-pink transition-colors">Focus Fatigue</h3>
              <p className="text-sm font-sans text-gray-mid leading-relaxed">Pinpoint exactly where your mental game dips across 10 frames vs historical baselines.</p>
            </div>
            <div className="p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-start text-left group hover:bg-white/[0.02] transition-colors">
              <span className="font-ui text-bat-blue text-xs font-bold tracking-[3px] uppercase mb-4 opacity-70">Metric 02</span>
              <h3 className="font-ui text-3xl uppercase tracking-tighter text-white mb-4 group-hover:text-bat-blue transition-colors">Competition Analysis</h3>
              <p className="text-sm font-sans text-gray-mid leading-relaxed">Real-time UBL Division benchmarks, median tracking, and peak score volatility.</p>
            </div>
            <div className="p-8 lg:p-12 flex flex-col items-start text-left group hover:bg-white/[0.02] transition-colors">
              <span className="font-ui text-strike text-xs font-bold tracking-[3px] uppercase mb-4 opacity-70">Metric 03</span>
              <h3 className="font-ui text-3xl uppercase tracking-tighter text-white mb-4 group-hover:text-strike transition-colors">Social Performance</h3>
              <p className="text-sm font-sans text-gray-mid leading-relaxed">PvP comparisons, Women&apos;s Elite tracking, and automated tournament bracket generation.</p>
            </div>
          </div>

          <Link href="/dashboard/player" className="group px-8 py-4 sm:px-10 sm:py-5 bg-strike hover:bg-strike-deep text-white font-ui font-extrabold text-xl sm:text-2xl tracking-[4px] uppercase transition-all flex items-center gap-4 shadow-[0_4px_0_theme(colors.strike-deep)] active:translate-y-[2px] active:shadow-none">
            Access Hub <span className="text-white/40 group-hover:translate-x-1 transition-transform">/</span> View Stats
          </Link>
        </div>
      </section>

      {/* 5. Contact / Join Section */}
      <section id="contact" className="w-full bg-navy py-24 border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-start max-w-xl">
                <div className="s-label font-ui text-strike tracking-widest uppercase text-sm font-bold mb-4">Recruitment</div>
                <h2 className="font-title text-[clamp(28px,5vw,52px)] leading-tight text-white mb-6 uppercase">
                    Ready to Join the <span className="text-strike italic">Squad?</span>
                </h2>
                <div className="w-20 h-1 bg-strike mb-8" />
                <p className="font-sans text-gray-mid leading-relaxed text-lg mb-10">
                    Whether you&apos;re an elite regular looking for a home or a rookie ready to learn the craft, Playmasters Kenya is open for tryouts. Leave your coordinates and our Unit Captain will initiate contact.
                </p>
                
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-center gap-6 p-6 bg-navy-dark/40 border border-white/5 rounded-2xl group hover:border-strike/30 transition-all">
                        <div className="w-12 h-12 rounded-full bg-strike/10 flex items-center justify-center text-strike text-xl">📍</div>
                        <div>
                            <p className="font-ui text-[10px] text-gray-dark uppercase tracking-widest mb-1">Base of Operations</p>
                            <p className="font-sans text-white font-medium">Strikez, Westgate Mall, Nairobi</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <ContactForm />
            </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="s-label font-ui text-strike tracking-widest uppercase text-sm font-bold text-center mb-2">On The Lanes</div>
        <h2 className="font-title text-[clamp(24px,4vw,40px)] text-center text-white mb-12 uppercase">Gallery & Partners</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          <div className="bg-navy aspect-square rounded-lg border border-white/5 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all overflow-hidden">
            <img src="/5858096969979465002.jpg" alt="Bowling Action" className="w-full h-full object-cover" />
          </div>
          <div className="bg-navy aspect-square rounded-lg border border-white/5 flex items-center justify-center md:col-span-2 md:row-span-2 relative group overflow-hidden">
            <img src="/5860367998361734483.jpg" alt="Player Training Visualization" className="w-full h-full object-cover z-10 grayscale group-hover:grayscale-0 transition-opacity" />
            <div className="absolute inset-0 bg-strike/5 group-hover:bg-strike/10 transition-colors" />
          </div>
          <div className="bg-navy aspect-square rounded-lg border border-white/5 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all overflow-hidden">
            <img src="/5858168725998079239.jpg" alt="Team Spirit" className="w-full h-full object-cover" />
          </div>
          <div className="bg-navy aspect-square rounded-lg border border-white/5 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all overflow-hidden">
            <img src="/5860677712748416291.jpg" alt="Tournament Highlights" className="w-full h-full object-cover" />
          </div>
          <div className="bg-navy aspect-square rounded-lg border border-white/5 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all overflow-hidden">
            <img src="/logo-md.png" alt="Playmasters Logo" className="w-1/2 object-contain" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-navy-dark border-t-8 border-strike py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <img src="/logo-sm.png" alt="Playmasters Branding" className="w-24 h-24 object-contain" />
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <div className="font-wordmark text-4xl tracking-tight text-white uppercase flex flex-col leading-none">
                PLAYMASTERS
                <span className="font-ui text-strike text-lg tracking-[8px] mt-1">KENYA UNIT</span>
              </div>
              <p className="font-ui text-gray-dark tracking-[3px] uppercase text-[10px] mt-4">Nairobi Official HQ</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
            <div className="flex gap-8 font-ui text-sm tracking-[4px] uppercase text-gray-mid">
              <Link href="https://www.instagram.com/playmasterske/" target="_blank" className="hover:text-white transition-colors">Instagram</Link>
            </div>
            <div className="font-ui text-xs text-gray-dark tracking-widest uppercase border-t border-white/5 pt-4 w-full text-center md:text-right">
              © {new Date().getFullYear()} Playmasters Club
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
