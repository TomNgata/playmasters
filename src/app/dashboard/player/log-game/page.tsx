'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type UBLBowler = {
    bowler_name: string;
    team_name: string;
};

const MATCH_TYPES = [
    { value: 'practice', label: 'Practice Session' },
    { value: 'league', label: 'League Match' },
    { value: 'tournament_singles', label: 'Tournament (Singles)' },
    { value: 'tournament_team', label: 'Tournament (Team)' },
];

export default function LogGame() {
    const supabase = createClient();
    const router = useRouter();
    
    const [playmasters, setPlaymasters] = useState<UBLBowler[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<string>('');
    const [matchType, setMatchType] = useState<string>('practice');
    const [frames, setFrames] = useState<number[]>(Array(10).fill(0));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{type: 'error'|'success', text: string} | null>(null);

    useEffect(() => {
        async function fetchPlaymasters() {
            const { data } = await supabase
                .from('ubl_bowler_stats')
                .select('bowler_name, team_name')
                .order('average', { ascending: false });

            if (data) {
                const pm = data.filter(b => (b.team_name || '').toUpperCase().includes('PLAYMASTERS'));
                setPlaymasters(pm);
                if (pm.length > 0) setSelectedPlayer(pm[0].bowler_name);
            }
        }
        fetchPlaymasters();
    }, []);

    const handleFrameChange = (index: number, value: string) => {
        const num = parseInt(value, 10);
        const newFrames = [...frames];
        newFrames[index] = isNaN(num) ? 0 : Math.min(30, Math.max(0, num));
        setFrames(newFrames);
    };

    const totalScore = frames.reduce((a, b) => a + b, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!selectedPlayer) {
            setMessage({ type: 'error', text: 'Please select which Playmaster is logging this game.' });
            return;
        }

        if (totalScore === 0) {
            setMessage({ type: 'error', text: 'Total score cannot be 0. Please enter your frames.' });
            return;
        }

        setIsSubmitting(true);

        const { error } = await supabase.from('scores').insert({
            total_score: totalScore,
            frame_scores: frames,
            player_name: selectedPlayer,
            match_type: matchType,
            version: 1
        });

        setIsSubmitting(false);

        if (error) {
            setMessage({ type: 'error', text: 'Failed to upload score. Try again.' });
            console.error(error);
        } else {
            setMessage({ type: 'success', text: `${selectedPlayer}&apos;s game locked in!` });
            setFrames(Array(10).fill(0));
            setTimeout(() => {
                router.push('/dashboard/player');
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-navy-dark text-white pb-24">
            <div className="py-12 max-w-3xl mx-auto px-4">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-wordmark uppercase tracking-tight text-white mb-2">
                        Log <span className="text-strike">Score</span>
                    </h1>
                    <p className="text-gray-400 font-ui text-[10px] tracking-[4px] uppercase italic">
                        Enter your frame-by-frame data for accurate fatigue analysis
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="bg-navy border border-white/5 p-6 md:p-8 rounded-2xl relative overflow-hidden space-y-8">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-strike to-bat-blue"></div>
                    
                    {message && (
                        <div className={`p-4 rounded-lg font-bold text-center text-sm ${message.type === 'error' ? 'bg-strike/10 border border-strike/30 text-strike' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Player & Match Type Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] text-gray-500 font-black uppercase tracking-[3px] mb-3">
                                Who is logging?
                            </label>
                            <select 
                                value={selectedPlayer}
                                onChange={(e) => setSelectedPlayer(e.target.value)}
                                className="w-full bg-navy-dark border border-white/10 rounded-xl px-4 py-3 text-white font-ui font-black uppercase tracking-widest text-sm outline-none focus:border-strike transition-all appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-navy">-- Select Player --</option>
                                {playmasters.map(p => (
                                    <option key={p.bowler_name} value={p.bowler_name} className="bg-navy text-white">
                                        {p.bowler_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] text-gray-500 font-black uppercase tracking-[3px] mb-3">
                                Match Type
                            </label>
                            <select
                                value={matchType}
                                onChange={(e) => setMatchType(e.target.value)}
                                className="w-full bg-navy-dark border border-white/10 rounded-xl px-4 py-3 text-white font-ui font-black uppercase tracking-widest text-sm outline-none focus:border-strike transition-all appearance-none cursor-pointer"
                            >
                                {MATCH_TYPES.map(mt => (
                                    <option key={mt.value} value={mt.value} className="bg-navy text-white">
                                        {mt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Selected Player & Type Confirmation */}
                    {selectedPlayer && (
                        <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-strike to-bat-blue p-[2px]">
                                <div className="w-full h-full bg-navy rounded-[10px] flex items-center justify-center text-xl">🎳</div>
                            </div>
                            <div>
                                <p className="font-wordmark text-lg uppercase text-white">{selectedPlayer}</p>
                                <p className="text-[9px] font-black uppercase tracking-[2px] text-strike">
                                    {MATCH_TYPES.find(m => m.value === matchType)?.label || 'Practice'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Frame Inputs */}
                    <div>
                        <label className="block text-[10px] text-gray-500 font-black uppercase tracking-[3px] mb-3">
                            Frame Scores
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {frames.map((score, index) => (
                                <div key={index} className="bg-navy-dark/80 p-3 rounded-xl border border-white/5 group focus-within:border-strike/30 transition-colors">
                                    <label className="block text-[9px] text-gray-600 font-black uppercase mb-2 text-center">
                                        F{index + 1}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="30"
                                        value={score || ''}
                                        onChange={(e) => handleFrameChange(index, e.target.value)}
                                        className="w-full bg-transparent text-2xl font-wordmark text-white outline-none placeholder-gray-700 text-center tabular-nums"
                                        placeholder="0"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[3px] mb-1">Calculated Total</p>
                            <p className={`text-6xl font-wordmark tabular-nums tracking-tighter ${totalScore > 0 ? 'text-strike' : 'text-gray-700'}`}>
                                {totalScore}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedPlayer}
                            className="w-full md:w-auto bg-strike text-white px-10 py-4 rounded-xl font-ui font-black uppercase tracking-[3px] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(232,32,48,0.3)] active:scale-95 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        >
                            {isSubmitting ? 'Verifying...' : 'Submit Score'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
