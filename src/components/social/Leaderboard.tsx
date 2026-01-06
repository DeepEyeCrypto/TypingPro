import React, { useEffect, useState } from 'react';
import { leaderboardService } from '@src/services/leaderboardService';
import { UserProfile } from '@src/services/userService';
import { useAuthStore } from '@src/stores/authStore';
import { raceService } from '@src/services/raceService';
import { getRank } from '@src/utils/rankSystem';
import './RankStyles.css';

interface Props {
    onPlayGhost: (lessonId: string, ghostData: any) => void;
}

export const Leaderboard: React.FC<Props> = ({ onPlayGhost }) => {
    const { profile: myProfile } = useAuthStore();
    const [rankings, setRankings] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingGhost, setLoadingGhost] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = leaderboardService.subscribeToGlobalRankings((data) => {
            setRankings(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleChallenge = async (uid: string) => {
        setLoadingGhost(uid);
        try {
            const bestRace = await raceService.getBestRace_User(uid);
            if (bestRace && bestRace.replay) {
                // Ensure replay format matches ReplayData
                const replayData = { charAndTime: bestRace.replay };
                onPlayGhost(bestRace.lessonId, replayData);
            } else {
                alert("No replay data available for this user.");
            }
        } catch (e) {
            console.error("Failed to load ghost", e);
            alert("Failed to load ghost data.");
        } finally {
            setLoadingGhost(null);
        }
    };

    const getRankBadge = (index: number) => {
        if (index === 0) return <span className="rank-badge-1">🥇</span>;
        if (index === 1) return <span className="rank-badge-2">🥈</span>;
        if (index === 2) return <span className="rank-badge-3">🥉</span>;
        return `#${index + 1}`;
    };

    if (loading) return <div className="leaderboard-loading">Loading rankings...</div>;

    return (
        <div className="leaderboard-section">
            <h3 className="section-title">Global Rankings</h3>

            <div className="ranking-header">
                <span className="col-rank">Rank</span>
                <span className="col-user">User</span>
                <span className="col-wpm">Top WPM</span>
                <span className="col-races">Races</span>
            </div>

            <div className="ranking-list">
                {rankings.map((user, index) => {
                    const isMe = user.uid === myProfile?.uid;
                    return (
                        <div key={user.uid} className={`ranking-row ${isMe ? 'highlight' : ''}`}>
                            <span className="col-rank badge">{getRankBadge(index)}</span>

                            <div className="col-user flex-user">
                                <img src={user.avatar_url} alt={user.username} />
                                <div className="user-info">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span className={user.highest_wpm >= 100 ? 'wpm-elite emerald-text' : ''}>
                                            {user.username}
                                        </span>
                                        {(() => {
                                            const rank = getRank(user.highest_wpm);
                                            return (
                                                <span
                                                    className={`rank-badge ${rank.className || ''}`}
                                                    style={{ background: rank.color, color: rank.label === 'Diamond' || rank.label === 'Silver' ? '#000' : '#fff' }}
                                                >
                                                    {rank.label}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                    {!isMe && (
                                        <button
                                            className="challenge-btn"
                                            onClick={() => handleChallenge(user.uid)}
                                            disabled={loadingGhost === user.uid}
                                        >
                                            {loadingGhost === user.uid ? '...' : '⚔️ Race'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <span className="col-wpm value">{user.highest_wpm}</span>
                            <span className="col-races">{user.total_races}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
