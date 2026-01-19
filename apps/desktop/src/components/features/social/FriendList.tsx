import React, { useEffect, useState } from 'react';
import { friendService, FriendRequest } from '../../../core/friendService';
import { UserProfile } from '../../../core/userService';
import { useAuthStore } from '../../../core/store/authStore';
import './FriendList.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Check, X, Users, Activity, UserPlus, ShieldAlert } from 'lucide-react';

export const FriendList = () => {
    const { profile } = useAuthStore();
    const [friends, setFriends] = useState<UserProfile[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profile) return;

        const unsubFriends = friendService.listenToFriendsPresence(profile.uid, (data) => {
            setFriends(data);
            setLoading(false);
        });

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
        <div className="flex flex-col items-center justify-center p-16 space-y-4">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--text-accent)] border-t-transparent animate-spin" />
                <Activity className="absolute inset-0 m-auto text-[var(--text-accent)] animate-pulse" size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30" style={{ color: 'var(--text-primary)' }}>Syncing_Neural_Graph</span>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500 relative overflow-hidden">
            {/* Friends Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Users size={12} className="text-[var(--text-accent)] opacity-40" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic" style={{ color: 'var(--text-primary)' }}>Live_Grid_Connections</h3>
                    </div>
                    <span className="text-[9px] font-black bg-[var(--text-accent)]/10 px-3 py-1 rounded-full border border-[var(--text-accent)]/20" style={{ color: 'var(--text-accent)' }}>
                        {friends.length}_NODES
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {friends.length === 0 ? (
                        <div className="p-8 rounded-[2rem] border-2 border-dashed border-white/5 text-center col-span-full opacity-30 group hover:border-[var(--text-accent)]/20 transition-colors">
                            <Users className="mx-auto mb-3 opacity-20" size={24} />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-primary)' }}>No_Neural_Links_Established</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {friends.map(friend => {
                                const isOnline = friend.last_seen && (Date.now() - friend.last_seen < 10 * 60 * 1000);
                                const status = friend.status || (isOnline ? 'LOBBY' : 'OFFLINE');

                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={friend.uid}
                                        className="group flex items-center gap-4 p-4 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[var(--text-accent)]/30 transition-all duration-300"
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/5">
                                                <img src={friend.avatar_url} alt={friend.username} className="w-full h-full object-cover" />
                                            </div>
                                            <div className={`status-indicator ${isOnline ? 'status-online' : 'status-offline'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-sm font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                                    {friend.username}
                                                </span>
                                                {status === 'TYPING' && (
                                                    <span className="flex gap-0.5">
                                                        <span className="w-1 h-1 bg-[var(--text-accent)] rounded-full animate-bounce"></span>
                                                        <span className="w-1 h-1 bg-[var(--text-accent)] rounded-full animate-bounce delay-75"></span>
                                                        <span className="w-1 h-1 bg-[var(--text-accent)] rounded-full animate-bounce delay-150"></span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 italic" style={{ color: 'var(--text-primary)' }}>
                                                    {status}
                                                </span>
                                                {status === 'TYPING' && friend.current_wpm && (
                                                    <span className="text-[10px] font-black tabular-nums wpm-pulse" style={{ color: 'var(--text-accent)' }}>
                                                        {friend.current_wpm} WPM_SGNL
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                            <button
                                                className="p-3 rounded-xl bg-[var(--text-accent)]/10 border border-[var(--text-accent)]/20 text-[var(--text-accent)] hover:bg-[var(--text-accent)] hover:text-white transition-all shadow-lg shadow-[var(--text-accent)]/10"
                                                title="Initiate Duel"
                                            >
                                                <Sword size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Requests Section */}
            <AnimatePresence>
                {requests.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 pt-6 border-t border-white/5"
                    >
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <UserPlus size={12} className="text-orange-500 opacity-40" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic" style={{ color: 'var(--text-primary)' }}>Inbound_Access_Protocols</h3>
                            </div>
                            <span className="text-[9px] font-black bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-orange-400">
                                {requests.length}_SIGNALS
                            </span>
                        </div>

                        <div className="space-y-3">
                            {requests.map(req => (
                                <div key={req.id} className="flex items-center gap-4 p-4 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 transition-all duration-300">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-orange-500/20">
                                        <img src={req.fromAvatar} alt={req.fromUsername} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                            {req.fromUsername}
                                        </div>
                                        <div className="text-[9px] font-black uppercase tracking-widest opacity-40" style={{ color: 'var(--text-primary)' }}>
                                            Pending_Authorization
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(req.id)}
                                            className="p-3 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/10"
                                            title="Authorize"
                                        >
                                            <Check size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleReject(req.id)}
                                            className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                                            title="Deny"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

