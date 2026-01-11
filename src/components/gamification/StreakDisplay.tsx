// ═══════════════════════════════════════════════════════════════════
// STREAK DISPLAY - Show current streak with fire animation
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

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
                <span className="text-white/50 text-sm">days</span>
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            {/* Main streak display */}
            <div className="flex items-center justify-center gap-4 mb-4">
                <div className={`text-5xl ${isOnFire ? 'animate-bounce' : ''}`}>
                    {isActive ? '🔥' : '❄️'}
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-white">{currentStreak}</div>
                    <div className="text-white/50 text-sm">day streak</div>
                </div>
            </div>

            {/* Streak milestones */}
            <div className="relative h-2 bg-white/10 rounded-full mb-4">
                {[7, 30, 100].map(milestone => {
                    const position = Math.min(100, (milestone / 100) * 100);
                    const reached = currentStreak >= milestone;
                    return (
                        <div
                            key={milestone}
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
                            style={{
                                left: `${position}%`,
                                backgroundColor: reached ? '#00ff41' : '#1a1a2e',
                                borderColor: reached ? '#00ff41' : '#ffffff30',
                            }}
                            title={`${milestone} days`}
                        />
                    );
                })}
                <div
                    className="absolute top-0 left-0 h-full bg-[#00ff41] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, currentStreak)}%` }}
                />
            </div>

            {/* Stats row */}
            <div className="flex justify-between text-sm">
                <div>
                    <span className="text-white/50">Best: </span>
                    <span className="text-white font-semibold">{longestStreak} days</span>
                </div>
                {lastPracticeDate && (
                    <div className="text-white/40">
                        Last practice: {new Date(lastPracticeDate).toLocaleDateString()}
                    </div>
                )}
            </div>

            {/* Motivation message */}
            <div className="mt-4 text-center text-sm">
                {currentStreak === 0 && (
                    <span className="text-white/40">Start practicing to build your streak!</span>
                )}
                {currentStreak > 0 && currentStreak < 7 && (
                    <span className="text-white/60">Keep going! {7 - currentStreak} days to Week Warrior 🎖️</span>
                )}
                {currentStreak >= 7 && currentStreak < 30 && (
                    <span className="text-[#00ff41]">🔥 Week Warrior! {30 - currentStreak} days to Month Master</span>
                )}
                {currentStreak >= 30 && currentStreak < 100 && (
                    <span className="text-[#00ff41]">🔥🔥 Month Master! {100 - currentStreak} days to Century Legend</span>
                )}
                {currentStreak >= 100 && (
                    <span className="text-[#ffd700]">💯 CENTURY LEGEND! You're unstoppable!</span>
                )}
            </div>
        </div>
    );
};
