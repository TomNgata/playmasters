import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sponsors | PlayMasters Kenya',
  description: 'Support Kenya\'s premier bowling franchise. View our current sponsors and learn how to become a PlayMasters sponsor.',
};

const sponsorBenefits = [
  {
    icon: '👕',
    title: 'Brand on All Merchandise',
    desc: 'Your logo prominently displayed on uniforms, towels, bottles, caps and bags at every tournament we compete in.',
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

const sponsorTiers = [
  {
    tier: 'Main Sponsor',
    amount: 'KES 1,000,000',
    color: 'strike',
    perks: [
      'Logo on ALL merchandise for every tournament',
      'Maximum brand exposure across all platforms',
      'Priority corporate hospitality at all events',
      'Featured prominently in all media and press',
      'All benefits below included',
    ],
  },
  {
    tier: 'Junior Sponsor',
    amount: 'KES 200,000',
    color: 'bat-blue',
    perks: [
      'Logo on team merchandise',
      'Social media brand mentions',
      'Corporate hospitality access',
      'Employee bowling engagement event',
      'Brand promotion across channels',
    ],
  },
];

export default function SponsorsPage() {
  return (
    <main className="min-h-screen bg-navy-dark text-white overflow-x-hidden">

      {/* Hero */}
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

      {/* Current Sponsors */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-12">
          <div>
            <span className="font-ui text-strike text-xs tracking-[5px] uppercase font-bold block">2025 / 2026</span>
            <h2 className="font-wordmark text-3xl md:text-4xl uppercase leading-none">Current Sponsors</h2>
          </div>
        </div>

        {/* Logo grid — placeholders until folder shared */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-navy border border-white/8 rounded-xl aspect-video flex items-center justify-center group hover:border-strike/20 transition-all">
              <div className="text-center">
                <div className="w-10 h-10 bg-white/5 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-gray-dark text-xl">🤝</span>
                </div>
                <p className="font-ui text-[10px] text-gray-dark tracking-[2px] uppercase">Partner Logo</p>
              </div>
            </div>
          ))}
        </div>
        <p className="font-ui text-xs text-gray-dark tracking-widest uppercase text-center">
          Sponsor logos being uploaded — contact <a href="mailto:playmasters.bowling@gmail.com" className="text-gray-mid hover:text-strike transition-colors">playmasters.bowling@gmail.com</a>
        </p>
      </section>

      {/* Past Supporters */}
      <section className="w-full bg-navy border-y border-white/5 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="font-ui text-bat-blue text-xs tracking-[5px] uppercase font-bold">Legacy</span>
            <h2 className="font-wordmark text-3xl md:text-4xl uppercase mt-2">Past Supporters</h2>
            <p className="font-sans text-gray-mid text-sm mt-3 max-w-xl mx-auto">
              Brands and individuals who have believed in PlayMasters across our journey from 2022 to today.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-navy-dark border border-white/5 rounded-xl py-8 flex items-center justify-center opacity-50 hover:opacity-80 transition-all">
                <span className="font-ui text-xs text-gray-dark tracking-[3px] uppercase">Past Sponsor {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="font-ui text-ball-pink text-xs tracking-[6px] uppercase font-bold">Why Partner With Us</span>
          <h2 className="font-wordmark text-4xl md:text-5xl uppercase mt-3">Sponsorship Benefits</h2>
          <div className="w-12 h-1 bg-strike mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sponsorBenefits.map((b) => (
            <div key={b.title} className="bg-navy border border-white/8 rounded-xl p-6 group hover:border-strike/20 hover:bg-navy-dark/40 transition-all">
              <div className="text-3xl mb-4">{b.icon}</div>
              <h3 className="font-ui text-lg uppercase tracking-wide text-white mb-2">{b.title}</h3>
              <p className="font-sans text-gray-mid text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="w-full bg-navy border-y border-white/5 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="font-ui text-strike text-xs tracking-[6px] uppercase font-bold">Investment Levels</span>
            <h2 className="font-wordmark text-4xl md:text-5xl uppercase mt-3">Sponsorship Tiers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sponsorTiers.map((tier) => (
              <div key={tier.tier} className={`relative bg-navy-dark border border-${tier.color}/30 rounded-2xl overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-full h-1 bg-${tier.color}`} />
                <div className="p-8">
                  <span className={`font-ui text-xs tracking-[5px] uppercase text-${tier.color} font-bold block mb-2`}>{tier.tier}</span>
                  <div className={`font-wordmark text-4xl md:text-5xl text-${tier.color} mb-6`}>{tier.amount}</div>
                  <ul className="flex flex-col gap-3">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${tier.color} flex-shrink-0`} />
                        <span className="font-sans text-sm text-gray-mid leading-relaxed">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Sponsor CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 py-20 text-center">
        <span className="font-ui text-strike text-xs tracking-[6px] uppercase font-bold block mb-4">Ready to Partner?</span>
        <h2 className="font-wordmark text-4xl md:text-5xl uppercase mb-6">
          Become a <span className="text-strike">Sponsor</span>
        </h2>
        <p className="font-sans text-gray-mid text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          We believe a partnership with PlayMasters will offer significant benefits — increased brand exposure, enhanced community engagement, and networking with Nairobi&apos;s bowling community. Let&apos;s build something great together.
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
