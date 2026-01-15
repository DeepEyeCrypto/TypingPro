import React from 'react';
import { LeaderboardEntry, LeaderboardPeriod, getLeaderboardTier } from '../../types/leaderboards';
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

// Optimized Row for 144FPS
const TableRow = React.memo(({ entry, isCurrentUser }: { entry: LeaderboardEntry, isCurrentUser: boolean }) => {
    const tier = getLeaderboardTier(entry.rank_position);
    const isElite = entry.wpm >= 100;

    return (
        <div
            className={`
                group glass-v5 flex items-center gap-4 p-3 rounded-xl transition-all duration-300
                ${isCurrentUser ? 'border-black/40 bg-black/5' : ''}
            `}
        >
            {/* Rank */}
            <div className="w-10 text-center">
                {entry.rank_position <= 3 ? (
                    <span className="text-2xl drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]">
                        {entry.rank_position === 1 && '🥇'}
                        {entry.rank_position === 2 && '🥈'}
                        {entry.rank_position === 3 && '🥉'}
                    </span>
                ) : (
                    <span className="text-black opacity-20 font-black text-xs font-mono">#{entry.rank_position}</span>
                )}
            </div>

            {/* Avatar */}
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    {entry.avatar_url ? (
                        <img src={entry.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-black opacity-20 text-xs font-bold">{entry.username.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                {isElite && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-black rounded-full blur-[1px] animate-pulse" />
                )}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm truncate ${isElite ? 'text-black underline decoration-black/20' : 'text-black'}`}>
                    {entry.username}
                    {isCurrentUser && <span className="text-black opacity-60 ml-2 text-[10px] uppercase font-black">// YOU</span>}
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-40" style={{ color: tier.color }}>
                    {tier.name}
                </div>
            </div>

            {/* Metrics */}
            <div className="flex gap-6 items-center">
                <div className="text-right">
                    <div className={`font-black tabular-nums transition-all ${isElite ? 'text-black text-lg' : 'text-black'}`}>
                        {Math.round(entry.wpm)}
                    </div>
                    <div className="text-[9px] font-black text-black opacity-20 uppercase tracking-tighter">WPM</div>
                </div>

                <div className="text-right w-12">
                    <div className="font-bold text-black tabular-nums text-xs">{entry.accuracy}%</div>
                    <div className="text-[9px] font-black text-black opacity-20 uppercase tracking-tighter">ACC</div>
                </div>
            </div>
        </div>
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
        <div className="space-y-4">
            {/* Header with tabs */}
            <div className="flex gap-2 p-1 bg-black/5 rounded-xl border border-black/10">
                {(['daily', 'weekly', 'alltime'] as LeaderboardPeriod[]).map(p => (
                    <button
                        key={p}
                        onClick={() => onPeriodChange(p)}
                        className={`
                            flex-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg
                            ${period === p
                                ? 'bg-black text-white shadow-[0_0_15px_rgba(0,0,0,0.4)]'
                                : 'text-black opacity-40 hover:text-black hover:bg-black/5'
                            }
                        `}
                    >
                        {PERIOD_LABELS[p]}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center pt-24 space-y-4">
                        <div className="w-6 h-6 border-2 border-black/20 border-t-black animate-spin rounded-full" />
                        <span className="text-[9px] font-black text-black uppercase tracking-widest">Retrieving_Global_Ranks...</span>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="flex items-center justify-center pt-24 italic text-white/20 text-xs">
                        No telemetry data recorded for this period.
                    </div>
                ) : (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
