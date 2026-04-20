import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Achievements | PlayMasters Kenya',
  description: 'Full record of PlayMasters achievements — Kenyan records, league championships, individual awards and tournament results from 2023 to 2026.',
};

// ─── Data ───────────────────────────────────────────────────────────────────

const kenyanRecords = [
  { record: 'Highest Male Score (1 Lane)', holder: 'Sagar Joshi', score: '290' },
  { record: 'Highest Male Score (2 Lanes)', holder: 'Paras Chandaria', score: '290' },
  { record: 'Highest Female Score (2 Lanes)', holder: 'Darshi Chandaria', score: '255' },
  { record: 'Highest Junior Score U18 (2 Lanes)', holder: 'Dhilan Chandaria', score: '237' },
  { record: 'Highest Junior Score U11 (1 Lane)', holder: 'Dhilan Chandaria', score: '152' },
  { record: 'Highest Junior Score U11 (2 Lanes)', holder: 'Dhilan Chandaria', score: '215' },
];

const seasons = [
  {
    year: '2026',
    color: 'strike',
    events: [
      {
        title: 'USBT Edition 8 — 2026 Season Opener',
        subtitle: 'Ultimate Singles Bowling Tournament',
        type: 'tournament',
        highlights: [
          { label: '🥇 Champion', detail: 'Dillan Mandalia — Captain, PlayMasters Warriors' },
          { label: '🥈 Runner-Up', detail: 'Paras Chandaria — Captain, PlayMasters OG' },
          { label: '5th Place', detail: 'Hemang Rana' },
          { label: '6th Place', detail: 'Nitin Pindoria' },
          { label: '🏆 4 PlayMasters athletes in Top 8 · Top 2 on the podium', detail: '' },
        ],
      },
    ],
  },
  {
    year: '2025',
    color: 'bat-blue',
    events: [
      {
        title: 'PINS UBL Season 16 — League',
        subtitle: 'Ultimate Bowling League',
        type: 'league',
        highlights: [
          { label: '🥇 Ultimate Champions', detail: 'PlayMasters Warriors' },
          { label: '🥈 Ultimate 2nd Place', detail: 'PlayMasters OG' },
          { label: 'Female Highest Score', detail: 'Dorothy Williams — 224' },
          { label: 'Female Highest Average', detail: 'Dorothy Williams — 161.04' },
          { label: 'Female Highest Game Scratch', detail: 'Dorothy Williams — 381' },
          { label: 'Male Highest Score', detail: 'Dillan Mandalia — 195.69' },
          { label: 'Male Highest Score (Shared)', detail: 'Suresh Bhudiya & Hemang Rana — 258' },
        ],
      },
      {
        title: 'UBL Season 15 Finals',
        subtitle: 'Ultimate Bowling League',
        type: 'league',
        highlights: [
          { label: '2nd Place — Gold Bracket', detail: 'PlayMasters Warriors' },
          { label: '3rd Place — Gold Bracket', detail: 'PlayMasters OG' },
          { label: '3rd Place — Silver Bracket', detail: 'PlayMasters Mavericks' },
          { label: '4th Place — Bronze Bracket', detail: 'Big 5 by PlayMasters' },
          { label: 'Highest Score (Women)', detail: 'Dorothy — 224' },
          { label: 'Most Improved (Women)', detail: 'Dorothy — +19.2' },
          { label: 'Highest Scratch (Women)', detail: 'Darshi — 381' },
          { label: 'Highest Scratch (Men)', detail: 'Sagar — 480' },
          { label: 'Highest Average (Men)', detail: 'Parth — 189.35' },
          { label: 'Youngest Player (Men)', detail: 'Dhilan — 167' },
        ],
      },
      {
        title: 'UBL Season 14 · Village Bowl Season 6',
        subtitle: 'League Results',
        type: 'league',
        highlights: [
          { label: '🥇 UBL Season 14', detail: 'PlayMasters — 1st Place' },
          { label: 'UBL Season 13', detail: 'PlayMasters — 4th Place' },
          { label: 'Village Bowl Season 6', detail: 'PlayMasters — 3rd Place' },
        ],
      },
    ],
  },
  {
    year: '2024',
    color: 'ball-pink',
    events: [
      {
        title: 'League Season Results',
        subtitle: 'UBL & Village Bowl',
        type: 'league',
        highlights: [
          { label: '🥇 UBL Season 10', detail: 'PlayMasters Warriors — 1st Place' },
          { label: '🥇 UBL Season 11', detail: 'PlayMasters — 1st Place' },
          { label: '🥇 Village Bowl Season 5', detail: 'PlayMasters — 1st Place' },
          { label: 'UBL Season 10', detail: 'PlayMasters — 3rd Place' },
          { label: 'UBL Season 10', detail: 'PlayMasters Mavericks — 4th Place' },
          { label: 'UBL Season 12', detail: 'PlayMasters Warriors — 4th Place' },
        ],
      },
    ],
  },
  {
    year: '2023',
    color: 'bat-blue',
    events: [
      {
        title: 'Team League Championships',
        subtitle: 'Strikes & UBL',
        type: 'league',
        highlights: [
          { label: '🥇 Strikes Season 5', detail: 'PlayMasters — 1st Place' },
          { label: '🥇 Strikes Season 6', detail: 'PlayMasters — 1st Place' },
          { label: '🥇 Strikes Season 6 Plate', detail: 'PlayMasters Ladies — 1st Place' },
          { label: '🥇 UBL Season 9', detail: 'PlayMasters — 1st Place' },
          { label: 'UBL Season 8', detail: 'PlayMasters — 4th Place' },
          { label: 'UBL Season 9 Plate', detail: 'PlayMasters Ladies — 2nd Place' },
        ],
      },
      {
        title: 'Individual Awards — Leagues',
        subtitle: 'UBL Season 9 Highlights',
        type: 'individual',
        highlights: [
          { label: 'Most Valuable Player', detail: 'Paras Chandaria' },
          { label: 'Most Valuable Player', detail: 'Sonika' },
          { label: 'Most Improved Player', detail: 'Sonika' },
          { label: 'Highest Game Scratch', detail: 'Amrit' },
          { label: 'Highest Series Scratch', detail: 'Ravi & Sonika' },
          { label: 'Most 200s (Season 5)', detail: 'PlayMasters' },
          { label: 'Most 200s (Season 6)', detail: 'PlayMasters Warriors' },
        ],
      },
      {
        title: 'Doubles Tournaments',
        subtitle: 'Double Trouble Series',
        type: 'tournament',
        highlights: [
          { label: '🥇 Double Trouble 2', detail: 'Saif & Viraj — 1st Place' },
          { label: '🥈 Double Trouble 1', detail: 'Paras & Viral — 2nd Place' },
          { label: '4th Place', detail: 'Ravi & Suresh' },
          { label: '5th Place', detail: 'Paras & Darshi' },
        ],
      },
      {
        title: 'Singles Tournaments',
        subtitle: 'Me I Love Bowling Series',
        type: 'tournament',
        highlights: [
          { label: '🥇 MILB 3', detail: 'Paras — 1st Place' },
          { label: '🥇 MILB 4 Silver', detail: 'Saif — 1st Place' },
          { label: '🥇 MILB 5 Silver', detail: 'Viraj — 1st Place' },
          { label: '🥇 MILB 5 Bronze', detail: 'Sonika — 1st Place' },
          { label: '🥇 MILB 5 Best Woman', detail: 'Sonika' },
          { label: '🥇 MILB 5 Best Junior', detail: 'Dhilan' },
          { label: '🥈 MILB 4 Gold', detail: 'Suresh — 2nd Place' },
          { label: '🥈 MILB 5 Gold', detail: 'Dillan — 2nd Place' },
        ],
      },
      {
        title: 'Singles League 2023',
        subtitle: 'Season 1 — Overall Points Table',
        type: 'individual',
        highlights: [
          { label: '🥇 Division 2', detail: 'Paras — 1st Place' },
          { label: '🥈 Division 1', detail: 'Ravi — 2nd Place' },
          { label: '4th Place', detail: 'Tilak' },
          { label: 'Overall Player Rankings', detail: 'Paras 🥇 · Tilak 🥉 · Viraj 4th · Suresh 7th · Ravi 8th · Saif 9th · Dillan 10th' },
        ],
      },
    ],
  },
];

