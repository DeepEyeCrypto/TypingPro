import { useRef, useCallback, useState, useEffect } from 'react';
import { useTypingStore } from '../stores/typingStore';

interface CharState {
    value: string;
    isCorrect: boolean | null;
    isTyped: boolean;
}

export const useTyping = (text: string) => {
    const {
        isStarted,
        isComplete,
        startTest,
        updateStats,
        updateProgress,
        setComplete,
        reset: resetStore
    } = useTypingStore();

    const [chars, setChars] = useState<CharState[]>(
        text.split('').map(c => ({ value: c, isCorrect: null, isTyped: false }))
    );
    const [cursorPos, setCursorPos] = useState(0);
    const startTimeRef = useRef<number | null>(null);

    const calculateStats = useCallback(() => {
        if (!startTimeRef.current) return;

        const now = Date.now();
        const elapsedMinutes = (now - startTimeRef.current) / 1000 / 60;

        const correctCount = chars.filter((c, idx) => idx < cursorPos && c.isCorrect).length;
        const wpm = Math.round((correctCount / 5) / elapsedMinutes) || 0;
        const accuracy = cursorPos > 0 ? Math.round((correctCount / cursorPos) * 100) : 0;
        const time = Math.round((now - startTimeRef.current) / 1000);

        updateStats(wpm, accuracy, time);
    }, [chars, cursorPos, updateStats]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (isComplete) return;

        const key = e.key;

        // 1. Handle Backspace
        if (key === 'Backspace') {
            e.preventDefault();
            if (cursorPos > 0) {
                setChars(prev => {
                    const newChars = [...prev];
                    newChars[cursorPos - 1] = { ...newChars[cursorPos - 1], isTyped: false, isCorrect: null };
                    return newChars;
                });
                setCursorPos(prev => prev - 1);
                updateProgress(cursorPos - 1, chars.filter((c, i) => i < cursorPos - 1 && c.isCorrect === false).map((_, i) => i));
            }
            return;
        }

        // 2. Handle Regular Keys
        if (key.length === 1 && cursorPos < text.length) {
            e.preventDefault();

            const isCorrect = key === text[cursorPos];

            if (!startTimeRef.current) {
                startTimeRef.current = Date.now();
                startTest();
            }

            setChars(prev => {
                const newChars = [...prev];
                newChars[cursorPos] = { ...newChars[cursorPos], isTyped: true, isCorrect };
                return newChars;
            });

            const nextPos = cursorPos + 1;
            setCursorPos(nextPos);

            // Update global store progress
            const currentErrors = chars.filter((c, i) => i < nextPos && c.isCorrect === false).map((_, i) => i);
            updateProgress(nextPos, currentErrors);

            // Check for completion
            if (nextPos === text.length) {
                setComplete(true);
            }

            calculateStats();
        }
    }, [cursorPos, text, isComplete, startTest, updateProgress, setComplete, calculateStats, chars]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [handleKeyDown]);

    const reset = useCallback(() => {
        setChars(text.split('').map(c => ({ value: c, isCorrect: null, isTyped: false })));
        setCursorPos(0);
        startTimeRef.current = null;
        resetStore();
    }, [text, resetStore]);

    return { chars, cursorPos, isComplete, reset };
};
