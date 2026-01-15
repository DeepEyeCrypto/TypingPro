import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';

interface StatDisplayProps {
    label: string;
    value: string | number;
    subValue?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'white' | 'dimmed';
    animatedCount?: boolean;
    unit?: string;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({ label, value, subValue, trend, color = 'white', animatedCount = false, unit }) => {
    // Animated counter logic
    const [displayValue, setDisplayValue] = useState<number | string>(value);

    useEffect(() => {
        if (animatedCount && typeof value === 'number') {
            const from = typeof displayValue === 'number' ? displayValue : 0;
            const controls = animate(from, value, {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                onUpdate: (latest) => setDisplayValue(Math.round(latest))
            });
            return () => controls.stop();
        } else {
            setDisplayValue(value);
        }
    }, [value, animatedCount]);

    return (
        <div className="flex flex-col items-center sm:items-start group transition-all">
            <span className="text-[8px] lg:text-[10px] font-black text-white/40 tracking-[0.3em] lg:tracking-[0.5em] uppercase mb-1 lg:mb-2 group-hover:opacity-100 transition-opacity">
                {label}
            </span>
            <div className="flex items-baseline gap-1 lg:gap-2">
                <motion.span
                    className={`text-xl lg:text-3xl font-black text-white tabular-nums tracking-tighter leading-none group-hover:scale-105 transition-transform duration-500 origin-left`}
                    initial={{ opacity: 0.8, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    key={String(displayValue)}
                >
                    {displayValue}
                </motion.span>
                {unit && (
                    <span className="text-[8px] lg:text-[10px] font-black text-white opacity-20 uppercase tracking-widest">{unit}</span>
                )}
                {subValue && (
                    <span className="text-sm font-black text-white opacity-20 uppercase tracking-[0.2em]">
                        {subValue}
                    </span>
                )}
            </div>
            {trend && (
                <div className={`flex items-center mt-4 text-[10px] font-black text-white opacity-40 group-hover:opacity-80 transition-all uppercase tracking-[0.3em]`}>
                    <div className={`mr-2 h-1.5 w-1.5 rounded-full ${trend === 'up' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-white/10'}`} />
                    <span>{trend === 'neutral' ? 'steady_state' : `${trend}_trajectory`}</span>
                </div>
            )}
        </div>
    );
};
