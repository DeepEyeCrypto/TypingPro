// ═══════════════════════════════════════════════════════════════════
// DASHBOARD PAGE: VisionOS-style glass dashboard
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { MissionBriefing } from './MissionBriefing';

interface DashboardPageProps {
    username: string;
    wpm: number;
    accuracy: number;
    keystones: number;
    streak: number;
    bestWpm: number;
    rank: string;
    level: number;
    currentLesson: { title: string; stage: string; targetWpm: number; index: number; total: number };
    onStartLesson: () => void;
    onStartMission: (lesson: any, targetWpm: number, minAcc: number) => void;
    missionState: string;
    onDeployMission: () => void;
    onResetMission: () => void;
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
    currentLesson,
    onStartLesson,
    onStartMission,
    missionState,
    onDeployMission,
    onResetMission,
}) => {

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

                {/* Certification Test Hero */}
                <motion.div variants={itemVariants}>
                    <GlassCard
                        title="Certification Test"
                        subtitle="PRO LEVEL AUTHENTICATION"
                        interactive
                        onClick={() => onStartMission(null, 90, 98)}
                        className="h-48 flex flex-col justify-end"
                        prismatic
                    >
                        <div className="flex justify-between items-end">
                            <p className="glass-text-muted text-sm max-w-[200px]">
                                Validate your typing speed and earn official digital certificates.
                            </p>
                            <div className="w-12 h-12 rounded-full glass-pill flex items-center justify-center text-xl font-bold">
                                🎖️
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Smart Drill Hero */}
                <motion.div variants={itemVariants}>
                    <GlassCard
                        title="AI Smart Drill"
                        subtitle="ADAPTIVE NEURAL TRAINING"
                        interactive
                        onClick={onStartLesson}
                        className="h-48 flex flex-col justify-end"
                    >
                        <div className="flex justify-between items-end">
                            <p className="glass-text-muted text-sm max-w-[200px]">
                                AI targets your weak letter pairs for optimized muscle memory.
                            </p>
                            <div className="w-12 h-12 rounded-full glass-pill flex items-center justify-center text-xl font-bold">
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
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Current SPD</span>
                        <div className="text-5xl font-black text-white">{wpm}</div>
                        <span className="text-[10px] font-bold text-cyan-400 mt-1 uppercase tracking-widest">Words Per Minute</span>
                    </GlassCard>

                    {/* Streak Stat */}
                    <GlassCard variant="compact" className="flex flex-col items-center justify-center text-center py-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Active Streak</span>
                        <div className="text-5xl font-black text-white">{streak}</div>
                        <span className="text-[10px] font-bold text-orange-400 mt-1 uppercase tracking-widest">Days Committed</span>
                    </GlassCard>

                    {/* Best Stat */}
                    <GlassCard variant="compact" className="flex flex-col items-center justify-center text-center py-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Peak Velocity</span>
                        <div className="text-5xl font-black text-white">{bestWpm}</div>
                        <span className="text-[10px] font-bold text-purple-400 mt-1 uppercase tracking-widest">Personal Record</span>
                    </GlassCard>
                </motion.div>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   STAGE 6: BOTTOM SECTION (Focus Areas)
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

                <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <GlassCard variant="compact" title="F & J Focus" subtitle="HOME ROW" cornerRadius="md">
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-lg font-black text-white/80">98%</span>
                            <span className="text-[8px] font-bold text-lime-400">OPTIMAL</span>
                        </div>
                    </GlassCard>
                    <GlassCard variant="compact" title="K & L Focus" subtitle="HOME ROW" cornerRadius="md">
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-lg font-black text-white/80">94%</span>
                            <span className="text-[8px] font-bold text-cyan-400">SYNCING</span>
                        </div>
                    </GlassCard>
                    <GlassCard variant="compact" title="E & R Focus" subtitle="TOP ROW" cornerRadius="md">
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-lg font-black text-white/80">91%</span>
                            <span className="text-[8px] font-bold text-white/40">CALIBRATING</span>
                        </div>
                    </GlassCard>
                    <GlassCard variant="compact" title="A & S Focus" subtitle="HOME ROW" cornerRadius="md">
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-lg font-black text-white/80">88%</span>
                            <span className="text-[8px] font-bold text-orange-400">DRILL REQ</span>
                        </div>
                    </GlassCard>
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
