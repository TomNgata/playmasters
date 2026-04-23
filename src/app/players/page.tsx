import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Players | PlayMasters Kenya',
  description: 'Meet the PlayMasters squad — Nairobi\'s most decorated bowling franchise. Player profiles, stats and achievements.',
};

// Verified players from Supabase/Historical Data
const players = [
  // PLAYMASTERS OG
  { name: 'Paras Chandaria', role: 'Captain — PlayMasters OG', team: 'OG', color: 'strike', records: ['Kenyan highest male score 2 lanes — 290'], highlights: ['UBL S9 MVP', 'USBT Ed.8 Runner-Up', '2023 Points Champion'] },
  { name: 'Suresh Bhudiya', role: 'Chairman — PlayMasters', team: 'OG', color: 'bat-blue', image: '/images/achievements/trophy-suresh.jpg', records: [], highlights: ['MILB 4 Gold — 2nd Place', 'UBL S16 Highest Score (Shared) — 258'] },
  { name: 'Sagar Joshi', role: 'PlayMasters OG', team: 'OG', color: 'strike', records: ['Kenyan highest male score 1 lane — 290'], highlights: ['UBL S15 Highest Scratch (Men) — 480'] },
  { name: 'Hiren', role: 'PlayMasters OG', team: 'OG', color: 'bat-blue', records: [], highlights: ['Consistent Top 10 League Performer'] },
  { name: 'James', role: 'PlayMasters OG', team: 'OG', color: 'bat-blue', records: [], highlights: ['League Veteran', 'Multi-Tournament Finalist'] },
  { name: 'Nitin Pindoria', role: 'PlayMasters OG', team: 'OG', color: 'bat-blue', records: [], highlights: ['USBT Ed.8 — 6th Place'] },
  { name: 'Parth', role: 'PlayMasters OG', team: 'OG', color: 'strike', records: [], highlights: ['UBL S15 Highest Average (Men) — 189.35'] },
  { name: 'Dhilan Chandaria', role: 'Junior — PlayMasters', team: 'OG', color: 'strike', records: ['U18 highest score 2 lanes — 237', 'U11 highest score (1 lane) — 152', 'U11 highest score (2 lanes) — 215'], highlights: ['MILB 5 Best Junior', 'Youngest player to score 167 in UBL'] },
  
  // PLAYMASTERS MAVERICKS
  { name: 'Deepen Kerai', role: 'Captain — PlayMasters Mavericks', team: 'Mavericks', color: 'ball-pink', records: [], highlights: ['Leader of the Mavericks expansion'] },
  { name: 'Mandela', role: 'PlayMasters Mavericks', team: 'Mavericks', color: 'ball-pink', records: [], highlights: ['UBL Season 16 Key Performer'] },
  { name: 'Rahul', role: 'PlayMasters Mavericks', team: 'Mavericks', color: 'ball-pink', records: [], highlights: ['Consistent league average 160+'] },
  { name: 'Avnish', role: 'PlayMasters Mavericks', team: 'Mavericks', color: 'ball-pink', records: [], highlights: ['Mavericks defensive anchor'] },
  { name: 'Darshi Chandaria', role: 'PlayMasters Mavericks', team: 'Mavericks', color: 'ball-pink', records: ['Kenyan highest female score 2 lanes — 255'], highlights: ['UBL S15 Highest Scratch — 381'] },

  // PLAYMASTERS RISING
  { name: 'Dorothy Williams', role: 'Captain — PlayMasters Rising', team: 'Rising', color: 'strike', image: '/images/achievements/trophy-dorothy.jpg', records: [], highlights: ['UBL S16 Female Highest Score — 224', 'UBL S16 Highest Average — 161.04', 'UBL S16 Highest Game Scratch — 381'] },
  { name: 'Victor', role: 'PlayMasters Rising', team: 'Rising', color: 'strike', records: [], highlights: ['Rising Talent', 'Consistent Growth'] },
  { name: 'Ian S.', role: 'PlayMasters Rising', team: 'Rising', color: 'strike', records: [], highlights: ['Squad Powerhouse'] },
  { name: 'Sam G.', role: 'PlayMasters Rising', team: 'Rising', color: 'strike', records: [], highlights: ['Tactical Anchor'] },
  { name: 'Vraj', role: 'PlayMasters Rising', team: 'Rising', color: 'strike', records: [], highlights: ['Junior development success'] },

  // PLAYMASTERS WARRIORS
  { name: 'Dillan Mandalia', role: 'Captain — PlayMasters Warriors', team: 'Warriors', color: 'bat-blue', image: '/images/achievements/trophy-dillan.jpg', records: [], highlights: ['USBT Edition 8 Champion 🥇', 'UBL S16 Male Highest Score — 195.69'] },
  { name: 'Hemang Rana', role: 'PlayMasters Warriors', team: 'Warriors', color: 'bat-blue', records: [], highlights: ['USBT Ed.8 — 5th Place', 'UBL S16 Highest Score (Shared) — 258'] },
];

