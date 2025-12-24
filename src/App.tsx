import React, { useState, useEffect } from 'react';
import TypingEngine from './components/TypingEngine';
import { SCIENTIFIC_CURRICULUM } from './data/LessonData';
import './styles/LiquidGlass.css';

const App: React.FC = () => {
    const [currentLessonId, setCurrentLessonId] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Disable Interactions
        const preventDefault = (e: Event) => e.preventDefault();
        document.addEventListener('contextmenu', preventDefault);
        document.addEventListener('selectstart', preventDefault);

        // Auto-Focus Preservation
        const handleFocus = () => {
            const typingArea = document.getElementById('typing-input-handler');
            if (typingArea) (typingArea as HTMLInputElement).focus();
        };
        window.addEventListener('click', handleFocus);
        window.addEventListener('keydown', handleFocus);

        return () => {
            document.removeEventListener('contextmenu', preventDefault);
            document.removeEventListener('selectstart', preventDefault);
            window.removeEventListener('click', handleFocus);
            window.removeEventListener('keydown', handleFocus);
        };
    }, []);

    return (
        <div className={`h-screen w-screen bg-[#050505] text-white flex flex-col overflow-hidden font-sans ${sidebarOpen ? 'sidebar-active' : ''}`}>
            {/* SVG Filters for Liquid Glass Effect */}
            <svg className="filters-svg">
                <defs>
                    <filter id="liquid-refraction">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="2" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>

            {/* Liquid Sidebar */}
            <aside className="liquid-sidebar p-10 flex flex-col">
                <h2 className="text-xl font-bold mb-8 liquid-text">Curriculum</h2>
                <div className="flex-1 overflow-y-auto space-y-4 pr-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(stage => (
                        <div key={stage} className="space-y-2">
                            <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Stage {stage}</h3>
                            {SCIENTIFIC_CURRICULUM.filter(l => l.stage === stage).map(lesson => (
                                <button
                                    key={lesson.id}
                                    onClick={() => {
                                        setCurrentLessonId(lesson.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full text-left p-3 rounded-lg text-sm transition-all ${currentLessonId === lesson.id ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5'}`}
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
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="liquid-button"
                    >
                        {sidebarOpen ? 'Close Curriculum' : 'Scientific Curriculum'}
                    </button>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer" />
                </nav>
            </header>

            {/* Main Experience */}
            <main className="flex-1 flex flex-col items-center justify-center px-10 pb-20">
                <TypingEngine lessonId={currentLessonId} />

                <div className="mt-20 flex gap-12 opacity-0 hover:opacity-100 transition-opacity duration-700">
                    <div className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/10">Refractive Surface v2.6.0</div>
                    <div className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/10">Engine Status: Ultra-Low Latency</div>
                </div>
            </main>
        </div>
    );
};

export default App;
