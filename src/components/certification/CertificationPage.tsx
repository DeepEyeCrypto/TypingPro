// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION PAGE - Main page for certification system
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useCallback } from 'react';
import { CertificationTiers } from './CertificationTiers';
import { CertificationTest } from './CertificationTest';
import { CertificateDisplay } from './CertificateDisplay';
import { CertificationTier, UserCertification, CertificationTest as CertTest } from '../../types/certifications';
import { CERTIFICATION_TIERS } from '../../data/certifications';
import {
    startCertificationTest,
    completeCertificationTest,
    createUserCertification,
    canAttemptTier,
} from '../../services/certificationService';

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
            alert(check.reason);
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
                import('../../services/activityService').then(({ activityService }) => {
                    import('../../stores/authStore').then(({ useAuthStore }) => {
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
        <div className="min-h-full p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="text-white opacity-60 hover:opacity-100 transition-colors"
                    >
                        ← Back
                    </button>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-white">Certifications</h1>
                    <p className="text-white opacity-60 text-sm">Official typing skill certifications</p>
                </div>
            </div>

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
            <CertificationTiers
                earnedCertifications={earnedCertifications}
                onAttempt={handleAttempt}
                onViewCertificate={setViewingCertificate}
            />

            {/* Certificate modal */}
            {viewingCertificate && (
                <CertificateDisplay
                    certification={viewingCertificate}
                    username={username}
                    onClose={() => setViewingCertificate(null)}
                />
            )}
        </div>
    );
};
