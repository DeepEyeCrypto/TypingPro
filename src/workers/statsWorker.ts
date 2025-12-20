
/**
 * statsWorker.ts - High-performance off-thread stats calculation
 */

export interface StatsEvent {
    type: 'UPDATE_STATS';
    data: {
        cursorIndex: number;
        errors: number[];
        startTime: number | null;
        contentLength: number;
        keypressTimestamps: number[];
    };
}

self.onmessage = (e: MessageEvent<StatsEvent>) => {
    if (e.data.type === 'UPDATE_STATS') {
        const { cursorIndex, errors, startTime, contentLength, keypressTimestamps } = e.data.data;

        if (!startTime) return;

        const now = Date.now();
        const durationMs = now - startTime;
        const timeMin = Math.max(0.01, durationMs / 60000);

        // Overall WPM
        const wpm = Math.round((cursorIndex / 5) / timeMin);

        // Rolling WPM (last 60s)
        const cutoff = now - 60000;
        const filteredKeypresses = keypressTimestamps.filter(t => t > cutoff);
        const rollingWpm = Math.round(filteredKeypresses.length / 5);

        // Accuracy
        const accuracy = Math.round(((cursorIndex - errors.length) / Math.max(1, cursorIndex)) * 100);

        // Progress
        const progress = Math.round((cursorIndex / contentLength) * 100);

        self.postMessage({
            type: 'STATS_UPDATED',
            stats: {
                wpm: rollingWpm, // Use rolling for live display? or hybrid?
                totalWpm: wpm,
                accuracy,
                errors: errors.length,
                progress
            }
        });
    }
};
