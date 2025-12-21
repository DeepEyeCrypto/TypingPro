import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import TypingArea from '../components/TypingArea';
import VirtualKeyboard from '../components/VirtualKeyboard';
import KeyboardHandsOverlay from '../components/KeyboardHandsOverlay';
import LessonVideoPlayer from '../components/LessonVideoPlayer';
import { useApp } from '../contexts/AppContext';
import { HERO_CURRICULUM } from '../constants/curriculum';
import { CODE_SNIPPETS } from '../constants/codeSnippets';
import { RotateCcw, ChevronRight, Monitor } from 'lucide-react';
import { KeyStats, Lesson, Stats } from '../types';
import InstructionalOverlay from '../components/curriculum/InstructionalOverlay';
import { AnimatePresence } from 'framer-motion';
import PerformanceGraph from '../components/analytics/PerformanceGraph';

interface MainLayoutContext {
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TypingPage(): React.ReactNode {
    const {
        settings, recordLessonComplete,
        setActiveLessonId, recordKeyStats, isCodeMode, setIsSidebarCollapsed
    } = useApp();

    const { setIsSidebarOpen } = useOutletContext<MainLayoutContext>() || {};

    // --- Core State ---
    const [currentLessonId, setCurrentLessonId] = useState<number>(1);
    const [activeLesson, setActiveLesson] = useState<Lesson>(HERO_CURRICULUM[0]);
    const [retryCount, setRetryCount] = useState<number>(0);
    const [videoVisible, setVideoVisible] = useState<boolean>(false);
    const [showOverlay, setShowOverlay] = useState<boolean>(true);

    // --- Live Progress State ---
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [liveStats, setLiveStats] = useState<{
        wpm: number;
        accuracy: number;
        errors: number;
        progress: number;
        wpmTimeline: { timestamp: number; wpm: number }[];
    }>({ wpm: 0, accuracy: 100, errors: 0, progress: 0, wpmTimeline: [] });
    const [liveKeyStats] = useState<Record<string, KeyStats>>({});
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [expectedFinger, setExpectedFinger] = useState<string | null>(null);
    const [modalStats, setModalStats] = useState<(Stats & { completed: boolean }) | null>(null);
    const [combo, setCombo] = useState(0);

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
                keys: [],
                description: `Master ${snippet.language} syntax`
            };
        } else {
            lesson = HERO_CURRICULUM.find(l => l.id === id) || HERO_CURRICULUM[0];
        }

        if (lesson) {
            setActiveLesson(lesson);
            setCurrentLessonId(id);
            setActiveLessonId(id);
            setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0, wpmTimeline: [] });
            setRetryCount(0);
            setModalStats(null);
            setCombo(0);
            setShowOverlay(true); // Always show overlay for a new lesson
        }
    }, [setActiveLessonId]);

    useEffect(() => {
        // Sync with global activeLessonId if it changes from sidebar
        // (Simplified logic: we'll assume sidebar and local stay in sync via context)
    }, [currentLessonId]);

    useEffect(() => {
        initializeLesson(currentLessonId, isCodeMode);
    }, [isCodeMode, initializeLesson, currentLessonId]);

    const handleRetry = useCallback(() => {
        setModalStats(null);
        setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0, wpmTimeline: [] });
        setRetryCount(c => c + 1);
        setCombo(0);
        setShowOverlay(false); // Don't show overlay on manual retry
    }, []);

    const handleComplete = useCallback((stats: Stats) => {
        recordLessonComplete(activeLesson.id, stats);
        recordKeyStats(liveKeyStats);

        const minAcc = activeLesson.passingCriteria?.accuracy || 98;
        const passed = stats.accuracy >= minAcc;
        setModalStats({ ...stats, completed: passed });
    }, [activeLesson, recordLessonComplete, recordKeyStats, liveKeyStats]);

    const handleNext = useCallback(() => {
        const nextLesson = HERO_CURRICULUM.find(l => l.id > currentLessonId);
        if (nextLesson) {
            initializeLesson(nextLesson.id, isCodeMode);
        }
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
        const handleTutorialToggle = () => setVideoVisible(v => !v);

        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        window.addEventListener('toggle-tutorial', handleTutorialToggle);

        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
            window.removeEventListener('toggle-tutorial', handleTutorialToggle);
        };
    }, [handleRetry]);

    // Stats are now handled inside TypingArea or as minimal labels

    return (
        <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden">
            {/* Mobile/Tablet Warning Overlay */}
            <div className="md:hidden fixed inset-0 z-[500] bg-slate-900/90 backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-3xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-6 animate-pulse">
                    <Monitor size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Physical Keyboard Required</h3>
                <p className="text-white/40 max-w-xs mx-auto">TypingPro is designed for desktop excellence. Please use a physical keyboard for the best learning experience.</p>
            </div>

            <AnimatePresence>
                {showOverlay && !modalStats && (
                    <InstructionalOverlay
                        lesson={activeLesson}
                        onStart={() => setShowOverlay(false)}
                    />
                )}
            </AnimatePresence>

            <div className="flex-1 w-full max-w-[1200px] flex flex-col items-center justify-center relative overflow-hidden px-10">
                {/* 1. Lesson Context Tier */}
                <div className={`text-center mb-6 transition-all duration-700 ${liveStats.wpm > 0 ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100'}`}>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2">{activeLesson.title}</h1>
                    <p className="text-sm font-bold text-white/30 uppercase tracking-widest">{activeLesson.description}</p>
                </div>

                {/* 2. Primary Action Tier: Typing Card */}
                <div className="w-full relative z-10 transition-all duration-500 transform hover:scale-[1.01]">
                    <div className="glass-premium border-white/10 shadow-3xl relative overflow-hidden">
                        {/* Minimal Stats Header Inside Card */}
                        <div className="absolute top-6 left-10 right-10 flex items-center justify-between pointer-events-none z-20">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-white leading-none">{liveStats.wpm}</span>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">WPM</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-white leading-none">{liveStats.accuracy}%</span>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Accuracy</span>
                                </div>
                            </div>
                            {combo > 0 && (
                                <div className="px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 flex flex-col items-center animate-pulse">
                                    <span className="text-sm font-black text-sky-400">{combo}X</span>
                                    <span className="text-[8px] font-bold text-sky-400/40 uppercase">Combo</span>
                                </div>
                            )}
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-black text-white leading-none">{liveStats.progress}%</span>
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Progress</span>
                            </div>
                        </div>

                        <TypingArea
                            key={`${activeLesson.id}-${retryCount}-${isCodeMode}`}
                            content={activeLesson.content}
                            activeLessonId={activeLesson.id}
                            isActive={!modalStats && !showOverlay}
                            onComplete={handleComplete}
                            onRestart={handleRetry}
                            onStatsUpdate={(s) => {
                                setLiveStats(s as any);
                                if (s.wpm > 0) {
                                    setIsSidebarCollapsed(true);
                                }
                            }}
                            onActiveKeyChange={setActiveKey}
                            onFingerChange={setExpectedFinger}
                            onComboUpdate={setCombo}
                            fontFamily={settings.fontFamily}
                            fontSize={settings.fontSize}
                            soundEnabled={settings.soundEnabled}
                            cursorStyle={settings.cursorStyle}
                            stopOnError={settings.stopOnError}
                            trainingMode={settings.trainingMode}
                            lessonType={activeLesson.type}
                            isMasterMode={activeLesson.isMasterMode}
                        />
                    </div>
                </div>

                {/* 3. Secondary Feedback Tier: Keyboard & Graph */}
                <div className={`w-full mt-6 grid grid-cols-12 gap-6 transition-all duration-700 ${liveStats.wpm > 0 ? 'opacity-20 blur-[2px]' : 'opacity-60'}`}>
                    <div className="col-span-8">
                        <VirtualKeyboard
                            activeKey={activeKey}
                            pressedKeys={pressedKeys}
                            layout={settings.keyboardLayout}
                            heatmapStats={liveKeyStats}
                            expectedFinger={expectedFinger}
                            osLayout={settings.osLayout}
                        />
                    </div>
                    <div className="col-span-4 flex flex-col justify-end">
                        <PerformanceGraph data={liveStats.wpmTimeline} height={100} isLive={true} />
                        <button
                            onClick={handleRetry}
                            className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-black text-xs uppercase tracking-widest group"
                        >
                            <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                            <span>Retry Lesson [Alt + R]</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals & Overlays */}
            {modalStats && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/40 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="glass-card-modern p-10 sm:p-14 max-w-lg w-full text-center shadow-3xl border-white/40 dark:border-white/10">
                        <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-2xl ${modalStats.completed ? 'bg-sky-500 text-white' : 'bg-red-500 text-white'}`}>
                            <span className="text-4xl">{modalStats.completed ? '🏆' : '💪'}</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">{modalStats.completed ? 'Mastered!' : 'Keep Going!'}</h2>
                        <p className="text-slate-400 dark:text-white/30 mb-10 font-medium">Your persistence is the key to speed.</p>

                        <div className="grid grid-cols-3 gap-4 mb-12">
                            <div className="p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/10">
                                <div className="text-2xl font-black text-slate-800 dark:text-white">{modalStats.wpm}</div>
                                <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/30 font-bold mt-1">WPM</div>
                            </div>
                            <div className="p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/10">
                                <div className="text-2xl font-black text-slate-800 dark:text-white">{modalStats.accuracy}%</div>
                                <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/30 font-bold mt-1">Acc</div>
                            </div>
                            <div className="p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/10">
                                <div className="text-2xl font-black text-slate-800 dark:text-white">{modalStats.errors}</div>
                                <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/30 font-bold mt-1">Errors</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleRetry}
                                className="flex-1 py-4 px-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/10 text-slate-600 dark:text-white/60 font-bold flex items-center justify-center gap-2 hover:bg-white/70 dark:hover:bg-white/10 transition-all"
                            >
                                <RotateCcw size={18} /> Retry
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!modalStats.completed && !isCodeMode}
                                className={`flex-1 py-4 px-6 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 ${modalStats.completed || isCodeMode ? 'bg-sky-500 text-white hover:scale-105 hover:bg-sky-400' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}
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
