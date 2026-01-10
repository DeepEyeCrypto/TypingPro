// ═══════════════════════════════════════════════════════════════════
// KEYSTONES CALCULATOR - Earning formulas for F2P economy
// ═══════════════════════════════════════════════════════════════════

export interface SessionResult {
    wpm: number;
    accuracy: number;
    duration_sec: number;
    is_perfect: boolean; // 100% accuracy
}

/**
 * Calculate Keystones earned from a typing session
 * 
 * Formula:
 * - Base: 1 keystone per 10 WPM (min 1)
 * - Accuracy bonus: +50% if ≥98%, +25% if ≥95%
 * - Perfect bonus: +5 if 100% accuracy
 * - Duration bonus: +1 per full minute (max +3)
 */
export function calculateKeystonesEarned(session: SessionResult): number {
    let keystones = 0;

    // BASE: 1 keystone per 10 WPM (min 1)
    keystones += Math.max(1, Math.floor(session.wpm / 10));

    // ACCURACY BONUS: +50% if >= 98%, +25% if >= 95%
    if (session.accuracy >= 98) {
        keystones = Math.floor(keystones * 1.5);
    } else if (session.accuracy >= 95) {
        keystones = Math.floor(keystones * 1.25);
    }

    // PERFECT BONUS: +5 if 100% accuracy
    if (session.is_perfect) {
        keystones += 5;
    }

    // DURATION BONUS: +1 per full minute (max +3)
    keystones += Math.min(3, Math.floor(session.duration_sec / 60));

    return keystones;
}

// Fixed reward amounts for various actions
export const KEYSTONES_REWARDS = {
    DAILY_LOGIN: 5,
    STREAK_7_DAYS: 25,
    STREAK_30_DAYS: 100,
    BADGE_COMMON: 10,
    BADGE_UNCOMMON: 20,
    BADGE_RARE: 50,
    BADGE_EPIC: 100,
    BADGE_LEGENDARY: 250,
    CHALLENGE_DAILY: 15,
    CHALLENGE_WEEKLY: 75,
    FIRST_WIN_OF_DAY: 10,
} as const;

// Cosmetic rarity tiers
export const RARITY_COLORS = {
    common: '#9ca3af',     // gray-400
    uncommon: '#4ade80',   // green-400
    rare: '#60a5fa',       // blue-400
    epic: '#c084fc',       // purple-400
    legendary: '#fbbf24',  // yellow-400
} as const;

export type Rarity = keyof typeof RARITY_COLORS;
