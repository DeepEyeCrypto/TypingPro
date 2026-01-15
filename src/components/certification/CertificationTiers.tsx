// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION TIERS - Grid display of all certification levels
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { CertificationTier, UserCertification } from '../../types/certifications';
import { CertificationCard } from './CertificationCard';
import { getCertificationStatus } from '../../services/certificationService';

interface CertificationTiersProps {
    earnedCertifications: UserCertification[];
    onAttempt: (tier: CertificationTier) => void;
    onViewCertificate: (certification: UserCertification) => void;
}

export const CertificationTiers: React.FC<CertificationTiersProps> = ({
    earnedCertifications,
    onAttempt,
    onViewCertificate,
}) => {
    const statuses = getCertificationStatus(earnedCertifications);
    const earnedCount = statuses.filter(s => s.earned).length;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Typing Certifications</h2>
                    <p className="text-white opacity-60 text-sm">Prove your skills with official timed tests</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">{earnedCount}/5</div>
                    <div className="text-white opacity-40 text-xs">Certified</div>
                </div>
            </div>

            {/* Tiers grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {statuses.map(status => (
                    <CertificationCard
                        key={status.tier}
                        tier={status.tier}
                        earned={status.earned}
                        certification={status.certification}
                        locked={status.locked}
                        onAttempt={() => onAttempt(status.tier)}
                        onViewCertificate={() => status.certification && onViewCertificate(status.certification)}
                    />
                ))}
            </div>

            {/* Progress bar */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-white opacity-60">Certification Progress</span>
                    <span className="text-white opacity-40">{earnedCount * 20}% Complete</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-white/20 via-white/50 to-white/80 rounded-full transition-all duration-500"
                        style={{ width: `${earnedCount * 20}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
