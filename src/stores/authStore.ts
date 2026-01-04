import { create } from 'zustand'
import { storeService } from '@src/services/store'

export interface User {
    id: string,
    name: string,
    email?: string,
    avatar_url?: string,
    provider: 'google' | 'github'
}

interface AuthState {
    user: User | null,
    token: string | null,
    isGuest: boolean,
    setAuthenticated: (user: User, token?: string) => void,
    setGuest: () => void,
    logout: () => void,
    checkSession: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isGuest: true,

    setAuthenticated: (user, token = undefined) => {
        set({ user, token: token || null, isGuest: false })
        // Persist to Store
        storeService.setUserProfile(user)
        if (token) storeService.setAuthToken(token)
    },

    setGuest: () => {
        set({ user: null, token: null, isGuest: true })
        storeService.clearAuth()
    },

    logout: () => {
        set({ user: null, token: null, isGuest: true })
        storeService.clearAuth()
        // Clear legacy local storage too
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
    },

    checkSession: async () => {
        const user = await storeService.getUserProfile()
        const token = await storeService.getAuthToken()

        if (user) {
            set({ user, token: token || null, isGuest: false })
            return true
        }
        return false
    }
}))
