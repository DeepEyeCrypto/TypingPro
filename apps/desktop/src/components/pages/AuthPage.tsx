import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

export const AuthPage: React.FC = () => {
    const { login, isLoading, error } = useAuth();

    return (
        <div className="h-screen w-screen flex items-center justify-center p-6">
            <GlassCard className="w-full max-w-md p-10 flex flex-col gap-8 items-center bg-black/30 border-white/10 shadow-2xl backdrop-blur-2xl">
                {/* Header */}
                <div className="text-center space-y-2">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl mx-auto mb-6 border border-white/10 flex items-center justify-center"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-white/60 text-sm">Sync your progress across devices</p>
                </div>

                {/* Actions */}
                <div className="w-full space-y-4">
                    {/* Google Button */}
                    <button
                        onClick={() => login('google')}
                        disabled={isLoading}
                        className="relative w-full h-14 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-4 group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </div>
                        <span className="font-semibold text-white tracking-wide">Continue with Google</span>
                    </button>

                    {/* GitHub Button */}
                    <button
                        onClick={() => login('github')}
                        disabled={isLoading}
                        className="relative w-full h-14 rounded-2xl border border-white/10 bg-black/40 hover:bg-black/60 flex items-center justify-center gap-4 group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-white tracking-wide">Continue with GitHub</span>
                    </button>
                </div>

                {isLoading && (
                    <div className="text-neon text-sm font-bold animate-pulse">
                        Authenticating... Check your browser
                    </div>
                )}

                {error && (
                    <div className="text-neon-red text-xs text-center px-4">
                        {error}
                    </div>
                )}

            </GlassCard>
        </div>
    );
};
