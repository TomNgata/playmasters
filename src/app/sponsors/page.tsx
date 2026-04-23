import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sponsors | PlayMasters Kenya',
  description:
    "Support Kenya's premier bowling franchise. View our current sponsors and learn how to become a PlayMasters sponsor.",
};

/* ─── Sponsor Data ──────────────────────────────────────────────── */

const mainSponsors = [
  {
    name: 'Parklane Construction',
    slug: 'parklane-construction-logo',
    since: '2023',
    note: 'Main Sponsor',
  },
  {
    name: 'Emami Mentho Plus',
    slug: 'emami-mentho-plus',
    since: '2024',
    note: 'Main Sponsor',
  },
];

const longStandingSponsors = [
  { name: 'RAA Limited',         slug: 'raa-logo',                since: '2023', note: 'First Sponsor' },
  { name: 'Kenya Builders CCL',  slug: 'kenya-builders-ccl-logo', since: '2023' },
  { name: 'Cameras Africa',      slug: 'cameras-africa',          since: '2023' },
  { name: 'Mayfair Insurance',   slug: 'mayfair-insurance-logo',  since: '2023' },
  { name: 'WOW Safaris',         slug: 'wow-safaris-logo',        since: '2023' },
  { name: 'CBM',                 slug: 'cbm-logos',               since: '2023' },
];

const sponsors2026 = [
  { name: 'Mzuri Sweets (Mr. Berry\'s)', slug: 'mr-berry-s-logo' },
  { name: 'Ideal Ceramics',              slug: 'ideal-ceramics-logo' },
  { name: 'Nextcraft',                   slug: 'nextcraft-logo' },
  { name: 'Dentex Industries',           slug: 'dentex-industries' },
  { name: 'Elkay & Sons Builders',       slug: 'elkay-sons-builders-ltd' },
  { name: 'Power Parts',                 slug: 'power-parts' },
  { name: 'Techno Roots',               slug: 'techno-roots-logo' },
  { name: 'Chief Imports',              slug: 'chief-imports-new-logo-2' },
  { name: 'Roto Tanks',                 slug: 'roto-tanks' },
  { name: 'GCS / Velogic',             slug: 'gcs-velogic-logo' },
];

const pastSponsors = [
  { name: 'Europa', slug: 'europalogo', years: '2023 – 2024' },
];

/* ─── Benefit Cards ─────────────────────────────────────────────── */

const sponsorBenefits = [
  {
    icon: '👕',
    title: 'Brand on All Merchandise',
    desc: 'Your logo prominently displayed on uniforms, towels, bottles, caps and bags at every tournament.',
  },
  {
    icon: '📱',
    title: 'Social Media Exposure',
    desc: 'Your brand tagged and featured across all our social platforms. Our wins = your brand visibility.',
  },
  {
    icon: '🏆',
    title: 'Corporate Hospitality',
    desc: 'Invitation to attend our tournaments and matches, network with business leaders and team members.',
  },
  {
    icon: '📣',
    title: 'Active Promotion',
    desc: 'We actively promote your brand on our social media and any relevant channels throughout the season.',
  },
  {
    icon: '🤝',
    title: 'Employee Engagement',
    desc: 'Your employees get to participate in friendly matches with our team — promoting teamwork and motivation.',
  },
  {
    icon: '🌍',
    title: 'Community Impact',
    desc: 'Align your brand with a growing sport and a team with deep community roots across Nairobi.',
  },
];

/* ─── Reusable Logo Card ─────────────────────────────────────────── */

