import { create } from 'zustand'

interface SyncState {
    isSyncing: boolean
    setSyncing: (bool: boolean) => void
}

export const useSyncStore = create<SyncState>((set) => ({
    isSyncing: false,
    setSyncing: (bool) => set({ isSyncing: bool })
}))