const teamColors: Record<string, string> = {
  OG: 'strike',
  Warriors: 'bat-blue',
  Mavericks: 'ball-pink',
  Rising: 'strike',
};

const teamLabels: Record<string, string> = {
  OG: 'PlayMasters OG',
  Warriors: 'PlayMasters Warriors',
  Mavericks: 'PlayMasters Mavericks',
  Rising: 'PlayMasters Rising',
};

export default function PlayersPage() {
  return (
    <main className="min-h-screen bg-navy-dark text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative w-full py-28 md:py-32 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-strike via-ball-pink to-bat-blue" />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
          <span className="font-wordmark text-[18vw] text-white/[0.025] uppercase whitespace-nowrap">THE SQUAD</span>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <span className="font-ui text-strike text-sm tracking-[6px] uppercase font-bold">The Roster</span>
          <h1 className="font-wordmark text-[clamp(40px,8vw,96px)] uppercase leading-none">
            Meet the <span className="text-strike">Squad</span>
          </h1>
          <p className="font-sans text-gray-mid text-lg md:text-xl max-w-2xl leading-relaxed">
            National record-holders, league champions, and rising stars — this is the PlayMasters roster.
          </p>
        </div>
      </section>

      {/* Team filter legend */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-12 pb-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {Object.entries(teamLabels).map(([key, label]) => (
            <div key={key} className={`flex items-center gap-2 px-4 py-2 bg-${teamColors[key]}/10 border border-${teamColors[key]}/20 rounded-full`}>
              <span className={`w-2 h-2 rounded-full bg-${teamColors[key]}`} />
              <span className={`font-ui text-xs tracking-[2px] uppercase text-${teamColors[key]}`}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Player Grid */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {players.map((player) => {
            const teamColor = teamColors[player.team] || 'bat-blue';
            return (
              <div
                key={player.name}
                className={`relative bg-navy border border-white/8 rounded-xl overflow-hidden group hover:border-${teamColor}/40 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all`}
              >
                <div className={`absolute top-0 left-0 w-full h-0.5 bg-${teamColor}`} />

                {/* Avatar placeholder */}
                <div className="w-full aspect-square bg-navy-dark/60 flex items-center justify-center relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br from-${teamColor}/10 via-transparent to-transparent`} />
                  <div className="flex flex-col items-center gap-2 relative z-10 w-full h-full">
                    {player.image ? (
                        <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-700">
                            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 bg-gradient-to-t from-${teamColor}/40 via-transparent to-transparent`} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                             <div className={`w-20 h-20 rounded-full border-2 border-${teamColor}/30 bg-navy flex items-center justify-center`}>
                                <span className="text-4xl">🎳</span>
                             </div>
                             <span className={`font-ui text-[10px] tracking-[3px] uppercase text-${teamColor} opacity-60`}>Photo Coming</span>
                        </div>
                    )}
                  </div>
                  {/* Team badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 bg-${teamColor}/15 border border-${teamColor}/25 rounded font-ui text-[9px] tracking-[2px] uppercase text-${teamColor}`}>
                    {teamLabels[player.team]}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-wordmark text-xl uppercase leading-tight mb-0.5">{player.name}</h3>
                  <p className="font-ui text-xs text-gray-mid tracking-widest uppercase mb-4">{player.role}</p>

                  {/* Records */}
                  {player.records.length > 0 && (
                    <div className="mb-3">
                      <span className="font-ui text-[9px] text-strike tracking-[3px] uppercase block mb-1.5">🏆 Kenyan Records</span>
                      {player.records.map((r, i) => (
                        <p key={i} className="font-sans text-[11px] text-white/80 leading-relaxed">{r}</p>
                      ))}
                    </div>
                  )}

                  {/* Highlights */}
                  {player.highlights.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="font-ui text-[9px] text-gray-mid tracking-[3px] uppercase mb-1">Highlights</span>
                      {player.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className={`mt-1.5 w-1 h-1 rounded-full bg-${teamColor} flex-shrink-0`} />
                          <p className="font-sans text-[11px] text-gray-mid leading-relaxed">{h}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Photo & Data Coming Soon Banner */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-navy border border-white/8 rounded-xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-strike/5 via-transparent to-bat-blue/5 pointer-events-none" />
          <span className="font-ui text-strike text-xs tracking-[5px] uppercase font-bold block mb-3">Coming Soon</span>
          <h3 className="font-wordmark text-2xl uppercase mb-3">Full Player Profiles &amp; Statistics</h3>
          <p className="font-sans text-gray-mid text-sm max-w-lg mx-auto leading-relaxed">
            Individual player photos, full career statistics, and detailed performance analytics are being compiled and will be live shortly. Contact us at <a href="mailto:playmasters.bowling@gmail.com" className="text-strike hover:underline">playmasters.bowling@gmail.com</a>
          </p>
        </div>
      </section>

    </main>
  );
}
