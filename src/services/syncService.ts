import { useAuthStore } from '@src/stores/authStore'
import { useStatsStore } from '@src/stores/statsStore'
import { useAchievementStore } from '@src/stores/achievementStore'
import { userService } from '@src/services/userService'
import { useSyncStore } from '@src/stores/syncStore'

export const syncService = {
    async pushToCloud() {
        const { setSyncing } = useSyncStore.getState()
        setSyncing(true)
        try {
            const { user } = useAuthStore.getState()
            const { unlockedIds, completedIds } = useStatsStore.getState()
            const { unlockedBadges, streak, certifications, keystones, totalKeystrokes, perfectSessions, challengeProgress } = useAchievementStore.getState()

            if (!user || !user.id) return

            // 1. Sync Progress
            await userService.updateProgress(user.id, unlockedIds, completedIds)

            // 2. Sync Achievements
            await userService.updateAchievements(user.id, {
                unlocked_badges: unlockedBadges,
                streak: {
                    current: streak.current_streak,
                    longest: streak.longest_streak,
                    last_date: streak.last_practice_date
                },
                certifications,
                keystones,
                total_keystrokes: totalKeystrokes,
                perfect_sessions: perfectSessions,
                challenge_progress: challengeProgress
            })

            localStorage.setItem('last_sync_ts', Date.now().toString())
        } finally {
            setSyncing(false)
        }
    },

    async pullFromCloud() {
        const { setSyncing } = useSyncStore.getState()
        setSyncing(true)
        try {
            const { user } = useAuthStore.getState()
            const { setProgress } = useStatsStore.getState()
            const { setAchievements } = useAchievementStore.getState()

            if (!user || !user.id) return

            const profile = await userService.getProfile(user.id)
            if (profile) {
                // 1. Sync Progress
                if (profile.unlocked_lessons && profile.completed_lessons) {
                    setProgress(profile.unlocked_lessons, profile.completed_lessons)
                }

                // 2. Sync Achievements
                setAchievements({
                    badges: profile.unlocked_badges || [],
                    streak: profile.streak ? {
                        current_streak: profile.streak.current,
                        longest_streak: profile.streak.longest,
                        last_practice_date: profile.streak.last_date
                    } : undefined,
                    certifications: profile.certifications || [],
                    keystones: profile.keystones || 0,
                    totalKeystrokes: profile.total_keystrokes || 0,
                    perfectSessions: profile.perfect_sessions || 0,
                    challengeProgress: profile.challenge_progress || {}
                })
            }
        } catch (e) {
            console.error("Sync pull failed", e)
        } finally {
            setSyncing(false)
            localStorage.setItem('last_sync_ts', Date.now().toString())
        }
    }
}
