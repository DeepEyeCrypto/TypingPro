// ═══════════════════════════════════════════════════════════════════
// GAMIFICATION PAGE - Main page for badges, streaks, leaderboards
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { BadgeGrid } from './BadgeGrid';
import { StreakDisplay } from './StreakDisplay';
import { LeaderboardTable } from './LeaderboardTable';
import { ChallengeCard } from './ChallengeCard';
import { BADGES } from '../../data/badges';
import { getBadgesWithProgress, UserStats } from '../../services/badgeService';
import { generateDailyChallenges } from '../../services/challengeService';
import { LeaderboardEntry, LeaderboardPeriod } from '../../types/leaderboards';
import { DailyChallenge, UserChallengeProgress } from '../../types/challenges';
import { CertificationTiers } from '../certification/CertificationTiers';
import { UserCertification } from '../../types/certifications';

interface GamificationPageProps {
    userStats: UserStats;
    unlockedBadgeIds: string[];
    streakData: {
        current_streak: number;
        longest_streak: number;
        last_practice_date?: string;
    };
    challengeProgress: Record<string, UserChallengeProgress>;
    earnedCertifications?: UserCertification[];
    userId?: string;
    username?: string;
    onCertificationAttempt?: (tier: string) => void;
    onBack?: () => void;
}

export const GamificationPage: React.FC<GamificationPageProps> = ({
    userStats,
    unlockedBadgeIds,
    streakData,
    challengeProgress,
    earnedCertifications = [],
    userId = '',
    username = 'Typist',
    onBack,
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'leaderboard' | 'certifications'>('overview');
    const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>('weekly');
    const [dailyChallenges] = useState<DailyChallenge[]>(() => generateDailyChallenges());

    // Mock leaderboard data (replace with actual API call)
    const [leaderboardEntries] = useState<LeaderboardEntry[]>([
        { user_id: '1', username: 'SpeedMaster', wpm: 145, accuracy: 98, rank_position: 1 },
        { user_id: '2', username: 'QuickFingers', wpm: 132, accuracy: 97, rank_position: 2 },
        { user_id: '3', username: 'TypeNinja', wpm: 128, accuracy: 99, rank_position: 3 },
        { user_id: '4', username: 'KeyboardKing', wpm: 115, accuracy: 96, rank_position: 4 },
        { user_id: '5', username: 'SwiftTyper', wpm: 108, accuracy: 95, rank_position: 5 },
    ]);

    const badgesWithProgress = getBadgesWithProgress(userStats, unlockedBadgeIds);
    const unlockedCount = badgesWithProgress.filter(b => b.unlocked).length;

    return (
        <div className="min-h-full pt-4 px-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="text-white opacity-60 hover:opacity-100 transition-colors"
                        >
                            ← Back
                        </button>
                    )}
                    <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight uppercase">Achievements</h1>
                </div>

                {/* Tab navigation */}
                <div className="flex gap-2">
                    {(['overview', 'badges', 'certifications', 'leaderboard'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize
                ${activeTab === tab
                                    ? 'bg-white/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                                    : 'bg-white/5 text-white opacity-40 border border-white/10 hover:bg-white/10 hover:opacity-100'
                                }
              `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column: Streak + Challenges */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Streak */}
                        <StreakDisplay
                            currentStreak={streakData.current_streak}
                            longestStreak={streakData.longest_streak}
                            lastPracticeDate={streakData.last_practice_date}
                        />

                        {/* Daily Challenges */}
                        <div>
                            <h2 className="text-xl font-black bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-4 tracking-tight uppercase">Daily Challenges</h2>
                            <div className="space-y-3">
                                {dailyChallenges.map(challenge => (
                                    <ChallengeCard
                                        key={challenge.id}
                                        challenge={challenge}
                                        progress={challengeProgress[challenge.id] || {
                                            challenge_id: challenge.id,
                                            progress: 0,
                                            target: challenge.requirement.target,
                                            completed: false,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column: Quick stats */}
                    <div className="space-y-4">
                        {/* Badge summary */}
                        <div className="bg-white/5 backdrop-blur-[60px] border border-white/10 rounded-xl p-6 shadow-xl">
                            <h3 className="font-bold text-white opacity-30 mb-4 uppercase tracking-widest text-xs">Badges</h3>
                            <div className="text-center mb-4">
                                <div className="text-4xl font-black bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent">{unlockedCount}</div>
                                <div className="text-white opacity-30 text-[10px] mt-1 uppercase tracking-widest font-bold">of {BADGES.length} unlocked</div>
                            </div>
                            <button
                                onClick={() => setActiveTab('badges')}
                                className="w-full py-2 bg-white/5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors text-[10px] font-black border border-white/10 uppercase tracking-widest"
                            >
                                View All Badges →
                            </button>
                        </div>

                        {/* Top 3 Leaderboard preview */}
                        <div className="bg-white/5 backdrop-blur-[60px] border border-white/10 rounded-xl p-6 shadow-xl">
                            <h3 className="font-bold text-white opacity-30 mb-4 uppercase tracking-widest text-xs">Top Typers</h3>
                            <div className="space-y-3">
                                {leaderboardEntries.slice(0, 3).map(entry => (
                                    <div key={entry.user_id} className="flex items-center gap-3">
                                        <span className="text-lg">
                                            {entry.rank_position === 1 && '🥇'}
                                            {entry.rank_position === 2 && '🥈'}
                                            {entry.rank_position === 3 && '🥉'}
                                        </span>
                                        <span className="flex-1 text-white/70 truncate text-sm font-medium">{entry.username}</span>
                                        <span className="text-cyan-400 font-mono font-bold">{entry.wpm}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setActiveTab('leaderboard')}
                                className="w-full mt-4 py-2 bg-white/5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors text-[10px] font-black border border-white/10 uppercase tracking-widest"
                            >
                                View Leaderboard →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
                <BadgeGrid badges={badgesWithProgress} />
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
                <LeaderboardTable
                    entries={leaderboardEntries}
                    period={leaderboardPeriod}
                    onPeriodChange={setLeaderboardPeriod}
                />
            )}

            {/* Certifications Tab */}
            {activeTab === 'certifications' && (
                <CertificationTiers
                    earnedCertifications={earnedCertifications}
                    onAttempt={(tier) => {
                        onCertificationAttempt?.(tier);
                    }}
                    onViewCertificate={(cert) => {
                        console.log('View certificate:', cert);
                    }}
                />
            )}
        </div>
    );
};
