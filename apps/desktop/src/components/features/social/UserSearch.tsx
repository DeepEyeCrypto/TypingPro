import React, { useState } from 'react';
import { friendService } from '../../../core/friendService';
import { UserProfile } from '../../../core/userService';
import { useAuthStore } from '../../../core/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Check, Loader2, Signal, Eye } from 'lucide-react';

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
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Signal size={12} className="text-[var(--text-accent)] opacity-40" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic" style={{ color: 'var(--text-primary)' }}>Broadcast_Sync_Search</h3>
                </div>
            </div>

            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                    <Search size={16} style={{ color: 'var(--text-primary)' }} />
                </div>
                <input
                    type="text"
                    placeholder="Search_Node_ID..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] pl-14 pr-16 py-5 text-sm placeholder:opacity-20 focus:outline-none focus:border-[var(--text-accent)]/40 transition-all font-mono tracking-wider shadow-2xl backdrop-blur-3xl"
                    style={{ color: 'var(--text-primary)' }}
                />

                {/* Internal Scan Beam */}
                <motion.div
                    animate={{ left: ['-10%', '110%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-[var(--text-accent)] to-transparent opacity-10 pointer-events-none"
                />

                <button
                    type="submit"
                    disabled={searching}
                    className="absolute right-2.5 top-2.5 p-3 rounded-xl bg-[var(--text-accent)] text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-[var(--text-accent)]/30"
                >
                    {searching ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </form>

            <div className="space-y-3">
                <AnimatePresence>
                    {results.map((user, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            key={user.uid}
                            className="flex items-center gap-4 p-4 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[var(--text-accent)]/30 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-[var(--text-accent)]/50 transition-colors shadow-2xl">
                                <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-black block truncate tracking-tight" style={{ color: 'var(--text-primary)' }}>{user.username}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30 italic" style={{ color: 'var(--text-primary)' }}>Peak_Spd:</span>
                                    <span className="text-[10px] font-black text-[var(--text-accent)] tracking-tighter">{user.avg_wpm || 0} WPM</span>
                                </div>
                            </div>
                            {requestSent === user.uid ? (
                                <div className="p-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30">
                                    <Check size={16} />
                                </div>
                            ) : (
                                <button
                                    onClick={() => sendRequest(user)}
                                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] hover:bg-[var(--text-accent)] hover:text-white hover:border-[var(--text-accent)] transition-all shadow-md"
                                >
                                    <UserPlus size={16} />
                                </button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {results.length === 0 && query && !searching && (
                    <div className="py-16 text-center bg-white/5 border-2 border-dashed border-white/5 rounded-[2.5rem] px-10">
                        <ShieldAlert className="mx-auto mb-4 opacity-10" size={32} />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] leading-loose opacity-20" style={{ color: 'var(--text-primary)' }}>
                            No_Sync_Matches_Found<br />
                            <span className="opacity-40 text-[8px] tracking-[0.2em] italic">Verify Node ID Connectivity</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

