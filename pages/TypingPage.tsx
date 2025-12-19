import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import TypingArea from '../components/TypingArea';
import VirtualKeyboard from '../components/VirtualKeyboard';
import KeyboardHandsOverlay from '../components/KeyboardHandsOverlay';
import LessonVideoPlayer from '../components/LessonVideoPlayer';
import { StatsCard } from '../components/stats/StatsCard';
import { GoalsPanel } from '../components/stats/GoalsPanel';
import { useApp } from '../contexts/AppContext';
import { LESSONS } from '../constants';
import { CODE_SNIPPETS } from '../constants/codeSnippets';
import { Code, Type, RotateCcw, ChevronRight, BarChart3 } from 'lucide-react';
import { Stats, KeyStats, Lesson } from '../types';

interface MainLayoutContext {
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * TypingPage - Liquid Overhaul
 * Integrated with Adaptive Grid System
 */
export default function TypingPage(): React.ReactNode {
    const {
        currentProfile, settings, lessonProgress, recordLessonComplete,
        setActiveLessonId, recordKeyStats
    } = useApp();

    const { setIsSidebarOpen } = useOutletContext<MainLayoutContext>() || {};

    // --- Core State ---
    const [isCodeMode, setIsCodeMode] = useState<boolean>(false);
    const [currentLessonId, setCurrentLessonId] = useState<number>(1);
    const [activeLesson, setActiveLesson] = useState<Lesson>(LESSONS[0]);
    const [retryCount, setRetryCount] = useState<number>(0);
    const [videoVisible, setVideoVisible] = useState<boolean>(false);
    const [showMobileStats, setShowMobileStats] = useState(false);

    // --- Live Progress State ---
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [liveStats, setLiveStats] = useState({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
    const [liveKeyStats, setLiveKeyStats] = useState<Record<string, KeyStats>>({});
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [modalStats, setModalStats] = useState<(Stats & { completed: boolean }) | null>(null);

    // --- Handlers ---
    const initializeLesson = useCallback((id: number, codeMode: boolean) => {
        let lesson: Lesson | undefined;
        if (codeMode) {
            const index = Math.abs(id - 1) % CODE_SNIPPETS.length;
            const snippet = CODE_SNIPPETS[index];
            lesson = {
                id,
                title: `Code: ${snippet.language}`,
                content: snippet.content,
                newKeys: [],
                keys: [],
                description: `Master ${snippet.language} syntax`
            };
        } else {
            lesson = LESSONS.find(l => l.id === id) || LESSONS[0];
        }

        if (lesson) {
            setActiveLesson(lesson);
            setCurrentLessonId(id);
            setActiveLessonId(id);
            setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
            setLiveKeyStats({});
            setRetryCount(0);
            setModalStats(null);
        }
    }, [setActiveLessonId]);

    useEffect(() => {
        initializeLesson(currentLessonId, isCodeMode);
    }, [isCodeMode, initializeLesson, currentLessonId]);

    const handleRetry = useCallback(() => {
        setModalStats(null);
        setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
        setRetryCount(c => c + 1);
    }, []);

    const handleComplete = useCallback((stats: Stats) => {
        recordLessonComplete(activeLesson.id, stats);
        recordKeyStats(liveKeyStats);
        const passed = stats.accuracy >= (settings.trainingMode === 'accuracy' ? 98 : 90);
        setModalStats({ ...stats, completed: passed });
    }, [activeLesson.id, recordLessonComplete, recordKeyStats, liveKeyStats, settings.trainingMode]);

    const handleNext = useCallback(() => {
        const nextId = currentLessonId + 1;
        if (!isCodeMode && nextId > LESSONS.length) return;
        initializeLesson(nextId, isCodeMode);
    }, [currentLessonId, isCodeMode, initializeLesson]);

    useEffect(() => {
        const handleDown = (e: KeyboardEvent) => {
            setPressedKeys(prev => new Set(prev).add(e.key));
            if (e.altKey && e.code === 'KeyR') handleRetry();
        };
        const handleUp = (e: KeyboardEvent) => {
            setPressedKeys(prev => {
                const next = new Set(prev);
                next.delete(e.key);
                return next;
            });
        };
        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
        };
    }, [handleRetry]);

    const StatsSidebar = () => (
        <div className="flex flex-col gap-8 p-10 h-full overflow-y-auto">
            <GoalsPanel
                wpmGoal={settings.wpmGoal}
                accuracyGoal={settings.accuracyGoal}
                dailyProgress={75}
            />

            <div className="space-y-6">
                <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Live Performance</h3>
                <div className="grid grid-cols-1 gap-4">
                    <StatsCard label="WPM" value={liveStats.wpm} icon="wpm" />
                    <StatsCard label="Accuracy" value={`${liveStats.accuracy}%`} icon="accuracy" />
                    <StatsCard label="Progress" value={`${liveStats.progress}%`} icon="progress" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            {/* Context-aware Controls (Mobile Top Bar) */}
            <div className="p-4 flex items-center justify-between xl:absolute xl:top-6 xl:left-8 z-50 w-full xl:w-auto gap-4">
                <div className="flex p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
                    <button
                        onClick={() => setIsCodeMode(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${!isCodeMode ? 'bg-brand text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        <Type size={16} /> <span className="hidden sm:inline">Text</span>
                    </button>
                    <button
                        onClick={() => setIsCodeMode(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${isCodeMode ? 'bg-purple-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        <Code size={16} /> <span className="hidden sm:inline">Code</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {activeLesson.videoUrl && (
                        <button
                            onClick={() => setVideoVisible(true)}
                            className="px-4 py-2 glass-card rounded-xl text-xs font-bold text-white/60 hover:text-white transition-all sm:inline-flex hidden"
                        >
                            Watch Tutorial
                        </button>
                    )}
                    <button
                        onClick={() => setShowMobileStats(!showMobileStats)}
                        className="2xl:hidden p-2 glass-card rounded-xl text-white/60"
                        title="Toggle Stats"
                    >
                        <BarChart3 size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                {/* Main Typing Area Stage */}
                <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
                        <TypingArea
                            key={`${activeLesson.id}-${retryCount}-${isCodeMode}`}
                            content={activeLesson.content}
                            activeLessonId={activeLesson.id}
                            isActive={!modalStats}
                            onComplete={handleComplete}
                            onRestart={handleRetry}
                            onStatsUpdate={setLiveStats}
                            onKeyStatsUpdate={setLiveKeyStats}
                            onActiveKeyChange={setActiveKey}
                            fontFamily={settings.fontFamily}
                            fontSize={settings.fontSize}
                            soundEnabled={settings.soundEnabled}
                            cursorStyle={settings.cursorStyle}
                            stopOnError={settings.stopOnError}
                            trainingMode={settings.trainingMode}
                        />
                    </div>

                    {/* Footer: Multi-Size Responsive Keyboard Section */}
                    <div className="w-full flex-shrink-0 bg-black/20 backdrop-blur-3xl border-t border-white/5 py-8 md:py-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                        <div className="max-w-[1400px] mx-auto px-6 relative z-10 transition-all duration-700">
                            {/* Standard Keyboard */}
                            <div className="w-full transition-transform duration-500 origin-bottom">
                                <VirtualKeyboard
                                    activeKey={activeKey}
                                    pressedKeys={pressedKeys}
                                    layout={settings.keyboardLayout}
                                    heatmapStats={liveKeyStats}
                                />
                            </div>

                            {/* Optional Hands Overlay (Large screens only) */}
                            {settings.showHands && (
                                <div className="hidden md:block absolute inset-0 pointer-events-none opacity-40 hover:opacity-60 transition-opacity">
                                    <KeyboardHandsOverlay
                                        currentChar={activeKey}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel (Desktop only - 2xl breakpoint) */}
                <aside className="hidden 2xl:block w-96 border-l border-white/5 bg-white/2 backdrop-blur-3xl h-full overflow-y-auto">
                    <StatsSidebar />
                </aside>

                {/* Mobile/Tablet Stats Drawer */}
                {showMobileStats && (
                    <div className="fixed inset-0 z-[100] 2xl:hidden">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileStats(false)} />
                        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0d0d12] border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
                            <div className="flex justify-start p-4 border-b border-white/5">
                                <button onClick={() => setShowMobileStats(false)} className="text-white/40"><X /></button>
                            </div>
                            <StatsSidebar />
                        </div>
                    </div>
                )}
            </div>

            {/* Modals & Overlays */}
            {modalStats && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0a0a0f]/80 backdrop-blur-lg animate-in fade-in duration-300">
                    <div className="glass-panel p-8 sm:p-12 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] max-w-lg w-full text-center">
                        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto flex items-center justify-center mb-8 shadow-2xl ${modalStats.completed ? 'bg-brand' : 'bg-red-500'}`}>
                            <span className="text-3xl sm:text-4xl">{modalStats.completed ? '🏆' : '💪'}</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{modalStats.completed ? 'Mastered!' : 'Keep Going!'}</h2>
                        <p className="text-white/40 mb-8 font-medium">Your persistence is the key to speed.</p>

                        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 text-center">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                <div className="text-xl sm:text-2xl font-black text-white">{modalStats.wpm}</div>
                                <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold">WPM</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                <div className="text-xl sm:text-2xl font-black text-white">{modalStats.accuracy}%</div>
                                <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Accuracy</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                <div className="text-xl sm:text-2xl font-black text-white">{modalStats.errors}</div>
                                <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Errors</div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleRetry}
                                className="flex-1 py-4 glass-card text-white font-bold flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={18} /> Retry
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!modalStats.completed && !isCodeMode}
                                className={`flex-1 py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 ${modalStats.completed || isCodeMode ? 'bg-brand hover:scale-105 text-white' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                            >
                                Next <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {videoVisible && activeLesson.videoUrl && (
                <LessonVideoPlayer
                    hlsUrl={activeLesson.videoUrl}
                    onClose={() => setVideoVisible(false)}
                />
            )}
        </div>
    );
}

// Helper X component for closing the stats drawer
const X = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
