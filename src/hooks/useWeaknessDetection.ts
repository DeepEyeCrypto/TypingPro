import { useCallback } from 'react';
import { KeystrokeEvent, WeaknessHeatmap, WeaknessData } from '../../types';

export const useWeaknessDetection = () => {
    const analyzeSession = useCallback((keystrokeLog: KeystrokeEvent[]): WeaknessHeatmap => {
        const heatmap: WeaknessHeatmap = {};

        keystrokeLog.forEach(event => {
            const char = event.expectedChar.toLowerCase();
            if (!heatmap[char]) {
                heatmap[char] = {
                    accuracy: 0,
                    avgLatency: 0,
                    errorCount: 0,
                    lastTested: new Date().toISOString(),
                };
            }

            const data = heatmap[char];
            data.errorCount += event.isError ? 1 : 0;

            // Update running average for latency
            const totalPresses = keystrokeLog.filter(k => k.expectedChar.toLowerCase() === char).length;
            data.avgLatency = (data.avgLatency * (totalPresses - 1) + event.latency) / totalPresses;

            // Accuracy for this character in this session
            const correctPresses = keystrokeLog.filter(k => k.expectedChar.toLowerCase() === char && !k.isError).length;
            data.accuracy = Math.round((correctPresses / totalPresses) * 100);
        });

        return heatmap;
    }, []);

    const identifyEnemyKeys = useCallback((heatmap: WeaknessHeatmap) => {
        return Object.entries(heatmap)
            .map(([char, data]) => ({ char, avgHold: (data as WeaknessData).avgLatency, ...(data as WeaknessData) }))
            .filter(k => k.accuracy < 90 || k.avgHold > 300)
            .sort((a, b) => (b.errorCount - a.errorCount) || (b.avgHold - a.avgHold))
            .slice(0, 3);
    }, []);

    const identifyBottlenecks = useCallback((keystrokeLog: KeystrokeEvent[]) => {
        const bigrams: Record<string, number[]> = {};

        for (let i = 1; i < keystrokeLog.length; i++) {
            const prev = keystrokeLog[i - 1];
            const curr = keystrokeLog[i];
            if (!prev.isError && !curr.isError) {
                const pair = (prev.char + curr.char).toLowerCase();
                if (!bigrams[pair]) bigrams[pair] = [];
                bigrams[pair].push(curr.latency);
            }
        }

        return Object.entries(bigrams)
            .map(([pair, latencies]) => ({
                pair,
                avgLat: latencies.reduce((a, b) => a + b, 0) / latencies.length
            }))
            .filter(b => b.avgLat > 400)
            .sort((a, b) => b.avgLat - a.avgLat)
            .slice(0, 3);
    }, []);

    return {
        analyzeSession,
        identifyEnemyKeys,
        identifyBottlenecks,
    };
};
