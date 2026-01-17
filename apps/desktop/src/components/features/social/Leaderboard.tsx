import React, { useEffect, useState, useMemo } from 'react';
import { leaderboardService } from '../../../core/leaderboardService';
import { UserProfile } from '../../../core/userService';
import { useAuthStore } from '../../../core/store/authStore';
import { raceService } from '../../../core/raceService';
import { RankBadge } from '../../layout/RankBadge';
import './RankStyles.css';
import './Visuals.css';

interface Props {
    onPlayGhost: (lessonId: string, ghostData: any) => void;
}

// Optimized Row Component for 144FPS - High Fidelity Deep Glass
const LeaderboardRow = React.memo(({ user, index, isMe, loadingGhost, onChallenge }: {
    user: UserProfile,
    index: number,
    isMe: boolean,
    loadingGhost: boolean,
    onChallenge: (uid: string) => void
}) => {
    const getRankIcon = (idx: number) => {
        if (idx === 0) return '🥇';
        if (idx === 1) return '🥈';
        if (idx === 2) return '🥉';
        return index + 1;
    };

    const isElite = (user.highest_wpm || 0) >= 100;

    return (
        <div className={`group flex items-center gap-6 p-5 rounded-[2rem] transition-all duration-500 ${isMe ? 'bg-white/10 border border-white/40 shadow-[0_20px_40px_rgba(255,255,255,0.1)]' : 'bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10'}`}>
            <div className="w-12 text-center">
                <span className={`text-[10px] font-black tracking-tighter ${index < 3 ? 'text-3xl' : 'text-white/20'}`}>
                    {getRankIcon(index)}
                </span>
            </div>

            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative">
                    <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-white/40 transition-all shadow-xl"
                        loading="lazy"
                    />
                    {isElite && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full blur-[4px] animate-pulse" />
                    )}
                </div>

                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-3">
                        <span className={`text-base font-black truncate text-white tracking-tight`}>
                            {user.username}
                        </span>
                        <RankBadge wpm={user.highest_wpm || 0} progress={0} compact />
                    </div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        {user.total_races || 0} TEST_SESSIONS
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-10">
                <div className="flex flex-col items-end">
                    <span className={`text-2xl font-black tabular-nums text-white tracking-tighter`}>
                        {Math.round(user.highest_wpm || 0)}
                    </span>
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">PEAK_VELOCITY</span>
                </div>

                {!isMe && (
                    <button
                        onClick={() => onChallenge(user.uid)}
                        disabled={loadingGhost}
                        className={`p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all ${loadingGhost ? 'opacity-50' : ''}`}
                        title="Challenge Ghost"
                    >
                        {loadingGhost ? (
                            <div className="w-5 h-5 border-3 border-white/20 border-t-white animate-spin rounded-full" />
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
});

export const Leaderboard: React.FC<Props> = ({ onPlayGhost }) => {
    const { profile: myProfile } = useAuthStore();
    const [rankings, setRankings] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingGhostId, setLoadingGhostId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = leaderboardService.subscribeToGlobalRankings((data) => {
            setRankings(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleChallenge = async (uid: string) => {
        setLoadingGhostId(uid);
        try {
            const bestRace = await raceService.getBestRace_User(uid);
            if (bestRace && bestRace.replay) {
                onPlayGhost(bestRace.lessonId, { charAndTime: bestRace.replay });
            }
        } catch (e) {
            console.error("Failed to load ghost", e);
        } finally {
            setLoadingGhostId(null);
        }
    };

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center space-y-6">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white animate-spin rounded-full" />
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] animate-pulse">Syncing_Global_Telemetry...</span>
        </div>
    );

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {rankings.map((user, index) => (
                <LeaderboardRow
                    key={user.uid}
                    user={user}
                    index={index}
                    isMe={user.uid === myProfile?.uid}
                    loadingGhost={loadingGhostId === user.uid}
                    onChallenge={handleChallenge}
                />
            ))}
        </div>
    );
};
