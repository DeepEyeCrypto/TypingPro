// ═══════════════════════════════════════════════════════════════════
// SOCIAL DASHBOARD: VisionOS-style community and competitive hub
// ═══════════════════════════════════════════════════════════════════

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
            alert("No friends online to duel! Try adding some friends first.");
        }
    };

    if (!user) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
                <GlassCard variant="large" className="text-center max-w-md py-12">
                    <div className="w-16 h-16 glass-pill flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <span className="text-3xl">🛡️</span>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4 italic">Access Encrypted</h2>
                    <p className="glass-text-muted text-xs font-bold uppercase tracking-[0.2em] mb-8">Establish protocol identity to access social grid.</p>
                    <button
                        onClick={onBack}
                        className="glass-pill w-full py-3 text-xs font-black text-gray-900 shadow-xl uppercase tracking-widest"
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

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               SOCIAL HEADER
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="glass-pill p-3 text-gray-900 shadow-lg hover:scale-110 active:scale-95 transition-all"
                    >
                        ←
                    </button>
                    <div>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] block mb-1">Global Network</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                            Social<span className="not-italic text-white/20">.Matrix</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-unified px-4 py-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        <span className="text-[9px] font-black text-white/60 tracking-widest uppercase">Nodes Online: 4,129</span>
                    </div>
                </div>
            </header>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               HERO IDENTITY CARD (STAGE 11 REFINEMENT)
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <GlassCard variant="large" className="w-full relative overflow-hidden group">
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="relative group/avatar">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 glass-unified shadow-2xl transition-transform group-hover/avatar:scale-105">
                            <img
                                src={profile?.avatar_url || user.avatar_url || ''}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full glass-pill flex items-center justify-center text-sm shadow-xl">
                            👑
                        </div>
                    </div>

                    <div className="flex-1 space-y-8 w-full">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">
                                    {profile?.username || 'GUEST_PROTO'}
                                </h2>
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <span className="glass-pill px-4 py-1.5 text-[10px] font-black text-gray-900 tracking-widest uppercase italic">
                                        {getRank(profile?.highest_wpm || 0).label}
                                    </span>
                                    <span className="text-[10px] font-black text-lime-400 uppercase tracking-[0.3em]">Operational</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={onNavigateToLobby}
                                    className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
                                >
                                    Access Lobby
                                </button>
                                <button
                                    onClick={handleStartDuel}
                                    className="glass-pill px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 shadow-xl"
                                >
                                    Challenge Friend
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="py-4 border-r border-white/5 last:border-none px-4">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] block mb-1">Peak Spd</span>
                                <span className="text-2xl font-black text-white">{profile?.highest_wpm || 0} <small className="text-[10px] opacity-30">WPM</small></span>
                            </div>
                            <div className="py-4 border-r border-white/5 last:border-none px-4">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] block mb-1">Mean Spd</span>
                                <span className="text-2xl font-black text-white">{profile?.avg_wpm || 0}</span>
                            </div>
                            <div className="py-4 border-r border-white/5 last:border-none px-4">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] block mb-1">Total Signals</span>
                                <span className="text-2xl font-black text-white">{profile?.total_races || 0}</span>
                            </div>
                            <div className="py-4 border-r border-white/5 last:border-none px-4">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] block mb-1">Rank Value</span>
                                <span className="text-2xl font-black text-cyan-400">{profile?.rank_points || 0}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <RankBadge
                                wpm={profile?.highest_wpm || 0}
                                progress={getProgressToNextRank(profile?.highest_wpm || 0).percent}
                            />
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               SOCIAL GRID
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Leaderboard Column */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">Global Signal Records</h3>
                        <div className="flex gap-4">
                            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Speed</span>
                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Keystones</span>
                        </div>
                    </div>
                    <Leaderboard onPlayGhost={onPlayGhost} />
                </div>

                {/* Friends & Search Column */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <GlassCard title="Synced Nodes" subtitle="FRIEND LIST" variant="compact">
                        <FriendList />
                    </GlassCard>

                    <GlassCard title="Signal Intercept" subtitle="USER SEARCH" variant="compact">
                        <UserSearch />
                    </GlassCard>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               TECH FOOTER (ACTIVITY & RELEASES)
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-t border-white/5 pt-12">
                <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] italic">System Logs (Live Feed)</h3>
                    <ActivityFeed />
                </div>
                <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] italic">Kernel Updates (Patch Notes)</h3>
                    <ReleaseHub />
                </div>
            </div>
        </div>
    );
};
