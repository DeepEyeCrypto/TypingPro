// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION CARD - High Fidelity Deep Glass Overhaul
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

    const color = '#000000';
    const icon = TIER_ICONS[tier];

    return (
        <div
            className={`
                relative p-10 rounded-[3rem] border transition-all duration-700
                ${earned
                    ? 'bg-black/10 border-black/20 shadow-[0_32px_64px_rgba(0,0,0,0.1)]'
                    : locked
                        ? 'bg-black/20 border-black/5 opacity-30 grayscale'
                        : 'bg-white/5 border-white/10 hover:border-black/20 hover:bg-black/10'
                }
            `}
        >
            {/* Lock overlay */}
            {locked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[3rem] backdrop-blur-sm z-10">
                    <span className="text-5xl drop-shadow-[0_0_20px_rgba(0,0,0,1)]">🔒</span>
                </div>
            )}

            {/* Earned badge */}
            {earned && (
                <div
                    className="absolute -top-3 -right-3 px-5 py-2 rounded-full text-[10px] font-black border border-white/20 shadow-2xl bg-white text-black z-20 tracking-widest uppercase"
                >
                    ✓_EARNED
                </div>
            )}

            {/* Icon */}
            <div className="text-7xl mb-10 text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">{icon}</div>

            {/* Tier name */}
            <h3 className="text-2xl font-black text-center mb-6 text-white uppercase tracking-tighter">
                {tierInfo.name}
            </h3>

            {/* Requirements */}
            <div className="space-y-3 mb-10 text-center">
                <div className="text-white opacity-60 font-black text-[10px] uppercase tracking-widest">
                    THRESHOLD: <span className="text-white text-sm">{tierInfo.min_wpm}+</span> WPM
                </div>
                <div className="text-white opacity-60 font-black text-[10px] uppercase tracking-widest">
                    PRECISION: <span className="text-white text-sm">{tierInfo.min_accuracy}%+</span> ACC
                </div>
            </div>

            {/* Reward */}
            <div className="text-center mb-10 px-6 py-3 bg-black/5 rounded-full border border-black/10">
                <span className="font-black text-white tracking-widest text-sm">+{tierInfo.keystones_reward}</span>
                <span className="text-white opacity-40 text-[10px] ml-2 font-black uppercase tracking-widest">Keystones</span>
            </div>

            {/* Actions */}
            {earned && certification ? (
                <button
                    onClick={onViewCertificate}
                    className="w-full py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all bg-white text-black hover:scale-105 active:scale-95 shadow-2xl"
                >
                    View_Credentials
                </button>
            ) : !locked ? (
                <button
                    onClick={onAttempt}
                    className="w-full py-4 bg-black/5 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black/10 transition-all border border-black/10 hover:border-black/20"
                >
                    Initial_Attempt
                </button>
            ) : null}

            {/* Earned date */}
            {earned && certification && (
                <div className="text-center text-[10px] text-white opacity-20 font-black uppercase tracking-widest mt-6">
                    TIMESTAMP_{new Date(certification.earned_at).toLocaleDateString()}
                </div>
            )}
        </div>
    );
};
