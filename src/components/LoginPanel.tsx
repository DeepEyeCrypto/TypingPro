import React from 'react';
import { useAuthStore } from '../stores/authStore';
import '../styles/glass.css';

const LoginPanel: React.FC = () => {
    const { login, setLoading, setError, isLoading } = useAuthStore();

    const handleOAuthLogin = async (provider: 'google' | 'github') => {
        setLoading(true);
        try {
            // In a real Tauri app, this would invoke a Rust command
            // For now, we mock the success
            setTimeout(() => {
                login({
                    id: '1',
                    email: 'user@example.com',
                    name: 'Typing Pro',
                    avatar: '',
                    provider
                });
            }, 1000);
        } catch (err) {
            setError('Authentication failed. Please try again.');
        }
    };

    return (
        <div className="ios-glass p-10 w-full max-w-md flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-xl shadow-blue-500/20 mb-2">
                    T
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Welcome to TypingPro</h2>
                <p className="text-gray-500 text-sm text-center">
                    Sign in to sync your progress, achievements, and compete on the global leaderboard.
                </p>
            </div>

            <div className="w-full flex flex-col gap-4">
                <button
                    onClick={() => handleOAuthLogin('google')}
                    disabled={isLoading}
                    className="ios-button w-full py-3 flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 border-none"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                    <span className="font-semibold">Continue with Google</span>
                </button>

                <button
                    onClick={() => handleOAuthLogin('github')}
                    disabled={isLoading}
                    className="ios-button w-full py-3 flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#2c3238] border-none"
                >
                    <img src="https://github.com/favicon.ico" alt="GitHub" className="w-4 h-4 invert" />
                    <span className="font-semibold">Continue with GitHub</span>
                </button>
            </div>

            <div className="flex flex-col items-center gap-4">
                <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors">
                    Continue as Guest
                </button>
                <p className="text-[10px] text-gray-600 text-center uppercase tracking-widest leading-relaxed">
                    By continuing, you agree to our<br />Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default LoginPanel;
