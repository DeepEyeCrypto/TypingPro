// ═══════════════════════════════════════════════════════════════════
// PROFILE SIDEBAR - High-Fidelity Deep Glass Overhaul
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { motion } from 'framer-motion';

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
    const today = new Date();
    const currentMonth = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    return (
        <div className="space-y-8 pr-2">
            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-[64px] border border-white/10 rounded-[3rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/[0.02] to-transparent pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full border-2 border-white/10 p-1 relative">
                            <div className="absolute inset-0 bg-white/10 rounded-full blur-md" />
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={username} className="w-full h-full object-cover rounded-full relative z-10" />
                            ) : (
                                <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center font-black text-white text-xl relative z-10 uppercase tracking-tighter">{username.charAt(0)}</div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-black text-white text-xl tracking-tighter leading-tight uppercase">{username}</h3>
                            <p className="text-[10px] text-white opacity-40 font-black tracking-widest uppercase">@{handle}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 py-6 border-y border-white/5">
                        <div className="text-center">
                            <div className="text-xl font-black text-white tracking-tighter leading-none">{bestWpm}</div>
                            <div className="text-[8px] font-black uppercase text-white opacity-30 tracking-widest mt-1">BEST_WPM</div>
                        </div>
                        <div className="text-center border-l border-white/5">
                            <div className="text-xl font-black text-white tracking-tighter leading-none">{rank}</div>
                            <div className="text-[8px] font-black uppercase text-white opacity-30 tracking-widest mt-1">RANK</div>
                        </div>
                        <div className="text-center border-l border-white/5">
                            <div className="text-xl font-black text-white tracking-tighter leading-none">{level}</div>
                            <div className="text-[8px] font-black uppercase text-white opacity-30 tracking-widest mt-1">LEVEL</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-6">
                        <span className="text-2xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">💎</span>
                        <span className="text-2xl font-black text-white tracking-tighter leading-none">{keystones.toLocaleString()}</span>
                        <span className="text-[10px] text-white opacity-40 font-black uppercase tracking-widest">Keystones</span>
                    </div>
                </div>
            </div>

            {/* Calendar Card */}
            <div className="bg-white/10 backdrop-blur-[64px] border border-white/10 rounded-[3rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-white opacity-30 uppercase tracking-[0.3em]">{currentMonth}</span>
                    <div className="flex gap-4">
                        <button className="text-white opacity-40 hover:opacity-100 transition-opacity text-sm">‹</button>
                        <button className="text-white opacity-40 hover:opacity-100 transition-opacity text-sm">›</button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="text-white opacity-20 font-black text-center py-2 text-[8px]">{day}</div>
                    ))}
                    {calendarDays.map((day, i) => (
                        <div
                            key={i}
                            className={`
                                h-8 flex items-center justify-center text-[10px] rounded-xl transition-all
                                ${day === today.getDate()
                                    ? 'bg-white text-black font-black shadow-[0_8px_16px_rgba(255,255,255,0.2)]'
                                    : day ? 'text-white opacity-60 hover:bg-white/10 font-bold' : ''
                                } 
                                ${day ? '' : 'invisible'}
                            `}
                        >
                            {day || ''}
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Challenges */}
            <div className="bg-white/10 backdrop-blur-[64px] border border-white/10 rounded-[3rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-white opacity-30 uppercase tracking-[0.3em]">DAILY_SYNC</span>
                    <button className="text-[8px] text-white opacity-40 hover:opacity-100 transition-opacity uppercase font-black tracking-widest">View All</button>
                </div>

                <div className="space-y-4">
                    {(challenges.length > 0 ? challenges : [
                        { title: 'Speed Burst', reward: 15, desc: 'Achieve 50 WPM' },
                        { title: 'Perfect Accuracy', reward: 20, desc: 'Maintain 100%' }
                    ]).map((challenge, i) => (
                        <div key={i} className="flex gap-4 items-center p-4 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/10 transition-all group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 group-hover:border-black/30 transition-all font-black">
                                <span className="text-lg">🎯</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-black text-white truncate leading-none mb-1 uppercase tracking-tighter">{challenge.title}</div>
                                <div className="text-[8px] font-black text-white opacity-30 truncate uppercase tracking-widest">{challenge.desc}</div>
                            </div>
                            <div className="text-xs font-black text-white tracking-widest">+{challenge.reward}💎</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
