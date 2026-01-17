// ═══════════════════════════════════════════════════════════════════
// BADGE SERVICE - Check and unlock achievement badges
// ═══════════════════════════════════════════════════════════════════

import { BADGES, getBadgeById } from '../data/badges';
import { Badge, UserBadge } from '../types/badges';

export interface UserStats {
    best_wpm: number;
    perfect_sessions: number;
    current_streak: number;
    longest_streak: number;
    lessons_completed: number;
    total_keystrokes: number;
}

// Check which badges user can unlock based on their stats
export function checkBadgeEligibility(stats: UserStats, unlockedBadgeIds: string[]): Badge[] {
    const eligibleBadges: Badge[] = [];

    for (const badge of BADGES) {
        // Skip if already unlocked
        if (unlockedBadgeIds.includes(badge.id)) continue;

        let eligible = false;

        switch (badge.requirement.type) {
            case 'wpm_milestone':
                eligible = stats.best_wpm >= badge.requirement.value;
                break;
            case 'accuracy_streak':
                eligible = stats.perfect_sessions >= badge.requirement.value;
                break;
            case 'days_streak':
                eligible = stats.longest_streak >= badge.requirement.value;
                break;
            case 'lessons_complete':
                eligible = stats.lessons_completed >= badge.requirement.value;
                break;
            case 'total_keystrokes':
                eligible = stats.total_keystrokes >= badge.requirement.value;
                break;
        }

        if (eligible) {
            eligibleBadges.push(badge);
        }
    }

    return eligibleBadges;
}

// Calculate progress towards a badge (0-100)
export function getBadgeProgress(badge: Badge, stats: UserStats): number {
    let current = 0;
    const target = badge.requirement.value;

    switch (badge.requirement.type) {
        case 'wpm_milestone':
            current = stats.best_wpm;
            break;
        case 'accuracy_streak':
            current = stats.perfect_sessions;
            break;
        case 'days_streak':
            current = stats.longest_streak;
            break;
        case 'lessons_complete':
            current = stats.lessons_completed;
            break;
        case 'total_keystrokes':
            current = stats.total_keystrokes;
            break;
    }

    return Math.min(100, Math.round((current / target) * 100));
}

// Get all badges with their unlock status and progress
export function getBadgesWithProgress(stats: UserStats, unlockedBadgeIds: string[]): (Badge & { unlocked: boolean; progress: number })[] {
    return BADGES.map(badge => ({
        ...badge,
        unlocked: unlockedBadgeIds.includes(badge.id),
        progress: unlockedBadgeIds.includes(badge.id) ? 100 : getBadgeProgress(badge, stats),
    }));
}

// Calculate total keystones reward from newly unlocked badges
export function calculateBadgeRewards(newBadges: Badge[]): number {
    return newBadges.reduce((total, badge) => total + badge.keystones_reward, 0);
}

// Create UserBadge entry for a newly unlocked badge
export function createUserBadge(badgeId: string): UserBadge {
    return {
        badge_id: badgeId,
        unlocked_at: new Date().toISOString(),
        progress: 100,
    };
}
