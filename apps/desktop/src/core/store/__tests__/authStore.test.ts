import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore, initializeAuthListener } from '../authStore'
import { auth } from '../../lib/firebase'
import { getIdToken } from 'firebase/auth'

// Mock Firebase
vi.mock('../../lib/firebase', () => ({
    auth: {
        currentUser: null,
        signOut: vi.fn()
    }
}))

vi.mock('firebase/auth', () => ({
    getIdToken: vi.fn(),
    onAuthStateChanged: vi.fn()
}))

vi.mock('../../tauriStore', () => ({
    storeService: {
        setAuthToken: vi.fn(),
        getAuthToken: vi.fn(),
        setUserProfile: vi.fn(),
        getUserProfile: vi.fn(),
        clearAuth: vi.fn()
    }
}))

describe('authStore', () => {
    beforeEach(() => {
        useAuthStore.setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isGuest: true,
            lastTokenRefresh: null
        })
        vi.clearAllMocks()
    })

    describe('setAuthenticated', () => {
        it('should set user and authentication state', async () => {
            const mockUser = {
                id: 'test-123',
                name: 'Test User',
                email: 'test@example.com',
                provider: 'google' as const
            }

            await useAuthStore.getState().setAuthenticated(mockUser, 'mock-token')

            const state = useAuthStore.getState()
            expect(state.user).toEqual(mockUser)
            expect(state.token).toBe('mock-token')
            expect(state.isAuthenticated).toBe(true)
            expect(state.isGuest).toBe(false)
            expect(state.lastTokenRefresh).toBeGreaterThan(0)
        })
    })

    describe('validateSession', () => {
        it('should return false when no Firebase user exists', async () => {
            auth.currentUser = null

            const result = await useAuthStore.getState().validateSession()

            expect(result).toBe(false)
        })

        it('should refresh token when expired', async () => {
            const mockUser = { uid: 'test-123' }
            auth.currentUser = mockUser as any

            // Set last refresh to 60 minutes ago
            useAuthStore.setState({
                user: { id: 'test-123', name: 'Test', provider: 'google' },
                lastTokenRefresh: Date.now() - (60 * 60 * 1000)
            })

            vi.mocked(getIdToken).mockResolvedValue('new-token')

            const result = await useAuthStore.getState().validateSession()

            expect(result).toBe(true)
            expect(getIdToken).toHaveBeenCalledWith(mockUser, true)
        })
    })

    describe('logout', () => {
        it('should clear all auth state', () => {
            // Setup authenticated state
            useAuthStore.setState({
                user: { id: 'test', name: 'Test', provider: 'google' },
                token: 'token',
                isAuthenticated: true,
                isGuest: false
            })

            useAuthStore.getState().logout()

            const state = useAuthStore.getState()
            expect(state.user).toBeNull()
            expect(state.token).toBeNull()
            expect(state.isAuthenticated).toBe(false)
            expect(state.isGuest).toBe(true)
        })
    })

    describe('refreshToken', () => {
        it('should return null when no user', async () => {
            auth.currentUser = null

            const result = await useAuthStore.getState().refreshToken()

            expect(result).toBeNull()
        })

        it('should refresh and return new token', async () => {
            auth.currentUser = { uid: 'test' } as any
            vi.mocked(getIdToken).mockResolvedValue('refreshed-token')

            const result = await useAuthStore.getState().refreshToken()

            expect(result).toBe('refreshed-token')
            expect(useAuthStore.getState().lastTokenRefresh).toBeGreaterThan(0)
        })
    })
})
