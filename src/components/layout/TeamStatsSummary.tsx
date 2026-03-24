'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TeamStatsSummary() {
    const [stats, setStats] = useState({
        activeRoster: '12+',
        tournamentsWon: '14'
    });

    useEffect(() => {
        async function fetchStats() {
            const supabase = createClient();
            const { data } = await supabase.from('team_stats').select('label, value');
            if (data) {
                const roster = data.find(s => s.label === 'Active Roster')?.value || '12+';
                const won = data.find(s => s.label === 'Tournaments Won')?.value || '14';
                setStats({ activeRoster: roster, tournamentsWon: won });
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/10 mt-4">
            <div className="flex flex-col">
                <span className="font-wordmark text-4xl text-ball-pink">{stats.activeRoster}</span>
                <span className="font-ui text-gray-mid uppercase tracking-wide text-xs">Active Roster</span>
            </div>
            <div className="h-10 w-px bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
                <span className="font-wordmark text-4xl text-navy-mid">{stats.tournamentsWon}</span>
                <span className="font-ui text-gray-mid uppercase tracking-wide text-xs">Tournaments Won</span>
            </div>
        </div>
    );
}
