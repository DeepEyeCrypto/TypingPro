
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

  const updateVisuals = useCallback((data: { index: number; isCorrect: boolean; cursorIndex: number; combo: number }) => {
    const { index, isCorrect, cursorIndex, combo } = data;

    // Update the character that was just typed
    const typedSpan = charRefs.current[index];
    if (typedSpan) {
      typedSpan.className = `inline text-center px-[0.5px] transition-all duration-300 font-medium ${getTextSizeClass(fontSize)} ${isCorrect ? 'text-emerald-400' : 'text-rose-500'}`;
    }

    // Update the new cursor position
    const nextSpan = charRefs.current[cursorIndex];
    if (nextSpan) {
      // Premium Vertical Cursor + Blue Underglow
      nextSpan.className = `inline text-center px-[0.5px] font-medium transition-all duration-300 ${getTextSizeClass(fontSize)} text-white relative z-10`;
      nextSpan.innerHTML = `<span class="absolute left-[-2px] bottom-0 w-[3px] h-full bg-sky-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(56,189,248,0.8)]"></span>${content[cursorIndex] === ' ' ? '&nbsp;' : content[cursorIndex]}`;
    }

    // Clean up previous cursor
    const prevSpan = charRefs.current[index];
    if (prevSpan && index !== cursorIndex) {
      // Ensure symbols like &nbsp; are preserved but cursor is gone
      prevSpan.innerHTML = content[index] === ' ' ? '&nbsp;' : content[index];
    }

    if (onActiveKeyChange) onActiveKeyChange(content[cursorIndex] || null);
    if (onFingerChange && content[cursorIndex]) onFingerChange(getHandMapFinger(content[cursorIndex]));
    if (onComboUpdate) onComboUpdate(combo);

    if (workerRef.current && engineRefs.startTime.current) {
      workerRef.current.postMessage({
        type: 'UPDATE_STATS',
        data: {
          cursorIndex: cursorIndex,
          errors: engineRefs.errors.current,
          startTime: engineRefs.startTime.current,
          contentLength: content.length,
          keystrokeLog: engineRefs.keystrokeLog.current,
          wpmTimeline: engineRefs.wpmTimeline.current
        }
      });
    }
  }, [fontSize, content, onActiveKeyChange, onFingerChange, onComboUpdate, engineRefs]);

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
      formAccuracy: finalAcc,
      keystrokeLog: engineRefs.keystrokeLog.current,
      wpmTimeline: engineRefs.wpmTimeline.current
    } as any);
  }, [engineRefs, content.length, onComplete]);

  useEffect(() => {
    if (isActive && inputRef.current) inputRef.current.focus({ preventScroll: true });
  }, [isActive, activeLessonId]);

  useEffect(() => {
    reset();
    if (inputRef.current) inputRef.current.value = '';
    charRefs.current.forEach((span, idx) => {
      if (span) {
        span.className = `inline text-center px-[0.5px] font-medium transition-all duration-300 ${getTextSizeClass(fontSize)} ${idx === 0 ? 'text-white relative z-10' : 'text-white/20'}`;
        if (idx === 0) {
          span.innerHTML = `<span class="absolute left-[-2px] bottom-0 w-[3px] h-full bg-sky-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(56,189,248,0.8)]"></span>${content[0] === ' ' ? '&nbsp;' : content[0]}`;
        } else {
          span.innerHTML = content[idx] === ' ' ? '&nbsp;' : content[idx];
        }
      }
    });
  }, [content, reset, fontSize]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (engineRefs.cursorIndex.current >= content.length) return;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
    if (e.key === ' ') e.preventDefault();
    handleInput(e.key, updateVisuals);
    if (soundEnabled) playSound();
  }, [content.length, handleInput, updateVisuals, soundEnabled, playSound, engineRefs.cursorIndex]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative py-20 px-12" onClick={() => inputRef.current?.focus()}>
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        onKeyDown={onKeyDown}
        autoComplete="off"
      />

      <div className={`w-full max-w-4xl flex flex-wrap justify-center leading-[1.8] select-none ${shake ? 'animate-shake' : ''}`}>
        {content.split('').map((char, idx) => (
          <span
            key={idx}
            ref={el => { charRefs.current[idx] = el; }}
            className={`inline text-center px-[0.5px] font-medium transition-all duration-300 ${getTextSizeClass(fontSize)} ${idx === 0 ? 'text-white relative z-10' : 'text-white/20'}`}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  );
};

// Helper for finger mapping (Simplified for UI polish phase)
const getHandMapFinger = (c: string) => {
  const char = c.toLowerCase();
  if (char === ' ') return 'thumb';
  return 'index'; // Placeholder for visual feedback
};

const getTextSizeClass = (size: FontSize) => {
  switch (size) {
    case 'small': return "text-2xl";
    case 'medium': return "text-3xl";
    case 'large': return "text-4xl";
    case 'xl': return "text-5xl";
    default: return "text-3xl";
  }
};

export default memo(TypingArea);
