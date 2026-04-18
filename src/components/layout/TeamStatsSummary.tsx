'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TeamStatsSummary() {
  const [stats, setStats] = useState({
    leagueTitles: 8,
    tournamentWins: 12,
    activePlayers: 16,
    yearsActive: new Date().getFullYear() - 2022,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient();
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);
        if (count) setStats((s) => ({ ...s, activePlayers: count }));
      } catch {
        // fallback to defaults
      }
    }
    fetchStats();
  }, []);

  const items = [
    { label: 'League Titles', value: stats.leagueTitles + '+', color: 'strike' },
    { label: 'Tournament Wins', value: stats.tournamentWins + '+', color: 'bat-blue' },
    { label: 'Squad Members', value: stats.activePlayers + '', color: 'ball-pink' },
    { label: 'Years Active', value: stats.yearsActive + '', color: 'strike' },
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
