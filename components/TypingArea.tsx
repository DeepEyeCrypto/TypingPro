
import React, { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import { Stats, FontSize, CursorStyle, KeyStats, TrainingMode, FingerStats } from '../types';
import { useSound } from '../contexts/SoundContext';
import { AlertCircle } from 'lucide-react';
import { KEYBOARD_ROWS, LAYOUTS } from '../constants';

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

// Optimized character component
const CharSpan = memo(({ char, idx, cursorIndex, isError, isPassed, shake, fontSize }: {
  char: string,
  idx: number,
  cursorIndex: number,
  isError: boolean,
  isPassed: boolean,
  shake: boolean,
  fontSize: FontSize
}) => {
  let className = `inline text-center transition-all duration-75 px-[0.5px] ${getTextSizeClass(fontSize)} `;

  if (idx === cursorIndex) {
    className += "bg-brand/80 text-white rounded-lg shadow-[0_0_20px_rgba(var(--brand-rgb),0.5)] glow-text scale-110 relative z-10 mx-1";
    if (shake) className += " animate-pulse bg-red-500 shadow-red-500/50";
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
  const [input, setInput] = useState('');
  const [cursorIndex, setCursorIndex] = useState(0);
  const [errors, setErrors] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [currentKeyStats, setCurrentKeyStats] = useState<Record<string, KeyStats>>({});
  const [currentFingerStats, setCurrentFingerStats] = useState<Record<string, FingerStats>>({});
  const [combo, setCombo] = useState(0);
  const [lastCorrectFinger, setLastCorrectFinger] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const finalizeSession = useCallback(() => {
    if (!startTime) return;
    const finalTime = Date.now();
    const durationMs = finalTime - startTime;
    const timeMin = Math.max(0.1, durationMs / 60000);
    const finalWpm = Math.round((cursorIndex / 5) / timeMin);
    const finalAcc = Math.round(((cursorIndex - errors.length) / Math.max(1, cursorIndex)) * 100);

    onComplete({
      wpm: finalWpm,
      accuracy: Math.max(0, finalAcc),
      errors: errors.length,
      progress: Math.round((cursorIndex / content.length) * 100),
      startTime: startTime,
      completed: true,
      keyStats: currentKeyStats,
      fingerStats: currentFingerStats,
      formAccuracy: Math.round(((cursorIndex - errors.length) / Math.max(1, cursorIndex)) * 100)
    });
  }, [startTime, cursorIndex, errors.length, content.length, onComplete, currentKeyStats, currentFingerStats]);

  useEffect(() => {
    if (lessonType === 'burst' && startTime && isActive) {
      setTimeLeft(15);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timer);
            finalizeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lessonType, startTime, isActive, finalizeSession]);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isActive, activeLessonId]);

  useEffect(() => {
    setInput('');
    setCursorIndex(0);
    setErrors([]);
    setStartTime(null);
    setCurrentKeyStats({});
    setCombo(0);
    if (inputRef.current) inputRef.current.value = '';
    if (onActiveKeyChange) onActiveKeyChange(content[0] || null);
  }, [content, onActiveKeyChange]);

  // Synchronous reaching of finger - Zero Lag
  const getFingerForChar = useCallback((c: string): string => {
    const char = c.toLowerCase();
    if (char === ' ') return 'thumb';
    for (const row of KEYBOARD_ROWS) {
      const key = row.find(k => {
        const mappings = LAYOUTS['qwerty'][k.code];
        return mappings && (mappings.default === char || mappings.shift === char);
      });
      if (key) return key.finger || 'thumb';
    }
    return 'thumb';
  }, []);

  const [rollingKeypresses, setRollingKeypresses] = useState<number[]>([]);

  useEffect(() => {
    const targetChar = content[cursorIndex];
    if (onActiveKeyChange) onActiveKeyChange(targetChar || null);

    const finger = targetChar ? getFingerForChar(targetChar) : null;
    if (onFingerChange) onFingerChange(finger);
    setLastCorrectFinger(finger);
  }, [cursorIndex, content, onActiveKeyChange, onFingerChange, getFingerForChar]);

  // Rolling WPM Updater
  useEffect(() => {
    if (!startTime || !isActive) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const cutoff = now - 60000;
      setRollingKeypresses(prev => {
        const filtered = prev.filter(t => t > cutoff);
        const wpm = Math.round((filtered.length / 5));
        const acc = Math.round(((cursorIndex - errors.length) / Math.max(1, cursorIndex)) * 100);
        onStatsUpdate({ wpm, accuracy: acc, errors: errors.length, progress: Math.round((cursorIndex / content.length) * 100) });
        return filtered;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isActive, cursorIndex, errors.length, content.length, onStatsUpdate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (cursorIndex >= content.length) return;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
    if (e.key === ' ') e.preventDefault();

    const now = Date.now();
    if (!startTime) setStartTime(now);

    const targetChar = content[cursorIndex];
    if (!targetChar) return;
    const isCorrect = e.key === targetChar;

    const finger = getFingerForChar(targetChar);

    setCurrentFingerStats(prev => {
      const existing = prev[finger] || { finger, totalPresses: 0, errorCount: 0, accuracy: 0 };
      const newPresses = existing.totalPresses + 1;
      const newErrors = existing.errorCount + (isCorrect ? 0 : 1);
      return {
        ...prev,
        [finger]: {
          ...existing,
          totalPresses: newPresses,
          errorCount: newErrors,
          accuracy: Math.round(((newPresses - newErrors) / newPresses) * 100)
        }
      };
    });

    if (isCorrect) {
      if (soundEnabled) playSound();
      setRollingKeypresses(prev => [...prev, now]);
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (onComboUpdate) onComboUpdate(nextCombo);

      const nextIdx = cursorIndex + 1;
      setInput(input + e.key);
      setCursorIndex(nextIdx);

      if (nextIdx === content.length) {
        finalizeSession();
      }
    } else {
      if (soundEnabled) playSound();
      setCombo(0);
      if (onComboUpdate) onComboUpdate(0);
      setShake(true);
      setTimeout(() => setShake(false), 200);

      if (!errors.includes(cursorIndex)) {
        setErrors([...errors, cursorIndex]);
      }

      if (!stopOnError) {
        setInput(input + e.key);
        setCursorIndex(cursorIndex + 1);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative py-10" onClick={() => inputRef.current?.focus()}>
      <input
        ref={inputRef}
        type="text"
        inputMode="none"
        className="absolute opacity-0 pointer-events-none"
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

      {timeLeft !== null && (
        <div className="absolute top-10 right-10 flex flex-col items-center">
          <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">Time Remaining</span>
          <span className={`text-4xl font-black ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-brand'}`}>
            {timeLeft}s
          </span>
        </div>
      )}

      {shake && lastCorrectFinger && (
        <div className="absolute top-0 animate-bounce bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
          <AlertCircle size={14} /> Use {lastCorrectFinger.replace('-', ' ')}
        </div>
      )}

      <div className={`w-full max-w-[95vw] flex flex-wrap justify-center leading-relaxed tracking-tight select-none ${shake ? 'animate-shake' : ''}`}>
        {content.split('').map((char, idx) => (
          <CharSpan
            key={idx}
            char={char}
            idx={idx}
            cursorIndex={cursorIndex}
            isError={errors.includes(idx)}
            isPassed={idx < cursorIndex}
            shake={shake}
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
