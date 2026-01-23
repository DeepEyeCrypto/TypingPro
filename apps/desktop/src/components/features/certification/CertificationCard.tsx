// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION CARD - High Fidelity Deep Glass Overhaul
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { CertificationTier, UserCertification, TIER_COLORS, TIER_ICONS } from '../../../types/certifications';
import { CERTIFICATION_TIERS } from '../../../data/certifications';

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
                relative p-10 rounded-[3rem] border transition-all duration-700 overflow-hidden
                ${earned
                    ? 'bg-[var(--accent-soft)] border-[var(--text-accent)]/30 shadow-2xl'
                    : locked
                        ? 'glass-panel opacity-30 grayscale'
                        : 'glass-panel hover:bg-[var(--glass-hover)] hover:border-[var(--text-accent)]'
                }
            `}
        >
            {/* Lock overlay */}
            {locked && (
                <div className="absolute inset-0 flex items-center justify-center glass-panel rounded-[3rem] z-10">
                    <span className="text-5xl drop-shadow-[0_0_20px_rgba(0,0,0,1)]">🔒</span>
                </div>
            )}

            {/* Earned badge */}
            {earned && (
                <div
                    className="absolute -top-3 -right-3 px-5 py-2 rounded-full text-[10px] font-black border border-[var(--text-accent)]/20 shadow-2xl bg-[var(--text-accent)] text-white z-20 tracking-widest uppercase italic"
                >
                    ✓_VALIDATED
                </div>
            )}

            {/* Icon */}
            <div className="text-7xl mb-10 text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">{icon}</div>

            {/* Tier name */}
            <h3 className="text-2xl font-black text-center mb-6 uppercase tracking-tighter italic" style={{ color: 'var(--text-primary)' }}>
                {tierInfo.name}
            </h3>

            {/* Requirements */}
            <div className="space-y-3 mb-10 text-center">
                <div className="font-black text-[10px] uppercase tracking-widest opacity-40" style={{ color: 'var(--text-primary)' }}>
                    THRESHOLD: <span className="text-[var(--text-accent)] text-sm">{tierInfo.min_wpm}+</span> WPM
                </div>
                <div className="font-black text-[10px] uppercase tracking-widest opacity-40" style={{ color: 'var(--text-primary)' }}>
                    PRECISION: <span className="text-[var(--text-accent)] text-sm">{tierInfo.min_accuracy}%+</span> ACC
                </div>
            </div>

            {/* Reward */}
            <div className="text-center mb-10 px-6 py-3 bg-[var(--accent-soft)] rounded-full border border-[var(--text-accent)]/10">
                <span className="font-black tracking-widest text-sm text-[var(--text-accent)]">+{tierInfo.keystones_reward}</span>
                <span className="text-[10px] ml-2 font-black uppercase tracking-widest opacity-40" style={{ color: 'var(--text-primary)' }}>Keystones</span>
            </div>

            {/* Actions */}
            {earned && certification ? (
                <button
                    onClick={onViewCertificate}
                    className="w-full py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all bg-[var(--text-accent)] text-white hover:scale-105 active:scale-95 shadow-xl shadow-[var(--text-accent)]/20"
                >
                    View_Credentials
                </button>
            ) : !locked ? (
                <button
                    onClick={onAttempt}
                    className="w-full py-4 glass-panel rounded-full text-[10px] font-black uppercase tracking-widest hover:border-[var(--text-accent)] hover:text-[var(--text-accent)] transition-all"
                    style={{ color: 'var(--text-primary)' }}
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
