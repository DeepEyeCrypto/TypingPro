import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import TypingArea from '../components/TypingArea';
import VirtualKeyboard from '../components/VirtualKeyboard';
import { useApp } from '../contexts/AppContext';
import { HERO_CURRICULUM } from '../constants/curriculum';
import { CODE_SNIPPETS } from '../constants/codeSnippets';
import { RotateCcw, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import InstructionalOverlay from '../components/curriculum/InstructionalOverlay';
import { Target, Activity, Music, Zap, Clock, Type as TypeIcon } from 'lucide-react';
import { ModeSelector } from '../components/training/ModeSelector';
import { Lesson, Stats, PracticeMode, ModeConfig } from '../types';
import { AppShell } from '../components/layout/AppShell';
import { PracticeEngine } from '../src/engines/typing/PracticeEngine';
import { ZenHeader } from '../components/layout/ZenHeader';
import Sidebar from '../components/Sidebar';
import { ZenStats } from '../components/layout/ZenStats';
import { FocusMode } from '../components/typing/FocusMode';
import { useWeaknessDetection } from '../src/hooks/useWeaknessDetection';
import { useAICoaching } from '../src/hooks/useAICoaching';
import { useGamification } from '../src/hooks/useGamification';
import { AdaptiveEngine } from '../src/utils/AdaptiveEngine';
import { AICoachRecommendation } from '../types';

interface MainLayoutContext {
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TypingPage(): React.ReactNode {
    const {
        settings, recordLessonComplete,
        setActiveLessonId, isCodeMode, setIsSidebarCollapsed, isSidebarCollapsed,
        getWeaknessDrill,
        isAccuracyMasterActive, setIsAccuracyMasterActive,
        isMetronomeActive, setIsMetronomeActive,
        metronomeBpm, setMetronomeBpm,
        userProfile, setUserProfile
    } = useApp();

    const { analyzeSession, identifyEnemyKeys, identifyBottlenecks } = useWeaknessDetection();
    const { generateRecommendation } = useAICoaching();
    const { calculateXP, processLevelUp } = useGamification();

    const { setIsSidebarOpen } = useOutletContext<MainLayoutContext>() || {};

    // --- Core State ---
    const [currentLessonId, setCurrentLessonId] = useState<number>(1);
    const [activeLesson, setActiveLesson] = useState<Lesson>(HERO_CURRICULUM[0]);
    const [retryCount, setRetryCount] = useState<number>(0);
    const [showOverlay, setShowOverlay] = useState<boolean>(true);

    const [modeConfig, setModeConfig] = useState<ModeConfig>({
        mode: 'curriculum',
        duration: 60,
        wordCount: 50,
        wordPool: 'top200'
    });
    const [customTextInput, setCustomTextInput] = useState("");

    // --- Live Progress State ---
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [liveStats, setLiveStats] = useState<{
        wpm: number;
        accuracy: number;
        errors: number;
        progress: number;
        cursorIndex: number;
        errorIndices: number[];
        timeLeft?: number;
        wpmTimeline?: { timestamp: number; wpm: number }[];
        aiInsights?: {
            enemyKeys: { char: string; avgLatency: number }[];
            bottlenecks: { pair: string; avgLat: number }[];
        };
        recommendation?: AICoachRecommendation;
    }>({ wpm: 0, accuracy: 100, errors: 0, progress: 0, cursorIndex: 0, errorIndices: [], timeLeft: 60, wpmTimeline: [] });

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
        if (modeConfig.mode === 'curriculum') {
            initializeLesson(currentLessonId, isCodeMode);
        } else {
            const content = PracticeEngine.generateContent(modeConfig, HERO_CURRICULUM);
            if (content) {
                setActiveLesson({
                    id: -1,
                    title: modeConfig.mode.charAt(0).toUpperCase() + modeConfig.mode.slice(1),
                    content,
                    description: `Training: ${modeConfig.mode} mode`,
                    keys: []
                });
                setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0, cursorIndex: 0, errorIndices: [] });
                setRetryCount(c => c + 1);
                setShowOverlay(false);
            }
        }
    }, [modeConfig, isCodeMode, initializeLesson, currentLessonId]);

    const handleRetry = useCallback(() => {
        setModalStats(null);
        setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0, cursorIndex: 0, errorIndices: [] });
        setRetryCount(c => c + 1);
        setShowOverlay(false);
    }, []);

    const handleComplete = useCallback((stats: Stats) => {
        // 1. Analyze session
        const heatmap = analyzeSession(stats.keystrokeLog || []);
        const enemyKeys = identifyEnemyKeys(heatmap);
        const bottlenecks = identifyBottlenecks(stats.keystrokeLog || []);

        // 2. AI Coaching
        const recommendation = generateRecommendation(stats, heatmap, enemyKeys, bottlenecks);

        // 3. Gamification
        const xpGained = calculateXP(stats);
        if (userProfile) {
            const updatedProfile = processLevelUp(userProfile, xpGained);
            setUserProfile(updatedProfile);
        }

        const enrichedStats: Stats & { completed: boolean } = {
            ...stats,
            completed: stats.accuracy >= 95,
            aiInsights: {
                enemyKeys: enemyKeys.map(k => ({ char: k.char, avgLatency: k.avgLatency })),
                bottlenecks
            },
            recommendation
        };

        recordLessonComplete(activeLesson.id, enrichedStats);
        setModalStats(enrichedStats);
        setLiveStats(prev => ({
            ...prev,
            aiInsights: enrichedStats.aiInsights,
            recommendation,
            wpmTimeline: stats.wpmTimeline
        }));
    }, [activeLesson, recordLessonComplete, analyzeSession, identifyEnemyKeys, identifyBottlenecks, generateRecommendation, calculateXP, processLevelUp, userProfile, setUserProfile]);

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
        <AppShell
            header={<ZenHeader />}
            sidebar={<Sidebar />}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={setIsSidebarCollapsed}
            isFocused={liveStats.cursorIndex > 0 && !modalStats}
            footer={
                <ZenStats
                    isTyping={liveStats.cursorIndex > 0 && !modalStats}
                    isComplete={!!modalStats}
                    stats={{
                        wpm: liveStats.wpm,
                        accuracy: liveStats.accuracy,
                        errors: liveStats.errors,
                        timeLeft: liveStats.timeLeft,
                        aiInsights: liveStats.aiInsights,
                        recommendation: liveStats.recommendation,
                        wpmTimeline: modalStats ? modalStats.wpmTimeline : liveStats.wpmTimeline
                    }}
                    onRestart={handleRetry}
                    onNext={modalStats?.completed ? handleNext : undefined}
                />
            }
        >
            <div className="flex flex-col items-center w-full">
                {/* 1. Mode Selector (Only if not typing and not complete) */}
                <AnimatePresence>
                    {liveStats.cursorIndex === 0 && !modalStats && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-16"
                        >
                            <ModeSelector config={modeConfig} onChange={setModeConfig} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 2. Custom Text Input (If needed) */}
                {modeConfig.mode === 'custom' && !modeConfig.customText && !modalStats && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl bg-white/5 backdrop-blur-3xl border border-white/5 p-8 rounded-[32px] mb-8 animate-in zoom-in-95 duration-500"
                    >
                        <h3 className="text-lg font-black text-[var(--main)] mb-4 uppercase tracking-widest opacity-40">Custom Practice</h3>
                        <textarea
                            value={customTextInput}
                            onChange={(e) => setCustomTextInput(e.target.value)}
                            placeholder="Paste your text here..."
                            className="w-full h-40 bg-black/20 border border-white/5 rounded-2xl p-4 text-[var(--main)] placeholder:text-[var(--sub)] focus:border-[var(--accent)]/50 outline-none transition-all resize-none mb-4"
                        />
                        <button
                            onClick={() => setModeConfig({ ...modeConfig, customText: customTextInput })}
                            className="w-full py-4 bg-[var(--accent)] text-[var(--bg)] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl shadow-[var(--accent)]/20"
                        >
                            Start Custom Session
                        </button>
                    </motion.div>
                )}

                {/* 3. Main Typing deck */}
                {!modalStats && (
                    <div className="w-full">
                        <FocusMode isActive={liveStats.cursorIndex > 0 && !modalStats}>
                            <TypingArea
                                key={`${activeLesson.id}-${retryCount}-${modeConfig.mode}`}
                                content={activeLesson.content}
                                activeLessonId={activeLesson.id}
                                isActive={!modalStats && (modeConfig.mode !== 'custom' || !!modeConfig.customText)}
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
                                isMasterMode={activeLesson.isMasterMode}
                                practiceMode={modeConfig.mode}
                                duration={modeConfig.duration}
                                caretSpeed={settings.caretSpeed}
                            />
                        </FocusMode>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
