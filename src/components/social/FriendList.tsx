import React, { useEffect, useState } from 'react';
import { friendService, FriendRequest } from '@src/services/friendService';
import { UserProfile } from '@src/services/userService';
import { useAuthStore } from '@src/stores/authStore';

export const FriendList = () => {
    const { profile } = useAuthStore();
    const [friends, setFriends] = useState<UserProfile[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profile) return;

        // 1. Fetch friends once (or we could also use onSnapshot here if we wanted)
        friendService.getFriends(profile.uid).then(setFriends).finally(() => setLoading(false));

        // 2. Real-time requests
        const unsub = friendService.listenToIncomingRequests(profile.uid, (data) => {
            setRequests(data);
        });

        return () => unsub();
    }, [profile]);

    const handleAccept = async (id: string) => {
        await friendService.acceptFriendRequest(id);
        // Re-fetch friends list since subcollection changed
        if (profile) {
            const updatedFriends = await friendService.getFriends(profile.uid);
            setFriends(updatedFriends);
        }
    };

    const handleReject = async (id: string) => {
        await friendService.rejectFriendRequest(id);
        // Requests will auto-update via listener
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12 space-x-3">
            <div className="w-2 h-2 rounded-full bg-hacker animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-hacker animate-bounce delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-hacker animate-bounce delay-300"></div>
            <span className="text-[10px] font-bold text-hacker uppercase tracking-widest pl-2">Syncing_Social_Graph...</span>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Friends Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Contact_List</h3>
                    <span className="text-[10px] font-bold text-hacker bg-hacker/10 px-2 py-0.5 rounded tabular-nums">
                        {friends.length} Active
                    </span>
                </div>

                <div className="space-y-2">
                    {friends.length === 0 ? (
                        <div className="p-6 rounded-lg border border-dashed border-white/5 text-center">
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">No_Connections_Found</p>
                        </div>
                    ) : (
                        friends.map(friend => (
                            <div key={friend.uid} className="group flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-hacker/30 hover:bg-white/10 transition-all duration-300">
                                <div className="relative">
                                    <img src={friend.avatar_url} alt={friend.username} className="w-10 h-10 rounded-full border border-white/10" />
                                    {friend.last_seen && (Date.now() - friend.last_seen < 10 * 60 * 1000) ? (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-hacker border-2 border-midnight"></div>
                                    ) : (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white/20 border-2 border-midnight"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-white truncate group-hover:text-hacker transition-colors">
                                        {friend.username}
                                    </div>
                                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">
                                        AVG_SPEED: {friend.avg_wpm} WPM
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 rounded-lg hover:bg-hacker/20 text-hacker">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Requests Section */}
            {requests.length > 0 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[10px] font-black text-rose-500/50 uppercase tracking-[0.2em]">Pending_Access</h3>
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded tabular-nums">
                            {requests.length} Signal
                        </span>
                    </div>

                    <div className="space-y-2">
                        {requests.map(req => (
                            <div key={req.id} className="flex items-center gap-4 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                                <img src={req.fromAvatar} alt={req.fromUsername} className="w-8 h-8 rounded-full border border-rose-500/20" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white truncate">
                                        {req.fromUsername}
                                    </div>
                                    <div className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
                                        Inbound_Request
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleAccept(req.id)}
                                        className="p-1.5 rounded-lg bg-hacker/10 text-hacker hover:bg-hacker hover:text-midnight transition-all"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleReject(req.id)}
                                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
