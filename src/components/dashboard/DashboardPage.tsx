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
                    <h1 className="text-2xl font-bold text-gray-800">
                        {greeting}, <span className="text-orange-500">{username}</span> 👋
                    </h1>
                    <p className="text-gray-500 text-sm">Let's practice some typing today</p>
                </div>

                {/* Stats Row */}
                <div className="wg-stats-row">
                    <StatsCard
                        icon="📊"
                        value={wpm}
                        unit="WPM"
                        label="Current Speed"
                        color="orange"
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
                        <h2 className="text-lg font-semibold text-gray-800">Training Modules</h2>
                        <button className="text-sm text-orange-500 hover:text-orange-600">view all</button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { name: 'Home Row', desc: 'Foundation training', icon: '🏠', color: 'from-orange-400 to-orange-500' },
                            { name: 'Speed Building', desc: 'Increase your pace', icon: '⚡', color: 'from-teal-400 to-teal-500' },
                            { name: 'Fluency', desc: 'Long-form practice', icon: '📝', color: 'from-purple-400 to-purple-500' },
                        ].map((module, i) => (
                            <div key={i} className="wg-card p-4 flex gap-4 items-center cursor-pointer">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-2xl`}>
                                    {module.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{module.name}</h3>
                                    <p className="text-xs text-gray-500">{module.desc}</p>
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
