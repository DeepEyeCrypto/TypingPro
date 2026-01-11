// ═══════════════════════════════════════════════════════════════════
// CERTIFICATE DISPLAY - Show earned certificate with verification
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { UserCertification, TIER_COLORS, TIER_ICONS } from '../../types/certifications';
import { CERTIFICATION_TIERS } from '../../data/certifications';

interface CertificateDisplayProps {
    certification: UserCertification;
    username: string;
    onClose: () => void;
}

export const CertificateDisplay: React.FC<CertificateDisplayProps> = ({
    certification,
    username,
    onClose,
}) => {
    const tierInfo = CERTIFICATION_TIERS.find(t => t.tier === certification.tier);
    const color = TIER_COLORS[certification.tier];
    const icon = TIER_ICONS[certification.tier];

    if (!tierInfo) return null;

    const earnedDate = new Date(certification.earned_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div
                className="relative max-w-2xl w-full bg-[#0a0a0f] rounded-2xl overflow-hidden"
                style={{
                    boxShadow: `0 0 60px ${color}40`,
                    border: `2px solid ${color}`,
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl z-10"
                >
                    ×
                </button>

                {/* Certificate content */}
                <div className="p-8 text-center">
                    {/* Header decoration */}
                    <div
                        className="absolute top-0 left-0 right-0 h-2"
                        style={{ backgroundColor: color }}
                    />

                    {/* TypingPro logo */}
                    <div className="text-white/20 text-sm tracking-[0.3em] uppercase mb-4">
                        TypingPro Expert Engine
                    </div>

                    {/* Certificate title */}
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Certificate of Achievement
                    </h1>

                    {/* Tier icon */}
                    <div className="text-7xl my-6">{icon}</div>

                    {/* Tier name */}
                    <h2
                        className="text-4xl font-bold mb-4"
                        style={{ color }}
                    >
                        {tierInfo.name} Certification
                    </h2>

                    {/* Awarded to */}
                    <p className="text-white/60 mb-2">This certifies that</p>
                    <p className="text-2xl font-bold text-white mb-4">{username}</p>

                    {/* Achievement text */}
                    <p className="text-white/60 max-w-md mx-auto mb-6">
                        has demonstrated proficiency in touch typing by achieving a speed of{' '}
                        <span style={{ color }}>{certification.wpm_achieved} WPM</span> with{' '}
                        <span style={{ color }}>{certification.accuracy_achieved}% accuracy</span> on the official
                        5-minute certification test.
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 mb-6">
                        <div>
                            <div className="text-3xl font-bold" style={{ color }}>
                                {certification.wpm_achieved}
                            </div>
                            <div className="text-white/40 text-sm">WPM</div>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div>
                            <div className="text-3xl font-bold" style={{ color }}>
                                {certification.accuracy_achieved}%
                            </div>
                            <div className="text-white/40 text-sm">Accuracy</div>
                        </div>
                    </div>

                    {/* Date */}
                    <p className="text-white/40 text-sm mb-4">
                        Issued on {earnedDate}
                    </p>

                    {/* Verification code */}
                    <div className="bg-white/5 rounded-lg p-4 inline-block">
                        <div className="text-white/40 text-xs mb-1">Verification Code</div>
                        <div className="font-mono text-lg tracking-wider" style={{ color }}>
                            {certification.verification_code}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                            onClick={() => {
                                // Future: Download as image/PDF
                                navigator.clipboard.writeText(certification.verification_code);
                                alert('Verification code copied!');
                            }}
                        >
                            Copy Code
                        </button>
                        <button
                            className="px-6 py-2 rounded-lg transition-all"
                            style={{ backgroundColor: `${color}30`, color }}
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
