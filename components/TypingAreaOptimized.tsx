import React, { useEffect, useRef, useCallback, memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Stats, FontSize, CursorStyle, TrainingMode, PracticeMode, CaretSpeed, KeystrokeEvent } from '../types';
import { useSound } from '../contexts/SoundContext';
import { useTypingEngine } from '../src/hooks/useTypingEngine';
import { usePerformanceTracking } from '../src/hooks/usePerformanceTracking';
import { useApp } from '../contexts/AppContext';
import styles from './TypingArea.module.css';

interface TypingAreaProps {
  content: string;
  onComplete: (stats: Stats) => void;
  onRestart: () => void;
  activeLessonId: number;
  isActive: boolean;
  soundEnabled: boolean;
  onActiveKeyChange?: (key: string | null) => void;
  onStatsUpdate: (stats: { wpm: number; accuracy: number; errors: number; progress: number; timeLeft?: number }) => void;
  fontFamily: string;
  fontSize: FontSize;
  cursorStyle: CursorStyle;
  stopOnError: boolean;
  trainingMode: TrainingMode;
  isMasterMode?: boolean;
  practiceMode?: PracticeMode;
  duration?: number;
  caretSpeed?: CaretSpeed;
}

const TypingAreaOptimized: React.FC<TypingAreaProps> = ({
  content,
  onComplete,
  onRestart,
  isActive,
  soundEnabled,
  onActiveKeyChange,
  onStatsUpdate,
  fontSize,
  stopOnError,
  isMasterMode,
  practiceMode = 'curriculum',
  duration = 60,
  caretSpeed = 'smooth'
}) => {
  const { playSound } = useSound();
  const { isAccuracyMasterActive, activeModal } = useApp();
  const { calculateRealTimeStats, stats: performanceStats } = usePerformanceTracking(content.length);
  const { handleKeyDown: engineHandleKeyDown, handleKeyUp: engineHandleKeyUp, reset, shake, timeLeft, isComplete, engineState } = useTypingEngine(content, stopOnError, practiceMode, duration);

  const { cursorIndex, errors, combo, startTime, keystrokeLog, wpmTimeline, words, extraChars } = engineState;
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const extraCharRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const workerRef = useRef<Worker | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, height: 32 });

  // PERF CRITICAL: Auto-focus on mount with proper event handling
  useEffect(() => {
    if (inputRef.current && isActive && activeModal === 'none') {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isActive, activeModal]);

  // PERF CRITICAL: Optimized caret positioning
  const updateCaret = useCallback(() => {
    const index = cursorIndex;
    const activeWord = words.find(w => index >= w.chars[0].idx && (w.spaceIdx === -1 || index <= w.spaceIdx));
    const extras = activeWord ? (extraChars[activeWord.wordIdx] || []) : [];

    let charEl;
    let useRight = false;

    if (extras.length > 0 && activeWord) {
      charEl = extraCharRefs.current[`${activeWord.wordIdx}-${extras.length - 1}`];
      useRight = true;
    } else {
      charEl = charRefs.current[index];
      if (!charEl && index > 0) {
        charEl = charRefs.current[index - 1];
        useRight = true;
      }
    }

    const containerEl = containerRef.current;
    if (charEl && containerEl) {
      const charRect = charEl.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setCursorPos({
        x: charRect.left - containerRect.left + (useRight ? charRect.width : 0),
        y: charRect.top - containerRect.top,
        height: charRect.height
      });
    }
  }, [cursorIndex, extraChars, words]);

  // PERF CRITICAL: Global keyboard event handler with capture phase
  useEffect(() => {
    if (!isActive || activeModal !== 'none' || isComplete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default browser behavior
      e.preventDefault();
      e.stopPropagation();

      // Ignore modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

      // Handle space specially
      if (e.key === ' ') {
        e.preventDefault();
      }

      const isCorrect = engineHandleKeyDown(e.key);

      // Update visuals and stats
      if (onActiveKeyChange) onActiveKeyChange(content[cursorIndex] || null);
      updateCaret();

      if (workerRef.current && startTime) {
        onStatsUpdate({ ...performanceStats, timeLeft }); // Fallback sync update if needed

        workerRef.current.postMessage({
          type: 'UPDATE_STATS',
          data: {
            cursorIndex,
            errors,
            startTime,
            contentLength: content.length,
            keystrokeLog,
            wpmTimeline
          }
        });
      }

      if (!isCorrect && (isAccuracyMasterActive || isMasterMode) && e.key !== 'Backspace') {
        onRestart();
        return;
      }

      if (soundEnabled) playSound();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      engineHandleKeyUp(e.key);
    };

    // PERF CRITICAL: Use capture phase for immediate response
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [isActive, activeModal, isComplete, engineHandleKeyDown, engineHandleKeyUp, isAccuracyMasterActive, isMasterMode, onRestart, soundEnabled, playSound, onActiveKeyChange, startTime, errors, keystrokeLog, calculateRealTimeStats, content, cursorIndex, updateCaret]);

  // PERF CRITICAL: Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Initialize Worker for stats
  useEffect(() => {
    workerRef.current = new Worker(new URL('../src/workers/statsWorker.ts', import.meta.url), { type: 'module' });
    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'STATS_UPDATED') {
        onStatsUpdate({ ...e.data.stats, timeLeft });
      }
    };
    return () => workerRef.current?.terminate();
  }, [onStatsUpdate, timeLeft]);

  useEffect(() => {
    updateCaret();
    window.addEventListener('resize', updateCaret);
    return () => window.removeEventListener('resize', updateCaret);
  }, [updateCaret]);

  // PERF CRITICAL: Reset handling
  useEffect(() => {
    reset();
    if (inputRef.current) inputRef.current.value = '';
  }, [content, reset]);

  // PERF CRITICAL: Optimized text rendering with useMemo
  const memoizedChars = useMemo(() => {
    return words.map((w, wIdx) => {
      const isCurrentWord = w.chars.some(c => c.idx === cursorIndex) || w.spaceIdx === cursorIndex;

      return (
        <div key={wIdx} className={styles.word}>
          {w.chars.map(({ char, idx }) => {
            const isTyped = idx < cursorIndex;
            const isError = errors.includes(idx);

            let stateClass = styles.untyped;
            if (isTyped) {
              stateClass = isError ? styles.error : styles.correct;
            } else if (isCurrentWord) {
              stateClass = styles.current;
            }

            return (
              <span
                key={idx}
                ref={el => { charRefs.current[idx] = el; }}
                className={`${styles.char} ${stateClass}`}
              >
                {char}
              </span>
            );
          })}

          {/* Render Extra Characters */}
          {(extraChars[wIdx] || []).map((char, eIdx) => (
            <span
              key={`extra-${wIdx}-${eIdx}`}
              ref={el => { extraCharRefs.current[`${wIdx}-${eIdx}`] = el; }}
              className={`${styles.char} ${styles.extra}`}
            >
              {char}
            </span>
          ))}

          {/* Space handler */}
          {w.spaceIdx !== -1 && (
            <span
              ref={el => { charRefs.current[w.spaceIdx] = el; }}
              className={`${styles.char} ${w.spaceIdx < cursorIndex
                ? (errors.includes(w.spaceIdx) ? styles.errorBackground : styles.correct)
                : (isCurrentWord ? styles.current : styles.untyped)
                }`}
            >
              &nbsp;
            </span>
          )}
        </div>
      );
    });
  }, [words, cursorIndex, errors, extraChars]);

  const getTextSizeClass = () => {
    switch (fontSize) {
      case 'small': return "text-xl";
      case 'medium': return "text-2xl";
      case 'large': return "text-3xl";
      case 'xl': return "text-4xl";
      default: return "text-2xl";
    }
  };

  // PERF CRITICAL: Optimized caret transitions
  const caretTransition = useMemo(() => {
    if (caretSpeed === 'off') return { duration: 0 };
    if (caretSpeed === 'fast') return { type: "spring" as const, stiffness: 1000, damping: 50, mass: 0.2 };
    return { type: "spring" as const, stiffness: 500, damping: 40, mass: 0.5 };
  }, [caretSpeed]);

  // PERF CRITICAL: Focus management with click handler
  const handleContainerClick = useCallback(() => {
    if (activeModal === 'none' && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [activeModal]);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* PERF CRITICAL: Hidden input for focus management */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        autoComplete="off"
        autoFocus
        style={{ width: 0, height: 0, border: 'none', padding: 0 }}
      />

      <motion.div
        className={`${styles.caret} ${!isActive || isComplete ? '' : 'animate-caret-blink'}`}
        animate={{
          x: cursorPos.x,
          y: cursorPos.y,
          height: cursorPos.height
        }}
        transition={caretTransition}
        style={{
          boxShadow: `0 0 ${10 + (performanceStats.speedIndicator || 0) / 10}px var(--accent)`,
          borderRightColor: (performanceStats.speedIndicator || 0) > 75 ? '#34C759' : 'var(--accent)',
          display: isComplete ? 'none' : 'block'
        }}
      />

      <div className={`${styles.textWrapper} ${getTextSizeClass()} ${shake ? 'animate-shake' : ''}`}>
        {memoizedChars}
      </div>
    </div>
  );
};

export default memo(TypingAreaOptimized);
