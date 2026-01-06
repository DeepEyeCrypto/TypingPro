import { create } from 'zustand'
import { storeService } from '@src/services/store'
import { userService, UserProfile } from '@src/services/userService'

export interface User {
    id: string,
    name: string,
    email?: string,
    avatar_url?: string,
    provider: 'google' | 'github'
}

interface AuthState {
    user: User | null,
    profile: UserProfile | null, // Added profile
    token: string | null,
    isGuest: boolean,
    isLoadingProfile: boolean, // Loading state for profile
    setAuthenticated: (user: User, token?: string) => Promise<void>, // Made async
    refreshProfile: () => Promise<void>,
    setGuest: () => void,
    logout: () => void,
    checkSession: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    profile: null,
    token: null,
    isGuest: true,
    isLoadingProfile: false,

    setAuthenticated: async (user, token = undefined) => {
        set({ user, token: token || null, isGuest: false, isLoadingProfile: true })
        // Persist to Store
        storeService.setUserProfile(user)
        if (token) storeService.setAuthToken(token)

        try {
            const profile = await userService.getProfile(user.id)
            set({ profile, isLoadingProfile: false })
        } catch (e) {
            console.error("Failed to load profile", e)
            set({ isLoadingProfile: false })
        }
    },

    refreshProfile: async () => {
        const { user } = get()
        if (user) {
            const profile = await userService.getProfile(user.id)
            set({ profile })
        }
    },

    setGuest: () => {
        set({ user: null, profile: null, token: null, isGuest: true })
        storeService.clearAuth()
    },

    logout: () => {
        set({ user: null, profile: null, token: null, isGuest: true })
        storeService.clearAuth()
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
    },

    checkSession: async () => {
        const user = await storeService.getUserProfile()
        const token = await storeService.getAuthToken()

        if (user) {
            set({ user, token: token || null, isGuest: false, isLoadingProfile: true })
            // Fetch profile
            try {
                const profile = await userService.getProfile(user.id)
                set({ profile, isLoadingProfile: false })
            } catch (error) {
                set({ isLoadingProfile: false })
            }
            return true
        }
        return false
    }
}))
