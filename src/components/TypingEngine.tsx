import React, { useState, useEffect, useCallback, memo } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface TypingStats {
    wpm: number;
    accuracy: number;
    consistency: number;
    elapsed_time: number;
    correct_chars: number;
    total_chars: number;
    error_count: number;
    finger_latency: number[];
}

export interface Lesson {
    id: number;
    stage: number;
    title: string;
    text: string;
    target_wpm: number;
}

export const useTypingEngine = () => {
    const [stats, setStats] = useState<TypingStats | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [userTyped, setUserTyped] = useState("");
    const [isFinished, setIsFinished] = useState(false);

    const loadLesson = useCallback(async (id: number) => {
        const lesson = await invoke<Lesson>('get_lesson', { lessonId: id });
        setCurrentLesson(lesson);
        setUserTyped("");
        setIsFinished(false);
        const initialStats = await invoke<TypingStats>('get_stats');
        setStats(initialStats);
    }, []);

    const processKey = useCallback(async (key: string) => {
        if (isFinished) return;

        if (key === 'Backspace') {
            const newStats = await invoke<TypingStats>('handle_backspace');
            setStats(newStats);
            setUserTyped(prev => prev.slice(0, -1));
        } else if (key.length === 1) {
            const newStats = await invoke<TypingStats>('process_key', { key });
            setStats(newStats);
            setUserTyped(prev => prev + key);

            if (currentLesson && (userTyped.length + 1) >= currentLesson.text.length) {
                setIsFinished(true);
            }
        }
    }, [isFinished, currentLesson, userTyped]);

    return {
        stats,
        currentLesson,
        userTyped,
        isFinished,
        loadLesson,
        processKey
    };
};

const TypingEngine: React.FC<{ lessonId: number }> = ({ lessonId }) => {
    const { stats, currentLesson, userTyped, isFinished, loadLesson, processKey } = useTypingEngine();

    useEffect(() => {
        loadLesson(lessonId);
    }, [lessonId, loadLesson]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable default shortcuts and focus preservation
            if (e.key === 'Tab' || e.key === 'Escape') e.preventDefault();

            processKey(e.key);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [processKey]);

    if (!currentLesson) return <div className="text-white/20 uppercase tracking-widest text-xs">Loading Liquid Core...</div>;

    return (
        <div className="flex flex-col items-center w-full max-w-4xl relative">
            {/* Hidden Input for Focus */}
            <input
                id="typing-input-handler"
                type="text"
                className="absolute opacity-0 pointer-events-none"
                autoFocus
                onKeyDown={(e) => {
                    // Prevent common shortcuts
                    if (e.ctrlKey || e.metaKey) return;
                    processKey(e.key);
                }}
            />

            {/* Stats Overlay */}
            <div className="grid grid-cols-3 gap-12 mb-16 opacity-80">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-1">WPM</span>
                    <span className="text-5xl font-black tracking-tighter text-white">{stats?.wpm || 0}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-1">ACC</span>
                    <span className="text-5xl font-black tracking-tighter text-white">{stats?.accuracy || 0}%</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-1">SYNC</span>
                    <span className="text-5xl font-black tracking-tighter text-white">{stats?.consistency || 0}%</span>
                </div>
            </div>

            {/* Dynamic Typing Well */}
            <div className="liquid-surface p-12 w-full min-h-[280px] flex flex-col justify-center">
                <div className="typing-well flex flex-wrap gap-x-[0.2em]">
                    {currentLesson.text.split('').map((char, idx) => {
                        const typedChar = userTyped[idx];
                        let status = "text-white/20";
                        if (idx === userTyped.length) status = "char-active";
                        else if (typedChar !== undefined) {
                            status = typedChar === char ? "text-white" : "text-red-500/80";
                        }

                        return (
                            <span key={idx} className={`transition-all duration-150 ${status}`}>
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        );
                    })}
                </div>

                {isFinished && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-700">
                        <h2 className="text-3xl font-bold mb-6 liquid-text">Stage Complete</h2>
                        <button
                            className="liquid-button"
                            onClick={() => loadLesson(lessonId)}
                        >
                            Refine Technique
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(TypingEngine);
