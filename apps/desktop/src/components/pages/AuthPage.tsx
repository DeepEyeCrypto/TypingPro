// ═══════════════════════════════════════════════════════════════════
// AUTH PAGE: VisionOS-style login and protocol entry
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useAuth } from '../../hooks/useAuth';
import { GoogleLoginButton } from '../features/auth/GoogleLoginButton';
import { motion } from 'framer-motion';

export const AuthPage: React.FC = () => {
    const { login, isLoading, error } = useAuth();

    return (
        <div className="h-screen w-screen flex items-center justify-center p-6 relative overflow-hidden bg-black">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 w-full max-w-md scale-95 md:scale-100">
                <GlassCard variant="large" className="w-full flex flex-col gap-10 items-center py-12 px-8">

                    {/* Brand Header */}
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="w-20 h-20 glass-unified mx-auto mb-8 flex items-center justify-center shadow-2xl"
                        >
                            <span className="text-4xl font-black text-white">P</span>
                        </motion.div>
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">TYPINGPRO</h1>
                        <p className="glass-text-muted text-[10px] font-black uppercase tracking-[0.3em]">Protocol Identity Access</p>
                    </div>

                    {/* Authentication Vectors */}
                    <div className="w-full flex flex-col gap-4">
                        {/* Google Vector */}
                        <GoogleLoginButton />

                        {/* GitHub Vector */}
                        <button
                            onClick={() => login('github')}
                            disabled={isLoading}
                            className="glass-unified w-full h-16 flex items-center justify-center gap-4 group hover:bg-white/5 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="black">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                            </div>
                            <span className="text-sm font-black text-white tracking-widest uppercase italic">Initialize GitHub</span>
                        </button>
                    </div>

                    {/* Status & Feedback */}
                    <div className="h-4">
                        {isLoading ? (
                            <span className="text-[10px] font-black text-cyan-400 animate-pulse tracking-[0.4em] uppercase">Checking Permissions...</span>
                        ) : error ? (
                            <span className="text-[10px] font-black text-red-400 tracking-wider uppercase">{error}</span>
                        ) : (
                            <span className="text-[10px] font-black text-white/20 tracking-widest uppercase">Select Vector</span>
                        )}
                    </div>

                    {/* Footer Policy */}
                    <div className="mt-4 flex flex-col items-center gap-4">
                        <div className="flex gap-6">
                            <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Privacy</span>
                            <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Terms</span>
                            <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Nodes</span>
                        </div>
                        <p className="text-[8px] text-white/10 uppercase tracking-[0.5em] font-black">v2.0.0-VISION-OS</p>
                    </div>

                </GlassCard>
            </div>
        </div>
    );
};
