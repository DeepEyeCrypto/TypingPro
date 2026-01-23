import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, AlertTriangle, Share2, Award, ArrowRight, X } from 'lucide-react';
import { Button } from '../../ui/Button';

interface MissionResultProps {
    isOpen: boolean;
    state: 'SUCCESS' | 'FAILURE';
    wpm: number;
    accuracy: number;
    failureReason?: string | null;
    onClose: () => void;
    onShare?: () => void;
}

export const MissionResult: React.FC<MissionResultProps> = ({
    isOpen,
    state,
    wpm,
    accuracy,
    failureReason,
    onClose,
    onShare
}) => {
    if (!isOpen) return null;

    const isSuccess = state === 'SUCCESS';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-xl"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-2xl glass-panel p-12 shadow-2xl overflow-hidden rounded-[4rem]"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {/* Background Glow */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-[120px] opacity-20 pointer-events-none ${isSuccess ? 'bg-[var(--text-accent)]' : 'bg-red-500'}`} />

                    {/* Status Label */}
                    <div className="flex justify-center mb-8">
                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-[0.3em] uppercase backdrop-blur-md ${isSuccess
                            ? 'bg-[var(--text-accent)]/10 text-[var(--text-accent)] border-[var(--text-accent)]/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>
                            {isSuccess ? 'MISSION_READY' : 'TERMINATION_LOG'}
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                            className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl backdrop-blur-xl border ${isSuccess
                                ? 'bg-[var(--text-accent)]/20 border-[var(--text-accent)]/30 text-[var(--text-accent)]'
                                : 'bg-red-500/20 border-red-500/30 text-red-500'}`}
                        >
                            {isSuccess ? <Trophy size={48} /> : <AlertTriangle size={48} />}
                        </motion.div>

                        <h1 className="text-6xl font-black tracking-tighter mb-2 uppercase leading-none italic">
                            {isSuccess ? 'DECODED' : 'FRACTURED'}
                        </h1>

                        <p className="text-[var(--text-secondary)] font-bold text-[10px] uppercase tracking-[0.4em] mb-12 opacity-60">
                            {isSuccess ? 'Elite_Status_Synchronized' : 'Operational_Failure_Detained'}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6 w-full mb-12">
                            <div className="glass-panel rounded-[2.5rem] p-8 relative group overflow-hidden transition-all hover:bg-[var(--glass-hover)] shadow-inner">
                                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-accent)] font-black mb-2">VELOCITY_LOG</div>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-5xl font-black tracking-tighter">{wpm}</span>
                                    <span className="text-xs font-black opacity-40">WPM</span>
                                </div>
                            </div>
                            <div className="glass-panel rounded-[2.5rem] p-8 relative group overflow-hidden transition-all hover:bg-[var(--glass-hover)] shadow-inner">
                                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-accent)] font-black mb-2">PRECISION_LOG</div>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-5xl font-black tracking-tighter">{accuracy}</span>
                                    <span className="text-xs font-black opacity-40">%</span>
                                </div>
                            </div>
                        </div>

                        {/* Failure Reason */}
                        {!isSuccess && failureReason && (
                            <div className="w-full bg-red-500/5 border border-red-500/10 rounded-[2rem] p-6 mb-12 text-left backdrop-blur-md">
                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="text-red-500 shrink-0" size={20} />
                                    <div>
                                        <div className="text-[10px] font-black text-red-500/60 uppercase tracking-[0.2em] mb-1">SYSTEM_ERROR_REPORT</div>
                                        <div className="text-xs text-[var(--text-primary)] font-medium leading-relaxed uppercase tracking-wider">{failureReason}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                            <button
                                className="w-full md:flex-1 py-4 rounded-2xl glass-panel hover:bg-[var(--glass-hover)] font-black text-[10px] uppercase tracking-[0.3em] transition-all opacity-40 hover:opacity-100"
                                onClick={onClose}
                            >
                                ABORT_TO_BASE
                            </button>

                            <button
                                className={`w-full md:flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl transition-all hover:scale-[1.05] active:scale-95 ${isSuccess
                                    ? 'bg-[var(--text-accent)] text-white shadow-[var(--text-accent)]/20'
                                    : 'bg-[var(--text-primary)] text-black'}`}
                                onClick={isSuccess ? (onShare || onClose) : onClose}
                                style={isSuccess ? {} : { color: 'var(--glass-bg)' }}
                            >
                                {isSuccess ? 'Share_Sync' : 'Retry Protocol'}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors opacity-40 hover:opacity-100"
                    >
                        <X size={20} />
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
