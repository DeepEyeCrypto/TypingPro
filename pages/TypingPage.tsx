import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import TypingArea from '../components/TypingArea';
import VirtualKeyboard from '../components/VirtualKeyboard';
import KeyboardHandsOverlay from '../components/KeyboardHandsOverlay';
import LessonVideoPlayer from '../components/LessonVideoPlayer';
import { useApp } from '../contexts/AppContext';
import { HERO_CURRICULUM } from '../constants/curriculum';
import { CODE_SNIPPETS } from '../constants/codeSnippets';
import { RotateCcw, ChevronRight, X } from 'lucide-react';
import { KeyStats, Lesson, Stats } from '../types';
import InstructionalOverlay from '../components/curriculum/InstructionalOverlay';
import { AnimatePresence } from 'framer-motion';

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
    const [liveStats, setLiveStats] = useState({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
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
            setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
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
        setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
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

    const StatsPills = () => (
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10 animate-ios-slide">
            <div className="px-6 py-3 rounded-[20px] bg-white dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-sm flex flex-col items-center min-w-[100px]">
                <span className="text-xl font-black text-slate-800 dark:text-white">{liveStats.wpm}</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">WPM</span>
            </div>
            <div className="px-6 py-3 rounded-[20px] bg-white dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-sm flex flex-col items-center min-w-[100px]">
                <span className="text-xl font-black text-slate-800 dark:text-white">{liveStats.accuracy}%</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Accuracy</span>
            </div>
            <div className="px-6 py-3 rounded-[20px] bg-white dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-sm flex flex-col items-center min-w-[100px]">
                <span className="text-xl font-black text-slate-800 dark:text-white">{liveStats.progress}%</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Progress</span>
            </div>
            {combo > 5 && (
                <div className="px-6 py-3 rounded-[20px] bg-sky-500/10 backdrop-blur-xl border border-sky-500/20 shadow-sm flex flex-col items-center min-w-[100px] animate-bounce">
                    <span className="text-xl font-black text-sky-500">{combo}</span>
                    <span className="text-[10px] font-bold text-sky-500/40 uppercase tracking-widest">COMBO</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden">
            <AnimatePresence>
                {showOverlay && !modalStats && (
                    <InstructionalOverlay
                        lesson={activeLesson}
                        onStart={() => setShowOverlay(false)}
                    />
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col items-center focus-container overflow-y-auto pt-16 scrollbar-hide">
                <StatsPills />

                <div className="text-center mb-8 animate-ios-slide" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">{activeLesson.title}</h2>
                    <p className="text-sm font-medium text-slate-400 dark:text-white/30 max-w-md mx-auto">{activeLesson.description}</p>
                </div>

                <div className="w-full glass-card-modern border-white/20 dark:border-white/10 shadow-2xl animate-ios-slide" style={{ animationDelay: '200ms' }}>
                    <TypingArea
                        key={`${activeLesson.id}-${retryCount}-${isCodeMode}`}
                        content={activeLesson.content}
                        activeLessonId={activeLesson.id}
                        isActive={!modalStats && !showOverlay}
                        onComplete={handleComplete}
                        onRestart={handleRetry}
                        onStatsUpdate={(s) => {
                            setLiveStats(s);
                            if (s.wpm > 0) {
                                setIsSidebarCollapsed(true);
                                if (setIsSidebarOpen) setIsSidebarOpen(false);
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

                <div className="mt-8 flex justify-center animate-ios-slide" style={{ animationDelay: '300ms' }}>
                    <button
                        onClick={handleRetry}
                        className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/10 text-slate-500 dark:text-white/40 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-white/50 dark:hover:bg-white/10 transition-all font-bold text-sm"
                    >
                        <RotateCcw size={16} /> <span>RETRY LESSON [ALT + R]</span>
                    </button>
                </div>

                <div className="w-full max-w-[1200px] mt-16 pb-12 animate-ios-slide" style={{ animationDelay: '400ms' }}>
                    <div className="w-full opacity-40 hover:opacity-100 transition-opacity duration-700">
                        <VirtualKeyboard
                            activeKey={activeKey}
                            pressedKeys={pressedKeys}
                            layout={settings.keyboardLayout}
                            heatmapStats={liveKeyStats}
                            expectedFinger={expectedFinger}
                        />
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
