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
            <GlassCard variant="large" className="flex flex-col md:flex-row items-center gap-8 py-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--text-accent)] opacity-[0.03] blur-[100px] pointer-events-none" />
                <div className="relative group shrink-0">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-glass bg-[var(--glass-bg)] shadow-2xl transition-transform group-hover:scale-105">
                        <img
                            src={user?.avatar_url || `https://api.dicebear.com/7.x/api/bottts/svg?seed=${user?.name || 'User'}`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-black tracking-tight mb-2 uppercase italic" style={{ color: 'var(--text-primary)' }}>
                        {user?.name || 'Anonymous Typist'}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="bg-[var(--text-accent)] text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-[var(--text-accent)]/20">
                            ELITE TYPIST
                        </span>
                        <span className="text-[var(--text-secondary)] font-mono text-sm tracking-widest opacity-60">
                            {user?.email || 'Guest Protocol'}
                        </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.2em] mt-6 font-bold opacity-40">
                        Interface Link Established: {profile?.joined_at ? new Date(profile.joined_at).toLocaleDateString() : 'Unknown Date'}
                    </p>
                </div>

                <button className="px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all bg-[var(--text-accent)] text-white shadow-xl hover:scale-105 active:scale-95">
                    Sync_Neural_Log
                </button>
            </GlassCard>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               STAGE 8: OVERALL STATISTICS
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <GlassCard variant="compact" className="text-center py-6 border-b-2 border-transparent hover:border-[var(--text-accent)] transition-all">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-secondary)] block mb-2 opacity-50">Total Tests</span>
                    <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{profile?.tests_completed || 0}</span>
                </GlassCard>

                <GlassCard variant="compact" className="text-center py-6 border-b-2 border-transparent hover:border-cyan-400 transition-all">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-secondary)] block mb-2 opacity-50">Peak WPM</span>
                    <span className="text-3xl font-black text-cyan-400">{Math.round(profile?.highest_wpm || 0)}</span>
                </GlassCard>

                <GlassCard variant="compact" className="text-center py-6 border-b-2 border-transparent hover:border-[var(--text-accent)] transition-all">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-secondary)] block mb-2 opacity-50">Avg Velocity</span>
                    <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{Math.round(profile?.avg_wpm || 0)}</span>
                </GlassCard>

                <GlassCard variant="compact" className="text-center py-6 border-b-2 border-transparent hover:border-lime-400 transition-all">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-secondary)] block mb-2 opacity-50">Efficiency</span>
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
                <button className="glass-panel p-6 flex items-center justify-between group hover:bg-[var(--glass-hover)] transition-all border border-glass">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--glass-bg)] border border-glass flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">🔑</div>
                        <div>
                            <span className="text-sm font-black uppercase tracking-widest block" style={{ color: 'var(--text-primary)' }}>Neural_Keys</span>
                            <span className="text-[10px] text-[var(--text-secondary)] opacity-60 font-bold uppercase">Update Authentication Protocols</span>
                        </div>
                    </div>
                </button>
                <button className="glass-panel p-6 flex items-center justify-between group hover:bg-[var(--glass-hover)] transition-all border border-glass">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--glass-bg)] border border-glass flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">🛡️</div>
                        <div>
                            <span className="text-sm font-black uppercase tracking-widest block" style={{ color: 'var(--text-primary)' }}>Telemetry_Privacy</span>
                            <span className="text-[10px] text-[var(--text-secondary)] opacity-60 font-bold uppercase">Manage Neural Link Secrecy</span>
                        </div>
                    </div>
                </button>
                <button className="glass-panel p-6 flex items-center justify-between group hover:bg-red-500/10 border border-red-500/20 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">🚪</div>
                        <div>
                            <span className="text-sm font-black uppercase tracking-widest block text-red-500">Terminate_Session</span>
                            <span className="text-[10px] text-red-500 opacity-60 font-bold uppercase">Sever Connection to Core</span>
                        </div>
                    </div>
                </button>
            </div>

        </div>
    );
};
