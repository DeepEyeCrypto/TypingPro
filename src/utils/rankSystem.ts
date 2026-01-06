
export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Emerald' | 'Diamond';

export interface RankInfo {
    label: RankTier;
    color: string;
    minWpm: number;
    nextRank?: RankTier;
    nextWpm?: number;
    className?: string; // For CSS effects like pulse/glimmer
}

export const RANKS: Record<RankTier, RankInfo> = {
    Bronze: { label: 'Bronze', color: '#cd7f32', minWpm: 0, nextRank: 'Silver', nextWpm: 30 },
    Silver: { label: 'Silver', color: '#c0c0c0', minWpm: 30, nextRank: 'Gold', nextWpm: 60 },
    Gold: { label: 'Gold', color: '#ffd700', minWpm: 60, nextRank: 'Emerald', nextWpm: 90 },
    Emerald: { label: 'Emerald', color: '#10b981', minWpm: 90, nextRank: 'Diamond', nextWpm: 120, className: 'rank-pulse' },
    Diamond: { label: 'Diamond', color: '#00ffff', minWpm: 120, className: 'rank-glimmer' }
};

export const getRank = (wpm: number): RankInfo => {
    if (wpm >= 120) return RANKS.Diamond;
    if (wpm >= 90) return RANKS.Emerald;
    if (wpm >= 60) return RANKS.Gold;
    if (wpm >= 30) return RANKS.Silver;
    return RANKS.Bronze;
};

export const getProgressToNextRank = (wpm: number) => {
    const currentRank = getRank(wpm);
    if (!currentRank.nextWpm) return { needed: 0, percent: 100 };

    const wpmInTier = wpm - currentRank.minWpm;
    const tierSpan = currentRank.nextWpm - currentRank.minWpm;
    const percent = Math.min(100, Math.max(0, (wpmInTier / tierSpan) * 100));
    const needed = Math.max(0, currentRank.nextWpm - wpm);

    return { needed, percent, nextLabel: currentRank.nextRank };
};
