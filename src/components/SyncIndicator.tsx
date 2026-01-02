import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@src/stores/authStore'
import './SyncIndicator.css'

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
        <div className={`sync-indicator ${synced ? 'synced' : 'pending'}`}>
            <span className="sync-dot"></span>
            <span className="sync-label">{synced ? 'SYNCED' : 'NOT SYNCED'}</span>
        </div>
    )
}
