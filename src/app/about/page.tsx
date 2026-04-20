import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About PlayMasters | Kenya\'s Premier Bowling Franchise',
  description: 'Learn about PlayMasters — our history, mission, vision, and the values that drive Kenya\'s most decorated bowling franchise, founded 2022.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-navy-dark text-white overflow-x-hidden">

      {/* ─── Hero ─── */}
      <section className="relative w-full py-28 md:py-36 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-dark opacity-90" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-strike via-ball-pink to-bat-blue" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-wordmark text-[20vw] text-white/[0.025] uppercase whitespace-nowrap">PLAYMASTERS</span>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-6">
          <span className="font-ui text-strike text-sm tracking-[6px] uppercase font-bold">Est. 2022 · Nairobi, Kenya</span>
          <h1 className="font-wordmark text-[clamp(40px,8vw,96px)] uppercase leading-none">
            About <span className="text-strike">Playmasters</span>
          </h1>
          <p className="font-sans text-gray-mid text-lg md:text-xl max-w-2xl leading-relaxed">
            From a single team at the lanes to Kenya&apos;s most dominant bowling franchise — this is our story.
          </p>
        </div>
      </section>

      {/* ─── Our Story ─── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1">
          <span className="font-ui text-strike text-xs tracking-[5px] uppercase font-bold">The Origin</span>
          <h2 className="font-wordmark text-4xl md:text-5xl uppercase mt-3 mb-6 leading-none">
            Born on the <span className="text-strike">Lanes</span>
          </h2>
          <div className="w-12 h-1 bg-strike mb-8" />
          <div className="flex flex-col gap-5 font-sans text-gray-mid leading-relaxed text-base">
            <p>
              <strong className="text-white">PlayMasters bowling was born in 2022</strong> — forged from a shared love of competition and a belief that Kenya&apos;s bowling scene deserved a franchise that showed up, showed out, and led from the front.
            </p>
            <p>
              What started as one tight-knit team quickly grew into a full franchise. Today, PlayMasters fields multiple squads — <strong className="text-white">PlayMasters OG, PlayMasters Warriors, PlayMasters Mavericks, and PlayMasters Rising</strong> — each competing at the highest levels of Nairobi bowling across league and tournament play.
            </p>
            <p>
              Since 2022, we have been crowned league champions on <strong className="text-white">multiple occasions across seasons 2023, 2024, and 2025</strong>, dominating singles and doubles tournaments and setting national records along the way.
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 group shadow-2xl">
          <img src="/images/achievements/trophy-team-alt-2.jpg" alt="Playmasters Team Success" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-tr from-navy-dark via-transparent to-transparent opacity-40" />
          <div className="absolute inset-0 border-2 border-strike/20 -m-3 group-hover:m-0 transition-all duration-500 rounded-2xl pointer-events-none" />
        </div>
      </section>

      {/* Kenya Bowling Context (Integrated) */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-navy/50 border border-white/8 rounded-2xl p-8 flex flex-col gap-5">
          <span className="font-ui text-bat-blue text-xs tracking-[5px] uppercase font-bold">Kenya&apos;s Bowling History</span>
          <h3 className="font-ui text-2xl uppercase text-white tracking-tight">The Bigger Picture</h3>
          <div className="w-8 h-0.5 bg-bat-blue" />
          <div className="flex flex-col gap-4 font-sans text-gray-mid text-sm leading-relaxed">
            <p>The first bowling alley in Kenya was built in Nairobi, quickly becoming a destination for locals and expatriates alike. But growth was far from guaranteed.</p>
            <div className="border-l-2 border-strike/40 pl-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="font-ui text-strike font-bold text-lg w-12 flex-shrink-0">2013</span>
                <p>Bowling was virtually <strong className="text-white">non-existent</strong> in Kenya — zero bowling alleys remained operational.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-ui text-strike font-bold text-lg w-12 flex-shrink-0">2017</span>
                <p>The sport was <strong className="text-white">reintroduced</strong>. Leagues and tournaments began forming across Nairobi.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-ui text-strike font-bold text-lg w-12 flex-shrink-0">2022</span>
                <p><strong className="text-white">PlayMasters was founded</strong>. A new chapter for Kenyan bowling began.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-ui text-strike font-bold text-lg w-12 flex-shrink-0">Now</span>
                <p>Multiple leagues run year-round. PlayMasters holds <strong className="text-white">Kenyan national records</strong> and leads the fraternity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mission & Vision ─── */}
      <section className="w-full bg-navy border-y border-white/5 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="font-ui text-ball-pink text-xs tracking-[6px] uppercase font-bold">What Drives Us</span>
            <h2 className="font-wordmark text-4xl md:text-5xl uppercase mt-3">Mission &amp; Vision</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="relative bg-navy-dark border border-white/8 rounded-2xl p-8 overflow-hidden group hover:border-strike/30 transition-all">
              <div className="absolute top-0 left-0 w-full h-1 bg-strike" />
              <span className="font-ui text-strike text-xs tracking-[5px] uppercase font-bold block mb-4">Mission</span>
              <p className="font-sans text-white text-lg leading-relaxed">
                To promote ten pin bowling in Kenya as an important sports activity and provide the required infrastructure, knowhow, services and opportunities for our players, coaches and the youth — to build &amp; develop their game.
              </p>
            </div>

            {/* Vision */}
            <div className="relative bg-navy-dark border border-white/8 rounded-2xl p-8 overflow-hidden group hover:border-bat-blue/30 transition-all">
              <div className="absolute top-0 left-0 w-full h-1 bg-bat-blue" />
              <span className="font-ui text-bat-blue text-xs tracking-[5px] uppercase font-bold block mb-4">Vision</span>
              <p className="font-sans text-white text-lg leading-relaxed">
                PlayMasters is devoted to fostering a high quality ten pin bowling environment — giving all players, coaches, and youth every opportunity to enjoy the game, achieve their maximum potential, and to <strong>fly the flag of Kenya on the international bowling stage.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Values ─── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="font-ui text-ball-pink text-xs tracking-[6px] uppercase font-bold">What We Stand For</span>
          <h2 className="font-wordmark text-4xl md:text-5xl uppercase mt-3">Our Values</h2>
          <div className="w-12 h-1 bg-strike mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            { num: '01', value: 'Sport & Development', desc: 'Sport is a fundamental part of education, health, and development.' },
            { num: '02', value: 'Professionalism', desc: 'We operate with professionalism and ethics at every level.' },
            { num: '03', value: 'Innovation', desc: 'Creativity and innovation push us to constantly improve.' },
            { num: '04', value: 'Integrity', desc: 'Good governance and integrity define how we lead.' },
            { num: '05', value: 'Team Spirit', desc: 'Team spirit and teamwork are the foundation of everything we do.' },
            { num: '06', value: 'Citizenship', desc: 'We are responsible citizens — on and off the lanes.' },
            { num: '07', value: 'Accountability', desc: 'Accountability and transparency build lasting trust.' },
            { num: '08', value: 'Respect', desc: 'We respect all members of the ten pin bowling fraternity.' },
            { num: '09', value: 'Inclusion', desc: 'No limits based on age, financial, or physical condition.' },
            { num: '10', value: 'Environment', desc: 'We promote beneficial environmental policies in sport.' },
          ].map(({ num, value, desc }) => (
            <div key={num} className="bg-navy/50 border border-white/8 rounded-xl p-5 group hover:border-strike/30 hover:bg-navy transition-all">
              <span className="font-wordmark text-[40px] leading-none text-white/8 group-hover:text-strike/15 transition-colors mb-2 block">{num}</span>
              <h3 className="font-ui text-lg uppercase tracking-wide text-white mb-2">{value}</h3>
              <p className="font-sans text-gray-mid text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Chairman Message Placeholder ─── */}
      <section className="w-full bg-navy border-y border-white/5 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="font-ui text-strike text-xs tracking-[6px] uppercase font-bold">Leadership</span>
          <h2 className="font-wordmark text-4xl md:text-5xl uppercase mt-3 mb-8">Chairman&apos;s Message</h2>
          <div className="relative bg-navy-dark border border-white/8 rounded-2xl p-10 text-left">
            <div className="absolute top-0 left-0 w-1 h-full bg-strike rounded-l-2xl" />
            <div className="w-16 h-16 rounded-full bg-navy border border-white/10 flex items-center justify-center mb-6 ml-2">
              <span className="text-3xl">🎳</span>
            </div>
            <p className="font-sans text-gray-mid text-lg leading-relaxed italic ml-2 mb-6">
              &ldquo;As Chairman, it is my privilege to lead the PlayMasters franchise during this period of unprecedented growth for Kenyan bowling. We are more than just a team; we are a community dedicated to the sport’s integrity, competitive spirit, and the development of our youth. Together, we strike for excellence.&rdquo;
            </p>
            <p className="font-ui text-[10px] text-strike/60 tracking-[2px] uppercase mb-6 ml-2 italic">
              [Note: Placeholder Statement — Awaiting Final Draft from Suresh]
            </p>
            <div className="ml-2">
              <p className="font-ui text-white text-lg tracking-wide uppercase">Suresh Bhudiya</p>
              <p className="font-ui text-gray-mid text-sm tracking-widest uppercase mt-1">Chairman, PlayMasters</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Teams ─── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="font-ui text-bat-blue text-xs tracking-[6px] uppercase font-bold">The Franchise</span>
          <h2 className="font-wordmark text-4xl md:text-5xl uppercase mt-3">Our Teams</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'PlayMasters OG', color: 'strike', desc: 'The original squad. The standard-setters. Where it all began in 2022.', captain: 'Paras Chandaria' },
            { name: 'PlayMasters Warriors', color: 'bat-blue', desc: 'Champions of UBL Season 10 & Season 16. The Warriors set the pace.', captain: 'Dillan Mandalia' },
            { name: 'PlayMasters Mavericks', color: 'ball-pink', desc: 'The bold third arm of the franchise. Growing fast, competing faster.', captain: 'Deepen Kerai' },
            { name: 'PlayMasters Rising', color: 'strike', desc: 'Our newest competitive division. Focused on growth, talent, and teamwork.', captain: 'Dorothy Williams' },
          ].map(({ name, color, desc, captain }) => (
            <div key={name} className={`relative bg-navy border border-white/8 rounded-2xl p-7 overflow-hidden group hover:border-${color}/30 transition-all`}>
              <div className={`absolute top-0 left-0 w-full h-1 bg-${color}`} />
              <h3 className="font-wordmark text-2xl uppercase mt-2 mb-3">{name}</h3>
              <p className="font-sans text-gray-mid text-sm leading-relaxed mb-4">{desc}</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className={`w-1.5 h-1.5 rounded-full bg-${color}`} />
                <span className="font-ui text-xs text-gray-mid tracking-widest uppercase">Captain: {captain}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
