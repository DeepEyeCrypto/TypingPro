// ═══════════════════════════════════════════════════════════════════
// BADGE TYPES
// ═══════════════════════════════════════════════════════════════════

export type BadgeCategory = 'speed' | 'accuracy' | 'streak' | 'special';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type BadgeRequirementType =
    | 'wpm_milestone'
    | 'accuracy_streak'
    | 'days_streak'
    | 'lessons_complete'
    | 'total_keystrokes';

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
    progress: number;
}

export const BADGE_RARITY_COLORS: Record<BadgeRarity, string> = {
    common: '#9CA3AF',
    uncommon: '#22C55E',
    rare: '#3B82F6',
    epic: '#A855F7',
    legendary: '#F59E0B',
};
