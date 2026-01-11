// ═══════════════════════════════════════════════════════════════════
// DASHBOARD PAGE - Main warm glass dashboard layout (Fitness-inspired)
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { StatsCard } from './StatsCard';
import { ProgressChart } from './ProgressChart';
import { CurrentLesson } from './CurrentLesson';
import { ProfileSidebar } from './ProfileSidebar';
import '../../styles/warm-glass.css';

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
}

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
}) => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="wg-dashboard">
            {/* Main Content */}
            <div className="wg-main-content">
                {/* Header */}
                <div className="mb-2">
                    <h1 className="text-2xl font-bold text-white">
                        {greeting}, <span className="text-[#00ff41]">{username}</span> 👋
                    </h1>
                    <p className="text-white/50 text-sm">Let's practice some typing today</p>
                </div>

                {/* Stats Row */}
                <div className="wg-stats-row">
                    <StatsCard
                        icon="📊"
                        value={wpm}
                        unit="WPM"
                        label="Current Speed"
                        color="green"
                        visual="bar"
                    />
                    <StatsCard
                        icon="💓"
                        value={`${accuracy.toFixed(1)}%`}
                        label="Accuracy"
                        color="teal"
                        visual="wave"
                    />
                    <StatsCard
                        icon="💎"
                        value={keystones.toLocaleString()}
                        label="Keystones"
                        color="purple"
                        visual="none"
                    />
                    <StatsCard
                        icon="🔥"
                        value={streak}
                        unit="days"
                        label="Streak"
                        color="green"
                        visual="none"
                    />
                </div>

                {/* Chart + Current Lesson Row */}
                <div className="wg-content-row">
                    <ProgressChart title="Typing Progress" currentWpm={wpm} />
                    <CurrentLesson
                        title={currentLesson.title}
                        stage={currentLesson.stage}
                        targetWpm={currentLesson.targetWpm}
                        currentLesson={currentLesson.index}
                        totalLessons={currentLesson.total}
                        onContinue={onStartLesson}
                    />
                </div>

                {/* Lesson Categories */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-white">Training Modules</h2>
                        <button className="text-sm text-[#00ff41] hover:text-[#00d4aa]">view all</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { name: 'Home Row', desc: 'Foundation training', icon: '🏠', color: 'from-[#00ff41] to-[#00aa66]' },
                            { name: 'Speed Building', desc: 'Increase your pace', icon: '⚡', color: 'from-[#00d4aa] to-[#009988]' },
                            { name: 'Fluency', desc: 'Long-form practice', icon: '📝', color: 'from-[#aa00ff] to-[#7700bb]' },
                        ].map((module, i) => (

                            <div key={i} className="wg-card p-4 flex gap-4 items-center cursor-pointer">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-2xl`}>
                                    {module.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{module.name}</h3>
                                    <p className="text-xs text-white/50">{module.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <ProfileSidebar
                username={username}
                handle="typingpro"
                bestWpm={bestWpm}
                rank={rank}
                level={level}
                keystones={keystones}
            />
        </div>
    );
};
