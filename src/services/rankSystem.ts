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
        maxWPM: 40,
        accentColor: '#CD7F32',
        soundTheme: 'basic',
        level: 1,
        icon: '🥉'
    },
    {
        name: 'Silver',
        minWPM: 41,
        maxWPM: 80,
        accentColor: '#C0C0C0',
        soundTheme: 'soft',
        level: 2,
        icon: '🥈'
    },
    {
        name: 'Gold',
        minWPM: 81,
        maxWPM: 120,
        accentColor: '#FFD700',
        soundTheme: 'crisp',
        level: 3,
        icon: '🥇'
    },
    {
        name: 'Platinum',
        minWPM: 121,
        maxWPM: 160,
        accentColor: '#E5E4E2',
        soundTheme: 'mechanical',
        level: 4,
        icon: '💎'
    },
    {
        name: 'Diamond',
        minWPM: 161,
        maxWPM: 200,
        accentColor: '#B9F2FF',
        soundTheme: 'premium',
        level: 5,
        icon: '💠'
    },
    {
        name: 'Master',
        minWPM: 201,
        maxWPM: 250,
        accentColor: '#FF10F0',
        soundTheme: 'elite',
        level: 6,
        icon: '⭐'
    },
    {
        name: 'Grandmaster',
        minWPM: 251,
        maxWPM: 300,
        accentColor: '#8A2BE2',
        soundTheme: 'legendary',
        level: 7,
        icon: '👑'
    },
    {
        name: 'Radiant',
        minWPM: 301,
        maxWPM: 999,
        accentColor: '#FF6EC7',
        soundTheme: 'divine',
        level: 8,
        icon: '✨'
    },
]

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
