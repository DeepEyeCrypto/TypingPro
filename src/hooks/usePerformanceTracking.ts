import { useState, useCallback, useRef, useEffect } from 'react';
import { Stats, KeystrokeEvent } from '../../types';

export const usePerformanceTracking = (contentLength: number) => {
    const [stats, setStats] = useState<Stats>({
        wpm: 0,
        accuracy: 100,
        errors: 0,
        progress: 0,
        startTime: null,
        completed: false,
        wpmTimeline: [],
        keystrokeLog: [],
    });

    const statsRef = useRef<Stats>(stats);

    useEffect(() => {
        statsRef.current = stats;
    }, [stats]);

    const updateStats = useCallback((newStats: Partial<Stats>) => {
        setStats(prev => ({
            ...prev,
            ...newStats,
        }));
    }, []);

    const calculateRealTimeStats = useCallback((
        cursorIndex: number,
        errors: number[],
        keystrokeLog: KeystrokeEvent[],
        startTime: number | null
    ) => {
        if (!startTime) return;

        const now = Date.now();
        const durationMs = now - startTime;
        const timeMin = Math.max(0.01, durationMs / 60000);

        const wpm = Math.round((cursorIndex / 5) / timeMin);
        const accuracy = Math.round(((cursorIndex - errors.length) / Math.max(1, cursorIndex)) * 100);
        const progress = Math.min(100, Math.round((cursorIndex / contentLength) * 100));

        // Calculate speed indicator (simple heuristic for now: current speed vs avg of last 5 entries)
        const recentWpm = statsRef.current.wpmTimeline?.slice(-5) || [];
        const avgRecentWpm = recentWpm.length > 0
            ? recentWpm.reduce((a, b) => a + b.wpm, 0) / recentWpm.length
            : wpm;

        const speedIndicator = Math.min(100, Math.max(0, (wpm / Math.max(1, avgRecentWpm)) * 50 + 25));

        updateStats({
            wpm,
            accuracy,
            errors: errors.length,
            progress,
            keystrokeLog,
            speedIndicator
        });
    }, [contentLength, updateStats]);

    return {
        stats,
        updateStats,
        calculateRealTimeStats,
    };
};
