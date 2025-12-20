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

        self.postMessage({
            type: 'STATS_UPDATED',
            stats: {
                wpm: rollingWpm,
                totalWpm: wpm,
                accuracy,
                errors: errors.length,
                progress,
                wpmTimeline,
                keystrokeLog
            }
        });
    }
};
