// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION PAGE - Main page for certification system
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useCallback } from 'react';
import { CertificationTiers } from './CertificationTiers';
import { CertificationTest } from './CertificationTest';
import { CertificateDisplay } from './CertificateDisplay';
import { CertificationTier, UserCertification, CertificationTest as CertTest } from '../../../types/certifications';
import { CERTIFICATION_TIERS } from '../../../data/certifications';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Award, ShieldCheck, Zap } from 'lucide-react';
import {
    startCertificationTest,
    completeCertificationTest,
    createUserCertification,
    canAttemptTier,
} from '../../../core/certificationService';
import { toast } from '../../../core/store/toastStore';

interface CertificationPageProps {
    userId: string;
    username: string;
    earnedCertifications: UserCertification[];
    onCertificationEarned?: (certification: UserCertification, keystones: number) => void;
    onBack?: () => void;
}

export const CertificationPage: React.FC<CertificationPageProps> = ({
    userId,
    username,
    earnedCertifications,
    onCertificationEarned,
    onBack,
}) => {
    const [activeTest, setActiveTest] = useState<CertTest | null>(null);
    const [viewingCertificate, setViewingCertificate] = useState<UserCertification | null>(null);
    const [testResult, setTestResult] = useState<{
        passed: boolean;
        wpm: number;
        accuracy: number;
        tier: CertificationTier;
    } | null>(null);

    const handleAttempt = useCallback((tier: CertificationTier) => {
        const check = canAttemptTier(tier, earnedCertifications);
        if (!check.canAttempt) {
            toast.error(check.reason);
            return;
        }

        const test = startCertificationTest(tier);
        setActiveTest(test);
        setTestResult(null);
    }, [earnedCertifications]);

    const handleTestComplete = useCallback((wpm: number, accuracy: number) => {
        if (!activeTest) return;

        const completedTest = completeCertificationTest(activeTest, wpm, accuracy);
        const tierInfo = CERTIFICATION_TIERS.find(t => t.tier === activeTest.tier);

        setTestResult({
            passed: completedTest.result?.passed || false,
            wpm,
            accuracy,
            tier: activeTest.tier,
        });

        if (completedTest.result?.passed && tierInfo) {
            const newCert = createUserCertification(userId, completedTest);
            if (newCert) {
                onCertificationEarned?.(newCert, tierInfo.keystones_reward);

                // Global Report: Certification
                import('../../../core/activityService').then(({ activityService }) => {
                    import('../../../core/store/authStore').then(({ useAuthStore }) => {
                        const avatarUrl = useAuthStore.getState().user?.avatar_url || '';
                        activityService.reportEvent({
                            type: 'certification',
                            userId,
                            username,
                            avatarUrl,
                            data: { tier: activeTest.tier }
                        });
                    });
                });
            }
        }

        setActiveTest(null);
    }, [activeTest, userId, username, onCertificationEarned]);

    const handleTestCancel = useCallback(() => {
        setActiveTest(null);
    }, []);

    // Active test view
    if (activeTest) {
        return (
            <CertificationTest
                test={activeTest}
                onComplete={handleTestComplete}
                onCancel={handleTestCancel}
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-full p-6 lg:p-10 max-w-7xl mx-auto pb-32"
        >
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-10 mb-10">
                <div className="flex items-center gap-6">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-3 rounded-2xl glass-panel shadow-lg hover:scale-110 active:scale-95 transition-all text-[var(--text-primary)]"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] block mb-1 opacity-40" style={{ color: 'var(--text-primary)' }}>Validation Protocols</span>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic" style={{ color: 'var(--text-primary)' }}>
                            Elite<span className="not-italic opacity-20">.Certifications</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-5 py-2 rounded-xl glass-panel flex items-center gap-3">
                        <Award className="text-[var(--text-accent)] w-5 h-5" />
                        <span className="text-[10px] font-black tracking-widest uppercase opacity-60" style={{ color: 'var(--text-primary)' }}>Verified Identity: {username}</span>
                    </div>
                </div>
            </header>

            {/* Test result notification */}
            {testResult && (
                <div
                    className={`
            mb-6 p-4 rounded-xl border
            ${testResult.passed
                            ? 'bg-white/5 border-white/10'
                            : 'bg-white/5 border-white/20 opacity-80'
                        }
          `}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">
                            {testResult.passed ? '🎉' : '😔'}
                        </span>
                        <div>
                            <h3 className={`font-bold text-white`}>
                                {testResult.passed ? 'Certification Earned!' : 'Test Not Passed'}
                            </h3>
                            <p className="text-white opacity-60 text-sm">
                                You achieved {testResult.wpm} WPM with {testResult.accuracy}% accuracy
                                {!testResult.passed && '. Keep practicing and try again!'}
                            </p>
                        </div>
                        <button
                            onClick={() => setTestResult(null)}
                            className="ml-auto text-white opacity-40 hover:opacity-100"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Tiers grid */}
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <CertificationTiers
                    earnedCertifications={earnedCertifications}
                    onAttempt={handleAttempt}
                    onViewCertificate={setViewingCertificate}
                />
            </div>

            {/* Certificate modal */}
            <AnimatePresence>
                {viewingCertificate && (
                    <CertificateDisplay
                        certification={viewingCertificate}
                        username={username}
                        onClose={() => setViewingCertificate(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};
