'use client';

import { useState, useEffect, useMemo } from 'react';
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

const MATCH_PHASES = [
    { value: 'regular', label: 'Regular Phase / Qualifiers' },
    { value: 'knockout', label: 'Knockout Stage' },
    { value: 'winners_bracket', label: 'Winners Bracket' },
    { value: 'losers_tier', label: 'Losers Tier / Bracket' },
    { value: 'finals', label: 'Finals / Step-Ladder' },
];

export default function LogGame() {
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();
    
    const [playmasters, setPlaymasters] = useState<UBLBowler[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<string>('');
    const [matchType, setMatchType] = useState<string>('practice');
    
    // Core state for new Conventional Bowling Scorecard
    const [rolls, setRolls] = useState<number[][]>(Array.from({ length: 10 }, () => []));
    const [activeFrame, setActiveFrame] = useState(0);
    const [alley, setAlley] = useState('');
    const [eventName, setEventName] = useState('');
    const [gameNumber, setGameNumber] = useState<number>(1);
    const [tournamentTier, setTournamentTier] = useState<string>('regular');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [pendingSession, setPendingSession] = useState<any | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        async function fetchPlaymasters() {
            const { data } = await supabase
                .from('ubl_bowler_stats')
                .select('bowler_name, team_name')
                .order('average', { ascending: false });

            if (data) {
                const pm = data.filter(b => (b.team_name || '').toUpperCase().includes('PLAYMASTERS'));
                setPlaymasters(pm);
                // Don't auto-set player so we can trigger session check on change
            }
        }
        fetchPlaymasters();
    }, [supabase]);

    // Check for active "in_progress" session when player is selected
    useEffect(() => {
        if (!selectedPlayer) {
            setRolls(Array.from({ length: 10 }, () => []));
            setActiveFrame(0);
            setSessionId(null);
            setPendingSession(null);
            return;
        }

        // Clear current local state immediately to avoid showing wrong player data while checking
        setRolls(Array.from({ length: 10 }, () => []));
        setActiveFrame(0);
        setSessionId(null);
        setPendingSession(null);

        async function checkActiveSession() {
            const { data } = await supabase
                .from('scores')
                .select('*')
                .eq('player_name', selectedPlayer)
                .eq('status', 'in_progress')
                .order('updated_at', { ascending: false })
                .limit(1);

            if (data && data.length > 0) {
                setPendingSession(data[0]);
            }
        }
        checkActiveSession();
    }, [selectedPlayer, supabase]);

    const resumeSession = () => {
        if (!pendingSession) return;
        setRolls(pendingSession.frame_scores);
        setMatchType(pendingSession.match_type || 'practice');
        setAlley(pendingSession.alley || '');
        setEventName(pendingSession.event_name || '');
        setGameNumber(pendingSession.game_number || 1);
        setTournamentTier(pendingSession.tournament_tier || 'regular');
        setSessionId(pendingSession.id);
        
        // Calculate active frame based on rolls
        const currentRolls = pendingSession.frame_scores as number[][];
        let nextFrame = 0;
        for (let i = 0; i < 10; i++) {
            const f = currentRolls[i];
            if (!f || f.length === 0) {
                nextFrame = i;
                break;
            }
            if (i < 9) {
                if (f[0] !== 10 && f.length < 2) {
                    nextFrame = i;
                    break;
                }
            } else {
                // 10th frame
                const isBonus = f[0] === 10 || (f[0] + (f[1] || 0)) >= 10;
                if ((!isBonus && f.length < 2) || (isBonus && f.length < 3)) {
                    nextFrame = i;
                    break;
                }
            }
            nextFrame = i + 1;
        }
        setActiveFrame(Math.min(nextFrame, 10));
        setPendingSession(null);
        setMessage({ type: 'success', text: 'Session resumed!' });
        setTimeout(() => setMessage(null), 3000);
    };

    const startFresh = () => {
        setPendingSession(null);
        setSessionId(null);
        setRolls(Array.from({ length: 10 }, () => []));
        setAlley('');
        setEventName('');
        setGameNumber(1);
        setTournamentTier('regular');
        setActiveFrame(0);
    };

    // Pure function to calculate running totals based on conventional bowling math
    const calculateRunningTotals = (currentRolls: number[][]): number[] => {
        const totals: number[] = [];
        let cumulative = 0;
        
        const flatRolls: number[] = [];
        for (const frame of currentRolls) {
            flatRolls.push(...frame);
        }
        
        let rollIndex = 0;
        for (let frameIndex = 0; frameIndex < 10; frameIndex++) {
            const frame = currentRolls[frameIndex];
            if (!frame || frame.length === 0) {
                totals.push(cumulative);
                continue;
            }
            
            if (frameIndex === 9) {
                const frameSum = frame.reduce((a, b) => a + b, 0);
                cumulative += frameSum;
                totals.push(cumulative);
                break;
            }
            
            const isStrike = frame[0] === 10;
            const isSpare = !isStrike && frame.length > 1 && frame[0] + frame[1] === 10;
            
            if (isStrike) {
                let bonus = 0;
                const next1 = flatRolls[rollIndex + 1];
                const next2 = flatRolls[rollIndex + 2];
                if (next1 !== undefined) bonus += next1;
                if (next2 !== undefined) bonus += next2;
                cumulative += 10 + bonus;
                rollIndex += 1; 
            } else if (isSpare) {
                let bonus = 0;
                const next1 = flatRolls[rollIndex + 2];
                if (next1 !== undefined) bonus += next1;
                cumulative += 10 + bonus;
                rollIndex += 2;
            } else {
                const frameSum = frame.reduce((a, b) => a + b, 0);
                cumulative += frameSum;
                rollIndex += frame.length; 
            }
            totals.push(cumulative);
        }
        
        return totals;
    };

    const runningTotals = calculateRunningTotals(rolls);
    const totalScore = Math.max(...runningTotals, 0);

    // Auto-save progress to Supabase
    const saveProgress = async (currentRolls: number[][]) => {
        if (!selectedPlayer) return;

        const payload = {
            player_name: selectedPlayer,
            frame_scores: currentRolls,
            total_score: Math.max(...calculateRunningTotals(currentRolls), 0),
            match_type: matchType,
            alley: alley,
            event_name: eventName,
            game_number: gameNumber,
            tournament_tier: tournamentTier,
            status: 'in_progress',
            version: 1
        };

        if (sessionId) {
            await supabase.from('scores').update(payload).eq('id', sessionId);
        } else {
            const { data } = await supabase.from('scores').insert(payload).select().single();
            if (data) setSessionId(data.id);
        }
    };

    const getAvailableKeys = () => {
        if (activeFrame > 9) return [];
        const currentFrame = rolls[activeFrame];
        
        if (activeFrame < 9) {
            if (currentFrame.length === 0) {
                return ['0','1','2','3','4','5','6','7','8','9','X'];
            } else if (currentFrame.length === 1) {
                const firstRoll = currentFrame[0];
                const maxPins = 9 - firstRoll;
                const keys = Array.from({length: maxPins + 1}, (_, i) => i.toString());
                keys.push('/');
                return keys;
            }
        } else {
            if (currentFrame.length === 0) {
                return ['0','1','2','3','4','5','6','7','8','9','X'];
            } else if (currentFrame.length === 1) {
                if (currentFrame[0] === 10) return ['0','1','2','3','4','5','6','7','8','9','X'];
                const maxPins = 9 - currentFrame[0];
                const keys = Array.from({length: maxPins + 1}, (_, i) => i.toString());
                keys.push('/');
                return keys;
            } else if (currentFrame.length === 2) {
                const sum = currentFrame[0] + currentFrame[1];
                if (sum >= 10) {
                    return ['0','1','2','3','4','5','6','7','8','9','X'];
                }
                return [];
            }
        }
        return [];
    };

    const handleKeyClick = (key: string) => {
        if (activeFrame > 9) return;
        
        const newRolls = [...rolls];
        const currentFrame = [...newRolls[activeFrame]];

        if (key === 'X') {
            currentFrame.push(10);
            if (activeFrame < 9) {
                newRolls[activeFrame] = currentFrame;
                setActiveFrame(prev => prev + 1);
            } else {
                newRolls[activeFrame] = currentFrame;
            }
        } else if (key === '/') {
            const pinsNeeded = 10 - currentFrame[0];
            currentFrame.push(pinsNeeded);
            if (activeFrame < 9) {
                newRolls[activeFrame] = currentFrame;
                setActiveFrame(prev => prev + 1);
            } else {
                newRolls[activeFrame] = currentFrame;
            }
        } else {
            const val = parseInt(key);
            currentFrame.push(val);
            if (activeFrame < 9) {
                if (currentFrame.length === 2) {
                    newRolls[activeFrame] = currentFrame;
                    setActiveFrame(prev => prev + 1);
                } else {
                    newRolls[activeFrame] = currentFrame;
                }
            } else {
                newRolls[activeFrame] = currentFrame;
                if (currentFrame.length === 2 && currentFrame[0] + currentFrame[1] < 10) {
                    setActiveFrame(10); // End of game
                } else if (currentFrame.length === 3) {
                    setActiveFrame(10); // End of game
                }
            }
        }

        setRolls(newRolls);
        saveProgress(newRolls);
    };

    const deleteLastRoll = () => {
        const newRolls = [...rolls];
        let frameToEdit = activeFrame;
        
        if (frameToEdit > 9) frameToEdit = 9;
        
        if (newRolls[frameToEdit].length === 0 && frameToEdit > 0) {
            frameToEdit--;
            setActiveFrame(frameToEdit);
        }

        if (newRolls[frameToEdit].length > 0) {
            newRolls[frameToEdit].pop();
            setRolls(newRolls);
            saveProgress(newRolls);
        }
    };

    const handleScoreSubmit = async () => {
        if (!selectedPlayer) {
            setMessage({ type: 'error', text: 'Select a player first' });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                player_name: selectedPlayer,
                frame_scores: rolls,
                total_score: totalScore,
                match_type: matchType,
                alley: alley,
                event_name: eventName,
                game_number: gameNumber,
                tournament_tier: tournamentTier,
                status: 'completed',
                version: (pendingSession?.version || 0) + 1
            };

            const { error } = await supabase
                .from('scores')
                .upsert(payload, { onConflict: 'id' });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Score locked in successfully!' });
            
            // Increment Game Number and clear scorecard for next game
            setGameNumber(prev => Math.min(prev + 1, 12));
            setRolls(Array.from({ length: 10 }, () => []));
            setActiveFrame(0);
            setSessionId(null);
            setPendingSession(null);

        } catch (err) {
            console.error("Submission Error:", err);
            setMessage({ type: 'error', text: 'Failed to lock game. Check connection.' });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-navy text-white pb-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-strike/5 blur-[120px] rounded-full -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-bat-blue/5 blur-[100px] rounded-full -ml-32 -mb-32" />

            <div className="max-w-4xl mx-auto px-4 pt-12 relative z-10">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-wordmark uppercase tracking-tight mb-2">Log Score</h1>
                        <p className="text-strike text-[10px] font-black uppercase tracking-[3px] italic">Kenya Unit {'//'} Telemetry Feed</p>
                    </div>
                    <button 
                        onClick={() => router.push('/dashboard/player')}
                        className="px-6 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-gray-400 hover:text-white"
                    >
                        Return to Dashboard
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                    <div className="md:col-span-12">
                         <div className="bg-navy-dark/40 border border-white/10 p-4 rounded-2xl">
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                 <div className="space-y-2">
                                     <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Select Player</label>
                                     <select 
                                         className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-[11px] font-black uppercase outline-none focus:border-strike transition-all"
                                         value={selectedPlayer}
                                         onChange={(e) => setSelectedPlayer(e.target.value)}
                                     >
                                         <option value="">-- Choose Unit Member --</option>
                                         {playmasters.map(b => (
                                             <option key={b.bowler_name} value={b.bowler_name}>{b.bowler_name}</option>
                                         ))}
                                     </select>
                                 </div>
                                 <div className="space-y-2">
                                     <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Bowling Alley</label>
                                     <input 
                                        type="text"
                                        placeholder="e.g. Strikez Westgate"
                                        className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-[11px] font-black uppercase outline-none focus:border-strike transition-all"
                                        value={alley}
                                        onChange={(e) => setAlley(e.target.value)}
                                     />
                                 </div>
                                 <div className="space-y-2">
                                     <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Event Name</label>
                                     <input 
                                        type="text"
                                        placeholder="e.g. Charity Open X"
                                        className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-[11px] font-black uppercase outline-none focus:border-strike transition-all"
                                        value={eventName}
                                        onChange={(e) => setEventName(e.target.value)}
                                     />
                                 </div>
                                 <div className="grid grid-cols-2 gap-2">
                                     <div className="space-y-2">
                                         <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Game #</label>
                                         <input 
                                            type="number"
                                            min="1"
                                            max="12"
                                            className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-[11px] font-black uppercase outline-none focus:border-strike transition-all"
                                            value={gameNumber}
                                            onChange={(e) => setGameNumber(parseInt(e.target.value))}
                                         />
                                     </div>
                                     <div className="space-y-2">
                                         <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Phase</label>
                                         <select 
                                            className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-[11px] font-black uppercase outline-none focus:border-strike transition-all"
                                            value={tournamentTier}
                                            onChange={(e) => setTournamentTier(e.target.value)}
                                         >
                                             {MATCH_PHASES.map(p => (
                                                 <option key={p.value} value={p.value} className="bg-navy">{p.label}</option>
                                             ))}
                                         </select>
                                     </div>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Session Restore Banner */}
                {pendingSession && (
                    <div className="mb-8 bg-strike border-l-8 border-navy-dark p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-4">
                        <div className="text-navy-dark">
                            <p className="text-xs font-black uppercase tracking-widest mb-1">Active Session Detected</p>
                            <p className="text-sm font-bold">Resuming session from {new Date(pendingSession.updated_at).toLocaleTimeString()}</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={resumeSession}
                                className="px-8 py-3 bg-navy-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                            >
                                Resume Progress
                            </button>
                            <button 
                                onClick={startFresh}
                                className="px-8 py-3 bg-white/20 text-navy-dark border border-navy-dark/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all"
                            >
                                Start Fresh
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Scorecard View */}
                <div className="bg-navy-dark border border-white/10 rounded-[32px] overflow-hidden shadow-2xl mb-8">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-navy-dark to-navy">
                        <div>
                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-[4px]">Live Card</span>
                            <p className="text-xl font-wordmark text-white uppercase">{selectedPlayer || 'System Unassigned'}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black uppercase text-strike tracking-[4px] animate-pulse">Total Score</span>
                            <p className="text-5xl font-wordmark text-white leading-none">{totalScore}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto p-4 custom-scrollbar">
                        <div className="min-w-[800px] flex gap-2">
                            {Array.from({ length: 10 }).map((_, fIdx) => (
                                <div 
                                    key={fIdx} 
                                    className={`flex-1 rounded-2xl border transition-all duration-300 ${activeFrame === fIdx ? 'bg-strike/5 border-strike shadow-[0_0_20px_rgba(232,32,48,0.1)]' : 'bg-navy border-white/5 opacity-50'}`}
                                >
                                    <div className={`text-[10px] font-black text-center py-2 border-b uppercase tracking-widest ${activeFrame === fIdx ? 'border-strike/20 text-strike' : 'border-white/5 text-gray-600'}`}>
                                        Frame {fIdx + 1}
                                    </div>
                                    <div className="flex border-b border-white/5 h-12">
                                        <div className="flex-1 border-r border-white/5 flex items-center justify-center font-wordmark text-lg">
                                            {fIdx < 9 ? (
                                                rolls[fIdx][0] === 10 ? '' : (rolls[fIdx][0] === 0 ? '-' : rolls[fIdx][0])
                                            ) : (
                                                rolls[fIdx][0] === 10 ? 'X' : (rolls[fIdx][0] === 0 ? '-' : rolls[fIdx][0])
                                            )}
                                        </div>
                                        <div className="flex-1 flex items-center justify-center font-wordmark text-lg border-r border-white/5 last:border-0">
                                            {fIdx < 9 ? (
                                                rolls[fIdx].length > 0 && rolls[fIdx][0] === 10 ? 'X' : (
                                                    rolls[fIdx].length > 1 ? (
                                                        rolls[fIdx][0] + rolls[fIdx][1] === 10 ? '/' : (rolls[fIdx][1] === 0 ? '-' : rolls[fIdx][1])
                                                    ) : ''
                                                )
                                            ) : (
                                                rolls[fIdx].length > 1 ? (
                                                    rolls[fIdx][0] === 10 ? (rolls[fIdx][1] === 10 ? 'X' : rolls[fIdx][1]) : (
                                                        rolls[fIdx][0] + rolls[fIdx][1] === 10 ? '/' : (rolls[fIdx][1] === 0 ? '-' : rolls[fIdx][1])
                                                    )
                                                ) : ''
                                            )
                                            }
                                        </div>
                                        {fIdx === 9 && (
                                            <div className="flex-1 flex items-center justify-center font-wordmark text-lg">
                                                {rolls[fIdx].length > 2 ? (
                                                    rolls[fIdx][2] === 10 ? 'X' : (
                                                        rolls[9][1] + rolls[9][2] === 10 && rolls[9][1] !== 10 ? '/' : (rolls[fIdx][2] === 0 ? '-' : rolls[fIdx][2])
                                                    )
                                                ) : ''}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`h-12 flex items-center justify-center font-wordmark text-2xl ${activeFrame === fIdx ? 'text-strike' : 'text-gray-700'}`}>
                                        {runningTotals[fIdx] || '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-8">
                        <div className="bg-navy-dark/60 border border-white/10 p-6 rounded-[32px] shadow-xl">
                            <div className="flex flex-wrap justify-center gap-3">
                                {['0','1','2','3','4','5','6','7','8','9','X','/'].map((key) => {
                                    const isAvailable = getAvailableKeys().includes(key);
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => handleKeyClick(key)}
                                            disabled={!isAvailable || isSubmitting}
                                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl font-wordmark transition-all transform active:scale-95 ${
                                                isAvailable 
                                                ? 'bg-navy border border-white/10 text-white hover:border-strike hover:text-strike hover:shadow-[0_0_15px_rgba(232,32,48,0.2)]' 
                                                : 'bg-white/[0.02] text-gray-800 border-transparent cursor-not-allowed opacity-20'
                                            } ${key === 'X' || key === '/' ? 'text-strike bg-strike/10' : ''}`}
                                        >
                                            {key}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={deleteLastRoll}
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-8 h-16 sm:h-20 bg-navy border border-white/10 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:border-white/20 transition-all"
                                >
                                    Delete Last
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-4 space-y-4">
                        <button 
                            disabled={activeFrame < 10 || isSubmitting}
                            onClick={handleScoreSubmit}
                            className={`w-full py-8 rounded-[32px] font-wordmark text-2xl uppercase tracking-tighter transition-all relative overflow-hidden group ${activeFrame >= 10 ? 'bg-strike text-white shadow-[0_20px_40px_rgba(232,32,48,0.3)] hover:-translate-y-1' : 'bg-white/5 text-gray-700 cursor-not-allowed'}`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>Lock in Final Score <span className="text-3xl">🏁</span></>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </button>
                        
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-strike animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cloud Syncing Live Progress</p>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 font-black uppercase tracking-widest text-[11px] z-50 ${message.type === 'success' ? 'bg-strike text-white' : 'bg-red-600 text-white'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}
