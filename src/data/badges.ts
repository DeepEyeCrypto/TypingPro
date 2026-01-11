// ═══════════════════════════════════════════════════════════════════
// BADGE DEFINITIONS - All unlockable badges in TypingPro
// ═══════════════════════════════════════════════════════════════════

import { Badge } from '../types/badges';

export const BADGES: Badge[] = [
    // ─────────────────────────────────────────
    // SPEED BADGES
    // ─────────────────────────────────────────
    {
        id: 'speed-30',
        slug: 'speedster_30',
        name: 'Speedster I',
        description: 'Reach 30 WPM',
        icon: '⚡',
        category: 'speed',
        rarity: 'common',
        requirement: { type: 'wpm_milestone', value: 30 },
        keystones_reward: 10,
    },
    {
        id: 'speed-50',
        slug: 'speedster_50',
        name: 'Speedster II',
        description: 'Reach 50 WPM',
        icon: '⚡',
        category: 'speed',
        rarity: 'uncommon',
        requirement: { type: 'wpm_milestone', value: 50 },
        keystones_reward: 25,
    },
    {
        id: 'speed-70',
        slug: 'speedster_70',
        name: 'Speedster III',
        description: 'Reach 70 WPM',
        icon: '⚡',
        category: 'speed',
        rarity: 'rare',
        requirement: { type: 'wpm_milestone', value: 70 },
        keystones_reward: 50,
    },
    {
        id: 'speed-100',
        slug: 'lightning_fingers',
        name: 'Lightning Fingers',
        description: 'Reach 100 WPM',
        icon: '🌩️',
        category: 'speed',
        rarity: 'epic',
        requirement: { type: 'wpm_milestone', value: 100 },
        keystones_reward: 100,
    },
    {
        id: 'speed-120',
        slug: 'speed_demon',
        name: 'Speed Demon',
        description: 'Reach 120 WPM',
        icon: '👹',
        category: 'speed',
        rarity: 'legendary',
        requirement: { type: 'wpm_milestone', value: 120 },
        keystones_reward: 250,
    },

    // ─────────────────────────────────────────
    // ACCURACY BADGES
    // ─────────────────────────────────────────
    {
        id: 'accuracy-5',
        slug: 'perfectionist_5',
        name: 'Perfectionist I',
        description: '5 perfect accuracy sessions',
        icon: '🎯',
        category: 'accuracy',
        rarity: 'common',
        requirement: { type: 'accuracy_streak', value: 5 },
        keystones_reward: 15,
    },
    {
        id: 'accuracy-25',
        slug: 'perfectionist_25',
        name: 'Perfectionist II',
        description: '25 perfect accuracy sessions',
        icon: '🎯',
        category: 'accuracy',
        rarity: 'rare',
        requirement: { type: 'accuracy_streak', value: 25 },
        keystones_reward: 75,
    },
    {
        id: 'accuracy-100',
        slug: 'zen_master',
        name: 'Zen Master',
        description: '100 perfect accuracy sessions',
        icon: '🧘',
        category: 'accuracy',
        rarity: 'legendary',
        requirement: { type: 'accuracy_streak', value: 100 },
        keystones_reward: 300,
    },

    // ─────────────────────────────────────────
    // STREAK BADGES
    // ─────────────────────────────────────────
    {
        id: 'streak-7',
        slug: 'week_warrior',
        name: 'Week Warrior',
        description: '7-day practice streak',
        icon: '🔥',
        category: 'streak',
        rarity: 'common',
        requirement: { type: 'days_streak', value: 7 },
        keystones_reward: 25,
    },
    {
        id: 'streak-30',
        slug: 'month_master',
        name: 'Month Master',
        description: '30-day practice streak',
        icon: '🔥',
        category: 'streak',
        rarity: 'rare',
        requirement: { type: 'days_streak', value: 30 },
        keystones_reward: 100,
    },
    {
        id: 'streak-100',
        slug: 'century_legend',
        name: 'Century Legend',
        description: '100-day practice streak',
        icon: '💯',
        category: 'streak',
        rarity: 'legendary',
        requirement: { type: 'days_streak', value: 100 },
        keystones_reward: 500,
    },

    // ─────────────────────────────────────────
    // CURRICULUM BADGES
    // ─────────────────────────────────────────
    {
        id: 'lessons-10',
        slug: 'eager_learner',
        name: 'Eager Learner',
        description: 'Complete 10 lessons',
        icon: '📚',
        category: 'special',
        rarity: 'common',
        requirement: { type: 'lessons_complete', value: 10 },
        keystones_reward: 20,
    },
    {
        id: 'lessons-25',
        slug: 'scholar',
        name: 'Scholar',
        description: 'Complete 25 lessons',
        icon: '🎓',
        category: 'special',
        rarity: 'uncommon',
        requirement: { type: 'lessons_complete', value: 25 },
        keystones_reward: 50,
    },
    {
        id: 'lessons-50',
        slug: 'curriculum_master',
        name: 'Curriculum Master',
        description: 'Complete all 50 lessons',
        icon: '👑',
        category: 'special',
        rarity: 'legendary',
        requirement: { type: 'lessons_complete', value: 50 },
        keystones_reward: 500,
    },
];

// Helper functions
export function getBadgeById(id: string): Badge | undefined {
    return BADGES.find(b => b.id === id);
}

export function getBadgesByCategory(category: string): Badge[] {
    return BADGES.filter(b => b.category === category);
}

export function getBadgesByRarity(rarity: string): Badge[] {
    return BADGES.filter(b => b.rarity === rarity);
}
