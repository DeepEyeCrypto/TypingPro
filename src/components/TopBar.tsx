import React, { useState } from 'react';
import { LoginModal } from './LoginModal';
import './TopBar.css';

interface TopBarProps {
    isLoggedIn: boolean;
    user: any;
}

export const TopBar: React.FC<TopBarProps> = ({ isLoggedIn, user }) => {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className="topbar">
            <div className="topbar-logo">
                <span className="logo-icon">T</span>
                <span className="logo-text">TypingPro</span>
            </div>

            <div className="topbar-actions">
                {isLoggedIn && user ? (
                    <div className="user-profile">
                        <div className="avatar-placeholder">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user.name || 'User'}</span>
                            <span className="user-status">Cloud Synced</span>
                        </div>
                    </div>
                ) : (
                    <button
                        className="btn-login-header"
                        onClick={() => setShowLogin(true)}
                    >
                        Login to Sync
                    </button>
                )}
            </div>

            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onSuccess={(u) => window.location.reload()} // Quick way to update state for now
                />
            )}
        </div>
    );
};

export default TopBar;
