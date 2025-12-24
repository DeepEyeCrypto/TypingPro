import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './LoginModal.css';

interface LoginModalProps {
    onClose: () => void;
    onSuccess: (user: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (provider: 'google' | 'github') => {
        setLoading(true);
        setError('');
        try {
            const clientId = provider === 'google'
                ? import.meta.env.VITE_GOOGLE_CLIENT_ID
                : import.meta.env.VITE_GITHUB_CLIENT_ID;

            const command = provider === 'google' ? 'handle_google_oauth' : 'handle_github_oauth';
            const response: any = await invoke(command, { clientId });

            if (response && response.user) {
                localStorage.setItem('typingPro_user', JSON.stringify(response.user));
                onSuccess(response.user);
                onClose();
            }
        } catch (err: any) {
            setError(`${provider} login failed. Please try again.`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <div className="login-modal glass-morphism animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>

                <div className="modal-header">
                    <h2>Cloud Sync</h2>
                    <p>Login to save your progress across devices</p>
                </div>

                <div className="modal-content">
                    <button
                        className="provider-btn google"
                        onClick={() => handleLogin('google')}
                        disabled={loading}
                    >
                        <span className="icon">G</span>
                        <span>Sign in with Google</span>
                    </button>

                    <button
                        className="provider-btn github"
                        onClick={() => handleLogin('github')}
                        disabled={loading}
                    >
                        <span className="icon">Git</span>
                        <span>Sign in with GitHub</span>
                    </button>
                </div>

                {error && <p className="modal-error">{error}</p>}

                <p className="modal-footer">
                    Guest data will be automatically synced upon login.
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
