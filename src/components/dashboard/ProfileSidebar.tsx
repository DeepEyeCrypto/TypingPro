// ═══════════════════════════════════════════════════════════════════
// PROFILE SIDEBAR - Right sidebar with user profile, calendar, challenges
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

interface ProfileSidebarProps {
    username: string;
    handle: string;
    avatarUrl?: string;
    bestWpm: number;
    rank: string;
    level: number;
    keystones: number;
    challenges?: { title: string; reward: number; desc: string }[];
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    username,
    handle,
    avatarUrl,
    bestWpm,
    rank,
    level,
    keystones,
    challenges = [],
}) => {
    // Generate current month calendar
    const today = new Date();
    const currentMonth = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    return (
        <div className="wg-sidebar">
            {/* Profile Card */}
            <div className="wg-profile-card">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="wg-profile-avatar bg-gradient-to-br from-[#00ff41] to-[#00aa66] flex items-center justify-center text-midnight text-lg font-bold"
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={username} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            username.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{username}</h3>
                        <p className="text-sm text-white/60">@{handle}</p>
                    </div>
                    <button className="ml-auto text-white/40 hover:text-white">⋯</button>
                </div>

                {/* Stats Row */}
                <div className="wg-profile-stats">
                    <div>
                        <div className="wg-profile-stat-value">{bestWpm}</div>
                        <div className="wg-profile-stat-label">Best WPM</div>
                    </div>
                    <div>
                        <div className="wg-profile-stat-value text-[#00ff41]">{rank}</div>
                        <div className="wg-profile-stat-label">Rank</div>
                    </div>
                    <div>
                        <div className="wg-profile-stat-value">Lv.{level}</div>
                        <div className="wg-profile-stat-label">Level</div>
                    </div>
                </div>

                {/* Keystones Balance */}
                <div className="flex items-center justify-center gap-2 py-3">
                    <span className="text-xl">💎</span>
                    <span className="text-lg font-bold text-white">{keystones.toLocaleString()}</span>
                    <span className="text-xs text-white/50">Keystones</span>
                </div>
            </div>

            {/* Calendar Card */}
            <div className="wg-profile-card">
                <div className="wg-calendar">
                    <div className="wg-calendar-header">
                        <span className="text-sm font-semibold text-white">{currentMonth}</span>
                        <div className="flex gap-2">
                            <button className="text-white/40 hover:text-white text-xs">‹</button>
                            <button className="text-white/40 hover:text-white text-xs">›</button>
                        </div>
                    </div>

                    <div className="wg-calendar-grid">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-white/40 text-xs py-1">{day}</div>
                        ))}
                        {calendarDays.map((day, i) => (
                            <div
                                key={i}
                                className={`wg-calendar-day ${day === today.getDate() ? 'today' : ''
                                    } ${day ? '' : 'opacity-0'}`}
                            >
                                {day || ''}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Daily Challenges */}
            <div className="wg-profile-card">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-white">Daily Challenges</span>
                    <button className="text-xs text-[#00ff41] hover:text-[#00d4aa]">view all</button>
                </div>

                <div className="space-y-2">
                    {challenges.length > 0 ? (
                        challenges.map((challenge, i) => (
                            <div key={i} className="wg-challenge-card">
                                <div className="wg-challenge-icon bg-gradient-to-br from-[#00ff41] to-[#00aa66] flex items-center justify-center">
                                    <span className="text-white">🎯</span>
                                </div>
                                <div className="wg-challenge-info">
                                    <div className="wg-challenge-title">{challenge.title}</div>
                                    <div className="wg-challenge-desc">{challenge.desc}</div>
                                </div>
                                <div className="wg-challenge-reward">+{challenge.reward}💎</div>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="wg-challenge-card">
                                <div className="wg-challenge-icon bg-gradient-to-br from-[#00ff41] to-[#00aa66] flex items-center justify-center">
                                    <span className="text-white">⚡</span>
                                </div>
                                <div className="wg-challenge-info">
                                    <div className="wg-challenge-title">Speed Burst</div>
                                    <div className="wg-challenge-desc">Achieve 50 WPM in any test</div>
                                </div>
                                <div className="wg-challenge-reward">+15💎</div>
                            </div>
                            <div className="wg-challenge-card">
                                <div className="wg-challenge-icon bg-gradient-to-br from-[#00d4aa] to-[#009988] flex items-center justify-center">
                                    <span className="text-white">🎯</span>
                                </div>
                                <div className="wg-challenge-info">
                                    <div className="wg-challenge-title">Perfect Accuracy</div>
                                    <div className="wg-challenge-desc">100% accuracy in any lesson</div>
                                </div>
                                <div className="wg-challenge-reward">+20💎</div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
