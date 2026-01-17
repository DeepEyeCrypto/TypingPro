// ═══════════════════════════════════════════════════════════════════
// BADGE CARD - Single badge display with rarity glow
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { Badge, BADGE_RARITY_COLORS } from '../../../types/badges';

interface BadgeCardProps {
    badge: Badge;
    unlocked: boolean;
    progress?: number;
    showProgress?: boolean;
}

import { GlassCard } from '../../ui/GlassCard';

export const BadgeCard: React.FC<BadgeCardProps> = ({
    badge,
    unlocked,
    progress = 0,
    showProgress = true,
}) => {
    const rarityColor = BADGE_RARITY_COLORS[badge.rarity];

    return (
        <GlassCard
            elevation="matte"
            cornerRadius="md"
            className={`transition-all duration-500 ${unlocked ? 'border-white/30' : 'opacity-40 grayscale'}`}
            prismatic={unlocked}
            interactive={unlocked}
        >
            <div className="p-4 flex flex-col items-center text-center">
                {/* Rarity indicator */}
                <div
                    className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ color: rarityColor, backgroundColor: rarityColor }}
                />

                {/* Badge icon */}
                <div className="text-4xl mb-4 transform transition-transform group-hover:scale-110 duration-500">
                    {unlocked ? badge.icon : '🔒'}
                </div>

                {/* Badge info */}
                <h3 className="font-black text-white text-xs uppercase tracking-widest mb-1 leading-tight">
                    {badge.name}
                </h3>
                <p className="text-white/30 text-[10px] font-medium px-2 mb-4">
                    {badge.description}
                </p>

                {/* Progress bar (if not unlocked) */}
                {showProgress && !unlocked && (
                    <div className="w-full mt-auto">
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor: rarityColor,
                                    boxShadow: `0 0 10px ${rarityColor}80`
                                }}
                            />
                        </div>
                        <div className="text-[9px] font-black text-white/20 uppercase tracking-tighter mt-1.5">
                            {progress}% SYNC
                        </div>
                    </div>
                )}

                {/* Keystones reward */}
                {unlocked && (
                    <div className="mt-auto pt-2 border-t border-white/5 w-full">
                        <span className="text-[10px] font-black text-white tracking-widest">
                            +{badge.keystones_reward} 💎
                        </span>
                    </div>
                )}
            </div>
        </GlassCard>
    );
};
