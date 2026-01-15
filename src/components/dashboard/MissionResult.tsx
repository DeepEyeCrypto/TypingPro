import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, AlertTriangle, Share2, Award, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

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
                className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/60 backdrop-blur-[64px] overflow-hidden"
            >
                {/* Background Shaders */}
                <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.9, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="relative w-full max-w-3xl"
                >
                    <div className="bg-black/30 backdrop-blur-[64px] rounded-[3.5rem] p-16 border border-white/10 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] relative overflow-hidden">

                        {/* Status Label */}
                        <div className="flex justify-center mb-12">
                            <div className={`px-6 py-2 rounded-full border text-[10px] font-black tracking-[0.4em] uppercase backdrop-blur-md ${isSuccess
                                ? 'bg-white/10 text-white border-white/20'
                                : 'bg-white/5 text-white/60 border-white/10'
                                }`}>
                                {isSuccess ? 'MISSION_READY' : 'TERMINATION_LOG'}
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="flex flex-col items-center text-center">
                            {/* Header Icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', damping: 15, delay: 0.3 }}
                                className={`w-32 h-32 rounded-full flex items-center justify-center mb-10 bg-white/10 border border-white/20 text-white shadow-2xl backdrop-blur-xl`}
                            >
                                {isSuccess ? <Trophy size={64} strokeWidth={1.5} /> : <AlertTriangle size={64} strokeWidth={1.5} />}
                            </motion.div>

                            <h1 className="text-6xl font-black tracking-tighter mb-4 text-white uppercase leading-none">
                                {isSuccess ? 'DECODED' : 'FRACTURED'}
                            </h1>

                            <p className="text-white/30 font-black text-[10px] uppercase tracking-[0.5em] mb-16">
                                {isSuccess ? 'Elite_Status_Synchronized' : 'Operational_Failure_Detained'}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-8 w-full mb-16">
                                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md relative group overflow-hidden">
                                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black mb-4">VELOCITY_LOG</div>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-7xl font-black text-white tracking-tighter">{wpm}</span>
                                        <span className="text-sm font-black text-white/40 uppercase tracking-widest">WPM</span>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md relative group overflow-hidden">
                                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black mb-4">PRECISION_LOG</div>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-7xl font-black text-white tracking-tighter">{accuracy}</span>
                                        <span className="text-sm font-black text-white/40 uppercase tracking-widest">%</span>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                                </div>
                            </div>

                            {/* Failure Reason */}
                            {!isSuccess && failureReason && (
                                <div className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-16 text-left backdrop-blur-md">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 text-white/50"><AlertTriangle size={24} /></div>
                                        <div>
                                            <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">SYSTEM_ERROR_REPORT</div>
                                            <div className="text-sm text-white/60 font-medium leading-relaxed uppercase tracking-wider">{failureReason}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-6 w-full">
                                <button
                                    className="flex-1 py-5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-[0.3em] transition-all"
                                    onClick={onClose}
                                >
                                    ABORT_TO_BASE
                                </button>

                                {isSuccess ? (
                                    <button
                                        className="flex-1 py-5 rounded-full bg-white text-black font-black text-xs uppercase tracking-[0.3em] shadow-[0_32px_64px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95"
                                        onClick={onShare}
                                    >
                                        Share_Sync
                                    </button>
                                ) : (
                                    <button
                                        className="flex-1 py-5 rounded-full bg-white text-black font-black text-xs uppercase tracking-[0.3em] shadow-[0_32px_64px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95"
                                        onClick={onClose}
                                    >
                                        RE-DEPLOY
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-12 flex justify-between items-center px-10">
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                            SECURE_STORAGE_FINALIZED // 2025
                        </div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] flex items-center">
                            <ArrowRight size={12} className="mr-3" />
                            END_TRANSMISSION
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
