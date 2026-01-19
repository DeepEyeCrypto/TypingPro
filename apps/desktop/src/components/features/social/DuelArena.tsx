import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '../../../core/store/authStore';
import { friendService } from '../../../core/friendService';
import { db } from '../../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { GlassCard } from '../../ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { TypingField } from '../typing/TypingField';
import { invoke } from '@tauri-apps/api/core';
import { Sword, Shield, Trophy, X, Zap, Target, Binary, Crown, Skull, Activity, Fingerprint, Radio, ArrowRight } from 'lucide-react';
import { getRankForWPM } from '../../../core/rankSystem';

interface Props {
    duelId: string;
    onEnd: () => void;
}

export const DuelArena: React.FC<Props> = ({ duelId, onEnd }) => {
    const { profile, user } = useAuthStore();
    const [duelData, setDuelData] = useState<any>(null);
    const [input, setInput] = useState('');
    const [myProgress, setMyProgress] = useState(0);
    const [text, setText] = useState('Initializing_Neural_Link...');
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
                if (data.text && text === 'Initializing_Neural_Link...') {
                    setText(data.text);
                }

                if (data.status === 'finished' && !finished) {
                    setFinished(true);
                    setResult(data.winnerUid === user?.id ? 'victory' : 'defeat');
                }
            }
        });

        return () => unsub();
    }, [duelId, user?.id, text, finished]);

    useEffect(() => {
        if (duelData?.status === 'in_progress' && countdown > 0) {
            const t = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(t);
        } else if (countdown === 0 && !startTime && !finished) {
            setStartTime(Date.now());
            invoke('update_presence', { state: 'In 1v1 Duel', details: 'Neural Battle in Progress' }).catch(() => { });
        }
    }, [duelData?.status, countdown, startTime, finished]);

    const handleKeyDown = useCallback((e: any) => {
        if (countdown > 0 || finished) return;

        const char = e.key;
        if (char.length !== 1 && char !== 'Backspace') return;

        if (char === 'Backspace') {
            setInput(prev => prev.slice(0, -1));
            return;
        }

        const nextInput = input + char;
        if (text.startsWith(nextInput)) {
            setInput(nextInput);
            const progress = (nextInput.length / text.length) * 100;

            const elapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60;
            const wpm = elapsed > 0 ? Math.round((nextInput.length / 5) / elapsed) : 0;

            setMyWpm(wpm);
            setMyProgress(progress);

            const role = isChallenger ? 'challenger' : 'opponent';
            friendService.updateDuelProgress(duelId, role, progress, wpm);

            if (nextInput === text && !finished) {
                setFinished(true);
                setResult('victory');
                const loserUid = isChallenger ? duelData?.opponent : duelData?.challenger;
                friendService.finalizeDuel(duelId, user!.id, loserUid);
            }
        }
    }, [input, text, countdown, finished, duelId, user?.id, duelData, startTime, isChallenger]);

    const oppProgress = isChallenger ? duelData?.opponentProgress : duelData?.challengerProgress;
    const oppWpm = isChallenger ? duelData?.opponentWPM : duelData?.challengerWPM;
    const oppName = isChallenger ? (duelData?.opponentName || 'Unknown_Entity') : (duelData?.challengerName || 'Unknown_Entity');
    const oppAvatar = isChallenger ? duelData?.opponentAvatar : duelData?.challengerAvatar;

    if (result) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/95 backdrop-blur-[50px] animate-in fade-in duration-1000 overflow-hidden">
                {/* Background Atmosphere */}
                <div className="absolute inset-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        transition={{ duration: 2 }}
                        className={`absolute inset-0 bg-gradient-to-b ${result === 'victory' ? 'from-green-500/20 via-transparent' : 'from-red-500/20 via-transparent'}`}
                    />
                    <motion.div
                        animate={{ opacity: [0.05, 0.1, 0.05] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)]"
                    />
                </div>

                <motion.div
                    initial={{ scale: 0.9, y: 30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="w-full max-w-2xl relative z-10"
                >
                    <GlassCard variant="large" className={`p-20 text-center border-2 overflow-hidden shadow-2xl ${result === 'victory' ? 'border-green-500/20 shadow-green-500/10' : 'border-red-500/20 shadow-red-500/10'}`}>
                        {/* Internal Scan Beam */}
                        <motion.div
                            animate={{ left: ['-10%', '110%'] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            className={`absolute top-0 w-px h-full blur-sm pointer-events-none z-0 ${result === 'victory' ? 'bg-green-400/20' : 'bg-red-400/20'}`}
                        />

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative z-10"
                        >
                            <div className="inline-flex p-8 rounded-[3rem] bg-white/5 border border-white/10 mb-10 shadow-inner group">
                                {result === 'victory' ? (
                                    <Trophy size={80} className="text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.4)] group-hover:scale-110 transition-transform" />
                                ) : (
                                    <Skull size={80} className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.4)] group-hover:scale-110 transition-transform" />
                                )}
                            </div>

                            <h1 className="text-7xl font-black uppercase tracking-tighter italic mb-4 leading-none" style={{ color: 'var(--text-primary)' }}>
                                {result === 'victory' ? (
                                    <span className="text-green-400">Neural_Dominance</span>
                                ) : (
                                    <span className="text-red-500">Signal_Compromised</span>
                                )}
                            </h1>
                            <p className="text-[11px] font-black uppercase tracking-[0.6em] opacity-30 mb-16 italic" style={{ color: 'var(--text-primary)' }}>Duel_Protocol_Terminated_Sequence_Complete</p>

                            <div className="grid grid-cols-2 gap-10 mb-16">
                                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center group hover:bg-white/10 transition-colors">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20 italic mb-3">Self_Throughput</span>
                                    <div className="text-5xl font-black italic tracking-tighter text-white">{myWpm}<small className="text-xs ml-2 opacity-20 not-italic">WPM</small></div>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center group hover:bg-white/10 transition-colors">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20 italic mb-3">Target_Status</span>
                                    <div className="text-5xl font-black italic tracking-tighter opacity-30 text-white">{oppWpm || 0}<small className="text-xs ml-2 opacity-20 not-italic">WPM</small></div>
                                </div>
                            </div>

                            <button
                                onClick={onEnd}
                                className={`w-full py-8 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.6em] shadow-2xl active:scale-95 transition-all border relative overflow-hidden group 
                                    ${result === 'victory'
                                        ? 'bg-green-500 text-white border-green-400/20 shadow-green-500/20 hover:shadow-green-500/40'
                                        : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-4">
                                    Return_To_Nexus
                                    <ArrowRight size={16} />
                                </span>
                                <div className="absolute inset-0 bg-white/10 translate-x-[-110%] group-hover:translate-x-0 transition-transform duration-500" />
                            </button>
                        </motion.div>
                    </GlassCard>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col p-10 bg-transparent max-w-7xl mx-auto overflow-hidden">
            {/* HEADS UP DISPLAY */}
            <div className="flex justify-between items-center mb-16 relative h-24 pb-8 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
                        <Radio size={24} className="text-[var(--text-accent)] animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-1">
                            <Activity size={12} className="text-green-500 opacity-60" />
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40 italic block" style={{ color: 'var(--text-primary)' }}>Arena_Status_Active</span>
                        </div>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none" style={{ color: 'var(--text-primary)' }}>Battle_Grid<span className="text-[var(--text-accent)]">.v4</span></h2>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {countdown > 0 && duelData?.status === 'in_progress' ? (
                        <motion.div
                            key="countdown"
                            initial={{ scale: 3, opacity: 0, filter: 'blur(20px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ scale: 0.2, opacity: 0, filter: 'blur(10px)' }}
                            className="absolute left-1/2 -translate-x-1/2 text-9xl font-black italic text-[var(--text-accent)] drop-shadow-[0_0_50px_rgba(0,243,255,0.4)]"
                        >
                            {countdown}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-16"
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-2 italic" style={{ color: 'var(--text-primary)' }}>Signal_Ping</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                                    <span className="text-sm font-black tabular-nums text-green-400">14MS</span>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-[var(--text-accent)]/20 blur-xl rounded-full" />
                                <Sword size={32} className="text-[var(--text-accent)] animate-pulse relative z-10" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-2 italic" style={{ color: 'var(--text-primary)' }}>Sync_Index</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black tabular-nums text-[var(--text-accent)]">99.9%</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)] shadow-[0_0_8px_var(--text-accent)] animate-pulse" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={onEnd}
                    className="p-5 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all opacity-40 hover:opacity-100 group shadow-2xl"
                    style={{ color: 'var(--text-primary)' }}
                >
                    <X size={20} className="group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            {/* BATTLERS ROW */}
            <div className="grid grid-cols-2 gap-10 mb-16">
                {/* Me (CHALLENGER A) */}
                <div className="relative group">
                    <GlassCard className={`p-10 rounded-[3rem] border-2 transition-all duration-700 backdrop-blur-3xl shadow-2xl ${myProgress > (oppProgress || 0) ? 'border-[var(--text-accent)]/50 bg-[var(--text-accent)]/5 shadow-[0_0_50px_var(--text-accent)]/10' : 'border-white/5'}`}>
                        <div className="flex items-center gap-8">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-[1.75rem] overflow-hidden border-2 border-[var(--text-accent)] relative shadow-2xl">
                                    <img src={profile?.avatar_url} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--text-accent)]/20 to-transparent" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--text-accent)] flex items-center justify-center border-4 border-slate-900 shadow-2xl">
                                    <Fingerprint size={10} className="text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white leading-none">{profile?.username}</h3>
                                    <div className="px-2.5 py-1 rounded-lg bg-[var(--text-accent)]/20 border border-[var(--text-accent)]/30 text-[9px] font-black text-[var(--text-accent)] uppercase tracking-widest italic shadow-inner">Origin_Node</div>
                                </div>
                                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mt-5 shadow-inner p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${myProgress}%` }}
                                        className="h-full bg-[var(--text-accent)] rounded-full shadow-[0_0_20px_var(--text-accent)] relative"
                                    >
                                        <div className="absolute top-0 right-0 w-2 h-full bg-white shadow-[0_0_10px_white] blur-[2px]" />
                                    </motion.div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-black italic text-[var(--text-accent)] tabular-nums leading-none mb-1">{myWpm}</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic" style={{ color: 'var(--text-primary)' }}>Thput_Rate</div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Opponent (CHALLENGER B) */}
                <div className="relative group">
                    <GlassCard className={`p-10 rounded-[3rem] border-2 transition-all duration-700 backdrop-blur-3xl shadow-2xl ${oppProgress > myProgress ? 'border-orange-500/50 bg-orange-500/5 shadow-[0_0_50px_rgba(249,115,22,0.1)]' : 'border-white/5'}`}>
                        <div className="flex items-center gap-8">
                            <div className="text-left">
                                <div className="text-5xl font-black italic text-orange-400 tabular-nums leading-none mb-1">{oppWpm || 0}</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic" style={{ color: 'var(--text-primary)' }}>Thput_Rate</div>
                            </div>
                            <div className="flex-1 text-right">
                                <div className="flex items-center justify-end gap-3 mb-2">
                                    <div className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[9px] font-black text-orange-400 uppercase tracking-widest italic shadow-inner">Enemy_Node</div>
                                    <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white leading-none">{oppName}</h3>
                                </div>
                                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mt-5 shadow-inner rotate-180 p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${oppProgress}%` }}
                                        className="h-full bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)] relative"
                                    >
                                        <div className="absolute top-0 right-0 w-2 h-full bg-white shadow-[0_0_10px_white] blur-[2px]" />
                                    </motion.div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="w-20 h-20 rounded-[1.75rem] overflow-hidden border-2 border-orange-500/30 relative shadow-2xl">
                                    <img src={oppAvatar || 'https://via.placeholder.com/128'} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent" />
                                </div>
                                <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center border-4 border-slate-900 shadow-2xl">
                                    <Target size={10} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* NEURAL INPUT FIELD */}
            <div className="flex-1 min-h-0 relative">
                <AnimatePresence>
                    {duelData?.status === 'pending' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#03040b]/90 backdrop-blur-[60px] z-40 rounded-[4rem] border-2 border-white/5 flex flex-col items-center justify-center p-20 text-center shadow-2xl"
                        >
                            <div className="relative mb-12">
                                <div className="absolute inset-0 bg-[var(--text-accent)]/20 blur-3xl animate-pulse rounded-full" />
                                <Binary size={80} className="text-[var(--text-accent)] relative z-10" />
                            </div>
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-6 text-white leading-none">Establishing_Neural_Link</h2>
                            <p className="max-w-md text-base font-medium opacity-40 leading-relaxed italic mb-16" style={{ color: 'var(--text-primary)' }}>Synchronizing encrypted battlefield vectors. Please focus your synaptic pathways on the target objective for maximum throughput.</p>

                            <button
                                onClick={onEnd}
                                className="px-16 py-6 rounded-[2rem] bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.6em] hover:bg-red-500 transition-all text-white group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-4">
                                    <X size={16} />
                                    ABORT_LINK_SEQUENCE
                                </span>
                                <div className="absolute inset-0 bg-red-600 translate-x-[-110%] group-hover:translate-x-0 transition-transform duration-500" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="h-full rounded-[4.5rem] bg-white/[0.02] border-2 border-white/5 p-20 lg:p-32 overflow-y-auto shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] relative group backdrop-blur-3xl">
                    {/* Internal Ultra-Scan Beam */}
                    <motion.div
                        animate={{ top: ['-10%', '110%'] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-px bg-[var(--text-accent)]/20 blur-md pointer-events-none z-0"
                    />

                    <div className="relative z-10">
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
        </div>
    );
};



