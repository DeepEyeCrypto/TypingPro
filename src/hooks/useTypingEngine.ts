
import { useRef, useCallback, useState } from 'react';
import { PerformanceMonitor } from '../utils/performanceMonitor';

interface TypingEngineState {
    cursorIndex: number;
    errors: number[];
    startTime: number | null;
    combo: number;
}

export const useTypingEngine = (content: string, stopOnError: boolean) => {
    // High-frequency data stored in refs to bypass React render cycle
    const cursorIndexRef = useRef(0);
    const errorsRef = useRef<number[]>([]);
    const comboRef = useRef(0);
    const startTimeRef = useRef<number | null>(null);
    const keypressTimestamps = useRef<number[]>([]);

    // Minimal state for non-critical UI updates (e.g. lesson complete, shake effect)
    const [shake, setShake] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleInput = useCallback((key: string, onUpdate: (data: {
        index: number;
        isCorrect: boolean;
        cursorIndex: number;
        combo: number;
    }) => void) => {
        PerformanceMonitor.startMeasure('typing-engine-input');

        const now = Date.now();
        if (cursorIndexRef.current >= content.length) {
            PerformanceMonitor.endMeasure('typing-engine-input');
            return false;
        }

        const targetChar = content[cursorIndexRef.current];
        const isCorrect = key === targetChar;

        if (!startTimeRef.current) {
            startTimeRef.current = now;
        }

        const currentIndex = cursorIndexRef.current;

        if (isCorrect) {
            keypressTimestamps.current.push(now);
            cursorIndexRef.current += 1;
            comboRef.current += 1;
            setShake(false);
        } else {
            comboRef.current = 0;
            if (!errorsRef.current.includes(currentIndex)) {
                errorsRef.current.push(currentIndex);
            }
            if (!stopOnError) {
                cursorIndexRef.current += 1;
            }
            setShake(true);
            // Non-critical: auto-reset shake
            setTimeout(() => setShake(false), 150);
        }

        // Check completion
        if (cursorIndexRef.current >= content.length) {
            setIsComplete(true);
        }

        // Immediate callback for Direct DOM manipulation
        onUpdate({
            index: currentIndex,
            isCorrect,
            cursorIndex: cursorIndexRef.current,
            combo: comboRef.current
        });

        PerformanceMonitor.endMeasure('typing-engine-input');
        return isCorrect;
    }, [content, stopOnError]);

    const reset = useCallback(() => {
        cursorIndexRef.current = 0;
        errorsRef.current = [];
        comboRef.current = 0;
        startTimeRef.current = null;
        keypressTimestamps.current = [];
        setShake(false);
        setIsComplete(false);
    }, []);

    return {
        // High-frequency values (read-only for component)
        engineRefs: {
            cursorIndex: cursorIndexRef,
            errors: errorsRef,
            combo: comboRef,
            startTime: startTimeRef,
            keypressTimestamps
        },
        // Minimal React state
        shake,
        isComplete,
        handleInput,
        reset
    };
};
