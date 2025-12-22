import React, { useEffect, useRef, useCallback, memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Stats, FontSize, CursorStyle, TrainingMode, PracticeMode, CaretSpeed } from '../types';
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
  const { engineRefs, handleKeyDown, handleKeyUp, reset, shake, timeLeft, isComplete } = useTypingEngine(content, stopOnError, practiceMode, duration);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const extraCharRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const workerRef = useRef<Worker | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, height: 32 });
  const [extraChars, setExtraChars] = useState<Record<number, string[]>>({});

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

  const words = useMemo(() => {
    let currentIdx = 0;
    return content.split(' ').map((word, wordIdx, array) => {
      const chars = word.split('').map(char => ({ char, idx: currentIdx++ }));
      const isLast = wordIdx === array.length - 1;
      const spaceIdx = isLast ? -1 : currentIdx++;
      return { word, chars, spaceIdx, wordIdx };
    });
  }, [content]);

  // Precision Caret Positioning logic
  const updateCaret = useCallback(() => {
    const index = engineRefs.cursorIndex.current;
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
  }, [engineRefs.cursorIndex, extraChars, words]);

  useEffect(() => {
    updateCaret();
    window.addEventListener('resize', updateCaret);
    return () => window.removeEventListener('resize', updateCaret);
  }, [updateCaret]);

  const updateVisuals = useCallback((data: { index: number; isCorrect: boolean; cursorIndex: number }) => {
    const { cursorIndex } = data;
    if (onActiveKeyChange) onActiveKeyChange(content[cursorIndex] || null);
    updateCaret(); // Trigger caret update on visual changes

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
    setExtraChars({});
    if (inputRef.current) inputRef.current.value = '';
  }, [content, reset]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (activeModal !== 'none' || isComplete) return;
    const currentIndex = engineRefs.cursorIndex.current;

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
    if (e.key === ' ') e.preventDefault();

    const activeWord = words.find(w => currentIndex >= w.chars[0].idx && (w.spaceIdx === -1 || currentIndex <= w.spaceIdx));
    const isAtWordEnd = activeWord && currentIndex === (activeWord.spaceIdx === -1 ? activeWord.chars[activeWord.chars.length - 1].idx + 1 : activeWord.spaceIdx);

    // Handle Backspace for extra characters first
    if (e.key === 'Backspace' && activeWord) {
      const extras = extraChars[activeWord.wordIdx] || [];
      if (extras.length > 0) {
        setExtraChars(prev => ({
          ...prev,
          [activeWord.wordIdx]: extras.slice(0, -1)
        }));
        if (soundEnabled) playSound();
        return;
      }
    }

    // Handle Extra Characters
    if (isAtWordEnd && e.key !== ' ' && e.key !== 'Backspace' && !['Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      setExtraChars(prev => ({
        ...prev,
        [activeWord!.wordIdx]: [...(prev[activeWord!.wordIdx] || []), e.key]
      }));
      if (soundEnabled) playSound();
      return;
    }

    const isCorrect = handleKeyDown(e.key, updateVisuals);

    if (!isCorrect && (isAccuracyMasterActive || isMasterMode)) {
      onRestart();
      return;
    }

    if (soundEnabled) playSound();
  }, [content.length, handleKeyDown, updateVisuals, soundEnabled, playSound, engineRefs.cursorIndex, isAccuracyMasterActive, isMasterMode, onRestart, activeModal, words, extraChars, isComplete]);

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
          boxShadow: '0 0 15px var(--accent)',
          display: isComplete ? 'none' : 'block'
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
