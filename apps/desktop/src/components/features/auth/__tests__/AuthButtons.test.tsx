import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthButtons } from '../AuthButtons'

// Mock useAuthStore
vi.mock('../../../core/store/authStore', () => ({
    useAuthStore: vi.fn(() => ({
        user: null,
        isGuest: true,
        logout: vi.fn()
    }))
}))

// Mock OAuth
vi.mock('@tauri-apps/plugin-oauth', () => ({
    start: vi.fn()
}))

describe('AuthButtons', () => {
    it('should show login buttons when not authenticated', () => {
        render(<AuthButtons />)

        expect(screen.getByText(/Login with Google/i)).toBeInTheDocument()
        expect(screen.getByText(/Login with GitHub/i)).toBeInTheDocument()
    })

    it('should show user avatar when authenticated', () => {
        const { useAuthStore } = require('../../../core/store/authStore')
        useAuthStore.mockReturnValue({
            user: {
                id: 'test-123',
                name: 'Test User',
                email: 'test@test.com',
                avatar_url: 'https://example.com/avatar.jpg'
            },
            isGuest: false,
            logout: vi.fn()
        })

        render(<AuthButtons />)

        const avatar = screen.getByAlt('User')
        expect(avatar).toBeInTheDocument()
        expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })

    it('should call logout when logout button clicked', async () => {
        const mockLogout = vi.fn()
        const { useAuthStore } = require('../../../core/store/authStore')
        useAuthStore.mockReturnValue({
            user: { id: 'test', name: 'Test', email: 'test@test.com' },
            isGuest: false,
            logout: mockLogout
        })

        render(<AuthButtons />)

        const logoutButton = screen.getByText(/Logout/i)
        fireEvent.click(logoutButton)

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled()
        })
    })
})
