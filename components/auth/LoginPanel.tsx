import React from 'react';
import { Github, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginPanelProps {
    onLogin: (provider: 'google' | 'github') => void;
    isLoading: boolean;
    error: string | null;
}

export const LoginPanel: React.FC<LoginPanelProps> = ({ onLogin, isLoading, error }) => {
    const googleIcon = (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="currentColor"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94L5.84 14.1z"
            />
            <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
        </svg>
    );

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Google Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onLogin('google')}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs transition-all hover:bg-gray-100 disabled:opacity-50 relative overflow-hidden group"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <span className="opacity-80 group-hover:opacity-100 transition-opacity">{googleIcon}</span>
                        <span>Sign in with Google</span>
                    </>
                )}
            </motion.button>

            {/* GitHub Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onLogin('github')}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#24292e] text-white font-black uppercase tracking-widest text-xs transition-all hover:bg-[#2f363d] disabled:opacity-50 group"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <Github size={20} className="opacity-80 group-hover:opacity-100 transition-opacity" />
                        <span>Sign in with GitHub</span>
                    </>
                )}
            </motion.button>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[var(--error)] text-[10px] font-bold uppercase tracking-[0.2em] text-center mt-2 p-3 bg-[var(--error)]/10 rounded-xl border border-[var(--error)]/20"
                >
                    {error}
                </motion.div>
            )}
        </div>
    );
};
