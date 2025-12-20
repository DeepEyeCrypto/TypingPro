import { useRef, useCallback, useState } from 'react';
import { PerformanceMonitor } from '../utils/performanceMonitor';
import { KeystrokeEvent } from '../../types';

export const useTypingEngine = (content: string, stopOnError: boolean) => {
    // High-frequency data stored in refs to bypass React render cycle
    const cursorIndexRef = useRef(0);
    const errorsRef = useRef<number[]>([]);
    const comboRef = useRef(0);
    const startTimeRef = useRef<number | null>(null);
    const keystrokeLog = useRef<KeystrokeEvent[]>([]);
    const wpmTimeline = useRef<{ timestamp: number; wpm: number }[]>([]);

    // Minimal state for non-critical UI updates
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

        const prevTimestamp = keystrokeLog.current.length > 0
            ? keystrokeLog.current[keystrokeLog.current.length - 1].timestamp
            : startTimeRef.current;

        const event: KeystrokeEvent = {
            char: key,
            code: '', // Can be improved if needed, but char is primary
            timestamp: now,
            latency: now - prevTimestamp,
            isError: !isCorrect,
            expectedChar: targetChar
        };
        keystrokeLog.current.push(event);

        const currentIndex = cursorIndexRef.current;

        if (isCorrect) {
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
            setTimeout(() => setShake(false), 150);
        }

        // Check completion
        if (cursorIndexRef.current >= content.length) {
            setIsComplete(true);
        }

        // Periodic WPM Timeline Check (e.g. every 5 characters or 1s)
        if (cursorIndexRef.current % 5 === 0) {
            const timeMin = (now - startTimeRef.current) / 60000;
            const currentWpm = Math.round((cursorIndexRef.current / 5) / Math.max(0.01, timeMin));
            wpmTimeline.current.push({ timestamp: now, wpm: currentWpm });
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
        keystrokeLog.current = [];
        wpmTimeline.current = [];
        setShake(false);
        setIsComplete(false);
    }, []);

    return {
        engineRefs: {
            cursorIndex: cursorIndexRef,
            errors: errorsRef,
            combo: comboRef,
            startTime: startTimeRef,
            keystrokeLog,
            wpmTimeline
        },
        shake,
        isComplete,
        handleInput,
        reset
    };
};
