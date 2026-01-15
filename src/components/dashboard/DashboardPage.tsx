import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { StatsCard } from './StatsCard';
import { CurrentLesson } from './CurrentLesson';
import { ProfileSidebar } from './ProfileSidebar';
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
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20
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
        <div className="w-full min-h-full pr-0 md:pr-2 pb-6">
            {/* Responsive Bento Grid: Mobile(1) -> Tablet(2) -> Desktop(3) */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full auto-rows-[minmax(180px,auto)] pb-20 md:pb-0"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >

                {/* 1. THERMOSTAT / WPM GAUGE (Top Left) */}
                <motion.div variants={itemVariants} className="col-span-1 xl:row-span-4 h-full">
                    <GlassCard className="flex flex-col justify-center items-center p-8 relative min-h-[300px] xl:min-h-full h-full">
                        <h3 className="text-white/70 text-sm font-bold tracking-widest absolute top-8 left-8 drop-shadow-md">CURRENT_VELOCITY</h3>
                        <div className="relative">
                            {/* Circle Gauge Implementation would go here */}
                            <div className="w-56 h-56 rounded-full border-[12px] border-white/5 flex items-center justify-center">
                                <span className="text-8xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent transition-all duration-500">{wpm}</span>
                                <span className="absolute bottom-10 text-cyan-500/30 text-xl font-bold">WPM</span>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* 2. STATS CHART / ENERGY (Middle Top) */}
                <motion.div variants={itemVariants} className="col-span-1 xl:row-span-3 h-full">
                    <GlassCard className="p-6 min-h-[300px] xl:min-h-full h-full">
                        <div className="flex justify-between mb-4">
                            <h3 className="text-red-400/80 text-xs font-bold tracking-widest drop-shadow-md">PERFORMANCE_VECTOR</h3>
                            <span className="text-neon-lime text-xs font-mono font-bold">LIVE</span>
                        </div>
                        {/* Placeholder for Recharts */}
                        <div className="flex-1 w-full min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/30 rounded-[24px] flex items-center justify-center text-white/20 shadow-inner">
                            CHART_MODULE_Z4
                        </div>
                    </GlassCard>
                </motion.div>

                {/* 3. PROFILE / RANK (Right Column) */}
                <motion.div variants={itemVariants} className="col-span-1 xl:row-span-6 h-full">
                    <GlassCard className="px-8 pt-8 pb-10 flex flex-col items-center h-full">
                        {/* Avatar with Fallback */}
                        <div className="w-32 h-32 rounded-full mb-6 overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                            <img
                                src={`https://api.dicebear.com/7.x/api/bottts/svg?seed=${username}`}
                                alt={username}
                                className="w-full h-full object-cover relative z-10 text-transparent"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).parentElement!.classList.add('fallback-active');
                                }}
                            />
                            <span className="absolute text-4xl font-black text-white/20 select-none">
                                {username.slice(0, 2).toUpperCase()}
                            </span>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-tight text-shadow-sm">{username}</h2>
                        <span className="text-purple-400 font-mono text-sm tracking-[0.2em] mb-8 font-bold opacity-90">{rank} // LVL {level}</span>

                        <div className="w-full mt-auto space-y-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[24px] shadow-inner p-6">
                            <div className="flex justify-between text-sm py-2 border-b border-white/10 last:border-0">
                                <span className="text-white/70 font-bold tracking-wider text-xs drop-shadow-md">STREAK</span>
                                <span className="text-white font-bold">{streak} DAYS</span>
                            </div>
                            <div className="flex justify-between text-sm py-2 border-b border-white/10 last:border-0">
                                <span className="text-white/70 font-bold tracking-wider text-xs drop-shadow-md">PEAK WPM</span>
                                <span className="text-white font-bold">{bestWpm}</span>
                            </div>
                            <div className="flex justify-between text-sm py-2 border-b-0">
                                <span className="text-white/70 font-bold tracking-wider text-xs drop-shadow-md">KEYSTONES</span>
                                <span className="text-purple-400 font-bold">{keystones} 💎</span>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* 4. CURRENT LESSON (Bottom Left) */}
                <motion.div variants={itemVariants} className="col-span-1 xl:row-span-2 h-full">
                    <GlassCard className="p-6 flex flex-col justify-between group cursor-pointer hover:border-neon-lime/30 transition-colors min-h-[200px] xl:min-h-full h-full" onClick={onStartLesson}>
                        <div>
                            <h3 className="text-neon-lime text-xs font-bold tracking-widest mb-1 drop-shadow-md">NEXT_PROTOCOL</h3>
                            <h2 className="text-2xl font-black text-white leading-tight">{currentLesson.title}</h2>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-white/40 text-xs font-mono">STAGE {currentLesson.stage}</span>
                            <div className="w-10 h-10 rounded-full bg-neon-lime flex items-center justify-center text-deep-ocean font-bold shadow-neon-glow group-hover:scale-110 transition-transform">
                                ▶
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* 5. ACCURACY MODULE (Middle Bottom) */}
                <motion.div variants={itemVariants} className="col-span-1 xl:row-span-3 h-full">
                    <GlassCard className="p-6 flex flex-col justify-center items-center min-h-[200px] xl:min-h-full h-full relative text-shadow-md">
                        <h3 className="text-white/70 text-xs font-bold tracking-widest absolute top-6 left-6 drop-shadow-md">PRECISION_INDEX</h3>
                        <span className="text-6xl font-black bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent transition-all duration-500">{Math.round(accuracy)}%</span>
                        <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]" style={{ width: `${accuracy}%` }} />
                        </div>
                    </GlassCard>
                </motion.div>

            </motion.div>

            <MissionBriefing
                isOpen={missionState === 'BRIEFING'}
                onClose={onResetMission}
                onStart={onDeployMission}
                missionData={{
                    title: "RANK_SILVER_CERT",
                    targetWpm: 90,
                    accuracy: 98,
                    constraints: ["STRICT_MODE"]
                }}
            />
        </div >
    );
};
