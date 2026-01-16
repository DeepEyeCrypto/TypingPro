// ═══════════════════════════════════════════════════════════════════
// STREAK DISPLAY - Show current streak with fire animation
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { GlassCard } from '../ui/GlassCard';

interface StreakDisplayProps {
    currentStreak: number;
    longestStreak: number;
    lastPracticeDate?: string;
    compact?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
    currentStreak,
    longestStreak,
    lastPracticeDate,
    compact = false,
}) => {
    const isActive = currentStreak > 0;
    const isOnFire = currentStreak >= 7;

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <span className={`text-lg ${isOnFire ? 'animate-pulse' : ''}`}>
                    {isActive ? '🔥' : '❄️'}
                </span>
                <span className="font-bold text-white">{currentStreak}</span>
                <span className="text-white opacity-40 text-xs font-black uppercase tracking-widest">S_TRK</span>
            </div>
        );
    }

    return (
        <GlassCard
            elevation="mid"
            cornerRadius="lg"
            className="p-8"
            prismatic={isOnFire}
        >
            {/* Main streak display */}
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <div className={`text-6xl mb-2 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] ${isOnFire ? 'animate-bounce' : ''}`}>
                    {isActive ? '🔥' : '❄️'}
                </div>
                <div className="text-center">
                    <div className="text-6xl font-black text-white tracking-tighter tabular-nums leading-none">
                        {currentStreak}
                    </div>
                    <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Active_Practice_Streak</div>
                </div>
            </div>

            {/* Streak milestones */}
            <div className="relative h-1.5 bg-white/5 rounded-full mb-8 border border-white/5 px-0.5">
                {[7, 30, 100].map(milestone => {
                    const position = Math.min(100, (milestone / 100) * 100);
                    const reached = currentStreak >= milestone;
                    return (
                        <div
                            key={milestone}
                            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 z-10 transition-all duration-500 ${reached ? 'border-white scale-110' : 'border-white/10'}`}
                            style={{
                                left: `${position}%`,
                                transform: `translate(-50%, -50%) ${reached ? 'scale(1.1)' : 'scale(1)'}`,
                                backgroundColor: reached ? 'white' : 'rgba(255,255,255,0.05)',
                                boxShadow: reached ? '0 0 15px rgba(255,255,255,0.5)' : 'none'
                            }}
                            title={`${milestone} days`}
                        />
                    );
                })}
                <div
                    className="absolute top-0 left-0 h-full bg-white opacity-80 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_white]"
                    style={{ width: `${Math.min(100, currentStreak)}%` }}
                />
            </div>

            {/* Stats row */}
            <div className="flex justify-between items-center text-xs border-t border-white/5 pt-6">
                <div>
                    <span className="text-white/30 font-black uppercase tracking-widest">Record: </span>
                    <span className="text-white font-black ml-1">{longestStreak} DAYS</span>
                </div>
                {lastPracticeDate && (
                    <div className="text-white/20 font-black uppercase tracking-widest text-[9px]">
                        Sync: {new Date(lastPracticeDate).toLocaleDateString()}
                    </div>
                )}
            </div>

            {/* Motivation message */}
            <div className="mt-8 text-center">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                    {currentStreak === 0 && (
                        <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Initiate_Engagement_Cycle</span>
                    )}
                    {currentStreak > 0 && currentStreak < 7 && (
                        <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Maintain_Velocity: {7 - currentStreak} to_unlocked_TIER1</span>
                    )}
                    {currentStreak >= 7 && currentStreak < 30 && (
                        <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-glow">WARRIOR_PROTOCOL_ACTIVE</span>
                    )}
                    {currentStreak >= 30 && currentStreak < 100 && (
                        <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-glow">MASTER_SYNCHRONIZATION_ACHIEVED</span>
                    )}
                    {currentStreak >= 100 && (
                        <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-glow">SENTIENT_LEGEND_STATUS</span>
                    )}
                </div>
            </div>
        </GlassCard>
    );
};
