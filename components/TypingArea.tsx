import React, { useEffect, useRef, useCallback, memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Stats, FontSize, CursorStyle, TrainingMode, PracticeMode } from '../types';
import { useSound } from '../contexts/SoundContext';
import { useTypingEngine } from '../src/hooks/useTypingEngine';
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
  duration = 60
}) => {
  const { playSound } = useSound();
  const { isAccuracyMasterActive, activeModal } = useApp();
  const { engineRefs, handleKeyDown, handleKeyUp, reset, shake, timeLeft } = useTypingEngine(content, stopOnError, practiceMode, duration);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
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
    const index = engineRefs.cursorIndex.current;
    const charEl = charRefs.current[index];
    const containerEl = containerRef.current;

    if (charEl && containerEl) {
      const charRect = charEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      setCursorPos({
        x: charRect.left - containerRect.left,
        y: charRect.top - containerRect.top,
        height: charRect.height
      });
    }
  }, [engineRefs.cursorIndex]);

  useEffect(() => {
    updateCaret();
    // Also update on window resize to keep pixel-perfect alignment
    window.addEventListener('resize', updateCaret);
    return () => window.removeEventListener('resize', updateCaret);
  }, [updateCaret, fontSize]);

  const updateVisuals = useCallback((data: { index: number; isCorrect: boolean; cursorIndex: number }) => {
    const { cursorIndex } = data;
    if (onActiveKeyChange) onActiveKeyChange(content[cursorIndex] || null);

    if (workerRef.current && engineRefs.startTime.current) {
      workerRef.current.postMessage({
        type: 'UPDATE_STATS',
        data: {
          cursorIndex,
          errors: engineRefs.errors.current,
          startTime: engineRefs.startTime.current,
          contentLength: content.length,
          keystrokeLog: engineRefs.keystrokeLog.current,
          wpmTimeline: engineRefs.wpmTimeline.current
        }
      });
    }
  }, [content, onActiveKeyChange, engineRefs]);

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
    if (activeModal !== 'none') return;
    if (engineRefs.cursorIndex.current >= content.length) return;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
    if (e.key === ' ') e.preventDefault();

    const isCorrect = handleKeyDown(e.key, updateVisuals);

    if (!isCorrect && (isAccuracyMasterActive || isMasterMode)) {
      onRestart();
      return;
    }

    if (soundEnabled) playSound();
  }, [content.length, handleKeyDown, updateVisuals, soundEnabled, playSound, engineRefs.cursorIndex, isAccuracyMasterActive, isMasterMode, onRestart, activeModal]);

  const words = useMemo(() => {
    let currentIdx = 0;
    return content.split(' ').map((word, wordIdx, array) => {
      const chars = word.split('').map(char => ({ char, idx: currentIdx++ }));
      const isLast = wordIdx === array.length - 1;
      const spaceIdx = isLast ? -1 : currentIdx++;
      return { word, chars, spaceIdx };
    });
  }, [content]);

  const getTextSizeClass = () => {
    switch (fontSize) {
      case 'small': return "text-xl";
      case 'medium': return "text-2xl";
      case 'large': return "text-3xl";
      case 'xl': return "text-4xl";
      default: return "text-2xl";
    }
  };

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

      {/* Sub-pixel accurate caret */}
      <motion.div
        className={styles.caret}
        animate={{
          x: cursorPos.x,
          y: cursorPos.y,
          height: cursorPos.height
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 40,
          mass: 0.5
        }}
        style={{
          boxShadow: '0 0 15px var(--accent)'
        }}
      />

      <div className={`${styles.textWrapper} ${getTextSizeClass()} ${shake ? 'animate-shake' : ''}`}>
        {words.map((w, wIdx) => {
          const isCurrentWord = w.chars.some(c => c.idx === engineRefs.cursorIndex.current) || w.spaceIdx === engineRefs.cursorIndex.current;

          return (
            <div key={wIdx} className={styles.word}>
              {w.chars.map(({ char, idx }) => {
                const isTyped = idx < engineRefs.cursorIndex.current;
                const isError = engineRefs.errors.current.includes(idx);

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

              {/* Space handler */}
              {w.spaceIdx !== -1 && (
                <span
                  ref={el => { charRefs.current[w.spaceIdx] = el; }}
                  className={`${styles.char} ${w.spaceIdx < engineRefs.cursorIndex.current
                    ? (engineRefs.errors.current.includes(w.spaceIdx) ? styles.errorBackground : styles.correct)
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
