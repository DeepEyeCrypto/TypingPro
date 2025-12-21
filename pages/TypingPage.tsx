import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import TypingArea from '../components/TypingArea';
import VirtualKeyboard from '../components/VirtualKeyboard';
import { useApp } from '../contexts/AppContext';
import { HERO_CURRICULUM } from '../constants/curriculum';
import { CODE_SNIPPETS } from '../constants/codeSnippets';
import { RotateCcw, ChevronRight } from 'lucide-react';
import { Lesson, Stats } from '../types';
import InstructionalOverlay from '../components/curriculum/InstructionalOverlay';
import { AnimatePresence } from 'framer-motion';
import LessonDisplay from '../components/LessonDisplay';
import HandGuide from '../components/HandGuide';
import { AIInsightCard } from '../components/gamification/AIInsightCard';

interface MainLayoutContext {
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TypingPage(): React.ReactNode {
    const {
        settings, recordLessonComplete,
        setActiveLessonId, isCodeMode, setIsSidebarCollapsed,
        getWeaknessDrill
    } = useApp();

    const { setIsSidebarOpen } = useOutletContext<MainLayoutContext>() || {};

    // --- Core State ---
    const [currentLessonId, setCurrentLessonId] = useState<number>(1);
    const [activeLesson, setActiveLesson] = useState<Lesson>(HERO_CURRICULUM[0]);
    const [retryCount, setRetryCount] = useState<number>(0);
    const [showOverlay, setShowOverlay] = useState<boolean>(true);

    // --- Live Progress State ---
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [liveStats, setLiveStats] = useState<{
        wpm: number;
        accuracy: number;
        errors: number;
        progress: number;
        cursorIndex: number;
        errorIndices: number[];
    }>({ wpm: 0, accuracy: 100, errors: 0, progress: 0, cursorIndex: 0, errorIndices: [] });

    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [modalStats, setModalStats] = useState<(Stats & { completed: boolean }) | null>(null);

    const handleStartRemedial = useCallback(() => {
        const drill = getWeaknessDrill();
        if (drill) {
            setActiveLesson({
                id: -999, // Special ID for remedial
                title: drill.title,
                content: drill.content,
                keys: [],
                description: "Focused practice for your AI-identified weaknesses."
            });
            setShowOverlay(false);
            setModalStats(null);
            setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0, cursorIndex: 0, errorIndices: [] });
            setRetryCount(c => c + 1);
        }
    }, [getWeaknessDrill]);

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
            setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0, cursorIndex: 0, errorIndices: [] });
            setRetryCount(0);
            setModalStats(null);
            setShowOverlay(true);
        }
    }, [setActiveLessonId]);

    useEffect(() => {
        initializeLesson(currentLessonId, isCodeMode);
    }, [isCodeMode, initializeLesson, currentLessonId]);

    const handleRetry = useCallback(() => {
        setModalStats(null);
        setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0, cursorIndex: 0, errorIndices: [] });
        setRetryCount(c => c + 1);
        setShowOverlay(false);
    }, []);

    const handleComplete = useCallback((stats: Stats) => {
        recordLessonComplete(activeLesson.id, stats);
        setModalStats({ ...stats, completed: stats.accuracy >= 95 });
    }, [activeLesson, recordLessonComplete]);

    const handleNext = useCallback(() => {
        const nextLesson = HERO_CURRICULUM.find(l => l.id > currentLessonId);
        if (nextLesson) initializeLesson(nextLesson.id, isCodeMode);
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

    return (
        <div className="flex-1 w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#fafafa] dark:bg-[#020617] transition-colors duration-500">
            <AnimatePresence>
                {showOverlay && !modalStats && (
                    <InstructionalOverlay lesson={activeLesson} onStart={() => setShowOverlay(false)} />
                )}
            </AnimatePresence>

            <div className="w-full max-w-[1000px] flex flex-col items-center px-6">
                {/* 1. Header */}
                <div className={`text-center mb-4 transition-all duration-700 ${liveStats.cursorIndex > 0 ? 'opacity-20 translate-y-[-10px]' : 'opacity-100'}`}>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{activeLesson.title}</h1>
                    <p className="text-xs font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">{activeLesson.description}</p>
                </div>

                {/* 2. Character Boxes */}
                <div className="w-full z-20">
                    <LessonDisplay
                        content={activeLesson.content}
                        cursorIndex={liveStats.cursorIndex}
                        errors={liveStats.errorIndices}
                    />
                </div>

                {/* Engine (Hidden) */}
                <div className="hidden">
                    <TypingArea
                        key={`${activeLesson.id}-${retryCount}`}
                        content={activeLesson.content}
                        activeLessonId={activeLesson.id}
                        isActive={!modalStats && !showOverlay}
                        onComplete={handleComplete}
                        onRestart={handleRetry}
                        onStatsUpdate={(s) => setLiveStats(prev => ({
                            ...prev,
                            ...s,
                            cursorIndex: Math.floor(s.progress * activeLesson.content.length / 100)
                        }))}
                        onActiveKeyChange={setActiveKey}
                        fontFamily={settings.fontFamily}
                        fontSize={settings.fontSize}
                        soundEnabled={settings.soundEnabled}
                        cursorStyle={settings.cursorStyle}
                        stopOnError={settings.stopOnError}
                        trainingMode={settings.trainingMode}
                    />
                </div>

                {/* 3. Hands & Keyboard */}
                <div className={`w-full relative flex flex-col items-center transition-all duration-700 ${liveStats.cursorIndex > 0 ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                    <div className="absolute top-[-100px] z-30">
                        <HandGuide activeKey={activeKey} />
                    </div>

                    <div className="w-full opacity-60 hover:opacity-100 transition-opacity duration-500">
                        <VirtualKeyboard
                            activeKey={activeKey}
                            pressedKeys={pressedKeys}
                            layout={settings.keyboardLayout}
                            osLayout={settings.osLayout}
                        />
                    </div>
                </div>

                {/* 4. Actions */}
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={handleRetry}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-white/40 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-white dark:hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
                    >
                        <RotateCcw size={14} /> <span>Retry [Alt+R]</span>
                    </button>
                    {modalStats?.completed && (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 transition-all font-bold text-xs uppercase tracking-widest"
                        >
                            <span>Next Lesson</span> <ChevronRight size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Modal */}
            {modalStats && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[32px] max-w-xl w-full text-center shadow-2xl border border-white/20 my-8">
                        <div className="text-4xl mb-4">{modalStats.completed ? '🏆' : '💪'}</div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">{modalStats.completed ? 'Mastered!' : 'Keep Practicing!'}</h2>

                        <div className="flex justify-center gap-6 my-6">
                            <div>
                                <div className="text-2xl font-black text-sky-500">{modalStats.wpm}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WPM</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-emerald-500">{modalStats.accuracy}%</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ACC</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-rose-500">{modalStats.errors}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ERRORS</div>
                            </div>
                        </div>

                        {modalStats.aiInsights && (
                            <AIInsightCard
                                insights={modalStats.aiInsights}
                                onStartDrill={handleStartRemedial}
                            />
                        )}

                        <div className="flex gap-4 mt-8">
                            <button onClick={handleRetry} className="flex-1 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl font-bold text-slate-600 dark:text-white/60">Retry</button>
                            {modalStats.completed && (
                                <button onClick={handleNext} className="flex-1 py-4 bg-sky-500 text-white rounded-2xl font-bold shadow-lg shadow-sky-500/20">Continue</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
