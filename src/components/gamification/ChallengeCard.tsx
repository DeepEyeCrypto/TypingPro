// ═══════════════════════════════════════════════════════════════════
// CHALLENGE CARD - Daily challenge display with progress
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { DailyChallenge, UserChallengeProgress } from '../../types/challenges';

interface ChallengeCardProps {
    challenge: DailyChallenge;
    progress: UserChallengeProgress;
}

const CHALLENGE_ICONS: Record<string, string> = {
    speed: '⚡',
    accuracy: '🎯',
    endurance: '⏱️',
    perfect: '💎',
    streak: '🔥',
};

import { GlassCard } from '../ui/GlassCard';

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, progress }) => {
    const icon = CHALLENGE_ICONS[challenge.type] || '🎯';
    const progressPercent = Math.min(100, Math.round((progress.progress / challenge.requirement.target) * 100));
    const isComplete = progress.completed;

    return (
        <GlassCard
            elevation="matte"
            cornerRadius="md"
            className={`transition-all duration-300 ${isComplete ? 'border-white/40 shadow-glass' : 'opacity-80'}`}
            interactive={true}
        >
            <div className="p-5 flex flex-col h-full">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shadow-inner">
                            {icon}
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-black text-white text-sm tracking-tight leading-tight">{challenge.title}</h3>
                            <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">{challenge.type}</span>
                        </div>
                    </div>
                    {isComplete ? (
                        <div className="bg-white/10 text-white text-[9px] font-black px-3 py-1 rounded-full border border-white/20">
                            COMPLETED
                        </div>
                    ) : (
                        <div className="text-right">
                            <span className="text-xs font-black text-white/40">+{challenge.reward_keystones} 💎</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-white/40 text-xs mb-6 font-medium leading-relaxed">
                    {challenge.description}
                </p>

                {/* Progress Cluster */}
                <div className="mt-auto">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black text-white/20 tracking-widest uppercase">Progress</span>
                        <span className="text-xs font-black text-white tabular-nums">{progressPercent}%</span>
                    </div>

                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${isComplete ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'bg-white/40'}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    <div className="mt-3 text-[10px] font-black text-white/30 text-right tracking-widest uppercase">
                        {progress.progress} / {challenge.requirement.target} UNIT SESSIONS
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};
