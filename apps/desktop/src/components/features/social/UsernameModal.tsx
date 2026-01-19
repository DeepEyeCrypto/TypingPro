import React, { useState } from 'react'
import { useAuthStore } from '../../../core/store/authStore'
import { userService } from '../../../core/userService'
import { GlassCard } from '../../ui/GlassCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Fingerprint, Terminal, ShieldCheck, Activity, AlertCircle, ArrowRight, X } from 'lucide-react'

export const UsernameModal = () => {
    const { user, profile, isLoadingProfile, refreshProfile } = useAuthStore()
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [isSkipped, setIsSkipped] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!user || isLoadingProfile || profile || isSkipped) return null

    const validateUsername = (value: string) => {
        if (value.length < 3) return 'PROTOCOL_ERROR: TOO_SHORT (MIN_3)'
        if (value.length > 20) return 'PROTOCOL_ERROR: TOO_LONG (MAX_20)'
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'PROTOCOL_ERROR: INVALID_SEQUENCE'
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
                setError('SIGNAL_COLLISION: ALIAS_EXISTS')
            }
        } catch (e: any) {
            setError(e.message || 'TRANSMISSION_FAILED: RETRY_SIGNAL');
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 overflow-hidden">
            {/* Ambient Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-[40px]"
            />

            <AnimatePresence>
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 120 }}
                    className="relative w-full max-w-lg"
                >
                    <GlassCard variant="large" className="text-center py-16 px-12 shadow-[0_60px_120px_rgba(0,0,0,0.9)] border-white/5 relative overflow-hidden">
                        {/* Internal Scan Beam */}
                        <motion.div
                            animate={{ left: ['-10%', '110%'] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-[var(--text-accent)] to-transparent opacity-10 blur-sm pointer-events-none z-0"
                        />

                        <div className="mb-12 relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
                                <Fingerprint size={32} className="text-[var(--text-accent)]" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-4" style={{ color: 'var(--text-primary)' }}>Identity_Protocol</h2>
                            <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-30 italic" style={{ color: 'var(--text-primary)' }}>Initialize_Unique_Operator_Alias</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 group-focus-within:text-[var(--text-accent)] transition-all">
                                    <Terminal size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value)
                                        setError('')
                                    }}
                                    placeholder="ENTER_ALIAS..."
                                    disabled={isSubmitting}
                                    autoFocus
                                    className="w-full bg-white/5 border border-white/5 rounded-[2.5rem] pl-16 pr-8 py-6 text-2xl font-black placeholder:opacity-5 focus:outline-none focus:border-[var(--text-accent)]/40 transition-all text-left tracking-widest uppercase italic shadow-2xl backdrop-blur-3xl"
                                    style={{ color: 'var(--text-primary)' }}
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                                {/* Micro-scan beam inside input */}
                                <motion.div
                                    animate={{ left: ['-10%', '110%'] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute top-0 w-px h-full bg-[var(--text-accent)]/20 pointer-events-none"
                                />
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex items-center justify-center gap-3 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/5 py-4 rounded-2xl border border-red-500/10 italic"
                                    >
                                        <AlertCircle size={14} />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex flex-col gap-5 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !username}
                                    className="w-full py-6 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.6em] bg-[var(--text-accent)] text-white shadow-2xl shadow-[var(--text-accent)]/30 active:scale-95 transition-all flex items-center justify-center gap-4 relative overflow-hidden group"
                                >
                                    <span className="relative z-10">
                                        {isSubmitting ? 'INITIALIZING_SIGNAL...' : 'CONFIRM_IDENTITY_TRANSMISSION'}
                                    </span>
                                    {!isSubmitting && <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                                    <div className="absolute inset-0 bg-white/10 translate-x-[-110%] group-hover:translate-x-0 transition-transform duration-500" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsSkipped(true)}
                                    disabled={isSubmitting}
                                    className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] opacity-20 hover:opacity-100 transition-all pt-4"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    <X size={12} />
                                    BYPASS_INITIALIZATION
                                </button>
                            </div>

                            {/* User Signature Link */}
                            <div className="mt-16 flex items-center justify-between gap-6 bg-white/5 rounded-[3rem] py-5 px-10 border border-white/5 shadow-2xl group hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-[1.5rem] overflow-hidden border-2 border-white/10 group-hover:border-[var(--text-accent)]/40 transition-colors shadow-2xl">
                                            <img src={user.avatar_url} alt="Profile Avatar" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-slate-900 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <div className="flex items-center gap-2 opacity-30 italic">
                                            <Activity size={10} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Linked_Node_Signature</span>
                                        </div>
                                        <span className="text-lg font-black uppercase tracking-tight italic" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
                                    </div>
                                </div>
                                <ShieldCheck size={20} className="text-green-500 opacity-20" />
                            </div>
                        </form>
                    </GlassCard>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

