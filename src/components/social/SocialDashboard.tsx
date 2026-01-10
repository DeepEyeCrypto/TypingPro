import React, { useState } from 'react';
import { useAuthStore } from '@src/stores/authStore';
import { friendService } from '@src/services/friendService';
import { DuelArena } from './DuelArena';
import { UserSearch } from './UserSearch';
import { FriendList } from './FriendList';
import { Leaderboard } from './Leaderboard';
import { getProgressToNextRank, getRank } from '@src/utils/rankSystem';
import { ReleaseHub } from './ReleaseHub';
import { HyperAnalytics } from './HyperAnalytics';
import './SocialDashboard.css';
import './Visuals.css';
import './RankStyles.css';

interface Props {
    onBack: () => void;
    onPlayGhost: (lessonId: string, ghostData: any) => void;
    onNavigateToLobby: () => void;
}

export const SocialDashboard: React.FC<Props> = ({ onBack, onPlayGhost, onNavigateToLobby }) => {
    const { user, profile } = useAuthStore();
    const [activeDuelId, setActiveDuelId] = useState<string | null>(null);

    const handleStartDuel = async () => {
        if (!user) return;
        const friends = await friendService.getFriends(user.id);
        if (friends.length > 0) {
            const duelId = await friendService.createDuelChallenge(user.id, friends[0].uid);
            setActiveDuelId(duelId);
        } else {
            alert("No friends online to duel! Try adding some friends first.");
        }
    };

    if (!user) {
        return (
            <div className="social-dashboard center">
                <h2>Login Required</h2>
                <p>Please login to access social features.</p>
                <button onClick={onBack} className="back-btn">← Back</button>
            </div>
        )
    }

    if (activeDuelId) {
        return <DuelArena duelId={activeDuelId} onEnd={() => setActiveDuelId(null)} />;
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
                            onClick={handleStartDuel}
                            className="w-full py-4 glass-button text-cyan-400 font-bold text-xl tracking-wider shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                        >
                            ⚔️ START DUEL
                        </button>
                    </div>
                    <UserSearch />
                </div>
            </div>
            <div className="phase-5-container">
                <div className="release-hub-section">
                    <ReleaseHub />
                </div>
                <div className="analytics-section">
                    <HyperAnalytics />
                </div>
            </div>
        </div>
    );
};
