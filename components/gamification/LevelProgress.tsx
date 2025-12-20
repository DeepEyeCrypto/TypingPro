import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Award, Flame, Star } from 'lucide-react';
import { XP_LEVELS } from '../../constants';

interface LevelProgressProps {
    xp: number;
    level: number;
    streakCount: number;
    className?: string;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ xp, level, streakCount, className = "" }) => {
    // Formula: Level = floor(sqrt(XP / 100)) + 1
    // Inverse: XP = (Level - 1)^2 * 100
    const currentLevelXp = Math.pow(level - 1, 2) * 100;
    const nextLevelXp = Math.pow(level, 2) * 100;
    const progressInLevel = xp - currentLevelXp;
    const totalXpInLevel = nextLevelXp - currentLevelXp;
    const progressPercentage = Math.min(100, Math.max(0, (progressInLevel / totalXpInLevel) * 100));

    const rankTitle = useMemo(() => {
        const sorted = [...XP_LEVELS].sort((a, b) => b.minLevel - a.minLevel);
        return sorted.find(l => level >= l.minLevel)?.title || 'Type Recruit';
    }, [level]);

    return (
        <div className={`glass-card p-6 rounded-[24px] border border-white/20 dark:border-white/10 shadow-xl ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-lg relative">
                        <span className="text-2xl font-black">{level}</span>
                        <motion.div
                            className="absolute -top-1 -right-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: streakCount > 0 ? 1 : 0 }}
                        >
                            <div className="bg-orange-500 text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex items-center gap-0.5">
                                <Flame size={8} fill="currentColor" /> {streakCount}
                            </div>
                        </motion.div>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{rankTitle}</h3>
                        <p className="text-xs font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">
                            Level {level} • {Math.floor(nextLevelXp - xp)} XP to level up
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-right">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400">
                        <Star size={14} fill="currentColor" className="animate-pulse" />
                        <span className="text-sm font-black">{Math.floor(xp)} XP</span>
                    </div>
                    {streakCount > 0 && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500">
                            <Flame size={10} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase">{(1 + (streakCount * 0.05)).toFixed(2)}x Boost</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>

            <div className="flex justify-between mt-2 px-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-tighter">LVL {level}</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-tighter">LVL {level + 1}</span>
            </div>
        </div>
    );
};

export default LevelProgress;
