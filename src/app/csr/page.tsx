import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSR & Community | PlayMasters Kenya',
  description: 'PlayMasters\'s commitment to community — charity events, cancer center support, and partnerships that go beyond the bowling lanes.',
};

const initiatives = [
  {
    icon: '❤️',
    title: 'Charity Events & Fundraisers',
    color: 'strike',
    desc: 'PlayMasters organises and participates in charity bowling events, with proceeds and additional donations channelled directly to local causes in Nairobi.',
    details: ['Charity bowling fundraisers', 'Additional donations for each event', 'Community-led participation'],
    status: 'Active',
  },
  {
    icon: '🎗️',
    title: 'Faraja Cancer Support Trust',
    color: 'ball-pink',
    desc: 'In 2025, PlayMasters raised KES 100,000 through a performance-based campaign where KES 1,000 was contributed for every 200+ score achieved by players.',
    details: [
      'Partnered with Faraja Cancer Support Trust',
      'KES 100,000 raised in the 2025 season',
      'Performance-based giving: KES 1,000 per 200+ score',
      'Using sport as a platform for health and wellbeing'
    ],
    status: 'Active',
  },
  {
    icon: '🏠',
    title: 'Raha Kids Centre (Lions Club)',
    color: 'strike',
    desc: 'Participated in the Lions Club Fundraising Bowling Extravaganza on 14th September 2025 to support brighter futures for children in need.',
    details: [
      'Beneficiary: Raha Kids Education, Rehabilitation & Reintegration Centre',
      'In partnership with Lions Club Nairobi',
      'Participated in Fundraising Bowling Extravaganza',
      'Contributing to child education and rehabilitation'
    ],
    status: 'Active',
  },
  {
    icon: '🤝',
    title: 'Community Partnerships',
    color: 'bat-blue',
    desc: 'Through strategic partnerships, PlayMasters works with like-minded organisations to grow the sport and give back to the Nairobi community.',
    details: ['Collaborative events with bowling alleys', 'Youth bowling programs', 'Corporate partnership events'],
    status: 'Ongoing',
  },
  {
    icon: '🧒',
    title: 'Junior Bowler Development',
    color: 'bat-blue',
    desc: 'We actively support junior bowlers, providing mentorship and opportunities to grow. One of our supported juniors made national records before the age of 11.',
    details: ['Under-11 and Under-18 programs', 'National-record-holding juniors', 'Mentorship from senior players'],
    status: 'Active',
  },
  {
    icon: '🌍',
    title: "Growing Kenya's Bowling Scene",
    color: 'strike',
    desc: 'Before 2017, bowling was nearly non-existent in Kenya. PlayMasters is at the forefront of building the sporting infrastructure and culture needed for Kenya to bowl internationally.',
    details: ['Participation in all major Nairobi leagues', 'Ambassadors for the sport', "Vision: fly Kenya's flag internationally"],
    status: 'Mission',
  },
];

