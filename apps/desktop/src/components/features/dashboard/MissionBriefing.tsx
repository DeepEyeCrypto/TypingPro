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
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8"
                >
                    {/* Scanner Lines Effect - Theme Aware */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10 bg-[length:100%_3px,4px_100%]"
                        style={{ backgroundImage: 'linear-gradient(var(--text-primary) 50%, transparent 50%), linear-gradient(90deg, var(--text-primary) 50%, transparent 50%)' }} />

                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="w-full max-w-4xl relative"
                    >
                        {/* Corner Accents */}
                        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-glass opacity-40" />
                        <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-glass opacity-40" />
                        <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-glass opacity-40" />
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-glass opacity-40" />

                        <div className="bg-[var(--glass-bg)] border border-glass rounded-[4rem] p-12 lg:p-20 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--text-accent)]/5 to-transparent pointer-events-none" />
                            {/* Mission Header */}
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 lg:mb-16">
                                <div>
                                    <span className="text-[10px] font-black opacity-30 tracking-[0.6em] uppercase mb-4 block" style={{ color: 'var(--text-primary)' }}>
                                        COMMENCING_OPERATIONAL_BRIEF
                                    </span>
                                    <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-none uppercase italic" style={{ color: 'var(--text-primary)' }}>
                                        {missionData.title}
                                    </h1>
                                </div>
                                <div className="text-left lg:text-right mt-6 lg:mt-0">
                                    <span className="text-[10px] font-black opacity-20 tracking-[0.4em] uppercase block mb-1" style={{ color: 'var(--text-primary)' }}>
                                        LOCATION_ENCRYPTED
                                    </span>
                                    <span className="text-[10px] font-black opacity-40 tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
                                        {new Date().toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>

                            {/* Mission Parameters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 mb-12 lg:mb-20">
                                <div className="p-8 lg:p-10 bg-[var(--glass-bg)] border border-glass rounded-[2rem] shadow-xl">
                                    <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em] block mb-3" style={{ color: 'var(--text-primary)' }}>TARGET_SPEED</span>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-5xl lg:text-6xl font-black tracking-tighter italic" style={{ color: 'var(--text-primary)' }}>{missionData.targetWpm}</span>
                                        <span className="text-[10px] font-black opacity-40 tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>WPM</span>
                                    </div>
                                </div>
                                <div className="p-8 lg:p-10 bg-[var(--glass-bg)] border border-glass rounded-[2rem] shadow-xl">
                                    <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em] block mb-3" style={{ color: 'var(--text-primary)' }}>PRECISION_MIN</span>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-5xl lg:text-6xl font-black tracking-tighter italic" style={{ color: 'var(--text-primary)' }}>{missionData.accuracy}%</span>
                                        <span className="text-[10px] font-black opacity-40 tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>ACC</span>
                                    </div>
                                </div>
                                <div className="p-8 lg:p-10 bg-[var(--text-accent)] text-white rounded-[2rem] shadow-[0_20px_40px_rgba(var(--text-accent),0.3)]">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block mb-3">THREAT_LEVEL</span>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-5xl lg:text-6xl font-black tracking-tighter italic">ULTRA</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                                <div className="flex-1">
                                    <h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mb-6" style={{ color: 'var(--text-primary)' }}>DEPLOYMENT_CONSTRAINTS</h3>
                                    <ul className="space-y-4">
                                        {missionData.constraints.map((c, i) => (
                                            <li key={i} className="flex items-center text-sm font-black italic tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                                <span className="w-2 h-2 bg-[var(--text-accent)] rotate-45 mr-4 shadow-[0_0_8px_var(--text-accent)]" />
                                                <span className="opacity-60">{c}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="w-full lg:w-1/3 p-8 bg-[var(--glass-bg)] border border-glass rounded-[2rem] shadow-inner">
                                    <div className="flex items-center text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-accent)' }}>
                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        THREAT_WARNING
                                    </div>
                                    <p className="text-[10px] opacity-40 leading-relaxed font-black uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                                        FAILURE TO MAINTAIN OPERATIONAL THRESHOLDS WILL RESULT IN IMMEDIATE SESSION TERMINATION.
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-12 lg:mt-20 flex flex-col md:flex-row justify-end items-center gap-6 md:gap-10">
                                <button
                                    onClick={onClose}
                                    className="text-[10px] font-black opacity-20 hover:opacity-100 transition-all tracking-[0.4em] uppercase"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    ABORT_MISSION
                                </button>
                                <button
                                    onClick={onStart}
                                    className="w-full md:w-auto px-20 py-6 bg-[var(--text-accent)] text-white font-black text-xs tracking-[0.4em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] uppercase"
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
