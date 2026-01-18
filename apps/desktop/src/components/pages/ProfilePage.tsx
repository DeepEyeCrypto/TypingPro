// ═══════════════════════════════════════════════════════════════════
// PROFILE PAGE: VisionOS-style user identity and performance summary
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { useAuthStore } from '../../core/store/authStore';
import { useAchievementStore } from '../../core/store/achievementStore';
import { GlassCard } from '../ui/GlassCard';

interface AchievementBadge {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    icon: string;
}

export const ProfilePage: React.FC = () => {
    const { user, profile } = useAuthStore();
    const { unlockedBadges } = useAchievementStore();

    // Mock achievements for grid visualization
    const achievements: AchievementBadge[] = [
        { id: '1', name: 'First Test', description: 'Complete your first typing test', unlocked: true, icon: '🎯' },
        { id: '2', name: 'Speed Demon', description: 'Reach 100 WPM', unlocked: profile?.highest_wpm ? profile.highest_wpm >= 100 : false, icon: '⚡' },
        { id: '3', name: 'Accuracy Master', description: 'Get 99% accuracy', unlocked: false, icon: '🎯' },
        { id: '4', name: 'Marathon', description: 'Type 100,000 characters', unlocked: true, icon: '🏃' },
        { id: '5', name: 'Consistency King', description: '10 tests with 95%+ accuracy', unlocked: false, icon: '👑' },
        { id: '6', name: 'Speed Runner', description: 'Reach 120 WPM', unlocked: false, icon: '🚀' }
    ];

    return (
        <div className="flex flex-col gap-8 p-4 md:p-6 w-full max-w-4xl mx-auto pb-24 animate-in fade-in duration-700">

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               STAGE 8: PROFILE HEADER
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <GlassCard variant="large" className="flex flex-col md:flex-row items-center gap-8 py-10">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 glass-unified shadow-2xl transition-transform group-hover:scale-105">
                        <img
                            src={user?.avatar_url || `https://api.dicebear.com/7.x/api/bottts/svg?seed=${user?.name || 'User'}`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full glass-pill flex items-center justify-center text-xs shadow-lg">
                        ✨
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                        {user?.name || 'Anonymous Typist'}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <span className="glass-pill px-4 py-1.5 text-xs font-bold text-gray-900 shadow-sm">
                            ELITE TYPIST
                        </span>
                        <span className="text-white/40 font-mono text-sm tracking-widest">
                            {user?.email || 'Guest Protocol'}
                        </span>
                    </div>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-6 font-bold">
                        Interface Link Established: {profile?.joined_at ? new Date(profile.joined_at).toLocaleDateString() : 'Unknown Date'}
                    </p>
                </div>

                <button className="glass-pill px-8 py-3 text-sm font-bold text-gray-900 shadow-xl active:scale-95 transition-all">
                    Update Profile
                </button>
            </GlassCard>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               STAGE 8: OVERALL STATISTICS
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <GlassCard variant="compact" className="text-center py-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30 block mb-2">Total Tests</span>
                    <span className="text-3xl font-black text-white">{profile?.tests_completed || 0}</span>
                </GlassCard>

                <GlassCard variant="compact" className="text-center py-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30 block mb-2">Peak WPM</span>
                    <span className="text-3xl font-black text-cyan-400">{Math.round(profile?.highest_wpm || 0)}</span>
                </GlassCard>

                <GlassCard variant="compact" className="text-center py-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30 block mb-2">Avg Velocity</span>
                    <span className="text-3xl font-black text-white">{Math.round(profile?.avg_wpm || 0)}</span>
                </GlassCard>

                <GlassCard variant="compact" className="text-center py-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30 block mb-2">Efficiency</span>
                    <span className="text-3xl font-black text-lime-400">98.2%</span>
                </GlassCard>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               STAGE 8: ACHIEVEMENTS
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <GlassCard title="Achievement Matrix" subtitle="SIGNAL INTERCEPTION RECORD">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {achievements.map(badge => (
                        <div
                            key={badge.id}
                            className={`
                                p-4 rounded-2xl transition-all border border-white/5
                                ${badge.unlocked
                                    ? 'bg-white/5 hover:bg-white/10 ring-1 ring-white/10'
                                    : 'opacity-30 grayscale'
                                }
                            `}
                        >
                            <div className="text-3xl mb-3">{badge.icon}</div>
                            <h3 className="text-xs font-bold text-white mb-1 tracking-tight">{badge.name.toUpperCase()}</h3>
                            <p className="text-[10px] text-white/50 leading-tight">{badge.description}</p>
                            {!badge.unlocked && (
                                <div className="mt-3 text-[8px] font-black tracking-[0.2em] text-orange-400">LOCKED</div>
                            )}
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               STAGE 8: ACCOUNT ACTIONS
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="flex flex-col gap-4">
                <button className="glass-unified p-4 flex items-center justify-between group hover:bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-lg">🔑</div>
                        <span className="text-sm font-bold text-white">Cryptographic Keys (Password)</span>
                    </div>
                    <span className="text-white/20 group-hover:text-white/60 transition-colors">→</span>
                </button>
                <button className="glass-unified p-4 flex items-center justify-between group hover:bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-lg">🛡️</div>
                        <span className="text-sm font-bold text-white">Privacy & Telemetry</span>
                    </div>
                    <span className="text-white/20 group-hover:text-white/60 transition-colors">→</span>
                </button>
                <button className="glass-unified p-4 flex items-center justify-between group hover:bg-red-500/10 border-red-500/20">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-lg">🚪</div>
                        <span className="text-sm font-bold text-red-400">Terminate Session (Sign Out)</span>
                    </div>
                    <span className="text-red-400/20 group-hover:text-red-400/60 transition-colors">→</span>
                </button>
            </div>

        </div>
    );
};
