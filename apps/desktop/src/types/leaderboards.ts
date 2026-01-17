// ═══════════════════════════════════════════════════════════════════
// LEADERBOARD TYPES
// ═══════════════════════════════════════════════════════════════════

export interface LeaderboardEntry {
    user_id: string;
    username: string;
    avatar_url?: string;
    wpm: number;
    accuracy: number;
    rank_position: number;
    timestamp?: string;
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'alltime';

export interface LeaderboardTier {
    name: string;
    color: string;
    minRank: number;
    maxRank: number;
}

const LEADERBOARD_TIERS: LeaderboardTier[] = [
    { name: 'Legend', color: '#FFD700', minRank: 1, maxRank: 1 },
    { name: 'Champion', color: '#C0C0C0', minRank: 2, maxRank: 3 },
    { name: 'Elite', color: '#CD7F32', minRank: 4, maxRank: 10 },
    { name: 'Master', color: '#00F3FF', minRank: 11, maxRank: 25 },
    { name: 'Expert', color: '#A855F7', minRank: 26, maxRank: 50 },
    { name: 'Skilled', color: '#22C55E', minRank: 51, maxRank: 100 },
    { name: 'Aspiring', color: '#64748B', minRank: 101, maxRank: Infinity },
];

export function getLeaderboardTier(rank: number): LeaderboardTier {
    return LEADERBOARD_TIERS.find(t => rank >= t.minRank && rank <= t.maxRank) || LEADERBOARD_TIERS[LEADERBOARD_TIERS.length - 1];
}
