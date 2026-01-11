// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION CARD - Single tier display with status
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { CertificationTier, UserCertification, TIER_COLORS, TIER_ICONS } from '../../types/certifications';
import { CERTIFICATION_TIERS } from '../../data/certifications';

interface CertificationCardProps {
    tier: CertificationTier;
    earned: boolean;
    certification?: UserCertification;
    locked: boolean;
    onAttempt?: () => void;
    onViewCertificate?: () => void;
}

export const CertificationCard: React.FC<CertificationCardProps> = ({
    tier,
    earned,
    certification,
    locked,
    onAttempt,
    onViewCertificate,
}) => {
    const tierInfo = CERTIFICATION_TIERS.find(t => t.tier === tier);
    if (!tierInfo) return null;

    const color = TIER_COLORS[tier];
    const icon = TIER_ICONS[tier];

    return (
        <div
            className={`
        relative p-6 rounded-xl border transition-all duration-300
        ${earned
                    ? 'bg-white/10 border-white/30'
                    : locked
                        ? 'bg-white/[0.02] border-white/5 opacity-40'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                }
      `}
            style={{
                boxShadow: earned ? `0 0 30px ${color}40` : 'none',
            }}
        >
            {/* Lock overlay */}
            {locked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                    <span className="text-4xl">🔒</span>
                </div>
            )}

            {/* Earned badge */}
            {earned && (
                <div
                    className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: color, color: tier === 'diamond' ? '#0a0a0f' : 'white' }}
                >
                    ✓ EARNED
                </div>
            )}

            {/* Icon */}
            <div className="text-5xl mb-4 text-center">{icon}</div>

            {/* Tier name */}
            <h3
                className="text-xl font-bold text-center mb-2"
                style={{ color }}
            >
                {tierInfo.name}
            </h3>

            {/* Requirements */}
            <div className="space-y-1 mb-4 text-center text-sm">
                <div className="text-white/60">
                    <span style={{ color }}>{tierInfo.min_wpm}+</span> WPM
                </div>
                <div className="text-white/60">
                    <span style={{ color }}>{tierInfo.min_accuracy}%+</span> Accuracy
                </div>
                <div className="text-white/40 text-xs">
                    5-minute test
                </div>
            </div>

            {/* Reward */}
            <div className="text-center mb-4">
                <span className="text-[#00ff41] font-bold">+{tierInfo.keystones_reward}</span>
                <span className="text-white/40 text-sm ml-1">💎</span>
            </div>

            {/* Actions */}
            {earned && certification ? (
                <button
                    onClick={onViewCertificate}
                    className="w-full py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: `${color}30`, color }}
                >
                    View Certificate
                </button>
            ) : !locked ? (
                <button
                    onClick={onAttempt}
                    className="w-full py-2 bg-[#00ff41]/20 text-[#00ff41] rounded-lg text-sm font-medium hover:bg-[#00ff41]/30 transition-all"
                >
                    Take Test
                </button>
            ) : null}

            {/* Earned date */}
            {earned && certification && (
                <div className="text-center text-xs text-white/40 mt-2">
                    Earned {new Date(certification.earned_at).toLocaleDateString()}
                </div>
            )}
        </div>
    );
};
