
import React, { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import { Stats, FontSize, CursorStyle, KeyStats, TrainingMode, FingerStats } from '../types';
import { useSound } from '../contexts/SoundContext';
import { AlertCircle } from 'lucide-react';
import { KEYBOARD_ROWS, LAYOUTS } from '../constants';
import { useTypingEngine } from '../src/hooks/useTypingEngine';
import { PerformanceMonitor } from '../src/utils/performanceMonitor';

interface TypingAreaProps {
  content: string;
  onComplete: (stats: Stats) => void;
  onRestart: () => void;
  activeLessonId: number;
  isActive: boolean;
  soundEnabled: boolean;
  onActiveKeyChange?: (key: string | null) => void;
  onStatsUpdate: (stats: { wpm: number; accuracy: number; errors: number; progress: number }) => void;
  onKeyStatsUpdate?: (stats: Record<string, KeyStats>) => void;
  onFingerChange?: (finger: string | null) => void;
  fontFamily: string;
  fontSize: FontSize;
  cursorStyle: CursorStyle;
  stopOnError: boolean;
  trainingMode: TrainingMode;
  lessonType?: 'standard' | 'burst';
  newKeys?: string[];
  fontColor?: string;
  onComboUpdate?: (combo: number) => void;
}

const IDLE_THRESHOLD = 5000;

/**
 * Optimized character component
 * Minimal styles, GPU hints, and memoization.
 */
const CharSpan = memo(({ char, idx, cursorIndex, isError, isPassed, fontSize }: {
  char: string,
  idx: number,
  cursorIndex: number,
  isError: boolean,
  isPassed: boolean,
  fontSize: FontSize
}) => {
  const isCurrent = idx === cursorIndex;

  // Static style string to prevent re-parsing
  let className = `inline text-center transition-opacity duration-75 px-[0.5px] will-change-transform ${getTextSizeClass(fontSize)} `;

  if (isCurrent) {
    className += "bg-brand/80 text-white rounded-lg shadow-sm relative z-10 mx-1 scale-105";
  } else if (isPassed) {
    className += isError ? "text-red-500/80" : "text-white/20";
  } else {
    className += "text-white/40";
  }

  return <span className={className}>{char === ' ' ? '\u00A0' : char}</span>;
});

const TypingArea: React.FC<TypingAreaProps> = ({
  content,
  onComplete,
  onRestart,
  activeLessonId,
  isActive,
  soundEnabled,
  onActiveKeyChange,
  onStatsUpdate,
  fontFamily,
  fontSize,
  cursorStyle,
  stopOnError,
  trainingMode,
  lessonType,
  newKeys,
  fontColor,
  onComboUpdate,
  onKeyStatsUpdate,
  onFingerChange
}) => {
  const { playSound } = useSound();
  const { state, handleInput, reset, keypressTimestamps } = useTypingEngine(content, stopOnError);
  const workerRef = useRef<Worker | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Worker
  useEffect(() => {
    workerRef.current = new Worker(new URL('../src/workers/statsWorker.ts', import.meta.url), { type: 'module' });

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'STATS_UPDATED') {
        onStatsUpdate(e.data.stats);
      }
    };

    return () => workerRef.current?.terminate();
  }, [onStatsUpdate]);

  // Sync with Worker
  useEffect(() => {
    if (state.startTime && workerRef.current) {
      workerRef.current.postMessage({
        type: 'UPDATE_STATS',
        data: {
          cursorIndex: state.cursorIndex,
          errors: state.errors,
          startTime: state.startTime,
          contentLength: content.length,
          keypressTimestamps: keypressTimestamps
        }
      });
    }
  }, [state.cursorIndex, state.errors, state.startTime, content.length, keypressTimestamps]);

  const finalizeSession = useCallback(() => {
    if (!state.startTime) return;

    const finalTime = Date.now();
    const durationMs = finalTime - state.startTime;
    const timeMin = Math.max(0.1, durationMs / 60000);
    const finalWpm = Math.round((state.cursorIndex / 5) / timeMin);
    const finalAcc = Math.round(((state.cursorIndex - state.errors.length) / Math.max(1, state.cursorIndex)) * 100);

    onComplete({
      wpm: finalWpm,
      accuracy: Math.max(0, finalAcc),
      errors: state.errors.length,
      progress: Math.round((state.cursorIndex / content.length) * 100),
      startTime: state.startTime,
      completed: true,
      formAccuracy: finalAcc
    });
  }, [state, content.length, onComplete]);

  useEffect(() => {
    if (lessonType === 'burst' && state.startTime && isActive) {
      const timer = setTimeout(() => finalizeSession(), 15000);
      return () => clearTimeout(timer);
    }
  }, [lessonType, state.startTime, isActive, finalizeSession]);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isActive, activeLessonId]);

  useEffect(() => {
    reset();
    if (inputRef.current) inputRef.current.value = '';
    if (onActiveKeyChange) onActiveKeyChange(content[0] || null);
  }, [content, onActiveKeyChange, reset]);

  // Finger Logic
  const getFingerForChar = useCallback((c: string): string => {
    const char = c.toLowerCase();
    if (char === ' ') return 'thumb';
    const rowIdx = KEYBOARD_ROWS.findIndex(row =>
      row.some(k => {
        const m = LAYOUTS['qwerty'][k.code];
        return m && (m.default === char || m.shift === char);
      })
    );
    if (rowIdx === -1) return 'thumb';
    const key = KEYBOARD_ROWS[rowIdx].find(k => {
      const m = LAYOUTS['qwerty'][k.code];
      return m && (m.default === char || m.shift === char);
    });
    return key?.finger || 'thumb';
  }, []);

  useEffect(() => {
    const targetChar = content[state.cursorIndex];
    if (onActiveKeyChange) onActiveKeyChange(targetChar || null);
    if (onFingerChange && targetChar) onFingerChange(getFingerForChar(targetChar));
  }, [state.cursorIndex, content, onActiveKeyChange, onFingerChange, getFingerForChar]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (state.cursorIndex >= content.length) return;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
    if (e.key === ' ') e.preventDefault();

    PerformanceMonitor.startMeasure('keystroke-response');

    const isCorrect = handleInput(e.key);
    if (soundEnabled) playSound();

    if (isCorrect && state.cursorIndex + 1 === content.length) {
      finalizeSession();
    }

    // Measure time until the end of this tick (approximate React render)
    requestAnimationFrame(() => PerformanceMonitor.endMeasure('keystroke-response'));
  }, [state.cursorIndex, content.length, handleInput, soundEnabled, playSound, finalizeSession]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative py-10 contain-layout" onClick={() => inputRef.current?.focus()}>
      <input
        ref={inputRef}
        type="text"
        inputMode="none"
        className="absolute opacity-0 pointer-events-none"
        onKeyDown={onKeyDown}
        autoComplete="off"
      />

      {state.shake && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 z-50 will-change-transform">
          <AlertCircle size={14} /> Correct your form!
        </div>
      )}

      <div className={`w-full max-w-[95vw] flex flex-wrap justify-center leading-relaxed tracking-tight select-none will-change-transform ${state.shake ? 'animate-shake' : ''}`}>
        {content.split('').map((char, idx) => (
          <CharSpan
            key={idx}
            char={char}
            idx={idx}
            cursorIndex={state.cursorIndex}
            isError={state.errors.includes(idx)}
            isPassed={idx < state.cursorIndex}
            fontSize={fontSize}
          />
        ))}
      </div>
    </div>
  );
};

const getTextSizeClass = (size: FontSize) => {
  switch (size) {
    case 'small': return "text-xl md:text-3xl";
    case 'medium': return "text-3xl md:text-5xl";
    case 'large': return "text-4xl md:text-7xl";
    case 'xl': return "text-5xl md:text-8xl";
    default: return "text-3xl md:text-5xl";
  }
};

export default memo(TypingArea);
