import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@src/stores/authStore'
import { userService } from '@src/services/userService'
import './UsernameModal.css'

export const UsernameModal = () => {
    const { user, profile, isLoadingProfile, refreshProfile } = useAuthStore()
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [isChecking, setIsChecking] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Only show if user is logged in, profile loaded (and missing), and not loading
    if (!user || isLoadingProfile || profile) return null

    const validateUsername = (value: string) => {
        if (value.length < 3) return 'Username too short (min 3)'
        if (value.length > 20) return 'Username too long (max 20)'
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers, _ allowed'
        return ''
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const err = validateUsername(username)
        if (err) {
            setError(err)
            return
        }

        setIsSubmitting(true)
        setError('')

        // 15 second timeout to prevent infinite hanging
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out. Please check your internet connection.")), 15000)
        );

        try {
            console.log("Attempting to create profile for:", username);

            // Race the creation against the timeout
            const success = await Promise.race([
                userService.createProfile(user.id, username, user.avatar_url || ''),
                timeoutPromise
            ]) as boolean;

            if (success) {
                console.log("Profile created successfully!");
                await refreshProfile()
            } else {
                setError('Username already taken')
            }
        } catch (e: any) {
            console.error("Profile Creation Failed:", e);
            // Handle specific Firebase error codes if possible, or generic message
            let msg = e.message || 'Failed to create profile';
            if (msg.includes("permission-denied")) msg = "Access Denied. Check API permissions.";
            if (msg.includes("unavailable")) msg = "Network unavailable. Try again.";
            setError(msg);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="username-modal-overlay">
            <div className="username-modal">
                <h2>Choose your identity</h2>
                <p className="subtitle">Create a unique username to compete globally.</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                                setError('')
                            }}
                            placeholder="Username"
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting || !username}
                    >
                        {isSubmitting ? 'Creating...' : 'Start Competing'}
                    </button>

                    <div className="user-preview">
                        <img src={user.avatar_url} alt="You" />
                        <span>{user.name}</span>
                    </div>
                </form>
            </div>
        </div>
    )
}
