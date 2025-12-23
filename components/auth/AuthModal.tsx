import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, Settings, Globe, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { invoke } from '@tauri-apps/api/tauri';
import { useSystemHealth } from '../../hooks/useSystemHealth';

export const AuthModal: React.FC = () => {
    const { activeModal, setActiveModal } = useApp();
    const { health, refresh } = useSystemHealth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showHealth, setShowHealth] = useState(false);

    if (activeModal !== 'auth') return null;

    const isSystemOk = health.frontendEnvOk && health.googleBackendOk && health.githubBackendOk;

    const handleLogin = async (provider: 'google' | 'github') => {
        if (!isSystemOk) {
            setError('SYSTEM CONFIGURATION INCOMPLETE. Check Health below.');
            setShowHealth(true);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const { authService } = await import('@/services/authService');
            if (provider === 'google') {
                await authService.signInWithGoogle();
            } else {
                await authService.signInWithGithub();
            }
            // Note: browser will open, and redirect back to our callback route
            // We can close the modal now or keep it open with a loading state
            setActiveModal('none');
        } catch (err: any) {
            console.error('Failed to start OAuth flow:', err);
            setError(err?.message || 'Failed to initialize login.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal('none')}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-[450px] bg-[#2c2e31] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl overflow-hidden"
            >
                {/* Close Button */}
                <button
                    onClick={() => setActiveModal('none')}
                    className="absolute top-8 right-8 text-[var(--sub)] hover:text-[var(--main)] transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[var(--main)] uppercase tracking-[0.2em] mb-2 font-mono">Sign In</h2>
                    <p className="text-[10px] text-[var(--sub)] uppercase tracking-[0.3em] font-bold opacity-60">Elevate your typing speed</p>
                </div>

                <div className="space-y-4 mb-8">
                    <ActionButton
                        provider="google"
                        onClick={() => handleLogin('google')}
                        disabled={isLoading}
                        icon={<Globe size={18} />}
                        label="Sign in with Google"
                    />
                    <ActionButton
                        provider="github"
                        onClick={() => handleLogin('github')}
                        disabled={isLoading}
                        icon={<Github size={18} />}
                        label="Sign in with GitHub"
                    />
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] text-rose-400 font-bold uppercase tracking-wider text-center">
                        {error}
                    </div>
                )}

                {/* Health Section */}
                <div className="border-t border-white/5 pt-6">
                    <button
                        onClick={() => setShowHealth(!showHealth)}
                        className="flex items-center gap-2 text-[var(--sub)] hover:text-[var(--main)] transition-colors text-[9px] font-black uppercase tracking-[0.2em] mb-4"
                    >
                        <Settings size={12} className={showHealth ? 'rotate-90 transition-transform' : 'transition-transform'} />
                        System Health {isSystemOk ? '[OK]' : '[FAIL]'}
                    </button>

                    <AnimatePresence>
                        {showHealth && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-3 p-4 bg-black/20 rounded-2xl"
                            >
                                <HealthItem label="Frontend Env" ok={health.frontendEnvOk} />
                                <HealthItem label="Google Auth" ok={health.googleBackendOk} />
                                <HealthItem label="GitHub Auth" ok={health.githubBackendOk} />

                                {health.errors.length > 0 && (
                                    <div className="mt-4 p-3 bg-rose-500/5 rounded-xl border border-rose-500/10">
                                        {health.errors.map((err, i) => (
                                            <div key={i} className="text-[8px] text-rose-300/60 font-mono mb-1">• {err}</div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={refresh}
                                        className="flex-1 py-3 bg-[var(--main)] text-[var(--bg)] rounded-[1rem] text-[9px] font-black uppercase tracking-widest"
                                    >
                                        Refresh Config
                                    </button>
                                </div>
                                <div className="text-[8px] text-[var(--sub)] opacity-40 text-center uppercase tracking-widest mt-2">
                                    Change .env and restart cargo tauri dev
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

const ActionButton: React.FC<{ provider: string, onClick: () => void, disabled: boolean, icon: React.ReactNode, label: string }> = ({ provider, onClick, disabled, icon, label }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all relative overflow-hidden group
            ${provider === 'google' ? 'bg-white text-black' : 'bg-[#24292e] text-white'}`}
    >
        {icon}
        {label}
    </motion.button>
);

const HealthItem: React.FC<{ label: string, ok: boolean }> = ({ label, ok }) => (
    <div className="flex items-center justify-between text-[10px] font-bold">
        <span className="text-[var(--sub)] opacity-60">{label}</span>
        <span className={ok ? 'text-emerald-400' : 'text-rose-500'}>[{ok ? 'OK' : 'FAIL'}]</span>
    </div>
);
