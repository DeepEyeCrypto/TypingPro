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

const TypingArea: React.FC<TypingAreaProps> = ({
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
  const { handleKeyDown, handleKeyUp, reset, shake, timeLeft, isComplete, engineState } = useTypingEngine(content, stopOnError, practiceMode, duration);

  const { cursorIndex, errors, combo, startTime, keystrokeLog, wpmTimeline, words, extraChars } = engineState;
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const extraCharRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const workerRef = useRef<Worker | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, height: 32 });

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

  // Precision Caret Positioning logic
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
      const containerRect = containerEl.getBoundingClientRect();

      setCursorPos({
        x: charRect.left - containerRect.left + (useRight ? charRect.width : 0),
        y: charRect.top - containerRect.top,
        height: charRect.height
      });
    }
  }, [cursorIndex, extraChars, words]);

  useEffect(() => {
    updateCaret();
    window.addEventListener('resize', updateCaret);
    return () => window.removeEventListener('resize', updateCaret);
  }, [updateCaret]);

  const updateVisuals = useCallback((data: any) => {
    const { index, keystrokeLog: logs, wpmTimeline: timeline } = data;
    if (onActiveKeyChange) onActiveKeyChange(content[index] || null);
    updateCaret();

    if (workerRef.current && startTime) {
      calculateRealTimeStats(
        index,
        errors,
        logs,
        startTime
      );

      workerRef.current.postMessage({
        type: 'UPDATE_STATS',
        data: {
          cursorIndex: index,
          errors,
          startTime,
          contentLength: content.length,
          keystrokeLog: logs,
          wpmTimeline: timeline
        }
      });
    }
  }, [content, onActiveKeyChange, startTime, errors, calculateRealTimeStats, updateCaret]);

  useEffect(() => {
    if (isActive && activeModal === 'none' && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isActive, practiceMode, activeModal]);

  useEffect(() => {
    reset();
    if (inputRef.current) inputRef.current.value = '';
  }, [content, reset]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (activeModal !== 'none' || isComplete) return;

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
    if (e.key === ' ') e.preventDefault();

    const isCorrect = handleKeyDown(e.key, updateVisuals);

    if (!isCorrect && (isAccuracyMasterActive || isMasterMode) && e.key !== 'Backspace') {
      onRestart();
      return;
    }

    if (soundEnabled) playSound();
  }, [handleKeyDown, updateVisuals, soundEnabled, playSound, isAccuracyMasterActive, isMasterMode, onRestart, activeModal, isComplete]);

  const getTextSizeClass = () => {
    switch (fontSize) {
      case 'small': return "text-xl";
      case 'medium': return "text-2xl";
      case 'large': return "text-3xl";
      case 'xl': return "text-4xl";
      default: return "text-2xl";
    }
  };

  const caretTransition = useMemo(() => {
    if (caretSpeed === 'off') return { duration: 0 };
    if (caretSpeed === 'fast') return { type: "spring" as const, stiffness: 1000, damping: 50, mass: 0.2 };
    return { type: "spring" as const, stiffness: 500, damping: 40, mass: 0.5 };
  }, [caretSpeed]);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      onClick={() => {
        if (activeModal === 'none') inputRef.current?.focus();
      }}
    >
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        onKeyDown={onKeyDown}
        onKeyUp={(e) => handleKeyUp(e.key)}
        autoComplete="off"
        autoFocus
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
        {words.map((w, wIdx) => {
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
        })}
      </div>
    </div>
  );
};

export default memo(TypingArea);
