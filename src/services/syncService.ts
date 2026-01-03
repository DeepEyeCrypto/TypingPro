import { useAuthStore } from '@src/stores/authStore'
import { useStatsStore } from '@src/stores/statsStore'

export const syncService = {
    async pushToCloud() {
        const { user, token } = useAuthStore.getState()
        const { lessonStats } = useStatsStore.getState()

        if (!user || !token) return

        // Placeholder for real API: In production, this would be a POST /sync

        // Simulate API delay
        await new Promise(r => setTimeout(r, 800))

        localStorage.setItem('last_sync_ts', Date.now().toString())
    },

    async pullFromCloud() {
        const { user, token } = useAuthStore.getState()
        const { loadStats } = useStatsStore.getState()

        if (!user || !token) return

        if (!user || !token) return

        // Simulate API fetch
        await new Promise(r => setTimeout(r, 800))

        // In a real app: const data = await fetch('/api/stats')...
        // For now, we remain local-first
        localStorage.setItem('last_sync_ts', Date.now().toString())
    }
}
