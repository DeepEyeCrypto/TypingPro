import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../../../core/store/authStore';
import { getRank, RankInfo, calculateLevel } from '../../../core/rankSystem';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, ShieldCheck, Crown, Star, Activity, ArrowRight } from 'lucide-react';
import { useRustAudio } from '../../../hooks/useRustAudio';
import './RankStyles.css';

export const RankCelebration = () => {
    const { profile } = useAuthStore();
    const { playTypingSound } = useRustAudio();
    const [show, setShow] = useState(false);
    const [celebrationData, setCelebrationData] = useState<{ type: 'rank' | 'level', name: string, icon: any, color: string, level?: number } | null>(null);
    const lastRankLabel = useRef<string | null>(null);
    const lastLevel = useRef<number | null>(null);

    useEffect(() => {
        if (!profile) return;

        const currentRank = getRank(profile.highest_wpm || 0);
        const currentLevel = calculateLevel(profile.rank_points || 0);

        if (lastRankLabel.current === null) {
            lastRankLabel.current = currentRank.name;
            lastLevel.current = currentLevel;
            return;
        }

        if (currentRank.name !== lastRankLabel.current) {
            setCelebrationData({
                type: 'rank',
                name: currentRank.name,
                icon: <Crown size={120} />,
                color: currentRank.accentColor
            });
            setShow(true);
            playTypingSound('mechanical');
            lastRankLabel.current = currentRank.name;
        }
        else if (currentLevel > (lastLevel.current || 0)) {
            setCelebrationData({
                type: 'level',
                name: `Level ${currentLevel}`,
                icon: <Zap size={120} />,
                color: 'var(--text-accent)',
                level: currentLevel
            });
            setShow(true);
            playTypingSound('mechanical');
            lastLevel.current = currentLevel;
        }
    }, [profile?.highest_wpm, profile?.rank_points]);

    return (
        <AnimatePresence>
            {show && celebrationData && profile && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-8 bg-black/90 backdrop-blur-3xl overflow-hidden"
                    onClick={() => setShow(false)}
                >
                    {/* Background Visualizers */}
                    <div className="absolute inset-0 z-0">
                        <motion.div
                            animate={{ opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[50vh] bg-gradient-to-b from-transparent via-[var(--text-accent)] to-transparent opacity-10 blur-[120px]"
                        />
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="max-w-xl w-full text-center relative z-10"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="mb-10">
                            <div className="flex justify-center items-center gap-4 mb-4">
                                <div className="w-12 h-px bg-white/20" />
                                <span className="text-[11px] font-black uppercase tracking-[0.8em] opacity-40 italic" style={{ color: 'var(--text-primary)' }}>Neural_Shift_Detected</span>
                                <div className="w-12 h-px bg-white/20" />
                            </div>
                            <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-4 text-white">
                                {celebrationData.type === 'rank' ? 'Rank_Upgrade' : 'Neural_Peak'}
                            </h1>
                        </div>

                        <div className="py-20 px-12 mb-10 bg-white/5 border border-white/10 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                            {/* High Intensity Scanning Beam */}
                            <motion.div
                                animate={{ top: ['-10%', '110%'] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-40 blur-sm z-20 pointer-events-none"
                            />

                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--text-accent)]/10 opacity-20 pointer-events-none" />

                            <motion.div
                                initial={{ rotate: -10, scale: 0.8 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", damping: 10 }}
                                className="mb-10 drop-shadow-[0_0_50px_rgba(255,255,255,0.2)] flex justify-center"
                                style={{ color: celebrationData.color }}
                            >
                                {celebrationData.icon}
                            </motion.div>

                            <div className="space-y-4">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-6xl font-black italic uppercase tracking-tighter leading-none"
                                    style={{
                                        color: celebrationData.color,
                                        textShadow: `0 0 50px ${celebrationData.color}88`
                                    }}
                                >
                                    {celebrationData.name}
                                </motion.div>
                                <div className="text-[12px] font-black uppercase tracking-[0.5em] opacity-40 italic flex items-center justify-center gap-3">
                                    <Activity size={12} />
                                    Neural_Tier_Protocol_v4.5
                                </div>
                            </div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-base font-medium opacity-40 mb-12 leading-relaxed italic max-w-md mx-auto"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {celebrationData.type === 'rank'
                                ? `Your neurological throughput has exceeded previous benchmarks. Higher bandwidth nodes are now synchronized under your signature.`
                                : `Your experience in the digital flow has reached a new paradigm. Neural Level ${celebrationData.level} has been successfully established.`
                            }
                        </motion.p>

                        <button
                            className="w-full py-7 rounded-[2rem] bg-[var(--text-accent)] text-white text-[11px] font-black uppercase tracking-[0.6em] shadow-2xl shadow-[var(--text-accent)]/30 hover:scale-105 active:scale-95 transition-all border border-white/20 relative overflow-hidden group"
                            onClick={() => setShow(false)}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-4">
                                Acknowledge_Promotion
                                <ArrowRight size={16} />
                            </span>
                            <div className="absolute inset-0 bg-white/10 translate-x-[-110%] group-hover:translate-x-0 transition-transform duration-500" />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

