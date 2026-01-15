// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION TYPES - Professional typing certification system
// ═══════════════════════════════════════════════════════════════════

export type CertificationTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface CertificationRequirement {
    tier: CertificationTier;
    name: string;
    icon: string;
    color: string;
    min_wpm: number;
    min_accuracy: number;
    test_duration_seconds: number;
    keystones_reward: number;
}

export interface UserCertification {
    id: string;
    user_id: string;
    tier: CertificationTier;
    wpm_achieved: number;
    accuracy_achieved: number;
    test_duration: number;
    earned_at: string;
    certificate_url?: string;
    verification_code: string;
}

export interface CertificationTest {
    id: string;
    tier: CertificationTier;
    text: string;
    duration_seconds: number;
    started_at?: string;
    completed_at?: string;
    result?: {
        wpm: number;
        accuracy: number;
        passed: boolean;
    };
}

// Tier display info
export const TIER_COLORS: Record<CertificationTier, string> = {
    bronze: 'rgba(0, 0, 0, 0.3)',
    silver: 'rgba(0, 0, 0, 0.5)',
    gold: 'rgba(0, 0, 0, 0.7)',
    platinum: 'rgba(0, 0, 0, 0.85)',
    diamond: 'rgba(0, 0, 0, 1.0)',
};

export const TIER_ICONS: Record<CertificationTier, string> = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💠',
    diamond: '💎',
};