export default function CsrPage() {
  return (
    <main className="min-h-screen bg-navy-dark text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative w-full py-28 md:py-36 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-strike via-ball-pink to-bat-blue" />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
          <span className="font-wordmark text-[14vw] text-white/[0.025] uppercase whitespace-nowrap">COMMUNITY</span>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <span className="font-ui text-ball-pink text-sm tracking-[6px] uppercase font-bold">Beyond the Lanes</span>
          <h1 className="font-wordmark text-[clamp(36px,7vw,88px)] uppercase leading-none">
            Community &amp; <span className="text-strike">CSR</span>
          </h1>
          <p className="font-sans text-gray-mid text-lg md:text-xl max-w-2xl leading-relaxed">
            PlayMasters believes that great teams build great communities. Here&apos;s how we give back.
          </p>
        </div>
      </section>

      {/* Value Statement */}
      <section className="w-full max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="relative bg-navy border border-white/8 rounded-2xl p-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-strike via-ball-pink to-bat-blue" />
          <p className="font-ui text-xl md:text-2xl text-white leading-relaxed uppercase tracking-wide">
            &ldquo;Responsible citizenship. We are responsible citizens — <span className="text-strike">on and off the lanes.</span>&rdquo;
          </p>
          <p className="font-ui text-xs text-gray-mid tracking-[4px] uppercase mt-4">PlayMasters Core Value #6</p>
        </div>
      </section>

      {/* Initiatives Grid */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <span className="font-ui text-strike text-xs tracking-[6px] uppercase font-bold">Our Work</span>
          <h2 className="font-wordmark text-4xl md:text-5xl uppercase mt-3">CSR Initiatives</h2>
          <div className="w-12 h-1 bg-strike mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initiatives.map((item) => (
            <div
              key={item.title}
              className={`relative bg-navy border border-white/8 rounded-xl overflow-hidden group hover:border-${item.color}/30 transition-all`}
            >
              <div className={`absolute top-0 left-0 w-full h-0.5 bg-${item.color}`} />
              <div className="p-7">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="font-ui text-xl uppercase tracking-wide text-white leading-tight">{item.title}</h3>
                    </div>
                  </div>
                  <span className={`flex-shrink-0 px-2.5 py-1 font-ui text-[10px] tracking-[2px] uppercase text-${item.color} bg-${item.color}/10 border border-${item.color}/20 rounded`}>
                    {item.status}
                  </span>
                </div>
                <p className="font-sans text-gray-mid text-sm leading-relaxed mb-4">{item.desc}</p>
                <ul className="flex flex-col gap-2">
                  {item.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`mt-1.5 w-1 h-1 rounded-full bg-${item.color} flex-shrink-0`} />
                      <span className="font-sans text-xs text-white/70 leading-relaxed">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community in Action Gallery */}
      <section className="w-full bg-navy py-24 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-strike via-transparent to-ball-pink opacity-20" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="font-ui text-ball-pink text-xs tracking-[6px] uppercase font-bold">Community in Action</span>
            <h2 className="font-wordmark text-4xl md:text-5xl uppercase mt-3 text-white">Making an Impact</h2>
            <p className="font-sans text-gray-mid text-sm mt-4 max-w-xl mx-auto leading-relaxed">
              At Playmasters, we believe our responsibility extends beyond the lanes. Here are some of our recent community outreach and support initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-dark aspect-square md:aspect-auto">
              <img src="/images/csr/faraja-group-stand.jpg" alt="Faraja Cancer Support Group" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="font-ui text-ball-pink text-[10px] tracking-[3px] uppercase font-bold">Health & Wellness</span>
                <h3 className="font-ui text-lg text-white uppercase mt-1">Faraja Cancer Support Trust</h3>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-dark aspect-square">
              <img src="/images/csr/banner-close.jpg" alt="Never Give Up Banner" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-navy-dark/20 group-hover:bg-transparent transition-colors" />
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-dark aspect-square">
              <img src="/images/csr/faraja-group-sit.jpg" alt="Faraja Activity" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-dark aspect-square">
              <img src="/images/csr/csr-activity-1.jpg" alt="Community Activity 1" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-dark aspect-square">
              <img src="/images/csr/csr-activity-2.jpg" alt="Community Activity 2" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* More Details Coming */}
      <section className="w-full bg-navy border-y border-white/5 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="font-ui text-bat-blue text-xs tracking-[5px] uppercase font-bold block mb-4">More Information</span>
          <h3 className="font-wordmark text-3xl uppercase mb-4">Full CSR Record Coming Soon</h3>
          <p className="font-sans text-gray-mid text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            A complete record of all charity events, donations, and community partnerships championed by PlayMasters since 2022 is being compiled and will be published here shortly.
          </p>
          <a
            href="mailto:playmasters.bowling@gmail.com?subject=CSR Enquiry — PlayMasters"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 hover:border-strike/40 text-white font-ui tracking-[3px] uppercase text-sm transition-all rounded-sm"
          >
            Get Involved
          </a>
        </div>
      </section>

    </main>
  );
}
