import React, { useEffect, useState } from 'react';
import { friendService, FriendRequest } from '@src/services/friendService';
import { UserProfile } from '@src/services/userService';
import { useAuthStore } from '@src/stores/authStore';
import './FriendList.css';

export const FriendList = () => {
    const { profile } = useAuthStore();
    const [friends, setFriends] = useState<UserProfile[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshData = async () => {
        if (!profile) return;
        setLoading(true);
        try {
            const [friendsData, requestsData] = await Promise.all([
                friendService.getFriends(profile.uid),
                friendService.getIncomingRequests(profile.uid)
            ]);
            setFriends(friendsData);
            setRequests(requestsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, [profile]);

    const handleAccept = async (id: string) => {
        await friendService.acceptFriendRequest(id);
        refreshData();
    };

    const handleReject = async (id: string) => {
        await friendService.rejectFriendRequest(id);
        refreshData();
    };

    if (loading) return <div className="friend-loading">Loading connections...</div>;

    return (
        <div className="friend-section">
            <div className="friend-column">
                <h3 className="section-title">Friends
                    <span className="count">{friends.length}</span>
                </h3>

                <div className="friend-list">
                    {friends.length === 0 ? (
                        <p className="empty-msg">No friends yet. Search to add some!</p>
                    ) : (
                        friends.map(friend => (
                            <div key={friend.uid} className="friend-card">
                                <img src={friend.avatar_url} alt={friend.username} />
                                <div className="friend-details">
                                    <span className="fname">{friend.username}</span>
                                    <span className="fstat">Avg: {friend.avg_wpm} WPM</span>
                                </div>
                                <div className="status-dot online"></div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {requests.length > 0 && (
                <div className="requests-column">
                    <h3 className="section-title">Requests
                        <span className="count pending">{requests.length}</span>
                    </h3>

                    <div className="request-list">
                        {requests.map(req => (
                            <div key={req.id} className="request-card">
                                <div className="req-header">
                                    <img src={req.fromAvatar} alt={req.fromUsername} />
                                    <span>{req.fromUsername}</span>
                                </div>
                                <div className="req-actions">
                                    <button onClick={() => handleAccept(req.id)} className="accept-btn">✓</button>
                                    <button onClick={() => handleReject(req.id)} className="reject-btn">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
