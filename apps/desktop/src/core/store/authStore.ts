import { create } from 'zustand'
import { storeService } from '../tauriStore'
import { userService, UserProfile } from '../userService'
import { auth } from '../../lib/firebase'
import { onAuthStateChanged, getIdToken } from 'firebase/auth'

export interface User {
    id: string,
    name: string,
    email?: string,
    avatar_url?: string,
    provider: 'google' | 'github' | 'email' | 'apple' | 'anonymous'
}

interface AuthState {
    user: User | null,
    profile: UserProfile | null,
    token: string | null,
    isAuthenticated: boolean,
    isGuest: boolean,
    isLoadingProfile: boolean,
    lastTokenRefresh: number | null,
    setAuthenticated: (user: User, token?: string) => Promise<void>,
    refreshProfile: () => Promise<void>,
    setGuest: () => void,
    logout: () => void,
    checkSession: () => Promise<boolean>,
    validateSession: () => Promise<boolean>,
    refreshToken: () => Promise<string | null>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    profile: null,
    token: null,
    isAuthenticated: false,
    isGuest: true,
    isLoadingProfile: false,
    lastTokenRefresh: null,

    setAuthenticated: async (user, token = undefined) => {
        set({
            user,
            token: token || null,
            isAuthenticated: true,
            isGuest: false,
            isLoadingProfile: true,
            lastTokenRefresh: Date.now()
        })

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
        set({ user: null, profile: null, token: null, isAuthenticated: false, isGuest: true, lastTokenRefresh: null })
        storeService.clearAuth()
    },

    logout: () => {
        set({ user: null, profile: null, token: null, isAuthenticated: false, isGuest: true, lastTokenRefresh: null })
        storeService.clearAuth()
        localStorage.removeItem('auth_user')
        localStorage.removeItem('user_session')

        // Sign out from Firebase
        if (auth.currentUser) {
            auth.signOut().catch(console.error)
        }
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
    },

    // New: Validate session with Firebase token refresh
    validateSession: async () => {
        try {
            const currentUser = auth.currentUser

            if (!currentUser) {
                console.log('[Auth] No Firebase user, clearing session')
                get().logout()
                return false
            }

            // Check if token needs refresh (refresh every 55 minutes, tokens expire after 1 hour)
            const { lastTokenRefresh } = get()
            const now = Date.now()
            const REFRESH_INTERVAL = 55 * 60 * 1000 // 55 minutes

            if (!lastTokenRefresh || (now - lastTokenRefresh > REFRESH_INTERVAL)) {
                console.log('[Auth] Refreshing Firebase token...')
                const token = await getIdToken(currentUser, true) // Force refresh
                await storeService.setAuthToken(token)
                set({ token, lastTokenRefresh: now })
                console.log('[Auth] ✅ Token refreshed successfully')
            }

            return true
        } catch (error) {
            console.error('[Auth] ❌ Token validation failed:', error)
            get().logout()
            return false
        }
    },

    // New: Manual token refresh (useful for network reconnection)
    refreshToken: async () => {
        try {
            const currentUser = auth.currentUser
            if (!currentUser) return null

            const token = await getIdToken(currentUser, true)
            await storeService.setAuthToken(token)
            set({ token, lastTokenRefresh: Date.now() })

            return token
        } catch (error) {
            console.error('[Auth] Token refresh failed:', error)
            return null
        }
    }
}))

// Helper: Setup Firebase auth state listener (call once on app init)
export const initializeAuthListener = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            // Firebase user exists, sync with store
            const token = await getIdToken(firebaseUser)
            const user: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || undefined,
                avatar_url: firebaseUser.photoURL || undefined,
                provider: (firebaseUser.providerData[0]?.providerId.includes('google') ? 'google' :
                    firebaseUser.providerData[0]?.providerId.includes('github') ? 'github' :
                        firebaseUser.providerData[0]?.providerId.includes('apple') ? 'apple' :
                            firebaseUser.isAnonymous ? 'anonymous' : 'email') as User['provider']
            }
            useAuthStore.getState().setAuthenticated(user, token)
        } else {
            // No Firebase user, check if we have stored session
            const hasSession = await useAuthStore.getState().checkSession()
            if (!hasSession) {
                useAuthStore.getState().setGuest()
            }
        }
    })
}
