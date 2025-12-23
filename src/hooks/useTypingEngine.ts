import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { PerformanceMonitor } from '../utils/performanceMonitor';
import { KeystrokeEvent, PracticeMode } from '../../types';
import { TypingEngine, EngineState } from '../engines/typing/TypingEngine';

export const useTypingEngine = (content: string, stopOnError: boolean, mode: PracticeMode = 'curriculum', duration = 60) => {
    // We use a ref for the engine to avoid re-instantiating it on every render
    const engine = useMemo(() => new TypingEngine(content, { stopOnError, mode, duration }), [content, stopOnError, mode, duration]);

    // We still need some React state for things that trigger re-renders
    const [engineState, setEngineState] = useState<EngineState>(engine.getState());
    const [shake, setShake] = useState(false);

    // Timer logic for 'time' mode
    useEffect(() => {
        if (mode !== 'time' || !engineState.startTime || engineState.isComplete) return;

        const interval = setInterval(() => {
            const timeLeft = engine.updateTimeLeft(Date.now());
            setEngineState(engine.getState());

            if (timeLeft === 0) {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [mode, engineState.startTime, engineState.isComplete, engine]);

    const handleKeyDown = useCallback((key: string, onUpdate: (data: any) => void) => {
        PerformanceMonitor.startMeasure('typing-engine-input');

        const { isCorrect, state } = engine.handleKeyDown(key);
        setEngineState({ ...state });

        if (!isCorrect && key !== 'Backspace') {
            setShake(true);
            setTimeout(() => setShake(false), 150);
        }

        onUpdate({
            index: state.cursorIndex,
            isCorrect,
            cursorIndex: state.cursorIndex,
            combo: state.combo,
            keystrokeLog: state.keystrokeLog,
            wpmTimeline: state.wpmTimeline
        });

        PerformanceMonitor.endMeasure('typing-engine-input');
        return isCorrect;
    }, [engine]);

    const handleKeyUp = useCallback((key: string) => {
        engine.handleKeyUp(key, Date.now());
        setEngineState({ ...engine.getState() });
    }, [engine]);

    const reset = useCallback(() => {
        engine.reset();
        setEngineState(engine.getState());
        setShake(false);
    }, [engine]);

    return {
        // Expose refs compatible with the old API where needed, or transition to state
        engineRefs: {
            cursorIndex: { current: engineState.cursorIndex },
            errors: { current: engineState.errors },
            combo: { current: engineState.combo },
            startTime: { current: engineState.startTime },
            keystrokeLog: { current: engineState.keystrokeLog },
            wpmTimeline: { current: engineState.wpmTimeline }
        },
        shake,
        isComplete: engineState.isComplete,
        timeLeft: engineState.timeLeft,
        engineState,
        handleKeyDown,
        handleKeyUp,
        reset
    };
};
