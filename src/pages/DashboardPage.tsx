import React, { useState, useEffect } from 'react';
import { CURRICULUM, getLessonsByStage, Lesson } from '../data/CurriculumDatabase';
import LessonEngine from '../components/LessonEngine';
import ProgressTracker from '../components/ProgressTracker';
import '../styles/LiquidGlass.css';

import TopBar from '../components/TopBar';

export const DashboardPage: React.FC = () => {
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userStats, setUserStats] = useState({
        stage: 1,
        lessonsCompleted: 0,
        bestWPM: 0
    });

    useEffect(() => {
        // Load progress from localStorage if exists
        const savedProgress = localStorage.getItem('typingPro_progress');
        if (savedProgress) {
            setUserStats(JSON.parse(savedProgress));
        }

        const firstLesson = CURRICULUM[0];
        setCurrentLesson(firstLesson);

        // Disable Interactions for focus
        const preventDefault = (e: Event) => e.preventDefault();
        document.addEventListener('contextmenu', preventDefault);
        document.addEventListener('selectstart', preventDefault);

        return () => {
            document.removeEventListener('contextmenu', preventDefault);
            document.removeEventListener('selectstart', preventDefault);
        };
    }, []);

    const handleLessonComplete = (stats: any) => {
        const newStats = {
            ...userStats,
            lessonsCompleted: userStats.lessonsCompleted + 1,
            bestWPM: Math.max(userStats.bestWPM, stats.wpm)
        };
        setUserStats(newStats);
        localStorage.setItem('typingPro_progress', JSON.stringify(newStats));

        // Logic to move to next lesson
        const currentIndex = CURRICULUM.findIndex(l => l.id === currentLesson?.id);
        if (currentIndex < CURRICULUM.length - 1) {
            setCurrentLesson(CURRICULUM[currentIndex + 1]);
        }
    };

    return (
        <div className={`h-screen w-screen bg-[#050505] text-white flex flex-col overflow-hidden font-sans ${sidebarOpen ? 'sidebar-active' : ''}`}>
            {/* NEW TOPBAR */}
            <TopBar
                isSidebarOpen={sidebarOpen}
                onCurriculumToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Stats Overview (Quick reference) */}
            <div className="absolute top-24 right-10 z-10 pointer-events-none">
                <ProgressTracker
                    currentStage={userStats.stage}
                    lessonsCompleted={userStats.lessonsCompleted}
                    currentWPM={userStats.bestWPM}
                />
            </div>

            {/* Liquid Sidebar */}
            <aside className="liquid-sidebar p-10 flex flex-col pt-32">
                <h2 className="text-xl font-bold mb-8 liquid-text">Scientific Curriculum</h2>
                <div className="flex-1 overflow-y-auto space-y-6 pr-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(stage => (
                        <div key={stage} className="space-y-2">
                            <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-bold border-b border-white/5 pb-1">Stage {stage}</h3>
                            {getLessonsByStage(stage).map(lesson => (
                                <button
                                    key={lesson.id}
                                    onClick={() => {
                                        setCurrentLesson(lesson);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full text-left p-3 rounded-lg text-sm transition-all ${currentLesson?.id === lesson.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-white/40 hover:bg-white/5'}`}
                                >
                                    {lesson.title}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Experience */}
            <main className="flex-1 flex flex-col items-center justify-center px-10 pb-20 pt-20 overflow-y-auto">
                {currentLesson && (
                    <LessonEngine
                        lesson={currentLesson}
                        onComplete={handleLessonComplete}
                    />
                )}

                <div className="mt-20 flex gap-12 opacity-50">
                    <div className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/20">Refractive Surface v2.6.0</div>
                    <div className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/20">Engine Status: Ultra-Low Latency</div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
