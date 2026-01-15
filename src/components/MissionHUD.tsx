import React from 'react';
import { motion } from 'framer-motion';

interface MissionHUDProps {
    currentWpm: number;
    targetWpm: number;
    accuracy: number;
    minAccuracy: number;
    stressLevel: number; // 0 to 100
    isMissionActive: boolean;
}

export const MissionHUD: React.FC<MissionHUDProps> = ({
    currentWpm,
    targetWpm,
    accuracy,
    minAccuracy,
    stressLevel,
    isMissionActive
}) => {
    if (!isMissionActive) return null;

    const wpmColor = currentWpm >= targetWpm ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
    const accColor = accuracy >= minAccuracy ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';

    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Top Tactical Bar */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-8 flex justify-between items-start">
                {/* WPM Tracker */}
                <div className="flex flex-col items-start translate-x-[-20%]">
                    <span className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase mb-2">VELOCITY_TARGET</span>
                    <div className="flex items-baseline space-x-3">
                        <motion.span
                            animate={{ color: wpmColor }}
                            className="text-5xl font-black tracking-tighter"
                        >
                            {Math.round(currentWpm)}
                        </motion.span>
                        <span className="text-xs font-bold text-white/20 tracking-widest uppercase">{targetWpm} WPM</span>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-center">
                    <div className="px-6 py-2 rounded-full border border-white/10 bg-white/10 backdrop-blur-xl mb-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <span className="text-[10px] font-black text-white tracking-[0.5em] animate-pulse">
                            • MISSION_HOT_LANE
                        </span>
                    </div>
                </div>

                {/* Accuracy Tracker */}
                <div className="flex flex-col items-end translate-x-[20%]">
                    <span className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase mb-2">CORE_PRECISION</span>
                    <div className="flex items-baseline space-x-3">
                        <motion.span
                            animate={{ color: accColor }}
                            className="text-5xl font-black tracking-tighter"
                        >
                            {accuracy.toFixed(1)}%
                        </motion.span>
                        <span className="text-xs font-bold text-white/20 tracking-widest uppercase">MIN {minAccuracy}%</span>
                    </div>
                </div>
            </div>

            {/* Side Stress Gauges */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 space-y-6 flex flex-col items-center">
                <div className="h-80 w-1.5 bg-white/5 relative overflow-hidden rounded-full border border-white/5">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${stressLevel}%` }}
                        className="absolute bottom-0 w-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                    />
                </div>
                <span className="text-[10px] font-black text-white/30 vertical-text tracking-[0.4em] uppercase">NEURAL_LOAD</span>
            </div>

            {/* Vignette Stress Effect */}
            <motion.div
                animate={{
                    opacity: stressLevel > 70 ? (stressLevel - 70) / 100 : 0,
                    boxShadow: `inset 0 0 ${stressLevel * 2}px rgba(255, 255, 255, 0.1)`
                }}
                transition={{ duration: 0.1 }}
                className="absolute inset-0 pointer-events-none z-[60]"
            />

            <style>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>
        </div>
    );
};
