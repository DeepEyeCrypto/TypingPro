
import { useState, useEffect, useRef, useCallback } from 'react';

interface TypingEngineState {
    input: string;
    cursorIndex: number;
    errors: number[];
    startTime: number | null;
    shake: boolean;
    combo: number;
}

export const useTypingEngine = (content: string, stopOnError: boolean) => {
    const [state, setState] = useState<TypingEngineState>({
        input: '',
        cursorIndex: 0,
        errors: [],
        startTime: null,
        shake: false,
        combo: 0
    });

    const keypressTimestamps = useRef<number[]>([]);
    const lastState = useRef(state);
    lastState.current = state;

    const handleInput = useCallback((key: string) => {
        const now = Date.now();
        const { cursorIndex, input, errors, startTime, combo } = lastState.current;

        if (cursorIndex >= content.length) return;

        const targetChar = content[cursorIndex];
        const isCorrect = key === targetChar;
        const newStartTime = startTime || now;

        if (isCorrect) {
            keypressTimestamps.current.push(now);
            setState(prev => ({
                ...prev,
                input: prev.input + key,
                cursorIndex: prev.cursorIndex + 1,
                startTime: newStartTime,
                combo: prev.combo + 1,
                shake: false
            }));
        } else {
            setState(prev => ({
                ...prev,
                combo: 0,
                shake: true,
                startTime: newStartTime,
                errors: prev.errors.includes(prev.cursorIndex) ? prev.errors : [...prev.errors, prev.cursorIndex],
                input: stopOnError ? prev.input : prev.input + key,
                cursorIndex: stopOnError ? prev.cursorIndex : prev.cursorIndex + 1
            }));

            // Auto-reset shake
            setTimeout(() => setState(prev => ({ ...prev, shake: false })), 200);
        }

        return isCorrect;
    }, [content, stopOnError]);

    const reset = useCallback(() => {
        setState({
            input: '',
            cursorIndex: 0,
            errors: [],
            startTime: null,
            shake: false,
            combo: 0
        });
        keypressTimestamps.current = [];
    }, []);

    return {
        state,
        handleInput,
        reset,
        keypressTimestamps: keypressTimestamps.current
    };
};
