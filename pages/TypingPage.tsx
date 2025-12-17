import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import TypingArea from '../components/TypingArea'; // We treat this as "TypingPanel"
import KeyboardHandsOverlay from '../components/KeyboardHandsOverlay';
import LessonVideoPlayer from '../components/LessonVideoPlayer';
import { StatsCard } from '../components/stats/StatsCard';
import { GoalsPanel } from '../components/stats/GoalsPanel';
import { useApp } from '../contexts/AppContext';
import { generateSmartLesson } from '../services/geminiService';
import { generateDrill } from '../services/drillService';
import { CODE_SNIPPETS } from '../constants/codeSnippets';
import { LESSONS } from '../constants'; // RESTORED
import { Loader2, Code, Type } from 'lucide-react'; // Added icons
import { Stats, KeyStats } from '../types';

interface MainLayoutContext {
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HLS_VIDEO_URL = "https://videos2.edclub.com/hls/196638853/3c53ad84-d876-4af8-ad8a-4140ab7bf929/index-1.m3u8";

export default function TypingPage() {
    const {
        currentProfile, settings, lessonProgress, recordLessonComplete,
        setActiveLessonId: setGlobalLessonId, recordKeyStats
    } = useApp();

    const { setIsSidebarOpen } = useOutletContext<MainLayoutContext>();
    const [videoVisible, setVideoVisible] = useState(false);

    // --- State ---
    const [currentLessonId, setCurrentLessonId] = useState(1);
    const [activeLesson, setActiveLesson] = useState(LESSONS[0]);
    const [retryCount, setRetryCount] = useState(0);

    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [modalStats, setModalStats] = useState<Stats | null>(null);
    const [liveStats, setLiveStats] = useState({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
    const [liveKeyStats, setLiveKeyStats] = useState<Record<string, KeyStats>>({}); // Heatmap stats
    const [isCodeMode, setIsCodeMode] = useState(false); // Code Mode Toggle
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    // --- Effects ---
    useEffect(() => {
        handleLessonSelect(currentLessonId, false);
        // We reset stats here effectively via handleLessonSelect
    }, [isCodeMode]); // Reload when mode toggles

    useEffect(() => {
        const savedId = localStorage.getItem(`last_lesson_${currentProfile.id}`);
        const id = savedId ? parseInt(savedId, 10) : 1;
        if (lessonProgress[id]?.unlocked || id === 1) {
            handleLessonSelect(id, false);
        } else {
            handleLessonSelect(1, false);
        }
    }, [currentProfile.id]);

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
        // In Code Mode, we don't strictly enforce unlocking for now, or we map IDs to snippets
        if (!isCodeMode && id > 0 && !progress?.unlocked && id !== 1) return;

        if (isCodeMode) {
            if (!CODE_SNIPPETS || CODE_SNIPPETS.length === 0) {
                console.error("Code Snippets missing!");
                return; // Prevent crash
            }
            // Map ID to code snippet (modulo length) - careful with 0 or negative
            // Ensure positive index
            const snippetIndex = Math.abs((id - 1)) % CODE_SNIPPETS.length;
            const snippet = CODE_SNIPPETS[snippetIndex];

            if (!snippet) {
                console.error("Snippet not found for index", snippetIndex);
                return;
            }

            const codeLesson = {
                id: id,
                title: `Code Snippet: ${snippet.language}`,
                content: snippet.content,
                newKeys: [],
                keys: [], // Added to satisfy Lesson interface
                description: `Practice ${snippet.language} syntax`
            };
            setCurrentLessonId(id);
            setGlobalLessonId(id);
            setActiveLesson(codeLesson);
            setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
            setLiveKeyStats({}); // Reset heatmap
            setRetryCount(0);
        } else {
            let lesson = LESSONS.find(l => l.id === id);
            if (lesson) {
                setCurrentLessonId(id);
                setGlobalLessonId(id);
                setActiveLesson(lesson);
                setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
                setLiveKeyStats({}); // Reset heatmap
                setRetryCount(0);
                if (save && id > 0) localStorage.setItem(`last_lesson_${currentProfile.id}`, id.toString());
            }
        }
    }, [lessonProgress, currentProfile.id, isCodeMode]); // Added isCodeMode dep

    const handleRetry = useCallback(() => {
        setModalStats(null);
        setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
        setRetryCount(c => c + 1);
    }, []);

    const handleComplete = useCallback((stats: Stats) => {
        recordLessonComplete(activeLesson.id, stats);
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
        }
    }, [currentLessonId, handleLessonSelect]);

    // Auto-trigger tutorial
    useEffect(() => {
        if (currentLessonId === 1) {
            const hasSeenIntro = sessionStorage.getItem(`seen_intro_hls_${currentProfile.id}`);
            if (!hasSeenIntro) {
                setVideoVisible(true);
                sessionStorage.setItem(`seen_intro_hls_${currentProfile.id}`, 'true');
            }
        }
    }, [currentLessonId, currentProfile.id]);

