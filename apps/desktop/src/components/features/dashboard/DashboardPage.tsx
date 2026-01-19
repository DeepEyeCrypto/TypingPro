// ═══════════════════════════════════════════════════════════════════
// DASHBOARD PAGE: VisionOS-style glass dashboard
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { MissionBriefing } from './MissionBriefing';
import { ThemePreviewCarousel } from '../../ThemePreviewCarousel';
import { getRankForWPM, getNextRank, calculateProgress, getWPMToNextRank, getLevelInfo, RANK_REWARDS } from '../../../core/rankSystem';
import { WeaknessProfile } from '../../../core/weaknessAnalyzer';
import { Zap, Target, TrendingUp, BarChart3, Binary, ShieldAlert, ArrowRight, Award, Sparkles } from 'lucide-react';

interface DashboardPageProps {
    username: string;
    wpm: number;
    accuracy: number;
    keystones: number;
    streak: number;
    bestWpm: number;
    rank: string;
    level: number;
    rankPoints: number;
    currentLesson: { title: string; stage: string; targetWpm: number; index: number; total: number };
    weaknessProfile: WeaknessProfile | null;
    onStartLesson: () => void;
    onStartMission: (lesson: any, targetWpm: number, minAcc: number) => void;
    missionState: string;
    onDeployMission: () => void;
    onResetMission: () => void;
    onConsultCoach: () => void;
    onOpenAnalytics: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 15
        }
    }
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
    username,
    wpm,
    accuracy,
    keystones,
    streak,
    bestWpm,
    rank,
    level,
    rankPoints,
    currentLesson,
    onStartLesson,
    onStartMission,
    missionState,
    onDeployMission,
    onResetMission,
    onConsultCoach,
    onOpenAnalytics,
    weaknessProfile
}) => {
    const currentRank = getRankForWPM(wpm);
    const nextRank = getNextRank(currentRank);
    const progress = calculateProgress(wpm);
    const wpmToNext = getWPMToNextRank(wpm);
    const levelInfo = getLevelInfo(rankPoints || 0);

    // Get top weaknesses
    const slowKeys = weaknessProfile?.slowKeys.slice(0, 2) || [];
    const errorKeys = weaknessProfile?.errorProneKeys.slice(0, 2) || [];
    const criticalKeys = [...slowKeys, ...errorKeys].slice(0, 4);

    const rewards = RANK_REWARDS[currentRank.name] || [];

    return (
        <div className="w-full flex flex-col gap-6 p-2 md:p-6 max-w-7xl mx-auto pb-24">

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   STAGE 6: TOP SECTION (Hero Cards)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   STAGE 7: RANK PROGRESSION HERO
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
                    <div className="relative group overflow-hidden bg-[var(--glass-bg)] border border-glass rounded-[4rem] p-12 lg:p-16 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--text-accent)]/10 to-transparent pointer-events-none" />

                        {/* Scanning Beam */}
                        <motion.div
                            animate={{ top: ['-10%', '110%'] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--text-accent)] to-transparent opacity-10 blur-sm z-20 pointer-events-none"
                        />

                        {/* Animated Ambient Glow */}
                        <motion.div
                            animate={{
                                opacity: [0.1, 0.2, 0.1],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                            className="absolute -top-1/2 -left-1/2 w-full h-full bg-[var(--text-accent)]/20 blur-[120px] rounded-full pointer-events-none"
                        />

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 relative z-10">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.6em] opacity-30 mb-4 block" style={{ color: 'var(--text-primary)' }}>Neural_Calibration_Status</span>
                                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none" style={{ color: 'var(--text-primary)' }}>
                                    {currentRank.name} <span className="text-[var(--text-accent)]">Tier</span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20 block mb-1" style={{ color: 'var(--text-primary)' }}>Next_Threshold</span>
                                    <span className="text-2xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{nextRank?.name || 'MAX'}</span>
                                </div>
                                <div className="w-20 h-20 rounded-3xl bg-[var(--text-accent)] border border-[var(--text-accent)]/20 flex items-center justify-center text-4xl shadow-2xl shadow-[var(--text-accent)]/30 scale-110">
                                    {currentRank.icon}
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic" style={{ color: 'var(--text-primary)' }}>Synchronization_Progress</span>
                                <span className="text-lg font-black italic text-[var(--text-accent)]">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-4 w-full bg-[var(--glass-bg)] border border-glass rounded-full overflow-hidden p-1 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-[var(--text-accent)] rounded-full shadow-[0_0_15px_var(--text-accent)]"
                                />
                            </div>
                            <div className="flex justify-between mt-4">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-20" style={{ color: 'var(--text-primary)' }}>Base_Freq: {currentRank.minWPM} WPM</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-accent)]">+{wpmToNext} WPM to level up</span>
                            </div>

                            <button
                                onClick={onOpenAnalytics}
                                className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-[var(--text-accent)] transition-all relative z-20 group/analytics"
                            >
                                <BarChart3 size={14} className="group-hover/analytics:scale-110 transition-transform" />
                                Open Performance Lab
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Certification Test Hero */}
                <motion.div variants={itemVariants}>
                    <GlassCard
                        title="Certification"
                        subtitle="PRO LEVEL AUTHENTICATION"
                        interactive
                        onClick={() => onStartMission(null, 90, 98)}
                        className="h-56 flex flex-col justify-end"
                        prismatic
                    >
                        <div className="flex justify-between items-end">
                            <p className="text-sm max-w-[200px] opacity-40 font-bold" style={{ color: 'var(--text-primary)' }}>
                                Validate velocity benchmarks and earn official digital credentials.
                            </p>
                            <div className="w-14 h-14 rounded-2xl bg-[var(--glass-bg)] border border-glass flex items-center justify-center text-2xl shadow-xl">
                                🎖️
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Smart Drill Hero */}
                <motion.div variants={itemVariants}>
                    <GlassCard
                        title="Neural Drill"
                        subtitle="ADAPTIVE AI TRAINING"
                        interactive
                        onClick={onStartLesson}
                        className="h-56 flex flex-col justify-end group/drill"
                    >
                        <div className="flex justify-between items-end">
                            <div className="space-y-4">
                                <p className="text-sm max-w-[200px] opacity-40 font-bold" style={{ color: 'var(--text-primary)' }}>
                                    AI targets physiological mechanical lag for optimized muscle memory.
                                </p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onConsultCoach(); }}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-accent)] hover:gap-4 transition-all"
                                >
                                    Consult_AI_Coach <ArrowRight size={14} />
                                </button>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-[var(--glass-bg)] border border-glass flex items-center justify-center text-2xl shadow-xl group-hover/drill:scale-110 transition-transform">
                                🧠
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   STAGE 6: MIDDLE SECTION (Progress/Stats)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

                <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* WPM Stat */}
                    <GlassCard variant="compact" className="flex flex-col items-center justify-center text-center py-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-2" style={{ color: 'var(--text-primary)' }}>Current SPD</span>
                        <div className="text-5xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{wpm}</div>
                        <span className="text-[10px] font-black italic mt-1 uppercase tracking-widest" style={{ color: 'var(--text-accent)' }}>Words Per Minute</span>
                    </GlassCard>

                    {/* Streak Stat */}
                    <GlassCard variant="compact" className="flex flex-col items-center justify-center text-center py-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-2" style={{ color: 'var(--text-primary)' }}>Active Streak</span>
                        <div className="text-5xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{streak}</div>
                        <span className="text-[10px] font-black italic mt-1 uppercase tracking-widest" style={{ color: 'var(--text-accent)' }}>Days Committed</span>
                    </GlassCard>

                    {/* Best Stat */}
                    <GlassCard variant="compact" className="flex flex-col items-center justify-center text-center py-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-2" style={{ color: 'var(--text-primary)' }}>Peak Velocity</span>
                        <div className="text-5xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{bestWpm}</div>
                        <span className="text-[10px] font-black italic mt-1 uppercase tracking-widest" style={{ color: 'var(--text-accent)' }}>Personal Record</span>
                    </GlassCard>
                </motion.div>

                {/* Level & Rewards Section */}
                <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Experience Level */}
                    <div className="lg:col-span-1 bg-[var(--glass-bg)] border border-glass rounded-[3rem] p-8 flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--text-accent)]/10 blur-3xl rounded-full" />
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={16} className="text-[var(--text-accent)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: 'var(--text-primary)' }}>Career_Level</span>
                            </div>
                            <div className="text-6xl font-black italic tracking-tighter mb-2" style={{ color: 'var(--text-primary)' }}>
                                Lvl <span className="text-[var(--text-accent)]">{levelInfo.level}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
                                <span>XP: {Math.round(levelInfo.currentXP)}</span>
                                <span>Next: {Math.round(levelInfo.xpToNext)}</span>
                            </div>
                            <div className="h-1.5 w-full bg-[var(--text-primary)]/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${levelInfo.progress}%` }}
                                    className="h-full bg-[var(--text-accent)]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rank Rewards */}
                    <div className="lg:col-span-2 bg-[var(--glass-bg)] border border-glass rounded-[3rem] p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Award size={16} className="text-[var(--text-accent)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: 'var(--text-primary)' }}>Tier_Unlocks</span>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-accent)]">Active: {currentRank.name}</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {rewards.map((reward, i) => (
                                <div key={i} className="px-4 py-3 rounded-2xl bg-[var(--text-primary)]/5 border border-[var(--text-primary)]/5 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[var(--text-accent)] shadow-[0_0_8px_var(--text-accent)]" />
                                    <span className="text-[10px] font-bold tracking-tight opacity-80" style={{ color: 'var(--text-primary)' }}>{reward}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   STAGE 6: BOTTOM SECTION (Focus Areas)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

                <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {criticalKeys.length > 0 ? criticalKeys.map((keyData, i) => (
                        <GlassCard key={i} variant="compact" title={`${keyData.key.toUpperCase()} Focus`} subtitle={keyData.avgLatency > 200 ? "VELOCITY_LAG" : "ERROR_PRONE"} cornerRadius="md">
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-xl font-black italic opacity-60" style={{ color: 'var(--text-primary)' }}>
                                    {keyData.avgLatency > 200 ? `${Math.round(keyData.avgLatency)}ms` : `${keyData.errorRate.toFixed(1)}%`}
                                </span>
                                <span className="text-[8px] font-black tracking-widest uppercase text-[var(--text-accent)] shadow-[0_0_8px_var(--text-accent)]">
                                    {keyData.avgLatency > 200 ? "SLOW" : "CRITICAL"}
                                </span>
                            </div>
                        </GlassCard>
                    )) : (
                        ['F', 'J', 'K', 'L'].map((k, i) => (
                            <GlassCard key={i} variant="compact" title={`${k} Focus`} subtitle="BASELINE" cornerRadius="md">
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-xl font-black italic opacity-20" style={{ color: 'var(--text-primary)' }}>Calibrating</span>
                                    <span className="text-[8px] font-black tracking-widest uppercase opacity-20" style={{ color: 'var(--text-primary)' }}>STABLE</span>
                                </div>
                            </GlassCard>
                        ))
                    )}
                </motion.div>

                {/* Theme Preview Section */}
                <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
                    <ThemePreviewCarousel />
                </motion.div>

            </motion.div>

            <MissionBriefing
                isOpen={missionState === 'BRIEFING'}
                onClose={onResetMission}
                onStart={onDeployMission}
                missionData={{
                    title: "Silver Certification",
                    targetWpm: 90,
                    accuracy: 98,
                    constraints: ["STRICT_MODE"]
                }}
            />
        </div>
    );
};

export default DashboardPage;
