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
            <div className="bg-black/20 border border-white/5 backdrop-blur-md rounded-2xl p-5 shadow-lg">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-12 h-12 rounded-full border border-neon-cyan/50 p-0.5"
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={username} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full bg-linear-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center font-bold text-black">{username.charAt(0).toUpperCase()}</div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-white tracking-wide">{username}</h3>
                        <p className="text-xs text-white/40 font-mono">@{handle}</p>
                    </div>
                    <button className="ml-auto text-white/40 hover:text-white transition-colors">⋯</button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5">
                    <div className="text-center">
                        <div className="text-lg font-bold text-white font-mono">{bestWpm}</div>
                        <div className="text-[10px] uppercase text-white/40 tracking-wider">Best WPM</div>
                    </div>
                    <div className="text-center border-l border-white/5">
                        <div className="text-lg font-bold text-neon-cyan font-mono">{rank}</div>
                        <div className="text-[10px] uppercase text-white/40 tracking-wider">Rank</div>
                    </div>
                    <div className="text-center border-l border-white/5">
                        <div className="text-lg font-bold text-white font-mono">Lv.{level}</div>
                        <div className="text-[10px] uppercase text-white/40 tracking-wider">Level</div>
                    </div>
                </div>

                {/* Keystones Balance */}
                <div className="flex items-center justify-center gap-2 pt-4">
                    <span className="text-lg animate-pulse">💎</span>
                    <span className="text-lg font-bold text-white font-mono">{keystones.toLocaleString()}</span>
                    <span className="text-xs text-white/50 uppercase tracking-wider">Keystones</span>
                </div>
            </div>

            {/* Calendar Card */}
            <div className="bg-black/20 border border-white/5 backdrop-blur-md rounded-2xl p-5 shadow-lg">
                <div className="wg-calendar">
                    <div className="wg-calendar-header">
                        <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{currentMonth}</span>
                        <div className="flex gap-2">
                            <button className="text-white/40 hover:text-white text-xs transition-colors">‹</button>
                            <button className="text-white/40 hover:text-white text-xs transition-colors">›</button>
                        </div>
                    </div>

                    <div className="wg-calendar-grid mt-4">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-white/20 text-[10px] font-bold text-center py-1">{day}</div>
                        ))}
                        {calendarDays.map((day, i) => (
                            <div
                                key={i}
                                className={`
                                    h-7 flex items-center justify-center text-xs rounded transition-all
                                    ${day === today.getDate()
                                        ? 'bg-neon-cyan/20 text-neon-cyan font-bold shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                                        : day ? 'text-white/60 hover:bg-white/5' : ''
                                    } 
                                    ${day ? '' : 'opacity-0'}
                                `}
                            >
                                {day || ''}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Daily Challenges */}
            <div className="bg-black/20 border border-white/5 backdrop-blur-md rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Daily Challenges</span>
                    <button className="text-[10px] text-neon-cyan hover:text-neon-cyan/80 transition-colors uppercase font-bold tracking-wider">View All</button>
                </div>

                <div className="space-y-3">
                    {challenges.length > 0 ? (
                        challenges.map((challenge, i) => (
                            <div key={i} className="flex gap-3 items-center p-2 rounded-lg bg-white/5 border border-white/5">
                                <div className="w-8 h-8 rounded bg-gradient-to-br from-neon-green/20 to-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/20">
                                    <span className="text-sm">🎯</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white truncate">{challenge.title}</div>
                                    <div className="text-[10px] text-white/40 truncate">{challenge.desc}</div>
                                </div>
                                <div className="text-xs font-mono font-bold text-neon-yellow">+{challenge.reward}💎</div>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="flex gap-3 items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="w-8 h-8 rounded bg-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/20 group-hover:border-neon-green/40 transition-colors">
                                    <span className="text-sm">⚡</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white">Speed Burst</div>
                                    <div className="text-[10px] text-white/40">Achieve 50 WPM</div>
                                </div>
                                <div className="text-xs font-mono font-bold text-neon-yellow">+15💎</div>
                            </div>
                            <div className="flex gap-3 items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="w-8 h-8 rounded bg-neon-purple/10 flex items-center justify-center text-neon-purple border border-neon-purple/20 group-hover:border-neon-purple/40 transition-colors">
                                    <span className="text-sm">🎯</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white">Perfect Accuracy</div>
                                    <div className="text-[10px] text-white/40">100% accuracy</div>
                                </div>
                                <div className="text-xs font-mono font-bold text-neon-yellow">+20💎</div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