    return (
        <div className="flex-1 flex flex-col h-full bg-bg-surface overflow-hidden relative">
            {/* Loading Overlay */}
            {isLoadingAi && (
                <div className="absolute inset-0 z-50 bg-bg-surface/80 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
                    <Loader2 className="w-10 h-10 text-brand animate-spin" />
                    <p className="text-sm font-medium text-text-muted">Generating...</p>
                </div>
            )}



            {/* Main Grid Layout */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row relative w-full h-full">

                {/* Top Controls (Mode Toggle) */}
                <div className="absolute top-4 left-4 z-40 flex gap-2">
                    <button
                        onClick={() => {
                            const newMode = !isCodeMode;
                            setIsCodeMode(newMode);
                            // Trigger lesson reload/switch immediately
                            // We prefer to just toggle state and let effect or manual call handle? 
                            // handleLessonSelect uses the state, but we need to call it.
                            // But handleLessonSelect is callback. Let's force a reset or rely on effect?
                            // Effect for activeLesson handles content updates? No.
                            // Let's manually trigger select for current ID
                            // We need to wait for state to update? 
                            // Better: pass the new mode to a helper or just reload page logic?
                            // Simple: Reload current lesson ID with new mode assumption.
                            // We can't call handleLessonSelect immediately with new state visible unless we pass it.
                            // Let's use a useEffect on isCodeMode?
                        }}
                        className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                            ${!isCodeMode
                                ? 'bg-brand text-text-inverted shadow-lg shadow-brand/20'
                                : 'bg-bg-secondary text-text-muted hover:bg-bg-secondary/80'
                            }
                        `}
                    >
                        <Type className="w-3 h-3" /> Text
                    </button>
                    <button
                        onClick={() => setIsCodeMode(true)}
                        className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                            ${isCodeMode
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                : 'bg-bg-secondary text-text-muted hover:bg-bg-secondary/80'
                            }
                        `}
                    >
                        <Code className="w-3 h-3" /> Code
                    </button>
                </div>

                {/* Center Panel: Typing Area & Video Toggle */}
                <div className="flex-1 flex flex-col min-w-0 relative">
                    {!videoVisible && (
                        <div className="w-full flex justify-center pt-2">
                            <button
                                onClick={() => setVideoVisible(true)}
                                className="text-xs text-brand hover:text-brand-hover font-medium flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                            >
                                Show Tutorial Video
                            </button>
                        </div>
                    )}

                    {/* Typing Area Container */}
                    <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12 overflow-y-auto no-scrollbar">
                        <div className="w-full h-full flex flex-col">
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
                                onKeyStatsUpdate={setLiveKeyStats} // Pass live stats updater
                                onSessionStats={handleSessionStats}
                                fontFamily={settings.fontFamily}
                                fontSize={settings.fontSize || 'large'}
                                cursorStyle={settings.cursorStyle}
                                stopOnError={settings.stopOnError}
                                trainingMode={settings.trainingMode}
                                fontColor={settings.fontColor}
                                newKeys={activeLesson.newKeys}
                            />
                        </div>
                    </div>

                    {/* Bottom: Keyboard (Fixed) */}
                    {settings.showKeyboard && (
                        <div className="flex-shrink-0 w-full flex items-end justify-center pb-4 px-6 bg-bg-surface/90 backdrop-blur-md z-30 border-t border-border">
                            <div className="w-full max-w-5xl relative origin-bottom transition-transform duration-300 keyboard-scaler">
                                <KeyboardHandsOverlay
                                    currentChar={activeKey}
                                    heatmapStats={liveKeyStats} // Pass stats for heatmap
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Stats & Goals (Hidden on mobile maybe? Or stacked?) */}
                <div className="hidden lg:flex w-80 flex-col gap-6 p-8 border-l border-border bg-bg-secondary/30 overflow-y-auto">
                    <GoalsPanel
                        wpmGoal={settings.wpmGoal || 40}
                        accuracyGoal={settings.accuracyGoal || 95}
                        dailyProgress={75} // Mock progress for now
                    />

                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Live Metrics</h3>
                        <StatsCard label="WPM" value={liveStats.wpm} icon="wpm" />
                        <StatsCard label="Accuracy" value={`${liveStats.accuracy}%`} icon="accuracy" subtext={liveStats.errors > 0 ? `${liveStats.errors} err` : 'Perfect'} />
                        <StatsCard label="Progress" value={`${liveStats.progress}%`} icon="progress" />
                    </div>
                </div>

                {/* Mobile/Tablet Stats Bar (Visible when sidebar hidden) */}
                <div className="lg:hidden absolute top-4 right-4 flex flex-col gap-2 z-20 pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
                    <span className="font-mono text-xl font-bold text-text-muted">{liveStats.wpm} <span className="text-[10px]">WPM</span></span>
                    <span className="font-mono text-sm text-text-muted">{liveStats.accuracy}% <span className="text-[10px]">ACC</span></span>
                </div>

            </div>

            {/* Modal */}
            {modalStats && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="bg-bg-surface rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-border">
                        {/* Result Content... */}
                        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl ${modalStats.completed ? 'bg-status-success text-white' : 'bg-status-warning text-white'}`}>
                            {modalStats.completed ? <div className="text-4xl">🏆</div> : <div className="text-4xl">🔒</div>}
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary mb-2">
                            {modalStats.completed ? "Lesson Complete!" : "Keep Practicing"}
                        </h2>
                        {/* ... etc ... */}
                        <div className="grid grid-cols-3 gap-2 mb-6 mt-4">
                            <StatsCard label="WPM" value={modalStats.wpm} icon="wpm" />
                            <StatsCard label="ACC" value={`${modalStats.accuracy}%`} icon="accuracy" />
                            <StatsCard label="ERR" value={modalStats.errors} icon="errors" />
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleRetry} className="flex-1 py-3 bg-bg-secondary text-text-primary rounded-xl font-bold hover:bg-bg-secondary/80 transition-colors">
                                Retry
                            </button>
                            <button
                                onClick={handleNextLesson}
                                disabled={!modalStats.completed}
                                className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg transition-all ${modalStats.completed ? 'bg-brand hover:bg-brand-hover' : 'bg-text-muted cursor-not-allowed opacity-50'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Modal */}
            {videoVisible && (
                <LessonVideoPlayer
                    hlsUrl={HLS_VIDEO_URL}
                    onClose={() => setVideoVisible(false)}
                    autoPlay={true}
                />
            )}
        </div>
    );
}
