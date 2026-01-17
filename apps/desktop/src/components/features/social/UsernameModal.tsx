import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../../core/store/authStore'
import { userService } from '../../../core/userService'
import './UsernameModal.css'

export const UsernameModal = () => {
    const { user, profile, isLoadingProfile, refreshProfile } = useAuthStore()
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [isSkipped, setIsSkipped] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Only show if user is logged in, profile loaded (and missing), not loading, AND not skipped
    if (!user || isLoadingProfile || profile || isSkipped) return null

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

        try {
            console.log("[UsernameModal] Attempting to create profile for:", username);

            const success = await userService.createProfile(user.id, username, user.avatar_url || '');

            if (success) {
                console.log("[UsernameModal] Profile created successfully!");
                await refreshProfile()
            } else {
                setError('Username already taken')
            }
        } catch (e: any) {
            console.error("[UsernameModal] Profile Creation Failed:", e);
            // Service now returns descriptive errors, use them directly
            setError(e.message || 'Failed to create profile. Try again.');
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="username-modal-overlay">
            <div className="username-modal">
                <div className="modal-content">
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
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </div>

                        {error && (
                            <div className="error-msg" role="alert" aria-live="polite">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting || !username}
                        >
                            {isSubmitting ? (
                                <span className="loader-text">Creating...</span>
                            ) : (
                                'Start Competing'
                            )}
                        </button>

                        <button
                            type="button"
                            className="skip-btn"
                            onClick={() => setIsSkipped(true)}
                            disabled={isSubmitting}
                        >
                            Setup Later
                        </button>

                        <div className="user-preview">
                            <img src={user.avatar_url} alt="Profile Avatar" />
                            <span>{user.name}</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
