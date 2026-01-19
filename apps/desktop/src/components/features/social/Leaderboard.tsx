import React, { useEffect, useState } from 'react';
import { leaderboardService } from '../../../core/leaderboardService';
import { UserProfile } from '../../../core/userService';
import { useAuthStore } from '../../../core/store/authStore';
import { raceService } from '../../../core/raceService';
import { RankBadge } from '../../layout/RankBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Sword, Activity, Loader2, ShieldCheck, Crown, Star } from 'lucide-react';
import './RankStyles.css';

interface Props {
    onPlayGhost: (lessonId: string, ghostData: any) => void;
}

const LeaderboardRow = React.memo(({ user, index, isMe, loadingGhost, onChallenge }: {
    user: UserProfile,
    index: number,
    isMe: boolean,
    loadingGhost: boolean,
    onChallenge: (uid: string) => void
}) => {
    const getRankDisplay = (idx: number) => {
        if (idx === 0) return <Crown className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" size={24} />;
        if (idx === 1) return <Star className="text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.5)]" size={20} />;
        if (idx === 2) return <Star className="text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.3)]" size={20} />;
        return <span className="text-xs font-black opacity-20">{idx + 1}</span>;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative flex items-center gap-6 p-5 rounded-[2.5rem] transition-all duration-500 border overflow-hidden
            ${isMe
                    ? 'bg-white/10 border-[var(--text-accent)]/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)]'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                }
        `}>
            {/* Top 3 Glow Background */}
            {index < 3 && (
                <div className={`absolute inset-0 opacity-5 pointer-events-none ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-400' : 'bg-amber-800'
                    }`} />
            )}

            {/* Scan Beam for Top 3 */}
            {index < 3 && (
                <motion.div
                    animate={{ left: ['-10%', '110%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 w-px h-full bg-white/20 blur-sm pointer-events-none"
                />
            )}

            <div className="w-10 flex justify-center relative z-10">
                {getRankDisplay(index)}
            </div>

            <div className="flex items-center gap-5 flex-1 min-w-0 relative z-10">
                <div className="relative group/avatar">
                    <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all duration-500 overflow-hidden
                        ${index === 0 ? 'border-yellow-400/50 scale-110 shadow-[0_0_20px_rgba(250,204,21,0.2)]' : 'border-white/10'}
                    `}>
                        <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all"
                            loading="lazy"
                        />
                    </div>
                </div>

                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <span className={`text-lg font-black tracking-tighter ${isMe ? 'text-[var(--text-accent)]' : 'text-white'}`}>
                            {user.username}
                        </span>
                        {index === 0 && <ShieldCheck size={14} className="text-yellow-400" />}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-20">Rank:</span>
                        <RankBadge wpm={user.highest_wpm || 0} progress={0} compact />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-12 relative z-10">
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap size={12} className="text-[var(--text-accent)]" />
                        <span className="text-3xl font-black italic tabular-nums tracking-tighter text-white">
                            {Math.round(user.highest_wpm || 0)}
                        </span>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-20">Peak_Sync_Spd</span>
                </div>

                {!isMe && (
                    <button
                        onClick={() => onChallenge(user.uid)}
                        disabled={loadingGhost}
                        className={`p-4 rounded-2xl transition-all flex items-center justify-center
                            ${loadingGhost
                                ? 'bg-white/5 opacity-50 cursor-not-allowed'
                                : 'bg-white/5 border border-white/5 hover:bg-[var(--text-accent)] hover:text-white hover:border-[var(--text-accent)] hover:scale-110 active:scale-95 shadow-2xl'
                            }`}
                        style={{ color: loadingGhost ? 'var(--text-primary)' : '' }}
                    >
                        {loadingGhost ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Sword size={20} />
                        )}
                    </button>
                )}
            </div>
        </motion.div>
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
        <div className="p-24 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-[var(--text-accent)]/20 border-t-[var(--text-accent)] animate-spin" />
                <Trophy className="absolute inset-0 m-auto text-[var(--text-accent)] opacity-20" size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse opacity-30" style={{ color: 'var(--text-primary)' }}>Syncing_Global_Registry</span>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <AnimatePresence>
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
            </AnimatePresence>
        </div>
    );
};

