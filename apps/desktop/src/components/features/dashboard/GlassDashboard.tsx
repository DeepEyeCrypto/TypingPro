// ═══════════════════════════════════════════════════════════════════
// GLASS DASHBOARD - High-Fidelity Deep Glass Overhaul
// Reference: uploaded_image_1768329290921.jpg
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { motion } from 'framer-motion';
import { useTyping } from '../../../hooks/useTyping';
import { useAchievementStore } from '../../../core/store/achievementStore';
import { Button } from '../../ui/Button';

// ─────────────────────────────────────────────────────────────────
// REUSABLE GLASS CARD COMPONENT
// ─────────────────────────────────────────────────────────────────
interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            className={`
                glass-panel
                rounded-[3rem] 
                p-10
                shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]
                transition-all duration-500
                hover:bg-[var(--glass-hover)]
                hover:translate-y-[-4px]
                hover:border-[var(--text-accent)]/20
                relative overflow-hidden
                ${className}
            `}
        >
            {/* Ambient Top Glow */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────
// CERTIFICATION TEST CARD
// ─────────────────────────────────────────────────────────────────
interface CertificationCardProps {
    currentWpm: number;
    requiredWpm: number;
    onStart: () => void;
}

const CertificationCard: React.FC<CertificationCardProps> = ({ currentWpm, requiredWpm, onStart }) => {
    const isUnlocked = currentWpm >= requiredWpm;

    return (
        <GlassCard delay={0.1} className="h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-12">
                    <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center text-3xl shadow-xl">
                        🎓
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase glass-panel backdrop-blur-md ${isUnlocked
                        ? 'text-[var(--text-accent)]'
                        : 'opacity-30'
                        }`}
                        style={{ color: isUnlocked ? 'var(--text-accent)' : 'var(--text-primary)' }}
                    >
                        {isUnlocked ? 'AVAILABLE' : 'LOCKED'}
                    </div>
                </div>

                <h2 className="text-4xl font-black tracking-tighter mb-4 leading-none italic" style={{ color: 'var(--text-primary)' }}>
                    Certification
                </h2>
                <p className="text-base leading-relaxed max-w-[320px] mb-12 font-bold opacity-40" style={{ color: 'var(--text-primary)' }}>
                    Official Elite Certification. Strictly monitored session with zero error tolerance.
                </p>

                <div className="flex gap-4 mb-2">
                    <div className="px-5 py-2.5 glass-panel rounded-2xl shadow-inner">
                        <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-20" style={{ color: 'var(--text-primary)' }}>Required</span>
                        <span className="text-xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{requiredWpm} WPM</span>
                    </div>
                    <div className="px-5 py-2.5 glass-panel rounded-2xl shadow-inner">
                        <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-20" style={{ color: 'var(--text-primary)' }}>Min Acc</span>
                        <span className="text-xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>99%</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-12">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-20" style={{ color: 'var(--text-primary)' }}>
                    Valid for: 2025
                </div>
                <Button
                    variant="primary"
                    onClick={onStart}
                    disabled={!isUnlocked}
                    className="!rounded-2xl !px-10 !py-5 shadow-xl shadow-[var(--text-accent)]/20 text-[10px] font-black uppercase tracking-[0.4em]"
                >
                    Apply Now
                </Button>
            </div>
        </GlassCard>
    );
};

// ─────────────────────────────────────────────────────────────────
// SMART DRILL CARD
// ─────────────────────────────────────────────────────────────────
interface DrillFocus {
    id: string;
    keys: string;
    name: string;
    progress: number;
    status: 'locked' | 'available' | 'completed';
}

interface SmartDrillCardProps {
    drillFocuses: DrillFocus[];
    onStartDrill: (focusId: string) => void;
}

const SmartDrillCard: React.FC<SmartDrillCardProps> = ({ drillFocuses, onStartDrill }) => {
    return (
        <GlassCard delay={0.2} className="h-full flex flex-col">
            <div className="flex justify-between items-start mb-12">
                <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center text-3xl shadow-xl">
                    🧠
                </div>
                <div className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase glass-panel text-[var(--text-accent)] backdrop-blur-md">
                    AI Adaptive
                </div>
            </div>

            <h2 className="text-4xl font-black tracking-tighter mb-4 leading-none italic" style={{ color: 'var(--text-primary)' }}>
                Smart Drills
            </h2>
            <p className="text-base leading-relaxed mb-10 font-bold opacity-40" style={{ color: 'var(--text-primary)' }}>
                AI-targeted bigram generation focused on your physiological mechanical lag.
            </p>

            <div className="grid grid-cols-1 gap-4 flex-1">
                {drillFocuses.map((focus, index) => (
                    <button
                        key={focus.id}
                        onClick={() => onStartDrill(focus.id)}
                        disabled={focus.status === 'locked'}
                        className={`
                            group relative p-6 rounded-2xl border text-left transition-all duration-500
                            ${focus.status === 'completed'
                                ? 'bg-[var(--glass-hover)] border-[var(--text-accent)]/20'
                                : focus.status === 'available'
                                    ? 'glass-panel hover:bg-[var(--glass-hover)] hover:border-[var(--text-accent)]/40 shadow-inner'
                                    : 'glass-panel border-transparent opacity-10 cursor-not-allowed'
                            }
                        `}
                    >
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <h4 className="font-black text-lg leading-tight tracking-tight italic" style={{ color: 'var(--text-primary)' }}>{focus.keys}</h4>
                                <p className="text-[10px] uppercase tracking-widest mt-1 font-black opacity-30" style={{ color: 'var(--text-primary)' }}>{focus.name}</p>
                            </div>
                            <span className="font-black tracking-tighter text-2xl group-hover:text-[var(--text-accent)] transition-colors opacity-20" style={{ color: 'var(--text-primary)' }}>
                                {focus.progress}%
                            </span>
                        </div>

                        {/* Progressive Fill Background */}
                        <div
                            className="absolute bottom-0 left-0 h-1 bg-[var(--text-accent)]/20 transition-all duration-1000"
                            style={{ width: `${focus.progress}%` }}
                        />
                    </button>
                ))}
            </div>
        </GlassCard>
    );
};

// ─────────────────────────────────────────────────────────────────
// MINI ANALYTICS PANEL
// ─────────────────────────────────────────────────────────────────
interface MiniAnalyticsProps {
    wpm: number;
    accuracy: number;
    streak: number;
}

const MiniAnalytics: React.FC<MiniAnalyticsProps> = ({ wpm, accuracy, streak }) => {
    return (
        <div className="flex flex-col gap-6 h-full">
            <GlassCard delay={0.4} className="!p-8 shadow-2xl">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 block opacity-20" style={{ color: 'var(--text-primary)' }}>Performance</span>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{wpm}</span>
                    <span className="text-xs font-black opacity-30" style={{ color: 'var(--text-primary)' }}>WPM</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: 'var(--text-primary)' }}>Average Speed</p>

                <div className="h-2 w-full glass-panel rounded-full mt-6 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(wpm / 150) * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-[var(--text-accent)] shadow-[0_0_10px_var(--text-accent)] rounded-full"
                    />
                </div>
            </GlassCard>

            <GlassCard delay={0.5} className="!p-8 flex-1 shadow-2xl">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 block opacity-20" style={{ color: 'var(--text-primary)' }}>Accuracy</span>
                <div className="relative w-40 h-40 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="var(--glass-border)" strokeWidth="12" className="opacity-10" />
                        <motion.circle
                            cx="80" cy="80" r="70" fill="none"
                            stroke="var(--text-accent)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={440}
                            initial={{ strokeDashoffset: 440 }}
                            animate={{ strokeDashoffset: 440 - (440 * accuracy / 100) }}
                            transition={{ duration: 2, ease: "circOut" }}
                            className="shadow-lg"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{accuracy}%</span>
                        <span className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-20" style={{ color: 'var(--text-primary)' }}>ACCURACY</span>
                    </div>
                </div>
            </GlassCard>

            <GlassCard delay={0.6} className="!p-8 shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="text-5xl drop-shadow-lg">🔥</div>
                    <div>
                        <span className="text-4xl font-black italic tracking-tighter block leading-none" style={{ color: 'var(--text-primary)' }}>{streak}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30" style={{ color: 'var(--text-primary)' }}>Day Streak</span>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────
interface GlassDashboardProps {
    onStartCertification: () => void;
    onStartDrill: (focusId: string) => void;
}

export const GlassDashboard: React.FC<GlassDashboardProps> = ({ onStartCertification, onStartDrill }) => {
    const { wpm, accuracy } = useTyping();
    const { streak } = useAchievementStore();

    const drillFocuses: DrillFocus[] = [
        { id: 'fj', keys: 'Home_Row_Anchors', name: 'Tactical_F_J', progress: 85, status: 'completed' },
        { id: 'dk', keys: 'Mechanical_Flow', name: 'Fluid_D_K', progress: 60, status: 'available' },
        { id: 'sl', keys: 'Stability_Control', name: 'Ring_Precision', progress: 30, status: 'available' },
    ];

    return (
        <div className="min-h-screen p-8 custom-scrollbar">
            {/* Ambient Background layers - ensure dark mode support */}
            <div className="fixed inset-0 bg-midnight -z-20" />
            <div className="fixed inset-0 bg-gradient-to-tr from-black via-black/90 to-black/80 -z-10" />

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
                <main className="space-y-10">
                    <header className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.5em] block mb-3 opacity-30" style={{ color: 'var(--text-primary)' }}>Dashboard</span>
                            <h1 className="text-6xl font-black tracking-tighter leading-none uppercase italic" style={{ color: 'var(--text-primary)' }}>Mission Hub</h1>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 px-6 py-3 rounded-2xl glass-panel backdrop-blur-md shadow-lg">
                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--text-accent)] animate-pulse shadow-[0_0_12px_var(--text-accent)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 font-mono" style={{ color: 'var(--text-primary)' }}>Online_Node</span>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <CertificationCard
                            currentWpm={wpm || 45}
                            requiredWpm={28}
                            onStart={onStartCertification}
                        />
                        <SmartDrillCard
                            drillFocuses={drillFocuses}
                            onStartDrill={onStartDrill}
                        />
                    </div>

                    <footer className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10">
                        {[
                            { label: 'LESSONS', value: '12/50', icon: '📚' },
                            { label: 'XP', value: '2,450', icon: '⚡' },
                            { label: 'Rank', value: 'SILVER', icon: '🏆' },
                            { label: 'Certs', value: '8', icon: '🎖️' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="glass-panel rounded-[2rem] p-6 hover:bg-[var(--glass-hover)] transition-all cursor-crosshair group shadow-xl"
                            >
                                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform opacity-40 grayscale group-hover:grayscale-0">{stat.icon}</div>
                                <div className="text-2xl font-black italic tracking-tighter leading-none mb-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-20" style={{ color: 'var(--text-primary)' }}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </footer>
                </main>

                <aside className="hidden lg:block">
                    <MiniAnalytics
                        wpm={wpm || 67}
                        accuracy={accuracy || 94}
                        streak={streak?.currentStreak || 7}
                    />
                </aside>
            </div>
        </div>
    );
};

export default GlassDashboard;
