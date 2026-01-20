import React from 'react';
import { motion } from 'framer-motion';

interface SurvivalFuelBarProps {
    fuel: number; // 0 to 100
    isSurvivalMode: boolean;
}

export const SurvivalFuelBar: React.FC<SurvivalFuelBarProps> = ({ fuel, isSurvivalMode }) => {
    if (!isSurvivalMode) return null;

    const isLow = fuel < 30;

    return (
        <div className="w-full flex flex-col gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex justify-between items-end px-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] italic opacity-40" style={{ color: 'var(--text-primary)' }}>
                    Survival_Reactor_Stability
                </span>
                <span className={`text-xs font-black tabular-nums ${isLow ? 'text-red-500 animate-pulse' : 'text-[var(--text-accent)]'}`}>
                    {Math.round(fuel)}%
                </span>
            </div>

            <div className="h-4 w-full bg-[var(--glass-bg)] border border-glass rounded-full overflow-hidden p-0.5 shadow-inner relative">
                {/* Background Glow */}
                <div className={`absolute inset-0 opacity-10 blur-md transition-colors duration-500 ${isLow ? 'bg-red-500' : 'bg-[var(--text-accent)]'}`} />

                <motion.div
                    initial={{ width: '100%' }}
                    animate={{
                        width: `${fuel}%`,
                        backgroundColor: isLow ? '#ef4444' : 'var(--text-accent)'
                    }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                    className="h-full rounded-full shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)] relative overflow-hidden"
                >
                    {/* Flowing highlight animation */}
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    />
                </motion.div>
            </div>
        </div>
    );
};
