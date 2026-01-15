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
        relative p-4 rounded-xl border transition-all duration-300 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)]
        ${isComplete
                    ? 'bg-black/10 border-black/30'
                    : 'bg-black/5 border-black/30'
                }
      `}
        >
            {/* Complete badge */}
            {isComplete && (
                <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xl">
                    ✓ DONE
                </div>
            )}

            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-black/5 border border-black/10 flex items-center justify-center text-2xl">
                    {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-black mb-1">{challenge.title}</h3>
                    <p className="text-black opacity-50 text-sm mb-3">{challenge.description}</p>

                    {/* Progress bar */}
                    <div className="h-2 bg-black/10 rounded-full overflow-hidden mb-1">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progressPercent}%`,
                                backgroundColor: 'rgb(0, 0, 0)',
                            }}
                        />
                    </div>

                    {/* Progress text */}
                    <div className="flex justify-between text-xs">
                        <span className="text-black opacity-40">
                            {progress.progress} / {challenge.requirement.target}
                        </span>
                        <span className={isComplete ? 'text-black font-bold' : 'text-black opacity-40'}>
                            {progressPercent}%
                        </span>
                    </div>
                </div>

                {/* Reward */}
                <div className="text-right">
                    <div className={`text-lg font-bold ${isComplete ? 'text-black' : 'text-black'}`}>
                        +{challenge.reward_keystones}
                    </div>
                    <div className="text-xs text-black opacity-40">💎</div>
                </div>
            </div>
        </div>
    );
};
