import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';

interface StatDisplayProps {
    label: string;
    value: string | number;
    subValue?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'hacker' | 'blue' | 'purple' | 'white';
    animatedCount?: boolean; // Enable animated counter
}

export const StatDisplay: React.FC<StatDisplayProps> = ({ label, value, subValue, trend, color = 'white', animatedCount = false }) => {
    const colorMap = {
        hacker: 'text-hacker shadow-[0_0_10px_rgba(0,255,65,0.2)]',
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        white: 'text-white/90'
    };

    // Animated counter logic
    const [displayValue, setDisplayValue] = useState<number | string>(value);

    useEffect(() => {
        if (animatedCount && typeof value === 'number') {
            const from = typeof displayValue === 'number' ? displayValue : 0;
            const controls = animate(from, value, {
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
                onUpdate: (latest) => setDisplayValue(Math.round(latest))
            });
            return () => controls.stop();
        } else {
            setDisplayValue(value);
        }
    }, [value, animatedCount]);

    return (
        <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-1">{label}</span>
            <div className="flex items-baseline space-x-2">
                <motion.span
                    className={`text-3xl font-mono font-bold tracking-tight ${colorMap[color]}`}
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    key={String(displayValue)}
                >
                    {displayValue}
                </motion.span>
                {subValue && <span className="text-xs font-mono text-white/20">{subValue}</span>}
            </div>
            {trend && (
                <div className={`flex items-center mt-2 text-[10px] font-bold ${trend === 'up' ? 'text-hacker' : trend === 'down' ? 'text-red-400' : 'text-white/20'}`}>
                    {trend === 'up' && '↑'}
                    {trend === 'down' && '↓'}
                    <span className="ml-1 uppercase tracking-widest">{trend === 'neutral' ? 'steady' : 'trending'}</span>
                </div>
            )}
        </div>
    );
};
