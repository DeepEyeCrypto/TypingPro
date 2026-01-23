// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION TIERS - Grid display of all certification levels
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { CertificationTier, UserCertification } from '../../../types/certifications';
import { CertificationCard } from './CertificationCard';
import { getCertificationStatus } from '../../../core/certificationService';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Target } from 'lucide-react';

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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
                <div>
                    <h2 className="text-xs font-black uppercase tracking-[0.5em] opacity-40 mb-2" style={{ color: 'var(--text-primary)' }}>Protocol Stages</h2>
                    <p className="text-xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>Ascend the Skill Hierarchy</p>
                </div>
                <div className="flex items-center gap-6 glass-panel p-6 rounded-[2rem] shadow-xl">
                    <div className="text-right">
                        <div className="text-xs font-black uppercase tracking-widest opacity-30" style={{ color: 'var(--text-primary)' }}>Nodes_Validated</div>
                        <div className="text-3xl font-black italic text-[var(--text-accent)]">{earnedCount}<span className="text-[10px] opacity-20 not-italic ml-1">/ 5</span></div>
                    </div>
                    <Award className="text-[var(--text-accent)] w-10 h-10 opacity-40" />
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
            <div className="mt-12 p-8 glass-panel rounded-[3rem] shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Target size={120} />
                </div>
                <div className="relative z-10">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic" style={{ color: 'var(--text-primary)' }}>Completion_Spectrum</span>
                        <span className="text-lg font-black italic text-[var(--text-accent)]">{earnedCount * 20}%</span>
                    </div>
                    <div className="h-3 glass-panel rounded-full overflow-hidden p-0.5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${earnedCount * 20}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-[var(--text-accent)] rounded-full shadow-[0_0_15px_var(--text-accent)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
