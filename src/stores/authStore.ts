import { create } from 'zustand'

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
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isGuest: true,
    setAuthenticated: (user, token = undefined) => set({ user, token: token || null, isGuest: false }),
    setGuest: () => set({ user: null, token: null, isGuest: true }),
    logout: () => {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
        set({ user: null, token: null, isGuest: true })
    }
}))
