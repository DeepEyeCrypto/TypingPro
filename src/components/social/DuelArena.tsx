import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@src/stores/authStore';
import { friendService } from '@src/services/friendService';
import { db } from '@src/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TypingField } from '../TypingField';
import { invoke } from '@tauri-apps/api/core';

interface Props {
    duelId: string;
    onEnd: () => void;
}

export const DuelArena: React.FC<Props> = ({ duelId, onEnd }) => {
    const { profile, user } = useAuthStore();
    const [duelData, setDuelData] = useState<any>(null);
    const [input, setInput] = useState('');
    const [myProgress, setMyProgress] = useState(0);
    const [text, setText] = useState('Waiting for data stream...');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [countdown, setCountdown] = useState(5);
    const [finished, setFinished] = useState(false);
    const [result, setResult] = useState<'victory' | 'defeat' | null>(null);
    const [myWpm, setMyWpm] = useState(0);

    const isChallenger = user?.id === duelData?.challenger;

    useEffect(() => {
        if (!duelId) return;

        const unsub = onSnapshot(doc(db, 'active_duels', duelId), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setDuelData(data);
                if (data.text && text === 'Waiting for data stream...') {
                    setText(data.text);
                }

                if (data.status === 'finished' && !finished) {
                    setFinished(true);
                    setResult(data.winnerUid === user?.id ? 'victory' : 'defeat');
                }
            }
        });

        invoke('update_presence', {
            state: 'In 1v1 Duel',
            details: 'Preparing for battle...'
        });

        return () => unsub();
    }, [duelId, user?.id]);

    useEffect(() => {
        if (duelData?.status === 'in_progress' && countdown > 0) {
            const t = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(t);
        } else if (countdown === 0 && !startTime && !finished) {
            setStartTime(Date.now());
            invoke('update_presence', { state: 'In 1v1 Duel', details: 'Typing at light speed!' });
        }
    }, [duelData?.status, countdown, startTime, finished]);

    const handleKeyDown = useCallback((e: any) => {
        if (countdown > 0 || finished) return;

        const char = e.key;
        if (char.length !== 1) return;

        const nextInput = input + char;
        if (text.startsWith(nextInput)) {
            const nextInputVal = nextInput;
            setInput(nextInputVal);
            const progress = (nextInputVal.length / text.length) * 100;

            const elapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60;
            const wpm = elapsed > 0 ? Math.round((nextInputVal.length / 5) / elapsed) : 0;

            setMyWpm(wpm);
            setMyProgress(progress);

            const role = isChallenger ? 'challenger' : 'opponent';
            friendService.updateDuelProgress(duelId, role, progress, wpm);

            if (nextInputVal === text && !finished) {
                setFinished(true);
                setResult('victory');
                const loserUid = isChallenger ? duelData?.opponent : duelData?.challenger;
                friendService.finalizeDuel(duelId, user!.id, loserUid);
            }
        }
    }, [input, text, countdown, finished, duelId, user?.id, duelData, startTime, isChallenger]);

    const oppProgress = isChallenger ? duelData?.opponentProgress : duelData?.challengerProgress;
    const oppWpm = isChallenger ? duelData?.opponentWPM : duelData?.challengerWPM;
    const oppName = isChallenger ? (duelData?.opponentName || 'Opponent') : (duelData?.challengerName || 'Challenger');
    const oppAvatar = isChallenger ? duelData?.opponentAvatar : duelData?.challengerAvatar;

    if (result) {
        return (
            <div className="w-full h-full flex items-center justify-center p-8 animate-in zoom-in duration-500">
                <Card blurLevel="l3" className={`w-full max-w-2xl p-12 text-center border-2 ${result === 'victory' ? 'border-black shadow-xl' : 'border-black/10 bg-black/5'}`}>
                    <div className="text-8xl mb-6 grayscale">{result === 'victory' ? '🏆' : '💀'}</div>
                    <h1 className={`text-6xl font-black uppercase tracking-[0.2em] mb-4 ${result === 'victory' ? 'text-black' : 'text-black opacity-40'}`}>
                        {result === 'victory' ? 'Victory' : 'Defeated'}
                    </h1>
                    <p className="text-black opacity-40 font-bold uppercase tracking-widest mb-8">Duel_Protocol_Terminated</p>

                    <div className="grid grid-cols-2 gap-8 mb-12">
                        <div className="p-6 bg-black/5 rounded-2xl">
                            <div className="text-4xl font-black text-black">{myWpm}</div>
                            <div className="text-[10px] font-bold text-black opacity-30 uppercase tracking-widest mt-1">Your_WPM</div>
                        </div>
                        <div className="p-6 bg-black/5 rounded-2xl">
                            <div className="text-4xl font-black text-black">{oppWpm || 0}</div>
                            <div className="text-[10px] font-bold text-black opacity-30 uppercase tracking-widest mt-1">Opponent_WPM</div>
                        </div>
                    </div>

                    <Button variant="outline" size="xl" onClick={onEnd} className="w-full">
                        RETURN_TO_BASE
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white/40 backdrop-blur-xl flex flex-col p-8 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-black/5 border border-black/10 rounded-full">
                        <span className="text-[10px] font-black tracking-widest uppercase italic text-black">Active_Combat_Zone</span>
                    </div>
                </div>
                {countdown > 0 && (
                    <div className="absolute left-1/2 top-1/4 -translate-x-1/2 text-9xl font-black text-black animate-pulse z-50">
                        {countdown}
                    </div>
                )}
                <Button variant="ghost" size="sm" onClick={onEnd} className="opacity-50 hover:opacity-100">TERMINATE</Button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-8 mb-8">
                {/* Me */}
                <Card className="p-6 bg-black/5 border-black/10">
                    <div className="flex items-center gap-4 mb-4">
                        <img src={profile?.avatar_url} className="w-12 h-12 rounded-full border border-black/10" alt="" />
                        <div className="flex-1">
                            <div className="text-xs font-black text-black uppercase">{profile?.username}</div>
                            <div className="w-full h-1 bg-black/5 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-black transition-all duration-300 shadow-md" style={{ width: `${myProgress}%` }}></div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-black">{myWpm}</div>
                            <div className="text-[8px] text-black opacity-30 uppercase font-bold">WPM</div>
                        </div>
                    </div>
                </Card>

                {/* Opponent */}
                <Card className="p-6 bg-black/5 border-black/10">
                    <div className="flex items-center gap-4 mb-4">
                        <img src={oppAvatar || 'https://via.placeholder.com/48'} className="w-12 h-12 rounded-full border border-black/10" alt="" />
                        <div className="flex-1">
                            <div className="text-xs font-black text-black uppercase">{oppName}</div>
                            <div className="w-full h-1 bg-black/5 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-black opacity-40 transition-all duration-300" style={{ width: `${oppProgress || 0}%` }}></div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-black">{oppWpm || 0}</div>
                            <div className="text-[8px] text-black opacity-30 uppercase font-bold">WPM</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Typing Zone */}
            <div className="flex-1 min-h-0 relative">
                {duelData?.status === 'pending' && <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 rounded-3xl flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
                    <div className="text-black font-black uppercase tracking-[0.4em] animate-pulse">Waiting_For_Opponent...</div>
                    <Button variant="ghost" size="sm" onClick={onEnd} className="text-black opacity-20 hover:opacity-100 mt-8">CANCEL_CHALLENGE</Button>
                </div>}
                {countdown > 0 && duelData?.status === 'in_progress' && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-40 rounded-3xl flex items-center justify-center">
                    <div className="text-black opacity-20 font-black uppercase tracking-[1em] animate-pulse">Initializing_Sync...</div>
                </div>}
                <div className="h-full rounded-3xl bg-black/5 p-12 border border-black/10 overflow-y-auto">
                    <TypingField
                        targetText={text}
                        input={input}
                        active={true}
                        onKeyDown={handleKeyDown}
                        isPaused={false}
                    />
                </div>
            </div>
        </div>
    );
};

