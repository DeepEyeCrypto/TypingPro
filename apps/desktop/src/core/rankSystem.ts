/**
 * RANK SYSTEM - Gamified Progression
 * Maps WPM ranges to rank tiers with colors and themes
 */

export interface Rank {
    name: string
    minWPM: number
    maxWPM: number
    accentColor: string
    soundTheme: string
    level: number
    icon: string
}

export const RANKS: Rank[] = [
    {
        name: 'Bronze',
        minWPM: 0,
        maxWPM: 39,
        accentColor: '#CD7F32',
        soundTheme: 'basic',
        level: 1,
        icon: '🥉'
    },
    {
        name: 'Silver',
        minWPM: 40,
        maxWPM: 79,
        accentColor: '#C0C0C0',
        soundTheme: 'soft',
        level: 2,
        icon: '🥈'
    },
    {
        name: 'Gold',
        minWPM: 80,
        maxWPM: 119,
        accentColor: '#FFD700',
        soundTheme: 'crisp',
        level: 3,
        icon: '🥇'
    },
    {
        name: 'Platinum',
        minWPM: 120,
        maxWPM: 159,
        accentColor: '#E5E4E2',
        soundTheme: 'mechanical',
        level: 4,
        icon: '💎'
    },
    {
        name: 'Diamond',
        minWPM: 160,
        maxWPM: 199,
        accentColor: '#B9F2FF',
        soundTheme: 'premium',
        level: 5,
        icon: '💠'
    },
    {
        name: 'Radiant',
        minWPM: 200,
        maxWPM: 999,
        accentColor: '#FF6EC7',
        soundTheme: 'divine',
        level: 6,
        icon: '✨'
    },
]

export interface LevelInfo {
    level: number;
    currentXP: number;
    xpToNext: number;
    progress: number;
}

export const calculateLevel = (xp: number): number => {
    // Basic logarithmic leveling: Level = floor(sqrt(xp/50)) + 1
    // 0 XP = Lvl 1
    // 200 XP = Lvl 3
    // 800 XP = Lvl 5
    // 5000 XP = Lvl 11
    return Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1
}

export const getLevelInfo = (xp: number): LevelInfo => {
    const level = calculateLevel(xp)
    const currentLevelXP = Math.pow(level - 1, 2) * 50
    const nextLevelXP = Math.pow(level, 2) * 50

    const xpInLevel = xp - currentLevelXP
    const xpToNext = nextLevelXP - currentLevelXP
    const progress = (xpInLevel / xpToNext) * 100

    return {
        level,
        currentXP: xpInLevel,
        xpToNext,
        progress: Math.min(100, Math.max(0, progress))
    }
}

export const RANK_REWARDS: Record<string, string[]> = {
    'Bronze': ['Basic Sound Set', 'Legacy Theme'],
    'Silver': ['Soft Taps Sound', 'Cyberpunk Accent'],
    'Gold': ['Crisp Clicks', 'Glass Brilliance'],
    'Platinum': ['Mechanical MX Blue', 'Aura Glow'],
    'Diamond': ['Premium Thock', 'Prismatic UI'],
    'Radiant': ['Divine Resonance', 'Neural Overload UI']
}

/**
 * Get rank for a given WPM
 */
export const getRankForWPM = (wpm: number): Rank => {
    const rank = RANKS.find(r => wpm >= r.minWPM && wpm <= r.maxWPM)
    return rank || RANKS[0]
}

/**
 * Calculate progress percentage within current rank
 */
export const calculateProgress = (wpm: number): number => {
    const rank = getRankForWPM(wpm)
    const range = rank.maxWPM - rank.minWPM
    const progress = ((wpm - rank.minWPM) / range) * 100
    return Math.min(100, Math.max(0, progress))
}

/**
 * Get next rank
 */
export const getNextRank = (currentRank: Rank): Rank | null => {
    const currentIndex = RANKS.findIndex(r => r.name === currentRank.name)
    return currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : null
}

/**
 * Calculate WPM needed for next rank
 */
export const getWPMToNextRank = (wpm: number): number => {
    const currentRank = getRankForWPM(wpm)
    const nextRank = getNextRank(currentRank)
    return nextRank ? nextRank.minWPM - wpm : 0
}

/**
 * Calculate XP (Elo-Lite) for a race session
 * XP = (WPM * (Accuracy/100)) * (1 + StreakMultiplier)
 */
export const calculateXP = (wpm: number, accuracy: number, streak: number = 0): number => {
    const baseXP = wpm * (accuracy / 100)
    const multiplier = 1 + (streak * 0.1) // 10% bonus per streak point
    return Math.round(baseXP * multiplier)
}

// ═══════════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY ALIASES (for migration from utils/rankSystem)
// ═══════════════════════════════════════════════════════════════════

// Type alias for backward compatibility
export type RankInfo = Rank

/**
 * Alias for getRankForWPM (backward compatible)
 */
export const getRank = getRankForWPM

/**
 * Get progress info to next rank
 */
export const getProgressToNextRank = (wpm: number): { percent: number; wpmNeeded: number } => {
    const percent = calculateProgress(wpm)
    const wpmNeeded = getWPMToNextRank(wpm)
    return { percent, wpmNeeded }
}
