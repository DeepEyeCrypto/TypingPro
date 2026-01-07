import React from 'react';
import { useAuthStore } from '@src/stores/authStore';
import './SocialDashboard.css';
import { UserSearch } from './UserSearch';
import { FriendList } from './FriendList';
import { Leaderboard } from './Leaderboard';
import './Visuals.css';
import './RankStyles.css';
import { getProgressToNextRank, getRank } from '@src/utils/rankSystem';

interface Props {
    onBack: () => void;
    onPlayGhost: (lessonId: string, ghostData: any) => void;
    onNavigateToLobby: () => void;
}

export const SocialDashboard: React.FC<Props> = ({ onBack, onPlayGhost, onNavigateToLobby }) => {
    const { user, profile } = useAuthStore();

    if (!user) {
        return (
            <div className="social-dashboard center">
                <h2>Login Required</h2>
                <p>Please login to access social features.</p>
                <button onClick={onBack} className="back-btn">← Back</button>
            </div>
        )
    }

    return (
        <div className="social-dashboard glass-panel">
            <header className="social-header">
                <button onClick={onBack} className="back-btn">← Back</button>
                <div className="header-title">
                    <h1>Community Hub</h1>
                    <span className="live-badge">● LIVE</span>
                </div>
            </header>

            <div className="profile-card">
                <img src={profile?.avatar_url || user.avatar_url} alt="Avatar" className="profile-avatar" />
                <div className="profile-info">
                    <h2 className="username">@{profile?.username || '...'}</h2>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <label>Highest WPM</label>
                            <span className={`value ${(profile?.highest_wpm || 0) >= 100 ? 'wpm-elite emerald-text' : 'em-text'}`}>
                                {profile?.highest_wpm || 0}
                            </span>
                        </div>
                        <div className="stat-box">
                            <label>Avg WPM</label>
                            <span className="value">{profile?.avg_wpm || 0}</span>
                        </div>
                        <div className="stat-box">
                            <label>Races</label>
                            <span className="value">{profile?.total_races || 0}</span>
                        </div>
                        <div className="stat-box">
                            <label>Rank Points</label>
                            <span className="value">{profile?.rank_points || 0}</span>
                        </div>
                    </div>

                    {/* Rank Progress Bar */}
                    {(() => {
                        const progress = getProgressToNextRank(profile?.highest_wpm || 0);
                        const currentRank = getRank(profile?.highest_wpm || 0);
                        return progress.nextLabel ? (
                            <div className="rank-progress-container">
                                <div className="progress-header">
                                    <span>Current: <span style={{ color: currentRank.color }}>{currentRank.label}</span></span>
                                    <span>Next: {progress.nextLabel} ({progress.needed} WPM more)</span>
                                </div>
                                <div className="progress-track">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${progress.percent}%`,
                                            background: `linear-gradient(90deg, ${currentRank.color}, #fff)`
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="rank-progress-container" style={{ textAlign: 'center', color: '#00ffff' }}>
                                🏆 MAX RANK ACHIEVED: DIAMOND
                            </div>
                        );
                    })()}
                </div>
            </div>

            <div className="social-grid">
                <div className="leaderboard-panel">
                    <Leaderboard onPlayGhost={onPlayGhost} />
                </div>
                <div className="main-feed">
                    <FriendList />
                </div>
                <div className="search-sidebar">
                    <div className="mb-4">
                        <button
                            onClick={onNavigateToLobby}
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold text-white shadow-lg transform hover:scale-105 transition-all text-xl tracking-wider border border-white/20"
                        >
                            ⚔️ START DUEL
                        </button>
                    </div>
                    <UserSearch />
                </div>
            </div>
        </div>
    );
};
