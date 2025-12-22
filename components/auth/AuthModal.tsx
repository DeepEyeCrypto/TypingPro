import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowRight, Github, Loader2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

import { LoginPanel } from './LoginPanel';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login } = useApp();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (provider: 'google' | 'github') => {
        setIsLoading(true);
        setError(null);
        try {
            await login(provider);
            onClose();
        } catch (err: any) {
            console.error(`${provider} login failed`, err);
            const errorMsg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err));

            if (errorMsg.includes('CSRF')) setError('Security check failed. Please try again.');
            else if (errorMsg.includes('time') || errorMsg.includes('TIMEOUT')) setError('Login session timed out. Please try again.');
            else if (errorMsg.includes('CLIENT_ID') || errorMsg.includes('SECRET')) {
                setError(`${provider.toUpperCase()} Config Error: ${errorMsg}`);
            }
            else setError(errorMsg || 'Authentication failed. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center p-4 pointer-events-auto"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute inset-0 bg-[var(--bg)]/80 backdrop-blur-md"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-[420px] bg-[var(--bg)] border border-[var(--sub)]/20 p-10 rounded-[40px] shadow-2xl relative z-[1000] font-mono pointer-events-auto"
                        style={{ boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.7)' }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="absolute right-8 top-8 p-3 text-[var(--sub)] hover:text-[var(--accent)] transition-all hover:rotate-90"
                        >
                            <X size={24} />
                        </button>

                        {/* Title */}
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-black text-[var(--main)] tracking-tighter uppercase">
                                {mode === 'login' ? 'sign in' : 'join crew'}
                            </h2>
                            <p className="text-[10px] text-[var(--sub)] uppercase tracking-[0.4em] mt-2 font-bold opacity-60">
                                elevate your typing speed
                            </p>
                        </div>

                        {/* Integrated Login Panel */}
                        <div className="mb-8">
                            <LoginPanel
                                onLogin={handleLogin}
                                isLoading={isLoading}
                                error={error}
                            />
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-6 mb-8 opacity-20">
                            <div className="h-px flex-1 bg-[var(--sub)]" />
                            <span className="text-[10px] text-[var(--sub)] uppercase tracking-[0.3em] font-black">or</span>
                            <div className="h-px flex-1 bg-[var(--sub)]" />
                        </div>

                        {/* Form */}
                        <div className="flex flex-col gap-4">
                            <div className="group">
                                <div className="flex items-center gap-3 border-b border-[var(--sub)]/20 group-focus-within:border-[var(--accent)] transition-colors py-2">
                                    <Mail size={16} className="text-[var(--sub)] group-focus-within:text-[var(--accent)]" />
                                    <input
                                        type="email"
                                        placeholder="email"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className="bg-transparent text-[var(--main)] placeholder:text-[var(--sub)]/40 w-full outline-none text-sm font-bold"
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <div className="flex items-center gap-3 border-b border-[var(--sub)]/20 group-focus-within:border-[var(--accent)] transition-colors py-2">
                                    <Lock size={16} className="text-[var(--sub)] group-focus-within:text-[var(--accent)]" />
                                    <input
                                        type="password"
                                        placeholder="password"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className="bg-transparent text-[var(--main)] placeholder:text-[var(--sub)]/40 w-full outline-none text-sm font-bold"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    console.log('Email Sign In Clicked');
                                }}
                                className="flex items-center justify-between w-full mt-4 p-4 rounded-2xl bg-[var(--accent)] text-[var(--bg)] shadow-xl shadow-[var(--accent)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all group pointer-events-auto"
                            >
                                <span className="font-black uppercase tracking-widest text-[11px]">
                                    {mode === 'login' ? 'sign in' : 'create account'}
                                </span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Footer Links */}
                        <div className="mt-8 flex justify-between text-[10px] font-bold uppercase tracking-widest">
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setMode(mode === 'login' ? 'register' : 'login');
                                }}
                                className="text-[var(--sub)] hover:text-[var(--accent)] transition-colors"
                            >
                                {mode === 'login' ? 'create account' : 'back to login'}
                            </button>
                            {mode === 'login' && (
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="text-[var(--sub)]/50 hover:text-[var(--sub)] transition-colors"
                                >
                                    forgot password?
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
