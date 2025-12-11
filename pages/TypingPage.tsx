import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import TypingArea from '../components/TypingArea';
import VirtualKeyboard from '../components/VirtualKeyboard';
import { useApp } from '../contexts/AppContext';
import { generateSmartLesson } from '../services/geminiService';
import { LESSONS, BADGES } from '../constants';
import { Trophy, Lock, Loader2 } from 'lucide-react';
import { Lesson, Stats } from '../types';
// Note: We need to import the Modal implementation or code it here. 
// In App.tsx it was inline. I will extract the "LessonCompleteModal" to a component if possible, or inline it for now to save time/complexity.
// I'll inline the "Lesson Complete" modal logic (which was 'modalStats') for now, or better, extract it.
// Let's keep it inline to match previous behavior but cleaner.

export default function TypingPage() {
    const {
        currentProfile, settings, lessonProgress, recordLessonComplete, toggleSidebar,
        setActiveLessonId: setGlobalLessonId
    } = useApp();

    // We can pull setSidebar from Outlet context if we really need it, or add to AppContext.
    // In MainLayout we passed it to Outlet context.
    const { setIsSidebarOpen } = useOutletContext<{ setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }>() || { setIsSidebarOpen: () => { } };

    // --- State ---
    const [currentLessonId, setCurrentLessonId] = useState(1);
    const [activeLesson, setActiveLesson] = useState(LESSONS[0]);
    const [retryCount, setRetryCount] = useState(0);

    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [modalStats, setModalStats] = useState<Stats | null>(null);
    const [liveStats, setLiveStats] = useState({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    // --- Effects ---

    // Restore last lesson on mount or profile change
    useEffect(() => {
        const savedId = localStorage.getItem(`last_lesson_${currentProfile.id}`);
        const id = savedId ? parseInt(savedId, 10) : 1;
        // Verify unlocked
        if (lessonProgress[id]?.unlocked || id === 1) {
            handleLessonSelect(id, false);
        } else {
            handleLessonSelect(1, false);
        }
    }, [currentProfile.id]);

    // Keyboard Listeners
    useEffect(() => {
        const handleDown = (e: KeyboardEvent) => {
            setPressedKeys(prev => new Set(prev).add(e.key));

            if (e.altKey) {
                if (e.code === 'KeyN') handleNextLesson();
                if (e.code === 'KeyR') handleRetry();
                if (e.code === 'KeyB') setIsSidebarOpen(prev => !prev);
            }
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
    }, [activeLesson, currentLessonId]); // Re-bind if lesson changes? Actually only deps needed for handlers

    // --- Handlers ---

    const handleLessonSelect = useCallback((id: number, save = true) => {
        const progress = lessonProgress[id];
        // Allow selecting unlocked lessons OR lesson 1 always
        if (!progress?.unlocked && id !== 1 && id !== 999) return;

        const lesson = LESSONS.find(l => l.id === id);
        if (lesson) {
            setCurrentLessonId(id);
            setGlobalLessonId(id); // Keep global state in sync for Header
            setActiveLesson(lesson);
            setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
            setRetryCount(0);
            if (save) localStorage.setItem(`last_lesson_${currentProfile.id}`, id.toString());
        }
    }, [lessonProgress, currentProfile.id]);

    const handleRetry = () => {
        setModalStats(null);
        setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
        setRetryCount(c => c + 1);
    };

    const handleComplete = (stats: Stats) => {
        const unlockedNext = recordLessonComplete(activeLesson.id, stats);

        const passedCriteria = stats.accuracy === 100 && stats.wpm >= 22;
        setModalStats({ ...stats, completed: passedCriteria });
    };

    const handleNextLesson = () => {
        setModalStats(null);
        if (currentLessonId < LESSONS.length) {
            handleLessonSelect(currentLessonId + 1);
        }
    };

    const handleSmartLesson = async () => {
        setIsLoadingAi(true);
        // Generate based on some hardcoded keys for now, or analyze history (future improvement)
        const lesson = await generateSmartLesson(['f', 'j', 'd', 'k', 's', 'l'], 'medium'); // This service needs to be robust
        setIsLoadingAi(false);

        if (lesson) {
            setActiveLesson(lesson);
            setCurrentLessonId(999);
            setRetryCount(0);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#FAFAFA] dark:bg-[#0B1120] relative max-w-7xl mx-auto w-full shadow-sm rounded-lg my-2 overflow-hidden">
            {/* Loading Overlay */}
            {isLoadingAi && (
                <div className="absolute inset-0 z-50 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
                    <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
                    <p className="text-sm font-medium text-gray-500">Generating Personal Lesson...</p>
                </div>
            )}

            {/* Lesson Title */}
            <div className="text-center py-6 px-4">
                <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight mb-2 opacity-90">{activeLesson.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">{activeLesson.description}</p>
            </div>

            {/* Typing Area */}
            <div className="flex-1 flex items-center justify-center w-full px-8 pb-8">
                <div className="w-full max-w-4xl relative">
                    <TypingArea
                        key={`${activeLesson.id}-${currentProfile.id}-${retryCount}`}
                        content={activeLesson.content}
                        activeLessonId={activeLesson.id}
                        isActive={!modalStats}
                        soundEnabled={settings.soundEnabled}
                        onComplete={handleComplete}
                        onRestart={handleRetry} // Restart just resets
                        onActiveKeyChange={setActiveKey}
                        onStatsUpdate={setLiveStats}
                        fontFamily={settings.fontFamily}
                        fontSize={settings.fontSize}
                        cursorStyle={settings.cursorStyle}
                        stopOnError={settings.stopOnError}
                    />
                </div>
            </div>

            {/* Footer / Stats / Keyboard */}
            <div className="bg-white/80 dark:bg-[#111827]/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">
                    {/* Live Stats Row */}
                    <div className="flex items-center justify-center gap-16">
                        <div className="text-center transform transition-transform hover:scale-105">
                            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">WPM</div>
                            <div className="font-mono text-3xl font-black text-brand-dark dark:text-blue-400">{liveStats.wpm}</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="text-center transform transition-transform hover:scale-105">
                            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Accuracy</div>
                            <div className={`font-mono text-3xl font-black ${liveStats.accuracy === 100 ? 'text-green-500' : 'text-orange-500'}`}>
                                {liveStats.accuracy}%
                            </div>
                        </div>
                        <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="text-center transform transition-transform hover:scale-105">
                            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Errors</div>
                            <div className={`font-mono text-3xl font-black ${liveStats.errors === 0 ? 'text-gray-400' : 'text-red-500'}`}>
                                {liveStats.errors}
                            </div>
                        </div>
                    </div>

                    {/* Keyboard */}
                    {settings.showKeyboard && (
                        <div className="w-full h-48 lg:h-56 transition-all duration-300">
                            <VirtualKeyboard
                                activeKey={activeKey}
                                pressedKeys={pressedKeys}
                                layout={settings.keyboardLayout}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Completion Result Modal (Inline for now) */}
            {modalStats && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100 dark:border-gray-700">
                        {/* Icon */}
                        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl ${modalStats.completed ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'}`}>
                            {modalStats.completed ? <div className="w-10 h-10 text-white font-bold text-3xl">🏆</div> : <div className="w-10 h-10">🔒</div>}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {modalStats.completed ? "Lesson Complete!" : "Keep Practicing"}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            {modalStats.completed ? "Excellent work! You've mastered this lesson." : "Aim for 100% accuracy and 22 WPM."}
                        </p>

                        <div className="grid grid-cols-3 gap-2 mb-6">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <div className="font-bold text-xl text-gray-800 dark:text-white">{modalStats.wpm}</div>
                                <div className="text-[10px] uppercase text-gray-400 font-bold">WPM</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <div className="font-bold text-xl text-gray-800 dark:text-white">{modalStats.accuracy}%</div>
                                <div className="text-[10px] uppercase text-gray-400 font-bold">Acc</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <div className="font-bold text-xl text-gray-800 dark:text-white">{modalStats.errors}</div>
                                <div className="text-[10px] uppercase text-gray-400 font-bold">Err</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleRetry} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                Retry
                            </button>
                            <button
                                onClick={handleNextLesson}
                                disabled={!modalStats.completed}
                                className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg transition-all ${modalStats.completed ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
