import { KeystrokeEvent } from '../../types';

export interface StatsEvent {
    type: 'UPDATE_STATS';
    data: {
        cursorIndex: number;
        errors: number[];
        startTime: number | null;
        contentLength: number;
        keystrokeLog: KeystrokeEvent[];
        wpmTimeline: { timestamp: number; wpm: number }[];
    };
}

self.onmessage = (e: MessageEvent<StatsEvent>) => {
    if (e.data.type === 'UPDATE_STATS') {
        const { cursorIndex, errors, startTime, contentLength, keystrokeLog, wpmTimeline } = e.data.data;

        if (!startTime) return;

        const now = Date.now();
        const durationMs = now - startTime;
        const timeMin = Math.max(0.01, durationMs / 60000);

        // Overall WPM
        const wpm = Math.round((cursorIndex / 5) / timeMin);

        // Rolling WPM (last 10s for more sensitivity in graphs)
        const cutoff = now - 10000;
        const recentKeystrokes = keystrokeLog.filter(k => k.timestamp > cutoff && !k.isError);
        const rollingWpm = Math.round((recentKeystrokes.length / 5) * 6); // Normalize to 60s

        // Accuracy
        const accuracy = Math.round(((cursorIndex - errors.length) / Math.max(1, cursorIndex)) * 100);

        // Progress
        const progress = Math.round((cursorIndex / contentLength) * 100);

        // Combo Calculation
        let currentCombo = 0;
        let bestCombo = 0;
        keystrokeLog.forEach(k => {
            if (!k.isError) {
                currentCombo++;
                if (currentCombo > bestCombo) bestCombo = currentCombo;
            } else {
                currentCombo = 0;
            }
        });

        // Bigram & Hold-time Analysis
        const charStats: Record<string, { holdTimes: number[], latencies: number[] }> = {};
        const bigramStats: Record<string, number[]> = {};

        keystrokeLog.forEach((k, i) => {
            if (!charStats[k.char]) charStats[k.char] = { holdTimes: [], latencies: [] };
            if (k.holdTime !== undefined) charStats[k.char].holdTimes.push(k.holdTime);
            charStats[k.char].latencies.push(k.latency);

            // Bigram tracking (ignore errors for speed analysis)
            if (i > 0 && !k.isError && !keystrokeLog[i - 1].isError) {
                const pair = (keystrokeLog[i - 1].char + k.char).toLowerCase();
                if (!bigramStats[pair]) bigramStats[pair] = [];
                bigramStats[pair].push(k.latency);
            }
        });

        // Identify "Enemy Keys" (High hesitation)
        const enemyKeys = Object.entries(charStats)
            .map(([char, s]) => ({
                char,
                avgHold: s.holdTimes.length > 0 ? s.holdTimes.reduce((a, b) => a + b, 0) / s.holdTimes.length : 0
            }))
            .filter(k => k.avgHold > 150) // Threshold for hesitation
            .sort((a, b) => b.avgHold - a.avgHold)
            .slice(0, 3);

        // Identify "Bigram Bottlenecks" (Slow transitions)
        const bottlenecks = Object.entries(bigramStats)
            .map(([pair, latencies]) => ({
                pair,
                avgLat: latencies.reduce((a, b) => a + b, 0) / latencies.length
            }))
            .filter(b => b.avgLat > 300) // Threshold for slow transitions
            .sort((a, b) => b.avgLat - a.avgLat)
            .slice(0, 3);

        self.postMessage({
            type: 'STATS_UPDATED',
            stats: {
                wpm: rollingWpm,
                totalWpm: wpm,
                accuracy,
                bestCombo,
                errors: errors.length,
                progress,
                wpmTimeline,
                keystrokeLog,
                aiInsights: {
                    enemyKeys,
                    bottlenecks
                }
            }
        });
    }
};
