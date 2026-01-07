import { useAuthStore } from '@src/stores/authStore'
import { useStatsStore } from '@src/stores/statsStore'
import { userService } from '@src/services/userService'

export const syncService = {
    async pushToCloud() {
        const { user, token, profile } = useAuthStore.getState()
        const { lessonStats, unlockedIds, completedIds } = useStatsStore.getState()

        if (!user || !user.id) return

        // 1. Update basic stats (WPM etc) - usually handled by race completion, but good for redundancy 
        // For now, we mainly sync progress here

        await userService.updateProgress(user.id, unlockedIds, completedIds)

        localStorage.setItem('last_sync_ts', Date.now().toString())
    },

    async pullFromCloud() {
        const { user } = useAuthStore.getState()
        const { setProgress } = useStatsStore.getState()

        if (!user || !user.id) return

        try {
            const profile = await userService.getProfile(user.id)
            if (profile) {
                // Merge cloud progress with local if cloud is ahead, or just prefer cloud?
                // For simple sync, we'll prefer cloud if it exists
                if (profile.unlocked_lessons && profile.completed_lessons) {
                    setProgress(profile.unlocked_lessons, profile.completed_lessons)
                }
            }
        } catch (e) {
            console.error("Sync pull failed", e)
        }

        localStorage.setItem('last_sync_ts', Date.now().toString())
    }
}
