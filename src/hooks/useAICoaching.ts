import { useCallback } from 'react';
import { AICoachRecommendation, WeaknessHeatmap, Stats } from '../../types';

export const useAICoaching = () => {
    const generateRecommendation = useCallback((
        stats: Stats,
        heatmap: WeaknessHeatmap,
        enemyKeys: { char: string }[],
        bottlenecks: { pair: string }[]
    ): AICoachRecommendation => {

        // Low Accuracy Focus
        if (stats.accuracy < 94) {
            return {
                type: 'drill',
                title: 'Accuracy Overhaul',
                description: 'Your accuracy is dipping. Let\'s slow down and focus on precision with these keys.',
                drillChars: enemyKeys.map(k => k.char),
            };
        }

        // High Latency for Specific Keys
        if (enemyKeys.length > 0) {
            return {
                type: 'drill',
                title: 'Eliminate Hesitation',
                description: `You're hesitating on "${enemyKeys[0].char.toUpperCase()}". Let's build muscle memory for it.`,
                drillChars: [enemyKeys[0].char],
            };
        }

        // Bottleneck Bigrams
        if (bottlenecks.length > 0) {
            return {
                type: 'drill',
                title: 'Smooth Transitions',
                description: `Your transition for "${bottlenecks[0].pair.toUpperCase()}" is a bit slow. Try some focused bigram reps.`,
                drillChars: [bottlenecks[0].pair[0], bottlenecks[0].pair[1]],
            };
        }

        // High Performance
        if (stats.wpm > 60 && stats.accuracy > 98) {
            return {
                type: 'tip',
                title: 'Elite Pacing',
                description: 'Incredible form! Challenge yourself by aiming for a higher WPM goal in the next lesson.',
            };
        }

        return {
            type: 'tip',
            title: 'Maintain Momentum',
            description: 'You\'re making great progress. Keep practicing consistently to lock in these speeds.',
        };
    }, []);

    const predictMilestones = useCallback((history: any[]): any[] => {
        // Basic linear prediction based on recent history
        if (history.length < 5) return [];

        const recentWpm = history.slice(-5).map(h => h.wpm);
        const avgWpm = recentWpm.reduce((a, b) => a + b, 0) / recentWpm.length;
        const growth = (recentWpm[recentWpm.length - 1] - recentWpm[0]) / recentWpm.length;

        return [
            {
                targetWpm: Math.round(avgWpm + 10),
                estimatedDays: growth > 0 ? Math.ceil(10 / growth) : 14,
                confidence: 0.7
            }
        ];
    }, []);

    return {
        generateRecommendation,
        predictMilestones,
    };
};
