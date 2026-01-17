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
    recordAttempt: (lessonId: string, wpm: number, accuracy: number, errors?: Record<string, number>, graphData?: { time: number, wpm: number, raw: number }[], replayData?: ReplayData) => void,
    loadStats: (stats: Record<string, LessonStats>, history?: SessionResult[], errors?: Record<string, number>, replays?: Record<string, ReplayData>, unlocked?: string[], completed?: string[]) => void,
    setProgress: (unlocked: string[], completed: string[]) => void
}

export const useStatsStore = create<StatsState>((set) => ({
    lessonStats: JSON.parse(localStorage.getItem('typing_stats') || '{}'),
    sessionHistory: JSON.parse(localStorage.getItem('typing_history') || '[]'),
    characterErrors: JSON.parse(localStorage.getItem('typing_errors') || '{}'),
    bestReplays: JSON.parse(localStorage.getItem('typing_replays') || '{}'),
    unlockedIds: CURRICULUM.map(l => l.id), // UNLOCK_ALL: Always unlock everything by default
    completedIds: JSON.parse(localStorage.getItem('completedIds') || '[]'),

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
