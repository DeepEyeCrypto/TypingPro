
import React, { useMemo } from 'react';
import { HistoryEntry, KeystrokeEvent } from '../../types';

interface HeatmapData {
    [key: string]: {
        color: string;
        opacity: number;
        avgLatency: number;
        errorRate: number;
    };
}

export const useHeatmap = (history: HistoryEntry[]) => {
    return useMemo(() => {
        const keyData: Record<string, { latencies: number[], errors: number, total: number }> = {};

        // Analyze last 5 sessions for the heatmap (rolling window)
        const recentSessions = history.slice(0, 5);

        recentSessions.forEach(session => {
            if (!session.keystrokeLog) return;
            session.keystrokeLog.forEach(event => {
                const char = event.expectedChar.toLowerCase();
                if (!keyData[char]) {
                    keyData[char] = { latencies: [], errors: 0, total: 0 };
                }
                keyData[char].total++;
                if (event.isError) {
                    keyData[char].errors++;
                } else {
                    keyData[char].latencies.push(event.latency);
                }
            });
        });

        const heatmap: HeatmapData = {};
        Object.keys(keyData).forEach(char => {
            const data = keyData[char];
            const avgLatency = data.latencies.length > 0
                ? data.latencies.reduce((a, b) => a + b, 0) / data.latencies.length
                : 500;
            const errorRate = data.errors / data.total;

            // Color logic: 
            // Speed: < 100ms = Green, > 500ms = Red
            // Accuracy: > 5% error = Red shift

            const speedScore = Math.max(0, Math.min(1, (avgLatency - 100) / 400)); // 0 (fast) to 1 (slow)
            const accuracyScore = Math.min(1, errorRate * 10); // Scale 10% error to full score

            const combinedScore = (speedScore + accuracyScore) / 2;

            // Interpolate between Emerald (Green) and Rose (Red)
            // hsl(142, 69%, 58%) -> Emerald 400
            // hsl(346, 77%, 49%) -> Rose 500

            const h = 142 - (combinedScore * (142 - (-14))); // Wrap around for red? No, simpler math:
            // Green (142) to Orange (40) to Red (0)
            const hue = Math.max(0, 142 - (combinedScore * 142));

            heatmap[char] = {
                color: `hsla(${hue}, 80%, 50%, 0.4)`,
                opacity: combinedScore,
                avgLatency,
                errorRate
            };
        });

        return heatmap;
    }, [history]);
};

// No default export as it's a hook/utility
