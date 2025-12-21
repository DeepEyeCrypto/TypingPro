import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronRight, Share2, Award } from 'lucide-react';
import { Stats } from '../../types';

interface ZenStatsProps {
    isTyping: boolean;
    isComplete: boolean;
    stats: {
        wpm: number;
        accuracy: number;
        errors: number;
        timeLeft?: number;
    };
    onRestart: () => void;
    onNext?: () => void;
}

export const ZenStats: React.FC<ZenStatsProps> = ({ isTyping, isComplete, stats, onRestart, onNext }) => {
    return (
        <div className="w-full flex flex-col items-center">
            <AnimatePresence mode="wait">
                {isComplete ? (
                    /* Result Summary State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center gap-8 w-full"
                    >
                        <div className="flex gap-16">
                            <div className="flex flex-col items-center">
                                <span className="text-6xl font-black text-[var(--accent)] tabular-nums tracking-tighter">{stats.wpm}</span>
                                <span className="text-[10px] font-bold text-[var(--sub)] uppercase tracking-[0.3em] mt-2">WPM</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-6xl font-black text-[var(--main)] tabular-nums tracking-tighter">{stats.accuracy}%</span>
                                <span className="text-[10px] font-bold text-[var(--sub)] uppercase tracking-[0.3em] mt-2">Accuracy</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-6xl font-black text-[var(--error)] tabular-nums tracking-tighter">{stats.errors}</span>
                                <span className="text-[10px] font-bold text-[var(--sub)] uppercase tracking-[0.3em] mt-2">Errors</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={onRestart}
                                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--sub)]/10 hover:bg-[var(--sub)]/20 transition-all text-[var(--main)]"
                            >
                                <RotateCcw size={18} className="group-hover:rotate-[-45deg] transition-transform duration-300" />
                                <span className="text-[11px] font-black uppercase tracking-widest">Restart Test</span>
                            </button>

                            {onNext && (
                                <button
                                    onClick={onNext}
                                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--accent)] text-[var(--bg)] shadow-xl shadow-[var(--accent)]/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    <span className="text-[11px] font-black uppercase tracking-widest">Next Lesson</span>
                                    <ChevronRight size={18} />
                                </button>
                            )}

                            <button className="p-4 rounded-2xl bg-[var(--sub)]/10 hover:bg-[var(--sub)]/20 text-[var(--sub)] hover:text-[var(--main)] transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    /* In-Session Live Stats State */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-12"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-[var(--accent)] tabular-nums transition-all border-b-2 border-[var(--accent)]/20 pb-1">{stats.wpm}</span>
                            <span className="text-[8px] font-bold text-[var(--sub)] uppercase tracking-[0.2em] mt-2">wpm</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-[var(--main)] tabular-nums transition-all border-b-2 border-white/5 pb-1">{stats.accuracy}%</span>
                            <span className="text-[8px] font-bold text-[var(--sub)] uppercase tracking-[0.2em] mt-2">accuracy</span>
                        </div>
                        {stats.timeLeft !== undefined && (
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-black text-[var(--sub)] tabular-nums transition-all border-b-2 border-white/5 pb-1">{stats.timeLeft}s</span>
                                <span className="text-[8px] font-bold text-[var(--sub)] uppercase tracking-[0.2em] mt-2">time</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
