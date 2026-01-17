import React, { useEffect, useState } from 'react';
import { friendService, FriendRequest } from '../../../core/friendService';
import { UserProfile } from '../../../core/userService';
import { useAuthStore } from '../../../core/store/authStore';
import './FriendList.css';
import './Visuals.css'; // Optimized design tokens

export const FriendList = () => {
    const { profile } = useAuthStore();
    const [friends, setFriends] = useState<UserProfile[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profile) return;

        // Use the new real-time presence listener for friends
        const unsubFriends = friendService.listenToFriendsPresence(profile.uid, (data) => {
            setFriends(data);
            setLoading(false);
        });

        // Real-time requests
        const unsubRequests = friendService.listenToIncomingRequests(profile.uid, (data) => {
            setRequests(data);
        });

        return () => {
            unsubFriends();
            unsubRequests();
        };
    }, [profile]);

    const handleAccept = async (id: string) => {
        await friendService.acceptFriendRequest(id);
    };

    const handleReject = async (id: string) => {
        await friendService.rejectFriendRequest(id);
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12 space-x-3">
            <div className="w-2 h-2 rounded-full bg-black animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-black animate-bounce delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-black animate-bounce delay-300"></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest pl-2 opacity-60">Syncing_Social_Graph...</span>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Friends Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-white opacity-30 uppercase tracking-[0.2em]">Live_Connections</h3>
                    <span className="text-[10px] font-bold text-white bg-white/5 px-2 py-0.5 rounded tabular-nums">
                        {friends.length} Active
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {friends.length === 0 ? (
                        <div className="p-6 rounded-lg border border-dashed border-white/5 text-center col-span-full">
                            <p className="text-[10px] font-bold text-white opacity-20 uppercase tracking-widest">No_Connections_Found</p>
                        </div>
                    ) : (
                        friends.map(friend => {
                            const isOnline = friend.last_seen && (Date.now() - friend.last_seen < 10 * 60 * 1000);
                            const status = friend.status || (isOnline ? 'LOBBY' : 'OFFLINE');

                            return (
                                <div key={friend.uid} className="group glass-v5 flex items-center gap-4 p-3 rounded-xl">
                                    <div className={`status-ring ${status.toLowerCase()} ${isOnline ? 'ring-active' : ''}`}>
                                        <img src={friend.avatar_url} alt={friend.username} className="w-10 h-10 rounded-full border border-white/10" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white truncate">
                                                {friend.username}
                                            </span>
                                            {status === 'TYPING' && (
                                                <span className="flex gap-0.5">
                                                    <span className="w-1 h-1 bg-black rounded-full animate-bounce"></span>
                                                    <span className="w-1 h-1 bg-black rounded-full animate-bounce delay-75"></span>
                                                    <span className="w-1 h-1 bg-black rounded-full animate-bounce delay-150"></span>
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-white opacity-30 uppercase tracking-tighter">
                                                {status}
                                            </span>
                                            {status === 'TYPING' && friend.current_wpm && (
                                                <span className="text-[10px] font-black text-white tabular-nums">
                                                    {friend.current_wpm} WPM
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-white" title="Direct Challenge">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Requests Section */}
            {requests.length > 0 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Pending_Access</h3>
                        <span className="text-[10px] font-bold text-white bg-white/5 px-2 py-0.5 rounded tabular-nums">
                            {requests.length} Signal
                        </span>
                    </div>

                    <div className="space-y-2">
                        {requests.map(req => (
                            <div key={req.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                                <img src={req.fromAvatar} alt={req.fromUsername} className="w-8 h-8 rounded-full border border-white/10" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white truncate">
                                        {req.fromUsername}
                                    </div>
                                    <div className="text-[10px] font-bold text-white opacity-60 uppercase tracking-tighter">
                                        Inbound_Request
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleAccept(req.id)}
                                        className="p-1.5 rounded-lg bg-white/5 text-white hover:bg-black hover:text-white transition-all"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleReject(req.id)}
                                        className="p-1.5 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all"
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
