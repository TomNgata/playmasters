'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Verified Playmasters squad members across all 4 active teams:
// OG (8) + Mavericks (5) + Rising (5) + Warriors (2) = 20
const VERIFIED_SQUAD_COUNT = 20;

// The 4 official Playmasters team names as stored in the profiles table
const PLAYMASTERS_TEAMS = [
  'PlayMasters OG',
  'PlayMasters Mavericks',
  'PlayMasters Rising',
  'PlayMasters Warriors',
];

export default function TeamStatsSummary() {
  const [stats, setStats] = useState({
    leagueTitles: 8,
    tournamentWins: 12,
    activePlayers: VERIFIED_SQUAD_COUNT,
    yearsActive: new Date().getFullYear() - 2022,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient();
        // Only count profiles belonging to the 4 Playmasters teams,
        // not all UBL league participants stored in the DB.
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .in('team', PLAYMASTERS_TEAMS);
        if (count && count > 0) {
          setStats((s) => ({ ...s, activePlayers: count }));
        }
        // If count is 0 or null (e.g. team column not set), keep the verified fallback
      } catch {
        // keep verified fallback
      }
    }
    fetchStats();
  }, []);

  const items = [
    { label: 'League Titles',   value: stats.leagueTitles + '+',  color: 'strike' },
    { label: 'Tournament Wins', value: stats.tournamentWins + '+', color: 'bat-blue' },
    { label: 'Squad Members',   value: stats.activePlayers + '',   color: 'ball-pink' },
    { label: 'Years Active',    value: stats.yearsActive + '',     color: 'strike' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {items.map(({ label, value, color }) => (
        <div key={label} className={`bg-navy-dark/60 border border-white/8 rounded-xl p-4 group hover:border-${color}/30 transition-all`}>
          <div className={`font-wordmark text-3xl text-${color} mb-1`}>{value}</div>
          <div className="font-ui text-[10px] text-gray-mid tracking-[3px] uppercase">{label}</div>
        </div>
      ))}
    </div>
  );
}
