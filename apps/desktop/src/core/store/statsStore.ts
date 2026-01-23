import { create } from 'zustand'
import { CURRICULUM } from '../../data/lessons'

export interface ReplayData {
    charAndTime: { char: string, time: number }[] // Time relative to start
}

export interface SessionResult {
    id: string,
    lessonId: string,
    wpm: number,
    accuracy: number,
    timestamp: number,
    graphData?: { time: number, wpm: number, raw: number }[],
    replayData?: ReplayData
}

export interface LessonStats {
    bestWPM: number,
    bestAccuracy: number,
    attempts: number,
    completed: boolean
}

interface StatsState {
    lessonStats: Record<string, LessonStats>,
    sessionHistory: SessionResult[],
    characterErrors: Record<string, number>,
    bestReplays: Record<string, ReplayData>, // Best replay per lesson
    unlockedIds: string[],
    completedIds: string[],
    isInitialized: boolean, // New initialization flag
    getStats: () => {
        bestWpm: number,
        wpm: number,
        accuracy: number,
        streak: number
    },
    initialize: () => void, // New init function
    recordAttempt: (lessonId: string, wpm: number, accuracy: number, errors?: Record<string, number>, graphData?: { time: number, wpm: number, raw: number }[], replayData?: ReplayData) => void,
    loadStats: (stats: Record<string, LessonStats>, history?: SessionResult[], errors?: Record<string, number>, replays?: Record<string, ReplayData>, unlocked?: string[], completed?: string[]) => void,
    setProgress: (unlocked: string[], completed: string[]) => void
}

export const useStatsStore = create<StatsState>((set, get) => ({
    lessonStats: {},
    sessionHistory: [],
    characterErrors: {},
    bestReplays: {},
    unlockedIds: CURRICULUM.map(l => l.id),
    completedIds: [],
    isInitialized: false,

    initialize: () => {
        if (get().isInitialized) return;

        try {
            console.log("[StatsStore] Initializing (Hydrating from localStorage)...");
            const lessonStats = JSON.parse(localStorage.getItem('typing_stats') || '{}');
            const sessionHistory = JSON.parse(localStorage.getItem('typing_history') || '[]');
            const characterErrors = JSON.parse(localStorage.getItem('typing_errors') || '{}');
            const bestReplays = JSON.parse(localStorage.getItem('typing_replays') || '{}');
            const completedIds = JSON.parse(localStorage.getItem('completedIds') || '[]');

            set({
                lessonStats,
                sessionHistory,
                characterErrors,
                bestReplays,
                completedIds,
                isInitialized: true
            });
            console.log("[StatsStore] Hydration Complete.");
        } catch (e) {
            console.error("[StatsStore] Hydration Failed", e);
            set({ isInitialized: true }); // Still mark as init to avoid loops
        }
    },
    getStats: () => {
        const history = get().sessionHistory;
        if (history.length === 0) return { bestWpm: 0, wpm: 0, accuracy: 100, streak: 0 };

        const wpmValues = history.map(s => s.wpm);
        const bestWpm = Math.max(...wpmValues);
        const totalWpm = history.reduce((acc, s) => acc + s.wpm, 0);
        const totalAcc = history.reduce((acc, s) => acc + s.accuracy, 0);

        const avgWpm = Math.round(totalWpm / history.length);
        const avgAcc = Math.round(totalAcc / history.length);

        return { bestWpm, wpm: avgWpm, accuracy: avgAcc, streak: 0 };
    },

    recordAttempt: (lessonId, wpm, accuracy, errors = {}, graphData = [], replayData) => set((state) => {
        // Update per-lesson bests
        const current = state.lessonStats[lessonId] || { bestWPM: 0, bestAccuracy: 0, attempts: 0, completed: false }
        const isPB = wpm > current.bestWPM

        const updatedLesson = {
            bestWPM: Math.max(current.bestWPM, wpm),
            bestAccuracy: Math.max(current.bestAccuracy, accuracy),
            attempts: current.attempts + 1,
            completed: current.completed || (accuracy === 100 && wpm >= 28)
        }
        const nextLessonStats = { ...state.lessonStats, [lessonId]: updatedLesson }

        // Update Best Replay if PB
        let nextReplays = state.bestReplays
        if (isPB && replayData) {
            nextReplays = { ...state.bestReplays, [lessonId]: replayData }
            localStorage.setItem('typing_replays', JSON.stringify(nextReplays))
        }

        // Update session history
        const session: SessionResult = {
            id: Math.random().toString(36).substring(7),
            lessonId,
            wpm,
            accuracy,
            timestamp: Date.now(),
            graphData,
            replayData
        }
        const nextHistory = [session, ...state.sessionHistory].slice(0, 100) // Keep last 100

        // ... existing error logic ...
        const nextErrors = { ...state.characterErrors }
        Object.entries(errors).forEach(([char, count]) => {
            nextErrors[char] = (nextErrors[char] || 0) + count
        })

        // Persist
        localStorage.setItem('typing_stats', JSON.stringify(nextLessonStats))
        localStorage.setItem('typing_history', JSON.stringify(nextHistory))
        localStorage.setItem('typing_errors', JSON.stringify(nextErrors))

        return {
            lessonStats: nextLessonStats,
            sessionHistory: nextHistory,
            characterErrors: nextErrors,
            bestReplays: nextReplays
        }
    }),

    loadStats: (stats, history = [], errors = {}, replays = {}, unlocked = ['l1'], completed = []) => {
        localStorage.setItem('typing_stats', JSON.stringify(stats))
        localStorage.setItem('typing_history', JSON.stringify(history))
        localStorage.setItem('typing_errors', JSON.stringify(errors))
        localStorage.setItem('typing_replays', JSON.stringify(replays))
        localStorage.setItem('unlockedIds', JSON.stringify(unlocked))
        localStorage.setItem('completedIds', JSON.stringify(completed))
        set({ lessonStats: stats, sessionHistory: history, characterErrors: errors, bestReplays: replays, unlockedIds: unlocked, completedIds: completed })
    },

    setProgress: (unlocked, completed) => {
        localStorage.setItem('unlockedIds', JSON.stringify(unlocked))
        localStorage.setItem('completedIds', JSON.stringify(completed))
        set({ unlockedIds: unlocked, completedIds: completed })
    }
}))
