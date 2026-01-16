import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MissionBriefingProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: () => void;
    missionData: {
        title: string;
        targetWpm: number;
        accuracy: number;
        constraints: string[];
    };
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({ isOpen, onClose, onStart, missionData }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[64px] flex items-center justify-center p-8"
                >
                    {/* Scanner Lines Effect - Monochrome Neutral */}
                    <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(255,255,255,0.1)_50%),linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02),rgba(255,255,255,0.05))] z-10 bg-[length:100%_2px,3px_100%]" />

                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="w-full max-w-4xl relative"
                    >
                        {/* Corner Accents */}
                        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-white/20" />
                        <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-white/20" />
                        <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-white/20" />
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-white/20" />

                        <div className="bg-white/10 border-white/20 shadow-[0_64px_128px_-32px_rgba(255,255,255,0.1)]">
                            {/* Mission Header */}
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 lg:mb-16">
                                <div>
                                    <span className="text-[10px] font-black text-white opacity-30 tracking-[0.6em] uppercase mb-2 lg:mb-4 block">
                                        COMMENCING_OPERATIONAL_BRIEF
                                    </span>
                                    <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tighter leading-none uppercase">
                                        {missionData.title}
                                    </h1>
                                </div>
                                <div className="text-left lg:text-right mt-4 lg:mt-0">
                                    <span className="text-[10px] font-black text-white opacity-20 tracking-[0.4em] uppercase block mb-1">
                                        LOCATION_ENCRYPTED
                                    </span>
                                    <span className="text-xs lg:text-sm font-bold text-white opacity-40 font-mono">
                                        {new Date().toISOString()}
                                    </span>
                                </div>
                            </div>

                            {/* Mission Parameters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 mb-8 lg:mb-16">
                                <div className="p-6 lg:p-8 glass-perfect rounded-xl lg:rounded-[2rem]">
                                    <span className="text-[10px] font-black text-white opacity-30 uppercase tracking-[0.3em] block mb-2 lg:mb-3">TARGET_SPEED</span>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">{missionData.targetWpm}</span>
                                        <span className="text-xs font-black text-white opacity-40 tracking-widest uppercase">WPM</span>
                                    </div>
                                </div>
                                <div className="p-6 lg:p-8 bg-black/5 border border-black/10 rounded-xl lg:rounded-[2rem] backdrop-blur-md">
                                    <span className="text-[10px] font-black text-white opacity-30 uppercase tracking-[0.3em] block mb-2 lg:mb-3">PRECISION_MIN</span>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">{missionData.accuracy}%</span>
                                        <span className="text-xs font-black text-white opacity-40 tracking-widest uppercase">ACC</span>
                                    </div>
                                </div>
                                <div className="p-8 glass-perfect rounded-[2rem]">
                                    <span className="text-[10px] font-black text-white opacity-30 uppercase tracking-[0.3em] block mb-3">THREAT_LEVEL</span>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-5xl font-black text-white tracking-tighter italic">ULTRA</span>
                                    </div>
                                </div>
                            </div>

                            {/* Constraints & Warning */}
                            <div className="flex gap-16">
                                <div className="flex-1">
                                    <h3 className="text-[10px] font-black text-white opacity-30 uppercase tracking-[0.4em] mb-6">DEPLOYMENT_CONSTRAINTS</h3>
                                    <ul className="space-y-4">
                                        {missionData.constraints.map((c, i) => (
                                            <li key={i} className="flex items-center text-sm text-white opacity-60 font-bold">
                                                <span className="w-2 h-2 bg-white/20 rotate-45 mr-4" />
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="w-1/3 p-6 glass-perfect rounded-[2rem]">
                                    <div className="flex items-center text-white opacity-40 text-[10px] font-black tracking-[0.2em] uppercase mb-4">
                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        THREAT_WARNING
                                    </div>
                                    <p className="text-[10px] text-white opacity-60 leading-relaxed font-bold uppercase tracking-wider">
                                        FAILURE TO MAINTAIN OPERATIONAL THRESHOLDS WILL RESULT IN IMMEDIATE SESSION TERMINATION.
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-16 flex justify-end items-center space-x-10">
                                <button
                                    onClick={onClose}
                                    className="text-[10px] font-black text-white opacity-30 hover:opacity-60 transition-colors tracking-[0.4em] uppercase"
                                >
                                    ABORT_MISSION
                                </button>
                                <button
                                    onClick={onStart}
                                    className="px-16 py-5 bg-black/5 border border-black/20 text-white font-black text-sm tracking-[0.3em] rounded-full hover:bg-black/10 transition-all shadow-[0_32px_64px_rgba(0,0,0,0.1)] active:scale-95 uppercase"
                                >
                                    Confirm_Deployment
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
