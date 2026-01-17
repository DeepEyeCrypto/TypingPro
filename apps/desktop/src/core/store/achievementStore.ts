import { create } from 'zustand'
import { UserBadge } from '../types/badges'
import { StreakData } from '../services/streakService'
import { UserCertification } from '../types/certifications'

interface AchievementState {
    unlockedBadges: string[],
    streak: StreakData,
    certifications: UserCertification[],
    keystones: number,
    totalKeystrokes: number,
    perfectSessions: number,
    challengeProgress: Record<string, any>,

    // Actions
    setAchievements: (data: {
        badges?: string[],
        streak?: StreakData,
        certifications?: UserCertification[],
        keystones?: number,
        totalKeystrokes?: number,
        perfectSessions?: number,
        challengeProgress?: Record<string, any>
    }) => void,
    unlockBadge: (badgeId: string) => void,
    updateStreak: (streak: StreakData) => void,
    addCertification: (cert: UserCertification) => void,
    addKeystones: (amount: number) => void,
    incrementStats: (keystrokes: number, isPerfect: boolean) => void,
    updateChallengeProgress: (challengeId: string, progress: any) => void,

    // Notification Queuing
    notifications: any[],
    addNotification: (notification: any) => void,
    clearNotification: (id: string) => void,

    resetAchievements: () => void
}

export const useAchievementStore = create<AchievementState>((set) => ({
    unlockedBadges: JSON.parse(localStorage.getItem('unlocked_badges') || '[]'),
    streak: JSON.parse(localStorage.getItem('streak_data') || '{"current_streak": 0, "longest_streak": 0, "last_practice_date": null}'),
    certifications: JSON.parse(localStorage.getItem('user_certifications') || '[]'),
    keystones: parseInt(localStorage.getItem('user_keystones') || '0'),
    totalKeystrokes: parseInt(localStorage.getItem('total_keystrokes') || '0'),
    perfectSessions: parseInt(localStorage.getItem('perfect_sessions') || '0'),
    challengeProgress: JSON.parse(localStorage.getItem('challenge_progress') || '{}'),

    setAchievements: (data) => set((state) => {
        const newState = {
            unlockedBadges: data.badges || state.unlockedBadges,
            streak: data.streak || state.streak,
            certifications: data.certifications || state.certifications,
            keystones: data.keystones !== undefined ? data.keystones : state.keystones,
            totalKeystrokes: data.totalKeystrokes !== undefined ? data.totalKeystrokes : state.totalKeystrokes,
            perfectSessions: data.perfectSessions !== undefined ? data.perfectSessions : state.perfectSessions,
            challengeProgress: data.challengeProgress || state.challengeProgress
        }

        localStorage.setItem('unlocked_badges', JSON.stringify(newState.unlockedBadges))
        localStorage.setItem('streak_data', JSON.stringify(newState.streak))
        localStorage.setItem('user_certifications', JSON.stringify(newState.certifications))
        localStorage.setItem('user_keystones', newState.keystones.toString())
        localStorage.setItem('total_keystrokes', newState.totalKeystrokes.toString())
        localStorage.setItem('perfect_sessions', newState.perfectSessions.toString())
        localStorage.setItem('challenge_progress', JSON.stringify(newState.challengeProgress))

        return newState
    }),

    unlockBadge: (badgeId) => set((state) => {
        if (state.unlockedBadges.includes(badgeId)) return state
        const next = [...state.unlockedBadges, badgeId]
        localStorage.setItem('unlocked_badges', JSON.stringify(next))
        return { unlockedBadges: next }
    }),

    updateStreak: (streak) => set(() => {
        localStorage.setItem('streak_data', JSON.stringify(streak))
        return { streak }
    }),

    addCertification: (cert) => set((state) => {
        const next = [...state.certifications, cert]
        localStorage.setItem('user_certifications', JSON.stringify(next))
        return { certifications: next }
    }),

    addKeystones: (amount) => set((state) => {
        const next = state.keystones + amount
        localStorage.setItem('user_keystones', next.toString())
        return { keystones: next }
    }),

    incrementStats: (keystrokes, isPerfect) => set((state) => {
        const nextKeystrokes = state.totalKeystrokes + keystrokes
        const nextPerfect = state.perfectSessions + (isPerfect ? 1 : 0)
        localStorage.setItem('total_keystrokes', nextKeystrokes.toString())
        localStorage.setItem('perfect_sessions', nextPerfect.toString())
        return { totalKeystrokes: nextKeystrokes, perfectSessions: nextPerfect }
    }),

    updateChallengeProgress: (challengeId, progress) => set((state) => {
        const nextProgress = { ...state.challengeProgress, [challengeId]: progress }
        localStorage.setItem('challenge_progress', JSON.stringify(nextProgress))
        return { challengeProgress: nextProgress }
    }),

    notifications: [],
    addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { ...notification, id: Math.random().toString(36).substr(2, 9) }]
    })),
    clearNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
    })),

    resetAchievements: () => {
        localStorage.removeItem('unlocked_badges')
        localStorage.removeItem('streak_data')
        localStorage.removeItem('user_certifications')
        localStorage.removeItem('user_keystones')
        localStorage.removeItem('total_keystrokes')
        localStorage.removeItem('perfect_sessions')
        localStorage.removeItem('challenge_progress')
        set({
            unlockedBadges: [],
            streak: { current_streak: 0, longest_streak: 0, last_practice_date: null },
            certifications: [],
            keystones: 0,
            totalKeystrokes: 0,
            perfectSessions: 0,
            challengeProgress: {}
        })
    }
}))
