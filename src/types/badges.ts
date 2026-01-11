// ═══════════════════════════════════════════════════════════════════
// BADGE TYPES - Achievement system for TypingPro
// ═══════════════════════════════════════════════════════════════════

export type BadgeCategory = 'speed' | 'accuracy' | 'streak' | 'social' | 'special';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type BadgeRequirementType = 'wpm_milestone' | 'accuracy_streak' | 'days_streak' | 'lessons_complete' | 'total_keystrokes';

export interface Badge {
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
    category: BadgeCategory;
    rarity: BadgeRarity;
    requirement: {
        type: BadgeRequirementType;
        value: number;
    };
    keystones_reward: number;
}

export interface UserBadge {
    badge_id: string;
    unlocked_at: string;
    progress?: number; // 0-100 for in-progress badges
}

// Rarity colors for UI
export const BADGE_RARITY_COLORS: Record<BadgeRarity, string> = {
    common: '#9ca3af',
    uncommon: '#00ff41',
    rare: '#00d4aa',
    epic: '#aa00ff',
    legendary: '#ffd700',
};
