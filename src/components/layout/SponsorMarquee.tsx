'use client';

const sponsors = [
  'Cameras Africa',
  'CBM',
  'Chief Imports',
  'Dentex Industries',
  'Elkay & Sons Builders',
  'Emami Mentho Plus',
  'Europa',
  'GCS / Velogic',
  'Ideal Ceramics',
  'Kenya Builders CCL',
  'Mayfair Insurance',
  "Mr. Berry's",
  'Nextcraft',
  'Parklane Construction',
  'Power Parts',
  'RAA',
  'Roto Tanks',
  'Techno Roots',
  'Wow Safaris',
];

export default function SponsorMarquee() {
  return (
    <section className="w-full bg-navy border-y border-white/5 py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
        <span className="font-ui text-xs text-gray-dark tracking-[4px] uppercase">Our Sponsors &amp; Partners</span>
      </div>
      <div className="relative flex overflow-x-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...sponsors, ...sponsors].map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-3 border border-white/8 rounded-lg bg-navy-dark/40">
              <span className="w-2 h-2 rounded-full bg-strike/40" />
              <span className="font-ui text-gray-mid text-sm tracking-[3px] uppercase">{s}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
