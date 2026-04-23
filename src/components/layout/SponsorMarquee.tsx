'use client';

import Image from 'next/image';

const sponsors = [
  { name: 'Parklane Construction',       slug: 'parklane-construction-logo' },
  { name: 'Emami Mentho Plus',           slug: 'emami-mentho-plus' },
  { name: 'RAA Limited',                 slug: 'raa-logo' },
  { name: 'Kenya Builders CCL',          slug: 'kenya-builders-ccl-logo' },
  { name: 'Cameras Africa',              slug: 'cameras-africa' },
  { name: 'Mayfair Insurance',           slug: 'mayfair-insurance-logo' },
  { name: 'WOW Safaris',                 slug: 'wow-safaris-logo' },
  { name: 'CBM',                         slug: 'cbm-logos' },
  { name: "Mzuri / Mr. Berry's",         slug: 'mr-berry-s-logo' },
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

export default function SponsorMarquee() {
  const items = [...sponsors, ...sponsors]; // duplicate for seamless loop

  return (
    <section className="w-full bg-navy border-y border-white/5 py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-5 text-center">
        <span className="font-ui text-xs text-gray-dark tracking-[4px] uppercase">Our Sponsors &amp; Partners</span>
      </div>

      <div className="relative flex overflow-x-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-navy to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-navy to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee">
          {items.map((s, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-36 h-20 bg-white rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-3"
            >
              <div className="relative w-full h-full">
                <Image
                  src={`/sponsors/${s.slug}.png`}
                  alt={s.name}
                  fill
                  className="object-contain"
                  sizes="144px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
      `}</style>
    </section>
  );
}
