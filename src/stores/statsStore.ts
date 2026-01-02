import { create } from 'zustand'

export interface SessionResult {
    id: string,
    lessonId: string,
    wpm: number,
    accuracy: number,
    timestamp: number
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
    recordAttempt: (lessonId: string, wpm: number, accuracy: number, errors?: Record<string, number>) => void,
    loadStats: (stats: Record<string, LessonStats>, history?: SessionResult[], errors?: Record<string, number>) => void
}

export const useStatsStore = create<StatsState>((set) => ({
    lessonStats: JSON.parse(localStorage.getItem('typing_stats') || '{}'),
    sessionHistory: JSON.parse(localStorage.getItem('typing_history') || '[]'),
    characterErrors: JSON.parse(localStorage.getItem('typing_errors') || '{}'),

    recordAttempt: (lessonId, wpm, accuracy, errors = {}) => set((state) => {
        // Update per-lesson bests
        const current = state.lessonStats[lessonId] || { bestWPM: 0, bestAccuracy: 0, attempts: 0, completed: false }
        const updatedLesson = {
            bestWPM: Math.max(current.bestWPM, wpm),
            bestAccuracy: Math.max(current.bestAccuracy, accuracy),
            attempts: current.attempts + 1,
            completed: current.completed || (accuracy === 100 && wpm >= 28)
        }
        const nextLessonStats = { ...state.lessonStats, [lessonId]: updatedLesson }

        // Update session history
        const session: SessionResult = {
            id: Math.random().toString(36).substring(7),
            lessonId,
            wpm,
            accuracy,
            timestamp: Date.now()
        }
        const nextHistory = [session, ...state.sessionHistory].slice(0, 100) // Keep last 100

        // Update error heatmap
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
            characterErrors: nextErrors
        }
    }),

    loadStats: (stats, history = [], errors = {}) => {
        localStorage.setItem('typing_stats', JSON.stringify(stats))
        localStorage.setItem('typing_history', JSON.stringify(history))
        localStorage.setItem('typing_errors', JSON.stringify(errors))
        set({ lessonStats: stats, sessionHistory: history, characterErrors: errors })
    }
}))
