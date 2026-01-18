import React from 'react';
import { LeaderboardEntry, LeaderboardPeriod, getLeaderboardTier } from '../../../types/leaderboards';
import '../social/Visuals.css';

interface LeaderboardTableProps {
    entries: LeaderboardEntry[];
    period: LeaderboardPeriod;
    onPeriodChange: (period: LeaderboardPeriod) => void;
    currentUserId?: string;
    loading?: boolean;
}

const PERIOD_LABELS: Record<LeaderboardPeriod, string> = {
    daily: 'Today',
    weekly: 'This Week',
    alltime: 'All Time',
};

import { GlassCard } from '../../ui/GlassCard';

// Optimized Row with premium glass tier
const TableRow = React.memo(({ entry, isCurrentUser }: { entry: LeaderboardEntry, isCurrentUser: boolean }) => {
    const tier = getLeaderboardTier(entry.rank_position);
    const isElite = entry.wpm >= 100;

    return (
        <GlassCard
            elevation="matte"
            cornerRadius="md"
            className={`transition-all duration-300 ${isCurrentUser ? 'border-white/50 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-[1.02] z-10' : 'opacity-80'}`}
            interactive={true}
            prismatic={isCurrentUser}
        >
            <div className="flex items-center gap-4 p-3 pr-5">
                {/* Rank */}
                <div className="w-12 text-center">
                    {entry.rank_position <= 3 ? (
                        <div className="relative inline-block">
                            <span className="text-3xl drop-shadow-glow">
                                {entry.rank_position === 1 && '🥇'}
                                {entry.rank_position === 2 && '🥈'}
                                {entry.rank_position === 3 && '🥉'}
                            </span>
                        </div>
                    ) : (
                        <span className="text-white/20 font-black text-[10px] font-mono tracking-tighter">#{entry.rank_position}</span>
                    )}
                </div>

                {/* Avatar */}
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 p-0.5 flex items-center justify-center overflow-hidden shadow-inner">
                        {entry.avatar_url ? (
                            <img src={entry.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/40 text-xs font-black">
                                {entry.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    {isElite && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full blur-[1px] animate-pulse shadow-[0_0_8px_white]" />
                    )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                    <div className={`font-black text-sm truncate flex items-center gap-2 ${isElite ? 'text-white' : 'text-white/80'}`}>
                        {entry.username}
                        {isCurrentUser && <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/60 text-[8px] uppercase font-black tracking-widest">Self</span>}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] filter saturate-[1.5] brightness-125" style={{ color: tier.color }}>
                        {tier.name}
                    </div>
                </div>

                {/* Metrics */}
                <div className="flex gap-8 items-center">
                    <div className="text-right">
                        <div className={`font-black tabular-nums tracking-tighter ${isElite ? 'text-white text-xl' : 'text-white text-lg'}`}>
                            {Math.round(entry.wpm)}
                        </div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">SPD</div>
                    </div>

                    <div className="text-right w-14">
                        <div className="font-black text-white/80 tabular-nums text-sm truncate">{entry.accuracy}%</div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">ACC</div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
});

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
    entries,
    period,
    onPeriodChange,
    currentUserId,
    loading = false,
}) => {
    return (
        <div className="space-y-6">
            {/* Header with tabs */}
            <div
                className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl"
            >
                {(['daily', 'weekly', 'alltime'] as LeaderboardPeriod[]).map(p => (
                    <button
                        key={p}
                        onClick={() => onPeriodChange(p)}
                        className={`
                            flex-1 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-lg
                            ${period === p
                                ? 'bg-white text-black shadow-glow translate-y-[-1px]'
                                : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                            }
                        `}
                    >
                        {PERIOD_LABELS[p]}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center pt-32 space-y-6">
                        <div className="w-8 h-8 border-2 border-white/10 border-t-white animate-spin rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] animate-pulse">Syncing_Global_Relay...</span>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="flex items-center justify-center pt-32">
                        <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] italic">Telemetry_Absent_In_Buffer</span>
                    </div>
                ) : (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                        {entries.map((entry) => (
                            <TableRow
                                key={entry.user_id}
                                entry={entry}
                                isCurrentUser={entry.user_id === currentUserId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
