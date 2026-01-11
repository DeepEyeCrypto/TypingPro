// ═══════════════════════════════════════════════════════════════════
// LEADERBOARD TABLE - Competitive rankings display
// ═══════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { LeaderboardEntry, LeaderboardPeriod, getLeaderboardTier } from '../../types/leaderboards';

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

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
    entries,
    period,
    onPeriodChange,
    currentUserId,
    loading = false,
}) => {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {/* Header with tabs */}
            <div className="flex border-b border-white/10">
                {(['daily', 'weekly', 'alltime'] as LeaderboardPeriod[]).map(p => (
                    <button
                        key={p}
                        onClick={() => onPeriodChange(p)}
                        className={`
              flex-1 px-4 py-3 text-sm font-medium transition-all
              ${period === p
                                ? 'bg-[#00ff41]/10 text-[#00ff41] border-b-2 border-[#00ff41]'
                                : 'text-white/60 hover:bg-white/5'
                            }
            `}
                    >
                        {PERIOD_LABELS[p]}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="p-4">
                {loading ? (
                    <div className="text-center py-8 text-white/40">Loading...</div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-8 text-white/40">No entries yet</div>
                ) : (
                    <div className="space-y-2">
                        {entries.map((entry, index) => {
                            const tier = getLeaderboardTier(entry.rank_position);
                            const isCurrentUser = entry.user_id === currentUserId;

                            return (
                                <div
                                    key={entry.user_id}
                                    className={`
                    flex items-center gap-4 p-3 rounded-lg transition-all
                    ${isCurrentUser
                                            ? 'bg-[#00ff41]/10 border border-[#00ff41]/30'
                                            : 'hover:bg-white/5'
                                        }
                  `}
                                >
                                    {/* Rank */}
                                    <div className="w-10 text-center">
                                        {entry.rank_position <= 3 ? (
                                            <span className="text-2xl">
                                                {entry.rank_position === 1 && '🥇'}
                                                {entry.rank_position === 2 && '🥈'}
                                                {entry.rank_position === 3 && '🥉'}
                                            </span>
                                        ) : (
                                            <span className="text-white/60 font-mono">{entry.rank_position}</span>
                                        )}
                                    </div>

                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                        {entry.avatar_url ? (
                                            <img src={entry.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-white/60">{entry.username.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>

                                    {/* Name */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-white truncate">
                                            {entry.username}
                                            {isCurrentUser && <span className="text-[#00ff41] ml-2">(You)</span>}
                                        </div>
                                        <div className="text-xs" style={{ color: tier.color }}>
                                            {tier.name}
                                        </div>
                                    </div>

                                    {/* WPM */}
                                    <div className="text-right">
                                        <div className="font-bold text-[#00ff41]">{entry.wpm}</div>
                                        <div className="text-xs text-white/40">WPM</div>
                                    </div>

                                    {/* Accuracy */}
                                    <div className="text-right w-16">
                                        <div className="font-semibold text-white">{entry.accuracy}%</div>
                                        <div className="text-xs text-white/40">ACC</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