function LogoCard({
  name,
  slug,
  badge,
  dim = false,
}: {
  name: string;
  slug: string;
  badge?: string;
  dim?: boolean;
}) {
  return (
    <div
      className={`relative bg-white rounded-xl overflow-hidden border border-white/10 aspect-video flex items-center justify-center p-4
        group transition-all duration-300
        ${dim ? 'opacity-40 grayscale hover:opacity-70 hover:grayscale-0' : 'hover:scale-[1.03] hover:shadow-[0_0_28px_theme(colors.strike/25%)]'}`}
    >
      {badge && (
        <span className="absolute top-2 left-2 bg-strike text-white font-ui text-[9px] tracking-[2px] uppercase px-2 py-0.5 rounded z-10">
          {badge}
        </span>
      )}
      <div className="relative w-full h-full">
        <Image
          src={`/sponsors/${slug}.png`}
          alt={`${name} logo`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */

export default function SponsorsPage() {
  return (
    <main className="min-h-screen bg-navy-dark text-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative w-full py-28 md:py-36 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-strike via-ball-pink to-bat-blue" />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
          <span className="font-wordmark text-[16vw] text-white/[0.025] uppercase whitespace-nowrap">PARTNERS</span>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <span className="font-ui text-strike text-sm tracking-[6px] uppercase font-bold">Proud Partners</span>
          <h1 className="font-wordmark text-[clamp(36px,7vw,88px)] uppercase leading-none">
            Our <span className="text-strike">Sponsors</span>
          </h1>
          <p className="font-sans text-gray-mid text-lg md:text-xl max-w-2xl leading-relaxed">
            The brands that believe in the vision and fuel our journey to the top of Kenyan bowling.
          </p>
        </div>
      </section>

      {/* ── Main Sponsors ── */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="mb-10">
          <span className="font-ui text-strike text-xs tracking-[5px] uppercase font-bold block">Headline Partners</span>
          <h2 className="font-wordmark text-3xl md:text-4xl uppercase leading-none mt-1">Main Sponsors</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          {mainSponsors.map((s) => (
            <div key={s.slug}>
              <LogoCard name={s.name} slug={s.slug} badge="Main Sponsor" />
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="font-ui text-sm text-white uppercase tracking-wide">{s.name}</span>
                <span className="font-ui text-xs text-gray-mid tracking-[2px]">Since {s.since}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Long-Standing Partners ── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <span className="font-ui text-bat-blue text-xs tracking-[5px] uppercase font-bold block">Since 2023</span>
          <h2 className="font-wordmark text-3xl md:text-4xl uppercase leading-none mt-1">Long-Standing Partners</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {longStandingSponsors.map((s) => (
            <div key={s.slug}>
              <LogoCard name={s.name} slug={s.slug} badge={s.note} />
              <div className="mt-2 px-1">
                <p className="font-ui text-xs text-white uppercase tracking-wide truncate">{s.name}</p>
                <p className="font-ui text-[10px] text-gray-dark tracking-[2px]">Since {s.since}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2026 New Sponsors ── */}
      <section className="w-full bg-navy border-y border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <span className="font-ui text-ball-pink text-xs tracking-[5px] uppercase font-bold block">New Additions</span>
            <h2 className="font-wordmark text-3xl md:text-4xl uppercase leading-none mt-1">2026 Sponsors</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sponsors2026.map((s) => (
              <div key={s.slug}>
                <LogoCard name={s.name} slug={s.slug} />
                <p className="mt-2 font-ui text-[10px] text-gray-mid uppercase tracking-[2px] px-1 truncate">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Past Supporters ── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <span className="font-ui text-gray-dark text-xs tracking-[5px] uppercase font-bold block">Legacy</span>
          <h2 className="font-wordmark text-3xl md:text-4xl uppercase leading-none mt-1 text-white/50">Past Supporters</h2>
          <p className="font-sans text-gray-dark text-sm mt-2 max-w-lg">
            Brands and individuals who have backed PlayMasters on our journey — we&apos;re grateful for every chapter.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg">
          {pastSponsors.map((s) => (
            <div key={s.slug}>
              <LogoCard name={s.name} slug={s.slug} dim />
              <div className="mt-2 px-1">
                <p className="font-ui text-[10px] text-gray-dark uppercase tracking-[2px]">{s.name}</p>
                <p className="font-ui text-[10px] text-gray-dark/60 tracking-[1px]">{s.years}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="w-full bg-navy border-t border-white/5 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="font-ui text-ball-pink text-xs tracking-[6px] uppercase font-bold">Why Partner With Us</span>
            <h2 className="font-wordmark text-4xl md:text-5xl uppercase mt-3">Sponsorship Benefits</h2>
            <div className="w-12 h-1 bg-strike mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sponsorBenefits.map((b) => (
              <div
                key={b.title}
                className="bg-navy-dark border border-white/8 rounded-xl p-6 hover:border-strike/20 hover:bg-navy-dark/60 transition-all"
              >
                <div className="text-3xl mb-4">{b.icon}</div>
                <h3 className="font-ui text-lg uppercase tracking-wide text-white mb-2">{b.title}</h3>
                <p className="font-sans text-gray-mid text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tiers disclaimer ── */}
      <section className="w-full bg-navy border-y border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="font-ui text-xs text-gray-mid tracking-[4px] uppercase">
            Detailed sponsorship packages and investment tiers are available upon direct enquiry.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full max-w-4xl mx-auto px-6 py-20 text-center">
        <span className="font-ui text-strike text-xs tracking-[6px] uppercase font-bold block mb-4">Ready to Partner?</span>
        <h2 className="font-wordmark text-4xl md:text-5xl uppercase mb-6">
          Become a <span className="text-strike">Sponsor</span>
        </h2>
        <p className="font-sans text-gray-mid text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          We believe a partnership with PlayMasters will offer significant benefits — increased brand exposure,
          enhanced community engagement, and networking with Nairobi&apos;s bowling community. Let&apos;s build something great together.
        </p>
        <a
          href="mailto:playmasters.bowling@gmail.com?subject=Sponsorship Enquiry — PlayMasters Kenya"
          className="inline-flex items-center gap-3 px-10 py-5 bg-strike hover:bg-strike-deep text-white font-ui font-bold text-xl tracking-[4px] uppercase transition-all shadow-[0_4px_0_theme(colors.strike-deep)] active:translate-y-[2px] active:shadow-none"
        >
          Get in Touch
          <span className="text-white/50">→</span>
        </a>
        <p className="font-ui text-xs text-gray-dark tracking-widest uppercase mt-6">
          playmasters.bowling@gmail.com
        </p>
      </section>

    </main>
  );
}
