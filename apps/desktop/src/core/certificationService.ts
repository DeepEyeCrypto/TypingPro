// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION SERVICE - Test management and verification
// ═══════════════════════════════════════════════════════════════════

import { CertificationTier, CertificationTest, UserCertification } from '../types/certifications';
import { CERTIFICATION_TIERS, getRandomTestText, getTierByName } from '../data/certifications';

// Generate unique verification code
function generateVerificationCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
        if (i === 4 || i === 8) code += '-';
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

// Start a certification test
export function startCertificationTest(tier: CertificationTier): CertificationTest {
    const tierInfo = getTierByName(tier);
    if (!tierInfo) throw new Error(`Invalid tier: ${tier}`);

    return {
        id: `cert-${Date.now()}`,
        tier,
        text: getRandomTestText(tier),
        duration_seconds: tierInfo.test_duration_seconds,
        started_at: new Date().toISOString(),
    };
}

// Complete a certification test
export function completeCertificationTest(
    test: CertificationTest,
    wpm: number,
    accuracy: number
): CertificationTest {
    const tierInfo = getTierByName(test.tier);
    if (!tierInfo) throw new Error(`Invalid tier: ${test.tier}`);

    const passed = wpm >= tierInfo.min_wpm && accuracy >= tierInfo.min_accuracy;

    return {
        ...test,
        completed_at: new Date().toISOString(),
        result: {
            wpm,
            accuracy,
            passed,
        },
    };
}

// Create user certification record
export function createUserCertification(
    userId: string,
    test: CertificationTest
): UserCertification | null {
    if (!test.result?.passed) return null;

    return {
        id: `cert-user-${Date.now()}`,
        user_id: userId,
        tier: test.tier,
        wpm_achieved: test.result.wpm,
        accuracy_achieved: test.result.accuracy,
        test_duration: test.duration_seconds,
        earned_at: test.completed_at || new Date().toISOString(),
        verification_code: generateVerificationCode(),
    };
}

// Check if user can attempt a tier
export function canAttemptTier(
    tier: CertificationTier,
    earnedCertifications: UserCertification[]
): { canAttempt: boolean; reason?: string } {
    const tiers: CertificationTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const tierIndex = tiers.indexOf(tier);

    // Bronze can always be attempted
    if (tierIndex === 0) return { canAttempt: true };

    // Check if previous tier is earned
    const previousTier = tiers[tierIndex - 1];
    const hasPrevious = earnedCertifications.some(c => c.tier === previousTier);

    if (!hasPrevious) {
        return {
            canAttempt: false,
            reason: `You must earn ${previousTier.charAt(0).toUpperCase() + previousTier.slice(1)} certification first`,
        };
    }

    return { canAttempt: true };
}

// Get certification status for all tiers
export function getCertificationStatus(earnedCertifications: UserCertification[]): {
    tier: CertificationTier;
    earned: boolean;
    certification?: UserCertification;
    locked: boolean;
}[] {
    const tiers: CertificationTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

    return tiers.map((tier, index) => {
        const cert = earnedCertifications.find(c => c.tier === tier);
        const previousEarned = index === 0 || earnedCertifications.some(c => c.tier === tiers[index - 1]);

        return {
            tier,
            earned: !!cert,
            certification: cert,
            locked: !previousEarned,
        };
    });
}

// Format time remaining (seconds to MM:SS)
export function formatTimeRemaining(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Calculate test duration in minutes
export function getTestDurationMinutes(tier: CertificationTier): number {
    const tierInfo = getTierByName(tier);
    return tierInfo ? tierInfo.test_duration_seconds / 60 : 5;
}
