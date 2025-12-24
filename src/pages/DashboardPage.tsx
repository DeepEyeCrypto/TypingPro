import React, { useState, useEffect } from 'react';
import { CURRICULUM, getLessonsByStage, Lesson } from '../data/CurriculumDatabase';
import LessonEngine from '../components/LessonEngine';
import ProgressTracker from '../components/ProgressTracker';
import '../styles/LiquidGlass.css';

export const DashboardPage: React.FC = () => {
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userStats, setUserStats] = useState({
        stage: 1,
        lessonsCompleted: 0,
        bestWPM: 0
    });

    useEffect(() => {
        // Load initial lesson
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
        console.log('Lesson Complete:', stats);
        setUserStats(prev => ({
            ...prev,
            lessonsCompleted: prev.lessonsCompleted + 1,
            bestWPM: Math.max(prev.bestWPM, stats.wpm)
        }));

        // Logic to move to next lesson
        const currentIndex = CURRICULUM.findIndex(l => l.id === currentLesson?.id);
        if (currentIndex < CURRICULUM.length - 1) {
            setCurrentLesson(CURRICULUM[currentIndex + 1]);
        }
    };

    return (
        <div className={`h-screen w-screen bg-[#050505] text-white flex flex-col overflow-hidden font-sans ${sidebarOpen ? 'sidebar-active' : ''}`}>
            {/* Liquid Sidebar */}
            <aside className="liquid-sidebar p-10 flex flex-col">
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

            {/* Header */}
            <header className="p-10 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl text-black font-black text-xl shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                        T
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight liquid-text">TypingPro</h1>
                    </div>
                </div>

                <nav className="flex items-center gap-6">
                    <ProgressTracker
                        currentStage={userStats.stage}
                        lessonsCompleted={userStats.lessonsCompleted}
                        currentWPM={userStats.bestWPM}
                    />
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="liquid-button"
                    >
                        {sidebarOpen ? 'Close' : 'Curriculum'}
                    </button>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer flex items-center justify-center">
                        <span className="text-xs">User</span>
                    </div>
                </nav>
            </header>

            {/* Main Experience */}
            <main className="flex-1 flex flex-col items-center justify-center px-10 pb-20 overflow-y-auto">
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
