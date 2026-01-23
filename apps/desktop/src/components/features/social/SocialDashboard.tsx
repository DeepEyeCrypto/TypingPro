import React, { useState } from 'react';
import { useAuthStore } from '../../../core/store/authStore';
import { friendService } from '../../../core/friendService';
import { DuelArena } from './DuelArena';
import { UserSearch } from './UserSearch';
import { FriendList } from './FriendList';
import { Leaderboard } from './Leaderboard';
import { getProgressToNextRank, getRank } from '../../../core/rankSystem';
import { RankBadge } from '../../layout/RankBadge';
import { ReleaseHub } from './ReleaseHub';
import { ActivityFeed } from './ActivityFeed';
import { GlassCard } from '../../ui/GlassCard';
import { ArrowLeft, Globe, Zap, Users, Shield, Cpu, Activity, MessageSquare, Sword, Search, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '../../../core/store/toastStore';

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
            toast.info("No friends online to duel! Try adding some friends first.");
        }
    };

    if (!user) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
                <GlassCard variant="large" className="text-center max-w-md py-12">
                    <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <Shield className="text-[var(--text-accent)]" size={32} />
                    </div>
                    <h2 className="text-2xl font-black tracking-widest mb-4 uppercase italic" style={{ color: 'var(--text-primary)' }}>Access Encrypted</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-40" style={{ color: 'var(--text-primary)' }}>Establish protocol identity to access social grid.</p>
                    <button
                        onClick={onBack}
                        className="bg-[var(--text-accent)] text-white w-full py-4 rounded-2xl text-[10px] font-black shadow-xl uppercase tracking-widest transform transition-all active:scale-95 shadow-[var(--text-accent)]/20"
                    >
                        Return to Hub
                    </button>
                </GlassCard>
            </div>
        );
    }

    if (activeDuelId) {
        return <DuelArena duelId={activeDuelId} onEnd={() => setActiveDuelId(null)} />;
    }

    return (
        <div className="w-full flex flex-col gap-10 p-4 md:p-6 max-w-7xl mx-auto pb-32 animate-in fade-in duration-700">
            {/* NEURAL STATUS HEADER */}
            <div className="relative overflow-hidden glass-panel backdrop-blur-[64px] rounded-[2.5rem] p-6 flex flex-wrap items-center justify-between gap-6 shadow-2xl">
                {/* Scan Beam */}
                <motion.div
                    animate={{ left: ['-10%', '110%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 w-1 h-full bg-gradient-to-b from-transparent via-[var(--text-accent)] to-transparent opacity-20 blur-md z-0"
                />

                <div className="flex items-center gap-6 relative z-10">
                    <button
                        onClick={onBack}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all opacity-40 hover:opacity-100"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic block mb-1" style={{ color: 'var(--text-primary)' }}>Social_Grid_Access</span>
                        <h1 className="text-2xl font-black italic tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>Neural_Matrix<span className="text-[var(--text-accent)]">.v4</span></h1>
                    </div>
                </div>

                <div className="flex gap-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-primary)' }}>Nodes: <span className="text-green-400">4,129 Online</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Globe size={14} className="text-[var(--text-accent)] opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-primary)' }}>Region: <span className="text-[var(--text-accent)]">Global</span></span>
                    </div>
                </div>
            </div>

            {/* HERO IDENTITY CARD */}
            <GlassCard variant="large" className="w-full relative overflow-hidden group border-b-4 border-b-[var(--text-accent)]/20 p-1">
                {/* Internal Scan Beam */}
                <motion.div
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--text-accent)] to-transparent opacity-10 blur-sm z-0"
                />

                <div className="p-10 flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="relative group/avatar">
                        <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden glass-panel shadow-2xl transition-transform group-hover/avatar:scale-105 duration-500">
                            <img
                                src={profile?.avatar_url || user.avatar_url || ''}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-[var(--text-accent)] text-white flex items-center justify-center shadow-xl border-4 border-[var(--bg-color)]">
                            <Crown size={20} />
                        </div>
                    </div>

                    <div className="flex-1 space-y-10 w-full">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 block mb-2" style={{ color: 'var(--text-primary)' }}>Subject_UID: {user.id.slice(0, 8)}</span>
                                <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-4" style={{ color: 'var(--text-primary)' }}>
                                    {profile?.username || 'GUEST_PROTO'}
                                </h2>
                                <div className="flex items-center justify-center md:justify-start gap-5">
                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--text-accent)] shadow-lg shadow-[var(--text-accent)]/20">
                                        <Zap size={12} className="text-white" />
                                        <span className="text-white text-[10px] font-black tracking-widest uppercase italic">
                                            {getRank(profile?.highest_wpm || 0).name}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black text-[var(--text-accent)] uppercase tracking-[0.4em] opacity-80 animate-pulse">Neural_Link_Elite</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={onNavigateToLobby}
                                    className="px-8 py-3.5 rounded-2xl glass-panel bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    <Globe size={14} />
                                    Access Lobby
                                </button>
                                <button
                                    onClick={handleStartDuel}
                                    className="bg-[var(--text-accent)] text-white px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[var(--text-accent)]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                                >
                                    <Sword size={14} />
                                    Initiate Duel
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Peak_Spd', value: `${profile?.highest_wpm || 0}`, unit: 'WPM', icon: <Zap size={12} /> },
                                { label: 'Mean_Spd', value: `${profile?.avg_wpm || 0}`, unit: '', icon: <Activity size={12} /> },
                                { label: 'Signals', value: `${profile?.total_races || 0}`, unit: '', icon: <Cpu size={12} /> },
                                { label: 'Neural_Pts', value: `${profile?.rank_points || 0}`, unit: 'RP', icon: <Target size={12} />, accent: true },
                            ].map((stat, i) => (
                                <div key={i} className="p-4 bg-white/5 rounded-3xl border border-white/10 group/stat hover:border-[var(--text-accent)]/50 transition-colors">
                                    <div className="flex items-center gap-2 mb-2 opacity-30 group-hover/stat:opacity-100 transition-opacity">
                                        {stat.icon}
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-primary)' }}>{stat.label}</span>
                                    </div>
                                    <span className={`text-3xl font-black italic ${stat.accent ? 'text-[var(--text-accent)]' : ''}`} style={{ color: stat.accent ? '' : 'var(--text-primary)' }}>
                                        {stat.value} <small className="text-[10px] opacity-30 not-italic">{stat.unit}</small>
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <RankBadge
                                wpm={profile?.highest_wpm || 0}
                                progress={getProgressToNextRank(profile?.highest_wpm || 0).percent}
                            />
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* SOCIAL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Leaderboard Column */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                            <Globe size={16} className="text-[var(--text-accent)]" />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40 italic" style={{ color: 'var(--text-primary)' }}>Global_Signal_Records</h3>
                        </div>
                        <div className="flex gap-6">
                            <span className="text-[9px] font-black text-[var(--text-accent)] uppercase tracking-widest cursor-pointer hover:underline underline-offset-8 decoration-2">Speed_Index</span>
                            <span className="text-[9px] font-black uppercase tracking-widest cursor-pointer hover:text-[var(--text-accent)] transition-colors opacity-20" style={{ color: 'var(--text-primary)' }}>Neural_Flow</span>
                        </div>
                    </div>
                    <Leaderboard onPlayGhost={onPlayGhost} />
                </div>

                {/* Friends & Search Column */}
                <div className="lg:col-span-4 flex flex-col gap-10">
                    <GlassCard title="Synced_Nodes" subtitle="FRIEND_LIST" variant="compact" icon={<Users size={16} />}>
                        <FriendList />
                    </GlassCard>

                    <GlassCard title="Node_Intercept" subtitle="USER_SEARCH" variant="compact" icon={<Search size={16} />}>
                        <UserSearch />
                    </GlassCard>
                </div>
            </div>

            {/* TECH FOOTER */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-t border-white/10 pt-16">
                <div className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <Activity size={16} className="text-green-500" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.5em] italic opacity-40" style={{ color: 'var(--text-primary)' }}>Neural_Live_Feed</h3>
                    </div>
                    <ActivityFeed />
                </div>
                <div className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <Cpu size={16} className="text-[var(--text-accent)]" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.5em] italic opacity-40" style={{ color: 'var(--text-primary)' }}>Kernel_Release_Notes</h3>
                    </div>
                    <ReleaseHub />
                </div>
            </div>
        </div>
    );
};

