import { useRef, useCallback, useState, useEffect } from 'react';
import { PerformanceMonitor } from '../utils/performanceMonitor';
import { KeystrokeEvent, PracticeMode } from '../../types';

export const useTypingEngine = (content: string, stopOnError: boolean, mode: PracticeMode = 'curriculum', duration = 60) => {
    const cursorIndexRef = useRef(0);
    const errorsRef = useRef<number[]>([]);
    const comboRef = useRef(0);
    const startTimeRef = useRef<number | null>(null);
    const keystrokeLog = useRef<KeystrokeEvent[]>([]);
    const wpmTimeline = useRef<{ timestamp: number; wpm: number }[]>([]);
    const lastKeyDownRef = useRef<{ key: string, time: number } | null>(null);

    const [shake, setShake] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [timeLeft, setTimeLeft] = useState(duration);

    // Timer logic for 'time' mode
    useEffect(() => {
        if (mode !== 'time' || !startTimeRef.current || isComplete) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
            const remaining = Math.max(0, duration - elapsed);
            setTimeLeft(remaining);

            if (remaining === 0) {
                setIsComplete(true);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [mode, duration, isComplete]);

    const handleKeyDown = useCallback((key: string, onUpdate: (data: {
        index: number;
        isCorrect: boolean;
        cursorIndex: number;
        combo: number;
    }) => void) => {
        PerformanceMonitor.startMeasure('typing-engine-input');

        const now = Date.now();
        if (isComplete) {
            PerformanceMonitor.endMeasure('typing-engine-input');
            return false;
        }

        if (key === 'Backspace') {
            if (cursorIndexRef.current > 0) {
                cursorIndexRef.current -= 1;
                // Remove error if we backspaced over it
                errorsRef.current = errorsRef.current.filter(e => e !== cursorIndexRef.current);
                onUpdate({
                    index: cursorIndexRef.current,
                    isCorrect: true,
                    cursorIndex: cursorIndexRef.current,
                    combo: comboRef.current
                });
            }
            PerformanceMonitor.endMeasure('typing-engine-input');
            return true;
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
            code: '',
            timestamp: now,
            latency: now - prevTimestamp,
            isError: !isCorrect,
            expectedChar: targetChar
        };
        keystrokeLog.current.push(event);
        lastKeyDownRef.current = { key, time: now };

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

        // Standard completion check (curriculum / words)
        if (mode !== 'time' && cursorIndexRef.current >= content.length) {
            setIsComplete(true);
        }

        if (cursorIndexRef.current % 5 === 0) {
            const timeMin = (now - startTimeRef.current) / 60000;
            const currentWpm = Math.round((cursorIndexRef.current / 5) / Math.max(0.01, timeMin));
            wpmTimeline.current.push({ timestamp: now, wpm: currentWpm });
        }

        onUpdate({
            index: currentIndex,
            isCorrect,
            cursorIndex: cursorIndexRef.current,
            combo: comboRef.current
        });

        PerformanceMonitor.endMeasure('typing-engine-input');
        return isCorrect;
    }, [content, stopOnError, isComplete, mode]);

    const handleKeyUp = useCallback((key: string) => {
        if (!lastKeyDownRef.current || lastKeyDownRef.current.key !== key) return;
        const now = Date.now();
        const holdDuration = now - lastKeyDownRef.current.time;
        for (let i = keystrokeLog.current.length - 1; i >= 0; i--) {
            const entry = keystrokeLog.current[i];
            if (entry.char === key && entry.holdTime === undefined) {
                entry.holdTime = holdDuration;
                break;
            }
        }
        lastKeyDownRef.current = null;
    }, []);

    const reset = useCallback(() => {
        cursorIndexRef.current = 0;
        errorsRef.current = [];
        comboRef.current = 0;
        startTimeRef.current = null;
        keystrokeLog.current = [];
        wpmTimeline.current = [];
        lastKeyDownRef.current = null;
        setShake(false);
        setIsComplete(false);
        setTimeLeft(duration);
    }, [duration]);

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
        timeLeft,
        handleKeyDown,
        handleKeyUp,
        reset
    };
};
