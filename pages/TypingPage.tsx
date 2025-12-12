import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import TypingArea from '../components/TypingArea';
import VirtualKeyboard from '../components/VirtualKeyboard';
import StatsBar from '../components/StatsBar';
import ErrorHeatmap from '../components/ErrorHeatmap';
import DailyGoalsWidget from '../components/DailyGoalsWidget';
import { useApp } from '../contexts/AppContext';
import { generateSmartLesson } from '../services/geminiService';
import { generateDrill } from '../services/drillService';
import { LESSONS, BADGES } from '../constants';
import { Trophy, Lock, Loader2, Zap } from 'lucide-react';
import { Lesson, Stats, KeyStats } from '../types';

interface MainLayoutContext {
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOpenTutorials: (videoId?: number) => void;
}

export default function TypingPage() {
    const {
        currentProfile, settings, lessonProgress, recordLessonComplete, toggleSidebar,
        setActiveLessonId: setGlobalLessonId, keyStats, recordKeyStats, dailyGoals
    } = useApp();

    const { setIsSidebarOpen, onOpenTutorials } = useOutletContext<MainLayoutContext>();

    // Track if tutorial has been shown for this session/mount
    const [tutorialShown, setTutorialShown] = useState(false);

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
    }, [activeLesson, currentLessonId]);

    // --- Handlers ---

    const handleLessonSelect = useCallback((id: number, save = true) => {
        const progress = lessonProgress[id];
        // Allow selecting unlocked lessons OR lesson 1 always OR special lessons (-1)
        if (id > 0 && !progress?.unlocked && id !== 1) return;

        let lesson = LESSONS.find(l => l.id === id);

        // Handle Drill/Smart Lessons if ID is special (though usually we pass object directly for those)

        if (lesson) {
            setCurrentLessonId(id);
            setGlobalLessonId(id);
            setActiveLesson(lesson);
            setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
            setRetryCount(0);
            if (save && id > 0) localStorage.setItem(`last_lesson_${currentProfile.id}`, id.toString());
        }
    }, [lessonProgress, currentProfile.id]);

    const handleRetry = useCallback(() => {
        setModalStats(null);
        setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
        setRetryCount(c => c + 1);
    }, []);

    const handleComplete = useCallback((stats: Stats) => {
        const unlockedNext = recordLessonComplete(activeLesson.id, stats);

        // Adjust criteria based on mode
        const thresholdAcc = settings.trainingMode === 'accuracy' ? 98 : 90;
        const passedCriteria = stats.accuracy >= thresholdAcc && stats.wpm >= 15;
        setModalStats({ ...stats, completed: passedCriteria });
    }, [activeLesson.id, recordLessonComplete, settings.trainingMode]);

    const handleSessionStats = useCallback((sessionStats: Record<string, KeyStats>) => {
        recordKeyStats(sessionStats);
    }, [recordKeyStats]);

    const handleNextLesson = useCallback(() => {
        setModalStats(null);
        if (currentLessonId > 0 && currentLessonId < LESSONS.length) {
            handleLessonSelect(currentLessonId + 1);
        } else if (currentLessonId === -1) {
            // If finishing a drill, go back to last regular lesson? or generate new drill?
            // For now, go back to lesson 1 or saved lesson
            const savedId = localStorage.getItem(`last_lesson_${currentProfile.id}`);
            handleLessonSelect(savedId ? parseInt(savedId) : 1);
        }
    }, [currentLessonId, handleLessonSelect, currentProfile.id]);

    const handleSmartLesson = async () => {
        setIsLoadingAi(true);
        const lesson = await generateSmartLesson(['f', 'j', 'd', 'k', 's', 'l'], 'medium');
        setIsLoadingAi(false);

        if (lesson) {
            setActiveLesson(lesson);
            setCurrentLessonId(999);
            setRetryCount(0);
        }
    };

    const handleStartDrill = () => {
        const drillLesson = generateDrill(keyStats);
        setActiveLesson(drillLesson);
        setCurrentLessonId(-1); // Special ID for drill
        setRetryCount(0);
        setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
    };

    // Auto-trigger tutorial for Lesson 1
    useEffect(() => {
        if (currentLessonId === 1 && !tutorialShown) {
            const hasSeenIntro = sessionStorage.getItem(`seen_intro_${currentProfile.id}`);
            if (!hasSeenIntro) {
                setTimeout(() => {
                    onOpenTutorials(1);
                    setTutorialShown(true);
                    sessionStorage.setItem(`seen_intro_${currentProfile.id}`, 'true');
                }, 500);
            }
        }
    }, [currentLessonId, tutorialShown, onOpenTutorials, currentProfile.id]);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#FAFAFA] dark:bg-[#0B1120] relative max-w-7xl mx-auto w-full shadow-sm rounded-lg overflow-hidden">
            {/* Loading Overlay */}
            {isLoadingAi && (
                <div className="absolute inset-0 z-50 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
                    <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
                    <p className="text-sm font-medium text-gray-500">Generating Personal Lesson...</p>
                </div>
            )}

            {/* Main Center Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full px-4 md:px-8 py-2 overflow-y-auto no-scrollbar">
                <div className="w-full max-w-5xl flex flex-col gap-4 md:gap-6">

                    {/* Header Section */}
                    <div className="text-center space-y-2 relative">
                        {/* Drill Button (Conditional) */}
                        {currentLessonId > 0 && Object.keys(keyStats).length > 3 && (
                            <button
                                onClick={handleStartDrill}
                                className="absolute right-0 top-0 text-xs flex items-center gap-1 text-orange-600 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-full font-bold transition-colors"
                                title="Practice your weakest keys"
                            >
                                <Zap className="w-3 h-3" /> Practice Weak Keys
                            </button>
                        )}

                        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight opacity-90">{activeLesson.title}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">{activeLesson.description}</p>
                    </div>

                    {/* Typing Area */}
                    <div className="w-full relative">
                        <TypingArea
                            key={`${activeLesson.id}-${currentProfile.id}-${retryCount}`}
                            content={activeLesson.content}
                            activeLessonId={activeLesson.id}
                            isActive={!modalStats}
                            soundEnabled={settings.soundEnabled}
                            onComplete={handleComplete}
                            onRestart={handleRetry}
                            onActiveKeyChange={setActiveKey}
                            onStatsUpdate={setLiveStats}
                            onSessionStats={handleSessionStats}
                            fontFamily={settings.fontFamily}
                            fontSize={settings.fontSize}
                            cursorStyle={settings.cursorStyle}
                            stopOnError={settings.stopOnError}
                            trainingMode={settings.trainingMode}
                            newKeys={activeLesson.newKeys}
                        />
                    </div>

                    {/* Stats & Keyboard Section */}
                    <div className="flex flex-col gap-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <StatsBar wpm={liveStats.wpm} accuracy={liveStats.accuracy} errors={liveStats.errors} />
                            <DailyGoalsWidget goals={dailyGoals} />
                        </div>

                        {/* Error Heatmap */}
                        {Object.keys(keyStats).length > 0 && activeLesson.id !== -1 && (
                            <div className="self-center">
                                <ErrorHeatmap keyStats={keyStats} />
                            </div>
                        )}

                        {settings.showKeyboard && (
                            <div className="w-full h-auto min-h-[140px] md:min-h-[180px] lg:h-56 transition-all duration-300">
                                <VirtualKeyboard
                                    activeKey={activeKey}
                                    pressedKeys={pressedKeys}
                                    layout={settings.keyboardLayout}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Completion Result Modal */}
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
                            {modalStats.completed ? "Excellent work! You've mastered this lesson." : `Aim for ${settings.trainingMode === 'accuracy' ? '98' : '90'}% accuracy.`}
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
