import React, { useState } from 'react';
import { friendService } from '@src/services/friendService';
import { UserProfile } from '@src/services/userService';
import { useAuthStore } from '@src/stores/authStore';
import { Button } from '../ui/Button';

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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Add_Friends</h3>
            </div>

            <form onSubmit={handleSearch} className="relative group">
                <input
                    type="text"
                    placeholder="Search_Biometric_ID..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-hacker/50 focus:bg-white/10 transition-all"
                />
                <button
                    type="submit"
                    disabled={searching}
                    className="absolute right-2 top-2 p-1.5 rounded-lg bg-hacker/10 text-hacker hover:bg-hacker hover:text-midnight transition-all disabled:opacity-50"
                >
                    {searching ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </button>
            </form>

            <div className="space-y-2">
                {results.map(user => (
                    <div key={user.uid} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                        <img src={user.avatar_url} alt={user.username} className="w-8 h-8 rounded-full border border-white/10" />
                        <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-white block truncate">{user.username}</span>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">LVL: {user.avg_wpm} WPM</span>
                        </div>
                        {requestSent === user.uid ? (
                            <div className="px-2 py-1 rounded bg-hacker/10 border border-hacker/20">
                                <span className="text-[10px] font-black text-hacker uppercase tracking-widest">Sent_!</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => sendRequest(user)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/40 hover:bg-hacker hover:text-midnight hover:border-hacker transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
                {results.length === 0 && query && !searching && (
                    <div className="py-8 text-center bg-white/5 border border-dashed border-white/10 rounded-xl">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">
                            No_Matches_Detected<br />
                            <span className="opacity-50">Check_Username_Encoding</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
