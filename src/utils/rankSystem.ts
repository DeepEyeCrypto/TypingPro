
export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Radiant';

export interface RankInfo {
    label: RankTier;
    color: string;
    minWpm: number;
    nextRank?: RankTier;
    nextWpm?: number;
    className?: string; // For CSS effects like pulse/glimmer
}

export const RANKS: Record<RankTier, RankInfo> = {
    Bronze: { label: 'Bronze', color: 'rgba(255,255,255,0.8)', minWpm: 0, nextRank: 'Silver', nextWpm: 40 },
    Silver: { label: 'Silver', color: 'rgba(255,255,255,0.85)', minWpm: 40, nextRank: 'Gold', nextWpm: 80 },
    Gold: { label: 'Gold', color: 'rgba(255,255,255,0.9)', minWpm: 80, nextRank: 'Platinum', nextWpm: 120 },
    Platinum: { label: 'Platinum', color: 'rgba(255,255,255,0.95)', minWpm: 120, nextRank: 'Diamond', nextWpm: 160, className: 'rank-pulse' },
    Diamond: { label: 'Diamond', color: '#ffffff', minWpm: 160, nextRank: 'Radiant', nextWpm: 200, className: 'rank-glimmer' },
    Radiant: { label: 'Radiant', color: '#ffffff', minWpm: 200, className: 'rank-radiance' }
};

export const getRank = (wpm: number): RankInfo => {
    if (wpm >= 200) return RANKS.Radiant;
    if (wpm >= 160) return RANKS.Diamond;
    if (wpm >= 120) return RANKS.Platinum;
    if (wpm >= 80) return RANKS.Gold;
    if (wpm >= 40) return RANKS.Silver;
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
