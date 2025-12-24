import React from 'react';
import { motion } from 'framer-motion';

interface StatsBarProps {
    wpm: number;
    accuracy: number;
    time: number;
    isStarted: boolean;
}

const StatsBar: React.FC<StatsBarProps> = ({ wpm, accuracy, time, isStarted }) => {
    return (
        <div className={`flex gap-12 items-center transition-all duration-500 ${isStarted ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}>
            <StatItem label="WPM" value={wpm} color="text-blue-500" />
            <StatItem label="Accuracy" value={`${accuracy}%`} color="text-green-500" />
            <StatItem label="Time" value={`${time}s`} color="text-purple-500" />
        </div>
    );
};

const StatItem = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
    <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
            {label}
        </span>
        <motion.span
            key={value}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-4xl font-bold tracking-tighter ${color}`}
        >
            {value}
        </motion.span>
    </div>
);

export default StatsBar;
