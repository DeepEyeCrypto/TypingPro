import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowRight, Github } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');

    const googleIcon = (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3.09c-2.127-1.927-4.882-3.09-7.91-3.09C7.391 0 3.191 2.909 1.255 7.155l4.011 2.61z"
            />
            <path
                fill="#34A853"
                d="M12 24c3.127 0 5.727-1.036 7.636-2.8l-3.664-2.836c-1.118.755-2.545 1.191-3.972 1.191-3.018 0-5.582-2.036-6.491-4.773L1.518 17.4C3.527 21.364 7.645 24 12 24z"
            />
            <path
                fill="#4285F4"
                d="M23.491 12.273c0-.855-.073-1.682-.209-2.482H12v4.691h6.455c-.273 1.482-1.109 2.727-2.336 3.555l3.664 2.836C21.936 19.018 24 15.936 24 12z"
            />
            <path
                fill="#FBBC05"
                d="M5.509 14.8c-.245-.727-.382-1.509-.382-2.327s.137-1.591.382-2.327l-4.011-2.61C.536 8.782 0 10.336 0 12s.536 3.218 1.491 4.673l4.018-3.327z"
            />
        </svg>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[var(--bg)]/80 backdrop-blur-md"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-[400px] bg-[var(--bg)] border border-[var(--sub)]/20 p-8 rounded-[32px] shadow-2xl relative z-10 font-mono"
                        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute right-6 top-6 p-2 text-[var(--sub)] hover:text-[var(--accent)] transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Title */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-[var(--main)] tracking-tighter">
                                {mode === 'login' ? 'login' : 'register'}
                            </h2>
                            <p className="text-[10px] text-[var(--sub)] uppercase tracking-widest mt-1">
                                to sync your progress
                            </p>
                        </div>

                        {/* Social Buttons */}
                        <div className="flex flex-col gap-3 mb-6">
                            <button className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl bg-[var(--sub)]/5 border border-[var(--sub)]/10 hover:border-[var(--accent)]/50 text-[var(--main)] transition-all font-bold text-xs uppercase tracking-widest group">
                                {googleIcon}
                                <span>Sign in with Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl bg-[var(--sub)]/5 border border-[var(--sub)]/10 hover:border-[var(--accent)]/50 text-[var(--main)] transition-all font-bold text-xs uppercase tracking-widest group">
                                <Github size={20} className="text-[var(--main)] group-hover:text-[var(--accent)] transition-colors" />
                                <span>Sign in with GitHub</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px flex-1 bg-[var(--sub)]/10" />
                            <span className="text-[10px] text-[var(--sub)] uppercase tracking-widest">or email</span>
                            <div className="h-px flex-1 bg-[var(--sub)]/10" />
                        </div>

                        {/* Form */}
                        <div className="flex flex-col gap-4">
                            <div className="group">
                                <div className="flex items-center gap-3 border-b border-[var(--sub)]/20 group-focus-within:border-[var(--accent)] transition-colors py-2">
                                    <Mail size={16} className="text-[var(--sub)] group-focus-within:text-[var(--accent)]" />
                                    <input
                                        type="email"
                                        placeholder="email"
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
                                        className="bg-transparent text-[var(--main)] placeholder:text-[var(--sub)]/40 w-full outline-none text-sm font-bold"
                                    />
                                </div>
                            </div>

                            <button className="flex items-center justify-between w-full mt-4 p-4 rounded-2xl bg-[var(--accent)] text-[var(--bg)] shadow-xl shadow-[var(--accent)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all group">
                                <span className="font-black uppercase tracking-widest text-[11px]">
                                    {mode === 'login' ? 'sign in' : 'create account'}
                                </span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Footer Links */}
                        <div className="mt-8 flex justify-between text-[10px] font-bold uppercase tracking-widest">
                            <button
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                className="text-[var(--sub)] hover:text-[var(--accent)] transition-colors"
                            >
                                {mode === 'login' ? 'create account' : 'back to login'}
                            </button>
                            {mode === 'login' && (
                                <button className="text-[var(--sub)]/50 hover:text-[var(--sub)] transition-colors">
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
