import React, { useState } from 'react';
import { friendService } from '@src/services/friendService';
import { UserProfile } from '@src/services/userService';
import { useAuthStore } from '@src/stores/authStore';
import './UserSearch.css';

export const UserSearch = () => {
    const { profile: myProfile } = useAuthStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserProfile[]>([]);
    const [searching, setSearching] = useState(false);
    const [requestSent, setRequestSent] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setSearching(true);
        try {
            const users = await friendService.searchUsers(query);
            // Filter out self
            setResults(users.filter(u => u.uid !== myProfile?.uid));
        } catch (error) {
            console.error(error);
        } finally {
            setSearching(false);
        }
    };

    const sendRequest = async (user: UserProfile) => {
        if (!myProfile) return;
        await friendService.sendFriendRequest(myProfile, user.uid);
        setRequestSent(user.uid);
        setTimeout(() => setRequestSent(null), 3000);
    };

    return (
        <div className="user-search">
            <h3>Add Friends</h3>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search username..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" disabled={searching}>
                    {searching ? '...' : '🔍'}
                </button>
            </form>

            <div className="search-results">
                {results.map(user => (
                    <div key={user.uid} className="result-item">
                        <img src={user.avatar_url} alt={user.username} />
                        <span>{user.username}</span>
                        {requestSent === user.uid ? (
                            <span className="sent-badge">Sent!</span>
                        ) : (
                            <button onClick={() => sendRequest(user)} className="add-btn">+</button>
                        )}
                    </div>
                ))}
                {results.length === 0 && query && !searching && (
                    <p className="no-results">No users found</p>
                )}
            </div>
        </div>
    );
};
