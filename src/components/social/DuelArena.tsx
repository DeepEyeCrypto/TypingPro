import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@src/stores/authStore';
import { friendService } from '@src/services/friendService';
import { db } from '@src/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Props {
    duelId: string;
    onEnd: () => void;
}

import { invoke } from '@tauri-apps/api/core';

export const DuelArena: React.FC<Props> = ({ duelId, onEnd }) => {
    const { profile, user } = useAuthStore();
    const [duelData, setDuelData] = useState<any>(null);
    const [input, setInput] = useState('');
    const [myProgress, setMyProgress] = useState(0);
    const [text, setText] = useState('The quick brown fox jumps over the lazy dog.'); // Example text

    useEffect(() => {
        if (!duelId) return;

        const unsub = onSnapshot(doc(db, 'active_duels', duelId), (doc) => {
            if (doc.exists()) {
                setDuelData(doc.data());
            }
        });

        // Initialize Discord Presence for Duel
        invoke('update_presence', {
            state: 'In 1v1 Duel',
            details: `Vs Opponent | Text: ${text.substring(0, 10)}...`
        });

        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key.length === 1) {
                handleKeystroke(e.key);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);

        return () => {
            unsub();
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [duelId, input, text]);

    const handleKeystroke = async (char: string) => {
        const nextInput = input + char;
        if (text.startsWith(nextInput)) {
            setInput(nextInput);
            const progress = (nextInput.length / text.length) * 100;
            const wpm = Math.floor((nextInput.length / 5) / (1 / 60)); // Placeholder

            setMyProgress(progress);
            const role = user?.id === duelData?.challenger ? 'challenger' : 'opponent';
            await friendService.updateDuelProgress(duelId, role, progress, wpm);

            if (nextInput === text) {
                // Handle victory
                invoke('update_presence', { state: 'Victory!', details: 'Won a 1v1 Duel' });
            }
        }
    };

    const myWpm = user?.id === duelData?.challenger ? duelData?.challengerWPM : duelData?.opponentWPM;
    const oppWpm = user?.id === duelData?.challenger ? duelData?.opponentWPM : duelData?.challengerWPM;
    const oppProgress = user?.id === duelData?.challenger ? duelData?.opponentProgress : duelData?.challengerProgress;

    return (
        <div className="w-full h-full bg-midnight/90 backdrop-blur-xl flex flex-col p-8 overflow-hidden animate-in fade-in duration-500">
            {/* Duel Header */}
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-6">
                    <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full animate-pulse">
                        <span className="text-[10px] font-black text-rose-500 tracking-[0.3em] uppercase">Match_Point_Live</span>
                    </div>
                </div>
                <div className="text-xl font-bold tracking-[0.2em] text-white/20 uppercase">
                    Versus_Arena <span className="text-hacker">[1V1]</span>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onEnd} className="text-rose-500/50 hover:text-rose-500">
                        TERMINATE_DUEL
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-12 relative">
                {/* Central Divider */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/5 bg-midnight flex items-center justify-center">
                        <span className="text-[10px] font-black text-white/10 uppercase italic">VS</span>
                    </div>
                </div>

                {/* Player Me Section */}
                <div className="flex-1 flex flex-col gap-6">
                    <Card className="p-8 bg-midnight/40 relative group overflow-hidden border-hacker/20">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-hacker/20 rounded-full blur-xl"></div>
                                <img src={profile?.avatar_url} alt="Me" className="w-16 h-16 rounded-full border-2 border-hacker relative z-10" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">{profile?.username} (You)</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-hacker animate-pulse"></div>
                                    <span className="text-[10px] text-hacker font-bold uppercase tracking-widest">TRANSMITTING...</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-black text-white tabular-nums leading-none">
                                    {myWpm || 0}
                                </div>
                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">REAL_TIME_WPM</div>
                            </div>
                        </div>

                        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-hacker transition-all duration-300"
                                style={{ width: `${myProgress}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                            <span>Progress_Status</span>
                            <span>{Math.round(myProgress)}%</span>
                        </div>
                    </Card>

                    <Card className="flex-1 p-8 bg-black/40 border-dashed border-white/5">
                        <div className="h-full flex items-center justify-center">
                            <span className="text-sm font-mono text-white/10 animate-pulse uppercase tracking-[0.5em]">Interactive_Zone_Active</span>
                        </div>
                    </Card>
                </div>

                {/* Opponent Section */}
                <div className="flex-1 flex flex-col gap-6">
                    <Card className="p-8 bg-midnight/40 relative group overflow-hidden border-rose-500/20">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="text-left">
                                <div className="text-4xl font-black text-white tabular-nums leading-none">
                                    {oppWpm || 0}
                                </div>
                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">OPPONENT_VELOCITY</div>
                            </div>
                            <div className="flex-1 text-right">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Target_Opponent</h3>
                                <div className="flex items-center gap-2 mt-1 justify-end">
                                    <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">INTERCEPTING_DATA...</span>
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl"></div>
                                <img src="https://via.placeholder.com/64" alt="Opponent" className="w-16 h-16 rounded-full border-2 border-rose-500 relative z-10" />
                            </div>
                        </div>

                        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-rose-500 transition-all duration-300"
                                style={{ width: `${oppProgress || 0}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                            <span>Sync_Offset_0ms</span>
                            <span>{Math.round(oppProgress || 0)}%</span>
                        </div>
                    </Card>

                    <Card className="flex-1 p-8 bg-black/20 border-white/5">
                        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                            <div className="w-12 h-12 rounded-full border-2 border-white/5 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white/5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Opponent_Stream_Ghosting</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
