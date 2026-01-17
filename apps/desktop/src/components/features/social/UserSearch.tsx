import React, { useState } from 'react';
import { friendService } from '../../../core/friendService';
import { UserProfile } from '../../../core/userService';
import { useAuthStore } from '../../../core/store/authStore';
import './Visuals.css';

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
        <div className={`space-y-8 animate-in fade-in duration-700 ${searching ? 'scanline-container' : ''}`}>
            <div className="flex items-center justify-between px-4">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">NEURAL_SEARCH</h3>
            </div>

            <form onSubmit={handleSearch} className="relative group">
                <input
                    type="text"
                    placeholder="ENTER_BIOMETRIC_ID..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full glass-perfect rounded-full px-8 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-mono tracking-wider shadow-2xl"
                />
                <button
                    type="submit"
                    disabled={searching}
                    className="absolute right-3 top-2.5 p-2 rounded-full bg-white text-black hover:scale-110 active:scale-90 transition-all disabled:opacity-50"
                >
                    {searching ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </button>
            </form>

            <div className="space-y-3">
                {results.map(user => (
                    <div key={user.uid} className="flex items-center gap-6 p-4 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group">
                        <img src={user.avatar_url} alt={user.username} className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-white/40 transition-all shadow-xl" />
                        <div className="flex-1 min-w-0">
                            <span className="text-sm font-black text-white block truncate tracking-tight">{user.username}</span>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">AVG_VELOCITY: {user.avg_wpm} WPM</span>
                        </div>
                        {requestSent === user.uid ? (
                            <div className="px-4 py-2 rounded-full bg-white text-black shadow-xl">
                                <span className="text-[10px] font-black uppercase tracking-widest">ENVOY_SENT</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => sendRequest(user)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/10 text-white hover:bg-white hover:text-black transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
                {results.length === 0 && query && !searching && (
                    <div className="py-12 text-center bg-white/2 border border-dashed border-white/10 rounded-[2rem] px-10">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-loose">
                            NO_MATCHES_SIGNATURE_INVALID<br />
                            <span className="opacity-40 text-[8px]">CHECK_OVERRIDE_PERMISSIONS</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
