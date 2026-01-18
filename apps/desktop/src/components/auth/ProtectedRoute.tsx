// ═══════════════════════════════════════════════════════════════════
// PROTECTED ROUTE: Authentication guard for sensitive pages
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { GlassCard } from '../ui/GlassCard';
import { GoogleLoginButton } from '../features/auth/GoogleLoginButton';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    fallbackMessage?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAuth = true,
    fallbackMessage = 'Sign in to access this feature'
}) => {
    const { user, login, isLoading } = useAuth();

    // If auth not required, render children
    if (!requireAuth) {
        return <>{children}</>;
    }

    // If user is authenticated, render children
    if (user) {
        return <>{children}</>;
    }

    // Show login prompt
    return (
        <div className="h-full w-full flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <GlassCard variant="large" className="max-w-md w-full p-8 flex flex-col items-center gap-6">
                    {/* Lock Icon */}
                    <div className="w-20 h-20 glass-unified rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    {/* Title */}
                    <div className="text-center">
                        <h2 className="text-xl font-black text-white tracking-tight mb-2">
                            Authentication Required
                        </h2>
                        <p className="text-sm text-white/50">
                            {fallbackMessage}
                        </p>
                    </div>

                    {/* Login Buttons */}
                    <div className="w-full flex flex-col gap-3">
                        <GoogleLoginButton />

                        <button
                            onClick={() => login('github')}
                            disabled={isLoading}
                            className="glass-unified w-full h-14 flex items-center justify-center gap-4 group hover:bg-white/10 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                            </div>
                            <span className="text-sm font-black text-white tracking-widest uppercase italic group-hover:tracking-[0.2em] transition-all">
                                {isLoading ? 'Connecting...' : 'Continue with GitHub'}
                            </span>
                        </button>
                    </div>

                    {/* Skip Option (Guest Mode) */}
                    <p className="text-[10px] text-white/30 font-medium text-center">
                        Some features require authentication to save your progress
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default ProtectedRoute;
