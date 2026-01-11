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

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, progress }) => {
    const icon = CHALLENGE_ICONS[challenge.type] || '🎯';
    const progressPercent = Math.min(100, Math.round((progress.progress / challenge.requirement.target) * 100));
    const isComplete = progress.completed;

    return (
        <div
            className={`
        relative p-4 rounded-xl border transition-all duration-300
        ${isComplete
                    ? 'bg-[#00ff41]/10 border-[#00ff41]/30'
                    : 'bg-white/5 border-white/10'
                }
      `}
        >
            {/* Complete badge */}
            {isComplete && (
                <div className="absolute -top-2 -right-2 bg-[#00ff41] text-[#0a0a0f] text-xs font-bold px-2 py-0.5 rounded-full">
                    ✓ DONE
                </div>
            )}

            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                    {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white mb-1">{challenge.title}</h3>
                    <p className="text-white/50 text-sm mb-3">{challenge.description}</p>

                    {/* Progress bar */}
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-1">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progressPercent}%`,
                                backgroundColor: isComplete ? '#00ff41' : '#00d4aa',
                            }}
                        />
                    </div>

                    {/* Progress text */}
                    <div className="flex justify-between text-xs">
                        <span className="text-white/40">
                            {progress.progress} / {challenge.requirement.target}
                        </span>
                        <span className={isComplete ? 'text-[#00ff41]' : 'text-white/40'}>
                            {progressPercent}%
                        </span>
                    </div>
                </div>

                {/* Reward */}
                <div className="text-right">
                    <div className={`text-lg font-bold ${isComplete ? 'text-[#00ff41]' : 'text-white'}`}>
                        +{challenge.reward_keystones}
                    </div>
                    <div className="text-xs text-white/40">💎</div>
                </div>
            </div>
        </div>
    );
};
