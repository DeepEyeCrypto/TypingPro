import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './TopBar.css';

interface TopBarProps {
    onCurriculumToggle: () => void;
    isSidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onCurriculumToggle, isSidebarOpen }) => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAuthAction = async (provider: 'google' | 'github') => {
        setLoading(true);
        try {
            const clientId = provider === 'google'
                ? import.meta.env.VITE_GOOGLE_CLIENT_ID
                : import.meta.env.VITE_GITHUB_CLIENT_ID;

            const command = provider === 'google' ? 'handle_google_oauth' : 'handle_github_oauth';
            const response = await invoke(command, { clientId });

            if (response) {
                setIsLoggedIn(true);
                setIsAuthOpen(false);
                // In a real app, sync localStorage to Firebase here
            }
        } catch (err) {
            console.error(`${provider} login failed:`, err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className="top-bar p-6 flex justify-between items-center z-50">
            <div className="flex items-center gap-4">
                <div className="logo-icon w-10 h-10 bg-white flex items-center justify-center rounded-xl text-black font-black text-xl shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                    T
                </div>
                <h1 className="text-xl font-bold tracking-tight liquid-text">TypingPro</h1>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={onCurriculumToggle}
                    className={`liquid-button ${isSidebarOpen ? 'active' : ''}`}
                >
                    {isSidebarOpen ? 'Close Menu' : 'Curriculum'}
                </button>

                <div className="auth-dropdown-container relative">
                    <button
                        onClick={() => setIsAuthOpen(!isAuthOpen)}
                        className="profile-btn w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center overflow-hidden"
                    >
                        {isLoggedIn ? (
                            <span className="text-xs text-green-400">●</span>
                        ) : (
                            <span className="text-[10px] text-white/40">GUEST</span>
                        )}
                    </button>

                    {isAuthOpen && (
                        <div className="auth-dropdown glass-morphism absolute right-0 mt-4 w-64 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="dropdown-header mb-4">
                                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Account Status</p>
                                <p className="text-sm font-semibold">{isLoggedIn ? 'Authenticated' : 'Guest Mode'}</p>
                                {!isLoggedIn && (
                                    <p className="text-[10px] text-cyan-400/60 mt-1">Login to sync progress to cloud</p>
                                )}
                            </div>

                            {!isLoggedIn ? (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleAuthAction('google')}
                                        disabled={loading}
                                        className="w-full py-2 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs flex items-center gap-3 transition-colors"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                        Login with Google
                                    </button>
                                    <button
                                        onClick={() => handleAuthAction('github')}
                                        disabled={loading}
                                        className="w-full py-2 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs flex items-center gap-3 transition-colors"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-white"></span>
                                        Login with GitHub
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsLoggedIn(false)}
                                    className="w-full py-2 px-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopBar;
