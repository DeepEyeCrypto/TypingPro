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
import { Card } from '../../ui/Card';
import { StatDisplay } from '../../ui/StatDisplay';
import { Button } from '../../ui/Button';
import './Visuals.css';

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
            <div className="h-full flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-700">
                <div className="glass-perfect p-12 rounded-3xl text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                        <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">Access Denied</h2>
                    <p className="text-white/60 text-sm font-medium">Sign in to access social features.</p>
                    <Button variant="primary" onClick={onBack} className="w-full">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    if (activeDuelId) {
        return <DuelArena duelId={activeDuelId} onEnd={() => setActiveDuelId(null)} />;
    }

    return (
        <div className="w-full h-full text-white p-8 overflow-y-auto animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="text-[10px] font-black tracking-widest text-white opacity-30 hover:opacity-100 transition-all uppercase"
                    >
                        [ ESC ] Back to Dashboard
                    </button>
                    <div className="h-4 w-px bg-white/10"></div>
                    <h1 className="text-xl font-black tracking-[0.25em] text-white uppercase italic">
                        Social<span className="not-italic text-white opacity-40"> Hub</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                        <span className="text-[10px] font-black tracking-widest uppercase text-white opacity-60">Live</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Hero Profile Card */}
                <div className="lg:col-span-4 glass-perfect p-8 relative overflow-hidden group rounded-3xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-white">
                        <svg className="w-64 h-64 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                    </div>

                    <div className="flex items-center gap-10 relative z-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-1000"></div>
                            <img
                                src={profile?.avatar_url || user.avatar_url || ''}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border-2 border-white/10 relative z-10 object-cover shadow-lg"
                            />
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter uppercase italic">
                                        {profile?.username || 'GUEST_USER'}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black text-white bg-white/10 px-2 py-0.5 rounded uppercase tracking-[0.2em] border border-white/20 overflow-hidden relative">
                                            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
                                            {getRank(profile?.highest_wpm || 0).label}
                                        </span>
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Online</span>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        onClick={onNavigateToLobby}
                                        variant="ghost"
                                        className="font-black tracking-widest text-[10px] text-white/50 hover:text-white"
                                    >
                                        Enter Lobby
                                    </Button>
                                    <Button
                                        onClick={handleStartDuel}
                                        variant="primary"
                                        className="font-black tracking-widest text-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                                    >
                                        Challenge a Friend
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-6">
                                <StatDisplay label="Best WPM" value={profile?.highest_wpm || 0} color="hacker" trend="up" />
                                <StatDisplay label="Avg Speed" value={profile?.avg_wpm || 0} />
                                <StatDisplay label="Total Races" value={profile?.total_races || 0} />
                                <StatDisplay label="Points" value={profile?.rank_points || 0} subValue="pts" />
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <RankBadge
                                    wpm={profile?.highest_wpm || 0}
                                    progress={getProgressToNextRank(profile?.highest_wpm || 0).percent}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Grid */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Global Leaderboard</h3>
                        </div>
                        <Leaderboard onPlayGhost={onPlayGhost} />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-perfect p-6 space-y-6 rounded-2xl">
                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Friends</h3>
                        <FriendList />
                    </div>

                    <div className="glass-v5 p-6 space-y-6 rounded-2xl border-white/10 bg-white/5 backdrop-blur-[60px]">
                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Find Players</h3>
                        <UserSearch />
                    </div>
                </div>
            </div>

            {/* Bottom Tech Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] opacity-40">Release Notes</h3>
                    <ReleaseHub />
                </div>
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] opacity-40">Activity Feed</h3>
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
};
