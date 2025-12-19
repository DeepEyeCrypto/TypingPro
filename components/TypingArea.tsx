
import React, { useEffect, useRef, useState } from 'react';
import { Stats, FontSize, CursorStyle, KeyStats, TrainingMode } from '../types';
import { useSound } from '../contexts/SoundContext'; // Changed import
import { AlertCircle } from 'lucide-react';

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
  onFingerChange?: (finger: string | null) => void; // New callback
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
  const [combo, setCombo] = useState(0);
  const [lastCorrectFinger, setLastCorrectFinger] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const finalizeSession = () => {
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
      completed: true
    });
  };

  // Burst Mode Timer
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
  }, [lessonType, startTime, isActive]);

  // Helper to get finger for the current char
  const getExpectedFinger = (idx: number) => {
    const char = content[idx];
    if (!char) return null;

    // Find in KEYBOARD_ROWS constant from keyToFingerMap utils/mapping
    // Actually we can use the existing constants.ts rows as they have finger info
    const lower = char.toLowerCase();
    const rows = (window as any).TAURI_KEYBOARD_ROWS || []; // Fallback if handled globally
    // We'll import KEYBOARD_ROWS for this
    return null; // Placeholder - will implement properly below
  };

  // Focus management
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isActive, activeLessonId]);

  // Reset state
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

  // Report active finger/key
  useEffect(() => {
    const targetChar = content[cursorIndex];
    if (onActiveKeyChange) onActiveKeyChange(targetChar || null);

    // Compute finger (moved from getExpectedFinger logic)
    import('../constants').then(({ KEYBOARD_ROWS, LAYOUTS }) => {
      let finger: string | null = null;
      const char = targetChar?.toLowerCase();
      if (char === ' ') finger = 'thumb';
      else {
        for (const row of KEYBOARD_ROWS) {
          const key = row.find(k => {
            const mappings = LAYOUTS['qwerty'][k.code];
            return mappings && (mappings.default === char || mappings.shift === char);
          });
          if (key) {
            finger = key.finger;
            break;
          }
        }
      }
      if (onFingerChange) onFingerChange(finger);
      setLastCorrectFinger(finger);
    });
  }, [cursorIndex, content, onActiveKeyChange, onFingerChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (cursorIndex >= content.length) return;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
    if (e.key === ' ') e.preventDefault();

    const now = Date.now();
    if (!startTime) setStartTime(now);

    const targetChar = content[cursorIndex];
    const isCorrect = e.key === targetChar;

    if (isCorrect) {
      if (soundEnabled) playSound();
      setCombo(prev => {
        const next = prev + 1;
        if (onComboUpdate) onComboUpdate(next);
        return next;
      });
      setInput(prev => prev + e.key);
      setCursorIndex(prev => prev + 1);

      // Check Completion
      if (cursorIndex + 1 === content.length) {
        const finalTime = Date.now();
        const activeDurationMs = Math.max(1, finalTime - (startTime || finalTime));
        const timeMin = activeDurationMs / 60000;
        const finalWpm = Math.round((content.length / 5) / timeMin);
        const finalAcc = Math.round(((content.length - errors.length) / content.length) * 100);

        onComplete({
          wpm: finalWpm,
          accuracy: Math.max(0, finalAcc),
          errors: errors.length,
          progress: 100,
          startTime: startTime,
          completed: true
        });
      }
    } else {
      // In "Accuracy Lock" (stopOnError) mode, we don't advance and show corrective feedback
      if (soundEnabled) playSound();
      setCombo(0);
      if (onComboUpdate) onComboUpdate(0);
      setShake(true);
      setTimeout(() => setShake(false), 200);

      if (!errors.includes(cursorIndex)) {
        setErrors(prev => [...prev, cursorIndex]);
      }

      if (!stopOnError) {
        setInput(prev => prev + e.key);
        setCursorIndex(prev => prev + 1);
      }
    }
  };

  const renderedText = React.useMemo(() => {
    return content.split('').map((char, idx) => {
      let className = `inline text-center transition-all duration-75 px-[0.5px] ${getTextSizeClass(fontSize)} `;
      if (idx === cursorIndex) {
        className += "bg-brand/80 text-white rounded-lg shadow-[0_0_20px_rgba(var(--brand-rgb),0.5)] glow-text scale-110 relative z-10 mx-1";
        if (shake) className += " animate-pulse bg-red-500 shadow-red-500/50";
      } else if (idx < cursorIndex) {
        className += errors.includes(idx) ? "text-red-500/80" : "text-white/20";
      } else {
        className += "text-white/40";
      }
      return <span key={idx} className={className}>{char === ' ' ? '\u00A0' : char}</span>;
    });
  }, [content, cursorIndex, errors, shake, fontSize]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative py-10" onClick={() => inputRef.current?.focus()}>
      <input ref={inputRef} type="text" inputMode="none" className="absolute opacity-0" onKeyDown={handleKeyDown} autoComplete="off" />

      {/* Burst Timer Overlay */}
      {timeLeft !== null && (
        <div className="absolute top-10 right-10 flex flex-col items-center">
          <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">Time Remaining</span>
          <span className={`text-4xl font-black ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-brand'}`}>
            {timeLeft}s
          </span>
        </div>
      )}

      {/* Finger Hint Popup */}
      {shake && lastCorrectFinger && (
        <div className="absolute top-0 animate-bounce bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
          <AlertCircle size={14} /> Use {lastCorrectFinger.replace('-', ' ')}
        </div>
      )}

      <div className={`w-full max-w-[95vw] flex flex-wrap justify-center leading-relaxed tracking-tight select-none ${shake ? 'animate-shake' : ''}`}>
        {renderedText}
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

export default React.memo(TypingArea);
