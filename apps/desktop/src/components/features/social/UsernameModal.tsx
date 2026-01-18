// ═══════════════════════════════════════════════════════════════════
// USERNAME MODAL: VisionOS-style identity initialization
// ═══════════════════════════════════════════════════════════════════

import React, { useState } from 'react'
import { useAuthStore } from '../../../core/store/authStore'
import { userService } from '../../../core/userService'
import { GlassCard } from '../../ui/GlassCard'
import { motion, AnimatePresence } from 'framer-motion'

export const UsernameModal = () => {
    const { user, profile, isLoadingProfile, refreshProfile } = useAuthStore()
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [isSkipped, setIsSkipped] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!user || isLoadingProfile || profile || isSkipped) return null

    const validateUsername = (value: string) => {
        if (value.length < 3) return 'PROTOCOL_ERROR: Too short (min 3)'
        if (value.length > 20) return 'PROTOCOL_ERROR: Too long (max 20)'
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'PROTOCOL_ERROR: Invalid sequence'
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
            const success = await userService.createProfile(user.id, username, user.avatar_url || '');
            if (success) {
                await refreshProfile()
            } else {
                setError('SIGNAL_COLLISION: Alias already exists')
            }
        } catch (e: any) {
            setError(e.message || 'TRANSMISSION_FAILED: Try again');
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Ambient Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-2xl"
            />

            <AnimatePresence>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="relative w-full max-w-md"
                >
                    <GlassCard variant="large" className="text-center py-12 px-8 shadow-[0_50px_100px_rgba(0,0,0,0.6)]">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">Identity Protocol</h2>
                            <p className="glass-text-muted text-[10px] font-black uppercase tracking-[0.3em]">Initialize unique operator alias</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value)
                                        setError('')
                                    }}
                                    placeholder="ENTER_ALIAS"
                                    disabled={isSubmitting}
                                    autoFocus
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-black text-white placeholder:text-white/10 focus:outline-none focus:border-white/30 transition-all text-center tracking-widest uppercase italic shadow-inner"
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                                <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-white/10 pointer-events-none transition-all" />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-400/5 py-2 rounded-lg border border-red-400/10"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="flex flex-col gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !username}
                                    className="glass-pill w-full py-4 text-xs font-black text-gray-900 shadow-xl active:scale-95 transition-all uppercase tracking-widest"
                                >
                                    {isSubmitting ? 'Initializing...' : 'Confirm Identity'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsSkipped(true)}
                                    disabled={isSubmitting}
                                    className="text-[10px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-[0.4em] pt-2"
                                >
                                    Bypass Initialization
                                </button>
                            </div>

                            {/* Signal Preview */}
                            <div className="mt-12 flex items-center justify-center gap-4 bg-white/5 rounded-2xl py-3 px-6 border border-white/5">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                                    <img src={user.avatar_url} alt="Profile Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Linked Node</span>
                                    <span className="text-[10px] font-black text-white uppercase tracking-wider italic">{user.name}</span>
                                </div>
                            </div>
                        </form>
                    </GlassCard>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
