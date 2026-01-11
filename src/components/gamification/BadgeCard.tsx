// ═══════════════════════════════════════════════════════════════════
// BADGE CARD - Single badge display with rarity glow
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { Badge, BADGE_RARITY_COLORS } from '../../types/badges';

interface BadgeCardProps {
    badge: Badge;
    unlocked: boolean;
    progress?: number;
    showProgress?: boolean;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
    badge,
    unlocked,
    progress = 0,
    showProgress = true,
}) => {
    const rarityColor = BADGE_RARITY_COLORS[badge.rarity];

    return (
        <div
            className={`
        relative p-4 rounded-xl border transition-all duration-300
        ${unlocked
                    ? 'bg-white/5 border-white/20'
                    : 'bg-white/[0.02] border-white/10 opacity-60'
                }
      `}
            style={{
                boxShadow: unlocked ? `0 0 20px ${rarityColor}40` : 'none',
            }}
        >
            {/* Rarity indicator */}
            <div
                className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: rarityColor }}
            />

            {/* Badge icon */}
            <div className="text-4xl mb-3 text-center">
                {unlocked ? badge.icon : '🔒'}
            </div>

            {/* Badge info */}
            <h3 className="font-bold text-white text-sm text-center mb-1">
                {badge.name}
            </h3>
            <p className="text-white/50 text-xs text-center mb-2">
                {badge.description}
            </p>

            {/* Progress bar (if not unlocked) */}
            {showProgress && !unlocked && (
                <div className="mt-3">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: rarityColor,
                            }}
                        />
                    </div>
                    <div className="text-xs text-white/40 text-center mt-1">
                        {progress}%
                    </div>
                </div>
            )}

            {/* Keystones reward */}
            {unlocked && (
                <div className="text-center text-xs text-[#00ff41] mt-2">
                    +{badge.keystones_reward} 💎
                </div>
            )}
        </div>
    );
};