const typeColors: Record<string, string> = {
  league: 'bat-blue',
  tournament: 'strike',
  individual: 'ball-pink',
};

const typeLabels: Record<string, string> = {
  league: 'League',
  tournament: 'Tournament',
  individual: 'Individual',
};

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AchievementsPage() {
  return (
    <main className="min-h-screen bg-navy-dark text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative w-full py-28 md:py-36 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-strike via-ball-pink to-bat-blue" />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
          <span className="font-wordmark text-[18vw] text-white/[0.025] uppercase whitespace-nowrap">CHAMPIONS</span>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <span className="font-ui text-strike text-sm tracking-[6px] uppercase font-bold">2023 → 2026</span>
          <h1 className="font-wordmark text-[clamp(40px,8vw,96px)] uppercase leading-none">
            Our <span className="text-strike">Achievements</span>
          </h1>
          <p className="font-sans text-gray-mid text-lg md:text-xl max-w-2xl leading-relaxed">
            Four years. Multiple teams. Kenyan records. This is the full PlayMasters trophy cabinet.
          </p>
        </div>
      </section>

      {/* Kenyan Records */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-shrink-0 w-10 h-10 bg-strike/10 rounded-lg flex items-center justify-center text-xl">🏆</div>
          <div>
            <span className="font-ui text-strike text-xs tracking-[5px] uppercase font-bold block">National</span>
            <h2 className="font-wordmark text-3xl md:text-4xl uppercase leading-none">Kenyan Records Held</h2>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/8">
          <table className="w-full">
            <thead>
              <tr className="bg-navy border-b border-white/8">
                <th className="text-left px-6 py-4 font-ui text-xs tracking-[3px] uppercase text-gray-mid">Record</th>
                <th className="text-left px-6 py-4 font-ui text-xs tracking-[3px] uppercase text-gray-mid">Holder</th>
                <th className="text-right px-6 py-4 font-ui text-xs tracking-[3px] uppercase text-strike">Score</th>
              </tr>
            </thead>
            <tbody>
              {kenyanRecords.map((r, i) => (
                <tr key={i} className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${i % 2 === 0 ? 'bg-navy-dark' : 'bg-navy/30'}`}>
                  <td className="px-6 py-4 font-sans text-sm text-gray-mid">{r.record}</td>
                  <td className="px-6 py-4 font-ui text-base uppercase tracking-wide text-white">{r.holder}</td>
                  <td className="px-6 py-4 text-right font-wordmark text-2xl text-strike">{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trophy Cabinet Gallery */}
      <section className="w-full bg-navy py-24 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-wordmark text-[15vw] opacity-[0.01] whitespace-nowrap pointer-events-none select-none">
          TROPHY CABINET
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="font-ui text-strike text-xs tracking-[6px] uppercase font-bold">Showcase</span>
            <h2 className="font-wordmark text-4xl md:text-5xl uppercase mt-3">The Trophy Cabinet</h2>
            <p className="font-sans text-gray-mid text-sm mt-4 max-w-xl mx-auto leading-relaxed">
              Snapshots of our dominant runs across Nairobi&apos;s premier bowling venues. From Pin Entertainment to Village Bowl.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-fr">
            {/* Main Feature */}
            <div className="col-span-2 row-span-2 aspect-[4/3] md:aspect-auto group relative overflow-hidden rounded-xl border border-white/10 bg-navy-dark">
              <img src="/images/achievements/trophy-team-large.jpg" alt="Team Playmasters Success" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
            
            {/* Square Gallery Items */}
            <div className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-navy-dark">
              <img src="/images/achievements/trophy-dorothy.jpg" alt="Dorothy's Trophies" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
            <div className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-navy-dark">
              <img src="/images/achievements/trophy-suresh.jpg" alt="Suresh Bhudiya Trophy" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
            <div className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-navy-dark">
              <img src="/images/achievements/trophy-dillan.jpg" alt="Dillan Mandalia Trophy" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
            <div className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-navy-dark">
              <img src="/images/achievements/trophy-team-celebration.jpg" alt="Team Celebration" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
            <div className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-navy-dark">
              <img src="/images/achievements/trophy-team-alt.jpg" alt="Team Trophy" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Season Timeline */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <span className="font-ui text-ball-pink text-xs tracking-[6px] uppercase font-bold">Season by Season</span>
          <h2 className="font-wordmark text-4xl md:text-5xl uppercase mt-3">Full Trophy Cabinet</h2>
          <div className="w-12 h-1 bg-strike mx-auto mt-4" />
        </div>

        <div className="flex flex-col gap-16">
          {seasons.map((season) => (
            <div key={season.year}>
              {/* Year marker */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`flex-shrink-0 px-5 py-2 bg-${season.color}/10 border border-${season.color}/30 rounded-lg`}>
                  <span className={`font-wordmark text-3xl text-${season.color} leading-none`}>{season.year}</span>
                </div>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {season.events.map((event, ei) => {
                  const eventColor = typeColors[event.type];
                  return (
                    <div key={ei} className={`relative bg-navy border border-white/8 rounded-xl overflow-hidden group hover:border-${eventColor}/30 transition-all`}>
                      <div className={`absolute top-0 left-0 w-full h-0.5 bg-${eventColor}`} />
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <h3 className="font-ui text-lg uppercase tracking-wide text-white leading-tight">{event.title}</h3>
                            <p className="font-ui text-xs text-gray-mid tracking-widest uppercase mt-1">{event.subtitle}</p>
                          </div>
                          <span className={`flex-shrink-0 px-2.5 py-1 bg-${eventColor}/10 border border-${eventColor}/20 rounded font-ui text-[10px] tracking-[2px] uppercase text-${eventColor}`}>
                            {typeLabels[event.type]}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {event.highlights.map((h, hi) => (
                            <div key={hi} className="flex items-start gap-3">
                              <span className="font-ui text-sm text-white flex-shrink-0 min-w-[140px]">{h.label}</span>
                              {h.detail && <span className="font-sans text-xs text-gray-mid leading-relaxed">{h.detail}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
