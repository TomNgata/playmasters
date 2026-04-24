import ModernHero from "@/components/layout/Hero";
import Link from 'next/link';
import Image from 'next/image';
import TeamStatsSummary from "@/components/layout/TeamStatsSummary";
import ContactForm from "@/components/ui/ContactForm";
import SponsorMarquee from "@/components/layout/SponsorMarquee";

const publicPages = [
  { name: 'About', href: '/about', icon: '🎳', desc: 'Our story, mission, vision & values', color: 'strike' },
  { name: 'Achievements', href: '/achievements', icon: '🏆', desc: 'Records & trophies 2023–2026', color: 'bat-blue' },
  { name: 'Players', href: '/players', icon: '👥', desc: 'Meet the full PlayMasters squad', color: 'ball-pink' },
  { name: 'Sponsors', href: '/sponsors', icon: '🤝', desc: 'Our partners & become a sponsor', color: 'strike' },
  { name: 'CSR', href: '/csr', icon: '❤️', desc: 'Community & impact records', color: 'bat-blue' },
  { name: 'Contact', href: '/contact', icon: '📩', desc: 'Get in touch with us', color: 'ball-pink' },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-navy-dark text-white overflow-x-hidden">
      {/* 1. Modern Functional Hero */}
      <section id="hero" className="w-full">
        <ModernHero />
      </section>

      {/* Public Pages Nav Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="font-ui text-strike text-xs tracking-[6px] uppercase font-bold">Explore</span>
          <h2 className="font-wordmark text-3xl md:text-4xl uppercase mt-2">PlayMasters HQ</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {publicPages.map((page) => (
            <Link
              key={page.name}
              href={page.href}
              className={`group flex flex-col items-center gap-3 p-5 bg-navy border border-white/8 rounded-xl hover:border-${page.color}/40 hover:bg-navy-dark/60 transition-all text-center glass-glow`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{page.icon}</span>
              <span className={`font-ui text-sm uppercase tracking-[2px] text-white group-hover:text-glow group-hover:text-${page.color} transition-colors`}>{page.name}</span>
              <span className="font-sans text-[10px] text-gray-dark leading-relaxed hidden md:block">{page.desc}</span>
            </Link>
          ))}
        </div>
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
          {/* Featured Club Image as background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-60 transition-all duration-700">
            <Image 
              src="/images/achievements/trophy-team-large.jpg" 
              alt="Playmasters Team" 
              fill
              className="object-cover" 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-navy-dark via-transparent to-transparent opacity-80" />
        </div>
      </section>



      {/* Gallery Section */}
      <section id="gallery" className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="s-label font-ui text-strike tracking-widest uppercase text-sm font-bold text-center mb-2">On The Lanes</div>
        <h2 className="font-title text-[clamp(24px,4vw,40px)] text-center text-white mb-12 uppercase">Gallery & Partners</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          <div className="bg-navy aspect-square rounded-lg border border-white/5 flex items-center justify-center opacity-60 hover:opacity-100 transition-all overflow-hidden relative">
            <Image src="/images/achievements/trophy-team-large.jpg" alt="Bowling Action" fill className="object-cover" />
          </div>
          <div className="bg-navy aspect-square rounded-lg border border-white/5 flex items-center justify-center md:col-span-2 md:row-span-2 relative group overflow-hidden">
            <Image src="/images/achievements/trophy-team-celebration.jpg" alt="Player Training Visualization" fill className="z-10 transition-opacity object-cover" />
            <div className="absolute inset-0 bg-strike/5 group-hover:bg-strike/10 transition-colors" />
          </div>
          <div className="bg-navy aspect-square rounded-lg border border-white/5 flex items-center justify-center opacity-60 hover:opacity-100 transition-all overflow-hidden relative">
            <Image src="/images/achievements/trophy-suresh.jpg" alt="Team Spirit" fill className="object-cover" />
          </div>
          <div className="bg-navy aspect-square rounded-lg border border-white/5 flex items-center justify-center opacity-60 hover:opacity-100 transition-all overflow-hidden relative">
            <Image src="/images/achievements/trophy-dorothy.jpg" alt="Tournament Highlights" fill className="object-cover" />
          </div>
          <div className="bg-navy aspect-square rounded-lg border border-white/5 flex items-center justify-center opacity-60 hover:opacity-100 transition-all overflow-hidden relative glass-glow">
            <Image src="/logo-lg.svg" alt="Playmasters Logo" width={80} height={80} className="object-contain" />
          </div>
        </div>
      </section>

      {/* National Records Highlight */}
      <section className="w-full bg-navy-dark py-20 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-strike/5 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <span className="font-ui text-strike text-xs tracking-[5px] uppercase font-bold block mb-4">Kenyan Legacy</span>
            <h2 className="font-wordmark text-4xl md:text-5xl uppercase mb-6 leading-tight">
              Dominating the <br /><span className="text-strike">National Leaderboards</span>
            </h2>
            <p className="font-sans text-gray-mid text-lg max-w-xl leading-relaxed mb-8">
              PlayMasters athletes currently hold 6 Kenyan National Records. From junior phenoms to veteran champions, our franchise sets the standard for excellence on the lanes.
            </p>
            <Link 
              href="/achievements" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-navy border border-white/10 rounded-lg font-ui text-sm tracking-[3px] uppercase hover:border-strike hover:bg-strike/5 transition-all group"
            >
              View Full Cabinet
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="p-6 bg-navy border border-white/8 rounded-xl glass-glow">
              <span className="font-ui text-[10px] text-gray-mid tracking-[3px] uppercase mb-2 block">Highest Score (1 Lane)</span>
              <span className="font-wordmark text-3xl text-white block mb-1">290 PINS</span>
              <span className="font-ui text-[10px] text-strike tracking-[2px] uppercase">Sagar Joshi — OG</span>
            </div>
            <div className="p-6 bg-navy border border-white/8 rounded-xl glass-glow">
              <span className="font-ui text-[10px] text-gray-mid tracking-[3px] uppercase mb-2 block">Junior (2 Lanes)</span>
              <span className="font-wordmark text-3xl text-white block mb-1">237 PINS</span>
              <span className="font-ui text-[10px] text-strike tracking-[2px] uppercase">Dhilan Chandaria — OG</span>
            </div>
            <div className="p-6 bg-navy border border-white/8 rounded-xl glass-glow">
              <span className="font-ui text-[10px] text-gray-mid tracking-[3px] uppercase mb-2 block">Female (2 Lanes)</span>
              <span className="font-wordmark text-3xl text-white block mb-1">255 PINS</span>
              <span className="font-ui text-[10px] text-strike tracking-[2px] uppercase">Darshi Chandaria — Mavericks</span>
            </div>
            <div className="p-6 bg-navy border border-white/8 rounded-xl glass-glow">
              <span className="font-ui text-[10px] text-gray-mid tracking-[3px] uppercase mb-2 block">Highest Score (2 Lanes)</span>
              <span className="font-wordmark text-3xl text-white block mb-1">290 PINS</span>
              <span className="font-ui text-[10px] text-strike tracking-[2px] uppercase">Paras Chandaria — OG</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Strategic Partners / Sponsors */}
      <SponsorMarquee />

      {/* Footer */}
      <footer className="w-full bg-navy-dark border-t-8 border-strike py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-24 h-24">
              <Image src="/logo-lg.svg" alt="Playmasters Branding" fill className="object-contain brightness-200 opacity-60" />
            </div>
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
