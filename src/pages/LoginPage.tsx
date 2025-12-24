import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const response = await invoke('handle_google_oauth', {
                clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            });
            if (response) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Google login failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGitHubLogin = async () => {
        setLoading(true);
        try {
            const response = await invoke('handle_github_oauth', {
                clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
            });
            if (response) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('GitHub login failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = () => {
        // Store a temporary guest session
        localStorage.setItem('guestMode', 'true');
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <div className="login-card glass-morphism">
                <div className="login-header">
                    <h1 className="login-title">Master Touch Typing</h1>
                    <p className="login-subtitle">From Zero to 200 WPM with Scientific Techniques</p>
                </div>

                <div className="login-content">
                    <button
                        className="btn btn-google glass-btn"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        {/* Placeholder for Google Icon */}
                        <span className="btn-icon">G</span>
                        <span>Sign in with Google</span>
                    </button>

                    <button
                        className="btn btn-github glass-btn"
                        onClick={handleGitHubLogin}
                        disabled={loading}
                    >
                        {/* Placeholder for GitHub Icon */}
                        <span className="btn-icon">Git</span>
                        <span>Sign in with GitHub</span>
                    </button>

                    <div className="divider">OR</div>

                    <button className="btn btn-guest" onClick={handleGuestLogin}>
                        Continue as Guest (10 Lessons Trial)
                    </button>
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="trust-indicators">
                    <div className="indicator">
                        <span className="icon">👥</span>
                        <span className="text">5,000+ Users</span>
                    </div>
                    <div className="indicator">
                        <span className="icon">⭐</span>
                        <span className="text">4.8 Rating</span>
                    </div>
                    <div className="indicator">
                        <span className="icon">💰</span>
                        <span className="text">Free Forever</span>
                    </div>
                </div>
            </div>

            <div className="login-background">
                {/* Floating glass orbs for liquid effect */}
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>
        </div>
    );
};

export default LoginPage;
