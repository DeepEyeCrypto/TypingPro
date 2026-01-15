// ═══════════════════════════════════════════════════════════════════
// LEADERBOARD TYPES - Competitive rankings
// ═══════════════════════════════════════════════════════════════════

export type LeaderboardPeriod = 'daily' | 'weekly' | 'alltime';

export interface LeaderboardEntry {
    user_id: string;
    username: string;
    avatar_url?: string;
    wpm: number;
    accuracy: number;
    rank_position: number;
    keystones?: number;
    is_current_user?: boolean;
}

export interface LeaderboardData {
    period: LeaderboardPeriod;
    entries: LeaderboardEntry[];
    updated_at: string;
    user_rank?: number;
}

// Rank tiers based on position
export function getLeaderboardTier(position: number): { name: string; color: string } {
    if (position === 1) return { name: 'Champion', color: '#ffd700' };
    if (position === 2) return { name: 'Runner-up', color: '#c0c0c0' };
    if (position === 3) return { name: 'Bronze', color: '#cd7f32' };
    if (position <= 10) return { name: 'Top 10', color: 'rgba(255, 255, 255, 0.9)' };
    if (position <= 50) return { name: 'Top 50', color: '#00d4aa' };
    if (position <= 100) return { name: 'Top 100', color: '#aa00ff' };
    return { name: 'Challenger', color: '#9ca3af' };
}
