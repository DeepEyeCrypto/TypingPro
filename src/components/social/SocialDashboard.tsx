import React, { useState } from 'react';
import { useAuthStore } from '@src/stores/authStore';
import { friendService } from '@src/services/friendService';
import { DuelArena } from './DuelArena';
import { UserSearch } from './UserSearch';
import { FriendList } from './FriendList';
import { Leaderboard } from './Leaderboard';
import { getProgressToNextRank, getRank } from '@src/utils/rankSystem';
import { RankBadge } from '../RankBadge';
import { ReleaseHub } from './ReleaseHub';
import { HyperAnalytics } from './HyperAnalytics';
import { Card } from '../ui/Card';
import { StatDisplay } from '../ui/StatDisplay';
import { Button } from '../ui/Button';

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
            <div className="social-dashboard center">
                <h2>Login Required</h2>
                <p>Please login to access social features.</p>
                <button onClick={onBack} className="back-btn">← Back</button>
            </div>
        )
    }

    if (activeDuelId) {
        return <DuelArena duelId={activeDuelId} onEnd={() => setActiveDuelId(null)} />;
    }

    return (
        <div className="w-full h-full text-white/90 p-8 overflow-y-auto animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="sm" onClick={onBack} className="text-white/40 hover:text-white">
                        ← RETURN_TO_DASHBOARD
                    </Button>
                    <div className="h-4 w-px bg-white/10"></div>
                    <h1 className="text-xl font-bold tracking-[0.2em] text-white uppercase">
                        Community <span className="text-hacker">Hub</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-hacker/10 border border-hacker/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-hacker animate-pulse"></div>
                        <span className="text-[10px] font-bold text-hacker tracking-widest uppercase">Social_Net_Active</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Profile Overview (Hero) */}
                <Card className="lg:col-span-4 p-8 bg-midnight/40 relative overflow-hidden group">
                    <div className="flex items-center gap-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-hacker/20 rounded-full blur-2xl group-hover:bg-hacker/30 transition-all duration-700"></div>
                            <img
                                src={profile?.avatar_url || user.avatar_url || ''}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border-2 border-hacker/30 relative z-10 object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                                        @{profile?.username || '...'}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-hacker px-2 py-0.5 bg-hacker/10 rounded uppercase tracking-widest">
                                            {getRank(profile?.highest_wpm || 0).label}
                                        </span>
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Operational_Status: Optimal</span>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        onClick={onNavigateToLobby}
                                        variant="primary"
                                        className="shadow-[0_0_20px_rgba(0,255,195,0.15)]"
                                    >
                                        ENTER_LOBBY_XP
                                    </Button>
                                    <Button onClick={handleStartDuel} variant="secondary">
                                        QUICK_DUEL_1V1
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-6">
                                <StatDisplay label="MAX_WPM" value={profile?.highest_wpm || 0} color="hacker" trend="up" />
                                <StatDisplay label="AVG_SPEED" value={profile?.avg_wpm || 0} />
                                <StatDisplay label="TOTAL_RACES" value={profile?.total_races || 0} />
                                <StatDisplay label="RANK_POINTS" value={profile?.rank_points || 0} subValue="pts" />
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <RankBadge
                                    wpm={profile?.highest_wpm || 0}
                                    progress={getProgressToNextRank(profile?.highest_wpm || 0).percent}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Social Grid */}
                <div className="lg:col-span-3 space-y-8">
                    <Card className="p-0 overflow-hidden bg-transparent border-none">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.3em]">Global_Leaderboard</h3>
                        </div>
                        <Leaderboard onPlayGhost={onPlayGhost} />
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="p-6 space-y-6">
                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Active_Contacts</h3>
                        <FriendList />
                    </Card>

                    <Card className="p-6 space-y-6">
                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Discovery</h3>
                        <UserSearch />
                    </Card>
                </div>
            </div>

            {/* Bottom Tech Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-12">
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-hacker uppercase tracking-[0.4em]">System_Release_Notes</h3>
                    <ReleaseHub />
                </div>
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Hyper_Analytics_Cloud</h3>
                    <HyperAnalytics />
                </div>
            </div>
        </div>
    );
};
