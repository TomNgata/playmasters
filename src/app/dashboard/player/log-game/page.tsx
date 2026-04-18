'use client';
export const dynamic = 'force-dynamic';

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
    const [message, setMessage] = useState<{type: 'error'|'success'|'info', text: string} | null>(null);

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
                if (currentFrame[0] === 10 && currentFrame[1] === 10) {
                    return ['0','1','2','3','4','5','6','7','8','9','X'];
                } else if (currentFrame[0] === 10 && currentFrame[1] !== 10) {
                    const maxPins = 9 - currentFrame[1];
                    const keys = Array.from({length: maxPins + 1}, (_, i) => i.toString());
                    keys.push('/');
                    return keys;
                } else if (currentFrame[0] + currentFrame[1] === 10) {
                    return ['0','1','2','3','4','5','6','7','8','9','X'];
                }
            }
        }
        return [];
    };

    const handleKeypress = (key: string) => {
        const newRolls = [...rolls.map(r => [...r])]; 
        let currentFrameIdx = activeFrame;
        
        if (key === 'del') {
            if (currentFrameIdx > 9) currentFrameIdx = 9;
            if (newRolls[currentFrameIdx] && newRolls[currentFrameIdx].length > 0) {
                newRolls[currentFrameIdx].pop();
            } else if (currentFrameIdx > 0) {
                currentFrameIdx--;
                if (newRolls[currentFrameIdx].length > 0) {
                   newRolls[currentFrameIdx].pop();
                }
            }
            setActiveFrame(currentFrameIdx);
            setRolls(newRolls);
            saveProgress(newRolls);
            return;
        }

        if (activeFrame > 9) return;

        const currentFrame = newRolls[currentFrameIdx];
        let value = 0;
        
        if (key === 'X') value = 10;
        else if (key === '/') value = 10 - currentFrame[0];
        else value = parseInt(key);

        currentFrame.push(value);

        if (currentFrameIdx < 9) {
            if (value === 10 || currentFrame.length === 2) {
                currentFrameIdx++;
            }
        } else {
            const isStrikeOrSpare = currentFrame[0] === 10 || (currentFrame[0] + (currentFrame[1] || 0)) >= 10;
            if ((currentFrame.length === 2 && !isStrikeOrSpare) || currentFrame.length === 3) {
                currentFrameIdx++; 
            }
        }
        
        setActiveFrame(currentFrameIdx);
        setRolls(newRolls);
        saveProgress(newRolls);
    };

    const renderRollValue = (frameIndex: number, rollIndex: number) => {
        const frame = rolls[frameIndex];
        if (!frame || frame[rollIndex] === undefined) return '';
        const val = frame[rollIndex];
        if (frameIndex < 9) {
            if (rollIndex === 0 && val === 10) return 'X';
            if (rollIndex === 1 && frame[0] + val === 10) return '/';
            if (val === 0) return '-';
            return val.toString();
        } else {
            if (rollIndex === 0 && val === 10) return 'X';
            if (rollIndex === 1) {
                if (val === 10) return 'X';
                if (frame[0] !== 10 && frame[0] + val === 10) return '/';
            }
            if (rollIndex === 2) {
                if (val === 10) return 'X';
                if (frame[1] !== 10 && frame[1] + val === 10) return '/';
            }
            if (val === 0) return '-';
            return val.toString();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!selectedPlayer) {
            setMessage({ type: 'error', text: 'Select player first.' });
            return;
        }

        setIsSubmitting(true);

        const { error } = await supabase.from('scores').upsert({
            id: sessionId || undefined,
            total_score: totalScore,
            frame_scores: rolls,
            player_name: selectedPlayer,
            match_type: matchType,
            alley: alley,
            event_name: eventName,
            game_number: gameNumber,
            tournament_tier: tournamentTier,
            status: 'completed',
            version: 1,
            updated_at: new Date().toISOString()
        });

        setIsSubmitting(false);

        if (error) {
            setMessage({ type: 'error', text: 'Failed to lock game.' });
        } else {
            setMessage({ type: 'success', text: `${selectedPlayer}'s Game ${gameNumber} locked! Ready for Game ${gameNumber + 1}.` });
            
            // Prepare for next game immediately
            setRolls(Array.from({ length: 10 }, () => []));
            setActiveFrame(0);
            setSessionId(null);
            setGameNumber(prev => prev + 1);
            
            // Clear message after a few seconds
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const availableKeys = getAvailableKeys();

    return (
        <div className="min-h-screen bg-navy-dark text-white pb-24 font-ui">
            <div className="py-12 max-w-4xl mx-auto px-4">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-wordmark uppercase tracking-tight text-white mb-2">
                        Log <span className="text-strike">Scorecard</span>
                    </h1>
                    <p className="text-gray-400 text-[10px] tracking-[4px] uppercase italic">
                        Multi-User Session Continuation Enabled
                    </p>
                </header>

                <div className="mb-6 flex justify-between items-center bg-navy/50 p-2 rounded-xl border border-white/5">
                    <button 
                        onClick={() => router.push('/dashboard/player')}
                        className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-strike transition-colors"
                    >
                        <span className="text-sm">←</span> Return to Dashboard
                    </button>
                    <div className="px-4 py-2 text-[8px] font-black uppercase tracking-[3px] text-strike/60 animate-pulse">
                        Session Active
                    </div>
                </div>

                <div className="bg-navy border border-white/5 p-4 md:p-6 rounded-2xl relative overflow-hidden space-y-8 shadow-2xl">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-strike to-bat-blue"></div>
                    
                    {message && (
                        <div className={`p-4 rounded-lg font-bold text-center text-sm ${
                            message.type === 'error' ? 'bg-strike/10 border border-strike/30 text-strike' : 
                            message.type === 'info' ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400' :
                            'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Resume Session Banner */}
                    {pendingSession && (
                        <div className="bg-strike/20 border border-strike/40 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="text-center md:text-left">
                                <p className="font-wordmark uppercase tracking-wider text-sm">Active Session Detected</p>
                                <p className="text-[10px] text-gray-400 uppercase">Resumed from {new Date(pendingSession.updated_at || pendingSession.created_at).toLocaleTimeString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={startFresh} className="px-4 py-2 rounded-lg bg-white/5 text-[10px] uppercase font-bold hover:bg-white/10">Start Fresh</button>
                                <button onClick={resumeSession} className="px-4 py-2 rounded-lg bg-strike text-white text-[10px] uppercase font-bold shadow-lg shadow-strike/20 hover:scale-105 transition-transform">Resume Progress</button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <select 
                                value={selectedPlayer}
                                onChange={(e) => setSelectedPlayer(e.target.value)}
                                className="w-full bg-navy-dark border border-white/10 rounded-xl px-4 py-3 text-white font-black uppercase tracking-widest text-sm outline-none focus:border-strike transition-all appearance-none cursor-pointer"
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
                            <select
                                value={matchType}
                                onChange={(e) => setMatchType(e.target.value)}
                                className="w-full bg-navy-dark border border-white/10 rounded-xl px-4 py-3 text-white font-black uppercase tracking-widest text-sm outline-none focus:border-strike transition-all appearance-none cursor-pointer"
                            >
                                {MATCH_TYPES.map(mt => (
                                    <option key={mt.value} value={mt.value} className="bg-navy text-white">
                                        {mt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="BOWLING ALLEY (E.G. STRIKEZ WESTGATE)"
                                value={alley}
                                onChange={(e) => {
                                    const val = e.target.value.toUpperCase();
                                    setAlley(val);
                                    saveProgress(rolls); // Optional: Trigger save on blur might be better but for consistency:
                                }}
                                onBlur={() => saveProgress(rolls)}
                                className="w-full bg-navy-dark border border-white/10 rounded-xl px-4 py-3 text-white font-black uppercase tracking-widest text-[10px] outline-none focus:border-strike transition-all"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] text-gray-500 font-bold tracking-widest uppercase pointer-events-none">ALLEY</div>
                        </div>
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="EVENT NAME (E.G. CHARITY OPEN X)"
                                value={eventName}
                                onChange={(e) => {
                                    const val = e.target.value.toUpperCase();
                                    setEventName(val);
                                }}
                                onBlur={() => saveProgress(rolls)}
                                className="w-full bg-navy-dark border border-white/10 rounded-xl px-4 py-3 text-white font-black uppercase tracking-widest text-[10px] outline-none focus:border-strike transition-all"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] text-gray-500 font-bold tracking-widest uppercase pointer-events-none">EVENT</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <select
                                value={gameNumber}
                                onChange={(e) => {
                                    setGameNumber(parseInt(e.target.value));
                                }}
                                onBlur={() => saveProgress(rolls)}
                                className="w-full bg-navy-dark border border-white/10 rounded-xl px-4 py-3 text-white font-black uppercase tracking-widest text-[10px] outline-none focus:border-strike transition-all appearance-none cursor-pointer"
                            >
                                {Array.from({length: 12}, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num} className="bg-navy">Game {num}</option>
                                ))}
                            </select>
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[8px] text-gray-500 font-bold tracking-widest uppercase pointer-events-none">#</div>
                        </div>
                        <div className="relative">
                            <select
                                value={tournamentTier}
                                onChange={(e) => setTournamentTier(e.target.value)}
                                onBlur={() => saveProgress(rolls)}
                                className="w-full bg-navy-dark border border-white/10 rounded-xl px-4 py-3 text-white font-black uppercase tracking-widest text-[10px] outline-none focus:border-strike transition-all appearance-none cursor-pointer"
                            >
                                {MATCH_PHASES.map(phase => (
                                    <option key={phase.value} value={phase.value} className="bg-navy">{phase.label}</option>
                                ))}
                            </select>
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[8px] text-gray-500 font-bold tracking-widest uppercase pointer-events-none">Phase</div>
                        </div>
                    </div>

                    {/* Scorecard Grid UI */}
                    <div className="overflow-x-auto pb-4 custom-scrollbar">
                        <div className="min-w-[800px] flex gap-1 border border-white/10 bg-white/5 rounded-xl p-2 select-none">
                            {Array.from({length: 10}).map((_, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => {
                                        if (i < activeFrame) setActiveFrame(i); 
                                    }}
                                    className={`flex-1 border ${activeFrame === i ? 'border-strike bg-strike/10' : 'border-white/10 bg-navy-dark'} rounded overflow-hidden flex flex-col transition-colors cursor-pointer`}
                                >
                                    <div className="text-[10px] uppercase font-black tracking-widest text-center py-1 bg-white/5 border-b border-white/10 text-gray-400">
                                        {i + 1}
                                    </div>
                                    <div className="flex border-b border-white/10 h-8">
                                        <div className="flex-1 border-r border-white/10 flex items-center justify-center font-wordmark text-sm">
                                            {renderRollValue(i, 0)}
                                        </div>
                                        <div className={`flex-1 flex items-center justify-center font-wordmark text-sm ${i === 9 ? 'border-r border-white/10' : ''}`}>
                                            {renderRollValue(i, i === 9 && rolls[i]?.[0] === 10 ? 1 : (rolls[i]?.length > 1 ? 1 : -1))}
                                        </div>
                                        {i === 9 && (
                                            <div className="flex-1 flex items-center justify-center font-wordmark text-sm">
                                                {renderRollValue(i, 2)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex items-center justify-center font-wordmark text-2xl py-2">
                                        {((rolls[i] && rolls[i].length > 0) || activeFrame > i) ? runningTotals[i] || '-' : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Keypad UI */}
                    <div className="max-w-md mx-auto bg-navy-dark p-4 rounded-xl border border-white/10 shadow-inner">
                        <div className="grid grid-cols-3 gap-2">
                            {['1','2','3','4','5','6','7','8','9','/','0','X'].map((key) => {
                                const isDisabled = !availableKeys.includes(key);
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => { if (!isDisabled) handleKeypress(key); }}
                                        disabled={isDisabled}
                                        className={`h-14 rounded-lg font-wordmark text-2xl flex items-center justify-center transition-all ${
                                            isDisabled ? 'opacity-20 bg-white/5 text-gray-500 cursor-not-allowed' : 
                                            key === 'X' || key === '/' ? 'bg-strike text-white shadow-[0_0_15px_rgba(232,32,48,0.4)] hover:bg-strike/80' : 
                                            'bg-white/10 text-white hover:bg-white/20 active:bg-white/30 hover:scale-[1.02]'
                                        }`}
                                    >
                                        {key}
                                    </button>
                                );
                            })}
                            <button
                                type="button"
                                onClick={() => handleKeypress('del')}
                                className="col-span-3 h-14 mt-2 rounded-lg font-wordmark text-2xl flex items-center justify-center transition-all bg-red-500/20 text-red-400 hover:bg-red-500/40 active:scale-[1.02]"
                            >
                                ⌫ DELETE
                            </button>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-6 mt-4">
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[3px] mb-1">Live Score</p>
                            <p className="text-6xl font-wordmark text-white tabular-nums flex items-baseline gap-2">
                                {totalScore}
                                {sessionId && <span className="text-[10px] text-emerald-500 animate-pulse uppercase tracking-widest font-ui">Cloud Syncing</span>}
                            </p>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !selectedPlayer || activeFrame < 10}
                            className="w-full md:w-auto bg-strike text-white px-10 py-4 rounded-xl font-ui font-black uppercase tracking-[3px] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(232,32,48,0.3)] active:scale-95 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        >
                            {isSubmitting ? 'Finalizing...' : 'Lock In Final Score'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

