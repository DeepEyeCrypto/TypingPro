import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../core/store/authStore'
// import './SyncIndicator.css' // TODO: Restore when CSS exists

export const SyncIndicator = () => {
    const { user } = useAuthStore()
    const [synced, setSynced] = useState(false)

    useEffect(() => {
        const checkSync = () => {
            const lastSync = localStorage.getItem('last_sync_ts')
            if (lastSync) {
                const diff = Date.now() - parseInt(lastSync)
                setSynced(diff < 60000) // Within last minute
            } else {
                setSynced(false)
            }
        }

        checkSync()
        const interval = setInterval(checkSync, 10000)
        return () => clearInterval(interval)
    }, [])

    if (!user) return null

    return (
        <div className={`
            flex items-center gap-2.5 px-3 py-1.5 rounded-full border shadow-sm transition-all duration-500
            ${synced
                ? 'bg-[var(--accent-soft)] border-[var(--text-accent)]/20 text-[var(--text-accent)]'
                : 'bg-orange-500/10 border-orange-500/20 text-orange-400 animate-pulse'
            }
        `}>
            <div className={`w-1.5 h-1.5 rounded-full ${synced ? 'bg-[var(--text-accent)] shadow-[0_0_8px_var(--text-accent)]' : 'bg-orange-500 shadow-[0_0_8px_orange]'}`} />
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">{synced ? 'Neural_Sync_Active' : 'Sync_Pending'}</span>
        </div>
    )
}
