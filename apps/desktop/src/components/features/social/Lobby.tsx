import React, { useState, useEffect } from 'react';
import { matchmakingService } from '../../../core/matchmakingService';
import { useAuthStore } from '../../../core/store/authStore';
import { GlassCard } from '../../ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Zap, Loader2, ShieldX, ArrowLeft, Radio, Globe, Activity } from 'lucide-react';

interface Props {
    onBack: () => void;
    onMatchFound: (matchId: string) => void;
}

const Lobby: React.FC<Props> = ({ onBack, onMatchFound }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [statusText, setStatusText] = useState("Ready_To_Duel?");
    const { user } = useAuthStore();

    useEffect(() => {
        let interval: any;
        if (isSearching) {
            interval = setInterval(async () => {
                if (user) {
                    const matchId = await matchmakingService.findAndCreateMatch(user.name || "Typist", user.avatar_url || "");
                    if (matchId) {
                        onMatchFound(matchId);
                    }
                }
            }, 3000);
        }

        return () => {
            if (interval) clearInterval(interval);
            if (isSearching) {
                matchmakingService.leaveQueue();
                matchmakingService.stopListening();
            }
        };
    }, [isSearching, user]);

    const handleFindMatch = async () => {
        if (!user) return;
        try {
            setIsSearching(true);
            setStatusText("Scanning_For_Worthy_Signal...");
            await matchmakingService.joinQueue(user.name || "Unknown", user.avatar_url || "", 50);
            matchmakingService.listenForMatch((matchId) => {
                setStatusText("Target_Locked!_Initializing_Arena...");
                setTimeout(() => onMatchFound(matchId), 1500);
            });
        } catch (error) {
            console.error(error);
            setStatusText("Signal_Error_Retry_Protocol.");
            setIsSearching(false);
        }
    };

    const handleCancel = async () => {
        await matchmakingService.leaveQueue();
        matchmakingService.stopListening();
        setIsSearching(false);
        setStatusText("Ready_To_Duel?");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-2xl mx-auto p-6 animate-in fade-in duration-700">
            <GlassCard variant="large" className="w-full flex flex-col items-center py-20 px-12 gap-10 text-center relative overflow-hidden border-2 border-white/5 shadow-2xl">
                {/* Internal Scan Beam */}
                <motion.div
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--text-accent)] to-transparent opacity-10 blur-sm pointer-events-none z-0"
                />

                {/* NEURAL RADAR */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                    <AnimatePresence>
                        {isSearching && (
                            <>
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: 0 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 border-2 border-[var(--text-accent)] rounded-full z-0 blur-sm"
                                />
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: 0 }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                    className="absolute inset-0 border border-[var(--text-accent)]/40 rounded-full z-0"
                                />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border border-[var(--text-accent)]/10 rounded-full z-0"
                                >
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--text-accent)] rounded-full blur-md opacity-40 shadow-[0_0_20px_var(--text-accent)]" />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <div className="relative z-10 p-10 rounded-[3rem] bg-white/5 border border-white/5 backdrop-blur-3xl shadow-2xl flex flex-col items-center">
                        <AnimatePresence mode="wait">
                            {isSearching ? (
                                <motion.div
                                    key="searching"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <Radio size={48} className="text-[var(--text-accent)] animate-pulse" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="ready"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <Sword size={48} className="text-white opacity-20" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-3 relative z-10">
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic" style={{ color: 'var(--text-primary)' }}>
                        {statusText.split('_').map((word, i) => (
                            <span key={i} className={i % 2 === 1 ? 'text-[var(--text-accent)]' : ''}>{word}</span>
                        ))}
                    </h2>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-30 italic" style={{ color: 'var(--text-primary)' }}>Neural_Matchmaking_Protocol.v4</p>
                </div>

                <div className="flex flex-col gap-5 w-full max-w-sm mt-4 relative z-10">
                    {!isSearching ? (
                        <button
                            onClick={handleFindMatch}
                            className="bg-[var(--text-accent)] text-white w-full py-5 rounded-3xl text-[10px] font-black shadow-2xl uppercase tracking-[0.4em] transform transition-all active:scale-95 shadow-[var(--text-accent)]/30 hover:scale-105 flex items-center justify-center gap-3"
                        >
                            <Zap size={14} />
                            Initiate_Signal_Broadcast
                        </button>
                    ) : (
                        <button
                            onClick={handleCancel}
                            className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] transform transition-all active:scale-95 opacity-40 hover:opacity-100 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 flex items-center justify-center gap-3"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            <ShieldX size={14} />
                            Abort_Active_Search
                        </button>
                    )}
                </div>

                {/* Legend / Tip */}
                <div className="absolute bottom-10 left-0 right-0 px-12 flex justify-between opacity-20">
                    <div className="flex items-center gap-2">
                        <Activity size={10} className="text-green-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Latency: 14ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe size={10} className="text-[var(--text-accent)]" />
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Kernel: US-GLOBAL-1</span>
                    </div>
                </div>
            </GlassCard>

            <button
                onClick={onBack}
                className="mt-16 text-[11px] font-black uppercase tracking-[0.5em] transform transition-all active:scale-95 opacity-30 hover:opacity-100 flex items-center gap-3"
                style={{ color: 'var(--text-primary)' }}
            >
                <ArrowLeft size={14} />
                Return_To_Social_Hub
            </button>
        </div>
    );
};

export default Lobby;

