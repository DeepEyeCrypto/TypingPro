import { useCallback } from 'react';
import { KeystrokeEvent, WeaknessHeatmap, WeaknessData } from '../../types';

export const useWeaknessDetection = () => {
    const analyzeSession = useCallback((keystrokeLog: KeystrokeEvent[]): WeaknessHeatmap => {
        const heatmap: WeaknessHeatmap = {};

        // Group events by character
        const charGroups: Record<string, KeystrokeEvent[]> = {};
        keystrokeLog.forEach(event => {
            const char = event.expectedChar.toLowerCase();
            if (!charGroups[char]) charGroups[char] = [];
            charGroups[char].push(event);
        });

        Object.entries(charGroups).forEach(([char, events]) => {
            const totalPresses = events.length;
            const errorCount = events.filter(e => e.isError).length;
            const correctEvents = events.filter(e => !e.isError);
            const avgLatency = correctEvents.length > 0
                ? correctEvents.reduce((acc, curr) => acc + curr.latency, 0) / correctEvents.length
                : 0;
            const accuracy = Math.round(((totalPresses - errorCount) / totalPresses) * 100);

            heatmap[char] = {
                accuracy,
                avgLatency,
                errorCount,
                lastTested: new Date().toISOString(),
            };
        });

        return heatmap;
    }, []);

    const identifyEnemyKeys = useCallback((heatmap: WeaknessHeatmap) => {
        return Object.entries(heatmap)
            .map(([char, data]) => ({ char, ...(data as WeaknessData) }))
            .filter(k => k.accuracy < 90 || k.avgLatency > 300)
            .sort((a, b) => (b.errorCount - a.errorCount) || (b.avgLatency - a.avgLatency))
            .slice(0, 3);
    }, []);

    const identifyBottlenecks = useCallback((keystrokeLog: KeystrokeEvent[]) => {
        const bigrams: Record<string, number[]> = {};

        for (let i = 1; i < keystrokeLog.length; i++) {
            const prev = keystrokeLog[i - 1];
            const curr = keystrokeLog[i];
            if (!prev.isError && !curr.isError) {
                const pair = (prev.expectedChar + curr.expectedChar).toLowerCase();
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
