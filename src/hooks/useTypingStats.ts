import { useMemo } from 'react';

export interface TypingSession {
    id: number;
    wpm: number;
    accuracy: number;
    date: string;
}

const generateMockData = (count: number): TypingSession[] => {
    return Array.from({ length: count }).map((_, i) => {
        // Generate WPM between 40 and 90 with some random fluctuation
        const baseWpm = 40 + Math.random() * 50;
        const wpm = Math.round(baseWpm);

        // Generate Accuracy between 90% and 100%
        const accuracy = 90 + Math.random() * 10;

        return {
            id: i,
            wpm,
            accuracy: parseFloat(accuracy.toFixed(1)),
            date: new Date(Date.now() - (count - i) * 86400000).toISOString().split('T')[0], // Past days
        };
    });
};

export const useTypingStats = () => {
    const stats = useMemo(() => {
        return generateMockData(20);
    }, []);

    // Calculate generic aggregate stats
    const averageWpm = useMemo(() => {
        if (stats.length === 0) return 0;
        return Math.round(stats.reduce((acc, curr) => acc + curr.wpm, 0) / stats.length);
    }, [stats]);

    const latestAccuracy = useMemo(() => {
        if (stats.length === 0) return 0;
        return stats[stats.length - 1].accuracy;
    }, [stats]);

    return {
        data: stats,
        averageWpm,
        latestAccuracy
    };
};
