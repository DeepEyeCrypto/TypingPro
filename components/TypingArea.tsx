
import React, { useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { Stats, FontSize, CursorStyle, TrainingMode } from '../types';
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
  onFingerChange?: (finger: string | null) => void;
  fontFamily: string;
  fontSize: FontSize;
  cursorStyle: CursorStyle;
  stopOnError: boolean;
  trainingMode: TrainingMode;
  lessonType?: 'standard' | 'burst';
  isMasterMode?: boolean;
  newKeys?: string[];
  fontColor?: string;
  onComboUpdate?: (combo: number) => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({
  content,
  onComplete,
  onRestart,
  activeLessonId,
  isActive,
  soundEnabled,
  onActiveKeyChange,
  onStatsUpdate,
  fontSize,
  cursorStyle,
  stopOnError,
  lessonType,
  isMasterMode,
  onComboUpdate,
  onFingerChange
}) => {
  const { playSound } = useSound();
  const { engineRefs, handleInput, reset, shake, isComplete } = useTypingEngine(content, stopOnError);

  const workerRef = useRef<Worker | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Track previous cursor index for direct DOM cleanup
  const prevCursorIndex = useRef(0);

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

  // Finger Logic (Memoized for speed)
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

  const updateVisuals = useCallback((data: { index: number; isCorrect: boolean; cursorIndex: number; combo: number }) => {
    const { index, isCorrect, cursorIndex, combo } = data;

    // Update the character that was just typed
    const typedSpan = charRefs.current[index];
    if (typedSpan) {
      typedSpan.className = `inline text-center px-[0.5px] tracking-wide transition-all duration-300 ${getTextSizeClass(fontSize)} ${isCorrect ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`;
    }

    // Update the new cursor position
    const nextSpan = charRefs.current[cursorIndex];
    if (nextSpan) {
      nextSpan.className = `inline text-center px-[0.5px] tracking-wide transition-all duration-300 ${getTextSizeClass(fontSize)} bg-sky-500 text-white rounded-xl shadow-lg relative z-10 mx-[2px] scale-110`;
    }

    // Non-critical updates
    if (onActiveKeyChange) onActiveKeyChange(content[cursorIndex] || null);
    if (onFingerChange && content[cursorIndex]) onFingerChange(getFingerForChar(content[cursorIndex]));
    if (onComboUpdate) onComboUpdate(combo);

    // Sync with worker
    if (workerRef.current && engineRefs.startTime.current) {
      workerRef.current.postMessage({
        type: 'UPDATE_STATS',
        data: {
          cursorIndex: cursorIndex,
          errors: engineRefs.errors.current,
          startTime: engineRefs.startTime.current,
          contentLength: content.length,
          keypressTimestamps: engineRefs.keypressTimestamps.current
        }
      });
    }
  }, [fontSize, content, onActiveKeyChange, onFingerChange, onComboUpdate, getFingerForChar, engineRefs]);

  const finalizeSession = useCallback(() => {
    if (!engineRefs.startTime.current) return;
    const finalTime = Date.now();
    const durationMs = finalTime - engineRefs.startTime.current;
    const timeMin = Math.max(0.1, durationMs / 60000);
    const cursorIndex = engineRefs.cursorIndex.current;
    const errors = engineRefs.errors.current.length;
    const finalWpm = Math.round((cursorIndex / 5) / timeMin);
    const finalAcc = Math.round(((cursorIndex - errors) / Math.max(1, cursorIndex)) * 100);

    onComplete({
      wpm: finalWpm,
      accuracy: Math.max(0, finalAcc),
      errors,
      progress: Math.round((cursorIndex / content.length) * 100),
      startTime: engineRefs.startTime.current,
      completed: true,
      formAccuracy: finalAcc
    });
  }, [engineRefs, content.length, onComplete]);

  // Master Mode Logic: Restart on any error
  useEffect(() => {
    if (isMasterMode && engineRefs.errors.current.length > 0) {
      onRestart();
    }
  }, [engineRefs.errors.current.length, isMasterMode, onRestart]);

  // Burst Mode Logic: 15-second limit
  useEffect(() => {
    if (lessonType === 'burst' && engineRefs.startTime.current && isActive) {
      const timer = setTimeout(() => {
        finalizeSession();
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [lessonType, isActive, engineRefs.startTime.current, finalizeSession]);

  useEffect(() => {
    if (isComplete) {
      finalizeSession();
    }
  }, [isComplete, finalizeSession]);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isActive, activeLessonId]);

  useEffect(() => {
    reset();
    if (inputRef.current) inputRef.current.value = '';
    // Reset visual spans
    charRefs.current.forEach((span, idx) => {
      if (span) {
        span.className = `inline text-center px-[0.5px] tracking-wide transition-all duration-300 ${getTextSizeClass(fontSize)} ${idx === 0 ? 'bg-sky-500 text-white rounded-xl shadow-lg relative z-10 mx-[2px] scale-110' : 'text-slate-400 dark:text-white/20'}`;
      }
    });
    if (onActiveKeyChange) onActiveKeyChange(content[0] || null);
  }, [content, onActiveKeyChange, reset, fontSize]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (engineRefs.cursorIndex.current >= content.length) return;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
    if (e.key === ' ') e.preventDefault();

    PerformanceMonitor.startMeasure('keystroke-response');

    handleInput(e.key, updateVisuals);
    if (soundEnabled) playSound();

    requestAnimationFrame(() => PerformanceMonitor.endMeasure('keystroke-response'));
  }, [content.length, handleInput, updateVisuals, soundEnabled, playSound, engineRefs.cursorIndex]);

  const chars = useMemo(() => content.split('').map((char, idx) => (
    <span
      key={idx}
      ref={el => { charRefs.current[idx] = el; }}
      className={`inline text-center px-[0.5px] tracking-wide transition-all duration-300 ${getTextSizeClass(fontSize)} ${idx === 0 ? 'bg-sky-500 text-white rounded-xl shadow-lg relative z-10 mx-[2px] scale-110' : 'text-slate-400 dark:text-white/20'}`}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  )), [content, fontSize]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative py-12 contain-layout" onClick={() => inputRef.current?.focus()}>
      <input
        ref={inputRef}
        type="text"
        inputMode="none"
        className="absolute opacity-0 pointer-events-none"
        onKeyDown={onKeyDown}
        autoComplete="off"
      />

      {shake && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 z-50 animate-ios-slide">
          <AlertCircle size={16} /> Correct your posture!
        </div>
      )}

      <div className={`w-full max-w-[95vw] flex flex-wrap justify-center leading-relaxed select-none will-change-transform ${shake ? 'animate-shake' : ''}`}>
        {chars}
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
