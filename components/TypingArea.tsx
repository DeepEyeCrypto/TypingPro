
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
  onKeyStatsUpdate?: (stats: Record<string, KeyStats>) => void; // New prop for live heatmap
  onSessionStats?: (stats: Record<string, KeyStats>) => void;
  fontFamily: string;
  fontSize: FontSize;
  cursorStyle: CursorStyle;
  stopOnError: boolean;
  trainingMode: TrainingMode;
  newKeys?: string[];
  fontColor?: string;
  onComboUpdate?: (combo: number) => void;
}

const IDLE_THRESHOLD = 5000; // 5 seconds

const TypingArea: React.FC<TypingAreaProps> = ({
  content,
  onComplete,
  onRestart,
  activeLessonId,
  isActive,
  soundEnabled,
  onActiveKeyChange,
  onStatsUpdate,
  onSessionStats,
  fontFamily,
  fontSize,
  cursorStyle,
  stopOnError,
  trainingMode,
  newKeys,
  fontColor,
  onComboUpdate,
  onKeyStatsUpdate // Added
}) => {
  const { playSound } = useSound(); // Hook usage
  const [input, setInput] = useState('');
  const [cursorIndex, setCursorIndex] = useState(0);
  const [errors, setErrors] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [currentKeyStats, setCurrentKeyStats] = useState<Record<string, KeyStats>>({});
  const [combo, setCombo] = useState(0);

  // Advanced Timing: Idle Time Tracking
  const [totalIdleTime, setTotalIdleTime] = useState(0);
  const lastInputTime = useRef<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isActive, activeLessonId]);

  // Reset state when content changes
  useEffect(() => {
    setInput('');
    setCursorIndex(0);
    setErrors([]);
    setStartTime(null);
    setTotalIdleTime(0);
    setCurrentKeyStats({});
    setCombo(0);
    lastInputTime.current = 0;
    onStatsUpdate({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
    if (inputRef.current) inputRef.current.value = '';
    if (onActiveKeyChange) onActiveKeyChange(content[0] || null);
  }, [content, onActiveKeyChange]);

  // Report active key
  useEffect(() => {
    if (onActiveKeyChange) {
      onActiveKeyChange(content[cursorIndex] || null);
    }
  }, [cursorIndex, content, onActiveKeyChange]);

  // Stats Logic & Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const calculateStats = () => {
      let currentWpm = 0;
      let currentAcc = 100;

      if (startTime) {
        const now = Date.now();
        // Check if currently idle (user walked away while timer running)
        let currentIdle = 0;
        if (lastInputTime.current > 0 && (now - lastInputTime.current) > IDLE_THRESHOLD) {
          currentIdle = (now - lastInputTime.current) - IDLE_THRESHOLD;
        }

        const activeDurationMs = Math.max(1, (now - startTime) - totalIdleTime - currentIdle);
        const timeElapsedMin = activeDurationMs / 60000;
        const words = cursorIndex / 5;

        currentWpm = Math.round(words / timeElapsedMin) || 0;
      }

      if (cursorIndex > 0) {
        const correctChars = cursorIndex - errors.length;
        currentAcc = Math.round((correctChars / cursorIndex) * 100);
        currentAcc = Math.max(0, currentAcc); // Prevent negative
      }

      const progress = content.length > 0 ? Math.round((cursorIndex / content.length) * 100) : 0;

      return { wpm: currentWpm, accuracy: currentAcc, errors: errors.length, progress };
    };

    if (startTime && cursorIndex < content.length) {
      interval = setInterval(() => {
        const stats = calculateStats();
        // Only update if something changed (at least 500ms has passed anyway)
        onStatsUpdate(stats);
      }, 1000); // 1s interval is enough for UI updates, reduces re-renders
    }

    return () => clearInterval(interval);
  }, [startTime, cursorIndex, errors.length, content.length, totalIdleTime]);

  const updateKeyStat = (char: string, isError: boolean) => {
    setCurrentKeyStats(prev => {
      const key = char.toLowerCase();
      const current = prev[key] || { char: key, totalPresses: 0, errorCount: 0, accuracy: 0 };

      const newTotal = current.totalPresses + 1;
      const newErrors = current.errorCount + (isError ? 1 : 0);
      const newAcc = Math.round(((newTotal - newErrors) / newTotal) * 100);

      const updated = {
        ...prev,
        [key]: {
          ...current,
          totalPresses: newTotal,
          errorCount: newErrors,
          accuracy: newAcc
        }
      };
      if (onKeyStatsUpdate) onKeyStatsUpdate(updated);
      return updated;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (cursorIndex >= content.length) return;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
    if (e.key === ' ') e.preventDefault();

    const now = Date.now();
    if (!startTime) {
      setStartTime(now);
      lastInputTime.current = now;
    } else {
      if (lastInputTime.current > 0) {
        const diff = now - lastInputTime.current;
        if (diff > IDLE_THRESHOLD) {
          setTotalIdleTime(prev => prev + (diff - IDLE_THRESHOLD));
        }
      }
      lastInputTime.current = now;
    }

    const targetChar = content[cursorIndex];
    let currentErrorCount = errors.length;
    let shouldAdvance = true;

    // Normalize for stats (case-insensitive for key map, usually)
    // But we might want specific shift stats later. For now, basic char.
    const keyChar = targetChar.toLowerCase();

    if (e.key === targetChar) {
      // Correct key press
      if (soundEnabled) playSound();
      updateKeyStat(keyChar, false);
      setCombo(prev => {
        const next = prev + 1;
        if (onComboUpdate) onComboUpdate(next);
        return next;
      });
    } else {
      // Incorrect key press
      if (soundEnabled) playSound();
      setCombo(0);
      if (onComboUpdate) onComboUpdate(0);

      // Visual Shake
      setShake(true);
      setTimeout(() => setShake(false), 200);

      // Only add to error count if not already marked for this index
      if (!errors.includes(cursorIndex)) {
        setErrors(prev => [...prev, cursorIndex]);
        currentErrorCount++;
        // Stat update (fault logic)
        // We attribute the error to the KEY THAT WAS MISSED (targetChar)
        updateKeyStat(keyChar, true);
      } else {
        // Repeated error on same char? Maybe don't penalize key stats twice?
        // Let's count every press for detailed stats.
        updateKeyStat(keyChar, true);
      }

      if (stopOnError) {
        shouldAdvance = false;
      }
    }

    if (shouldAdvance) {
      // Always Advance
      setInput(prev => prev + e.key);
      setCursorIndex(prev => {
        const newIndex = prev + 1;

        // Check Completion
        if (newIndex === content.length) {
          const finalTime = Date.now();
          const activeDurationMs = Math.max(1, (finalTime - (startTime || finalTime)) - totalIdleTime);
          const timeMin = activeDurationMs / 60000;
          const finalWpm = Math.round((content.length / 5) / timeMin);
          const correctChars = content.length - currentErrorCount;
          const finalAcc = Math.round((correctChars / content.length) * 100);

          // Report Final Key Stats
          if (onSessionStats) onSessionStats(currentKeyStats);

          onComplete({
            wpm: finalWpm,
            accuracy: Math.max(0, finalAcc),
            errors: currentErrorCount,
            progress: 100,
            startTime: startTime,
            completed: true
          });
        }
        return newIndex;
      });
    }
  };

  const getTextSizeClass = () => {
    switch (fontSize) {
      case 'small': return "text-xl md:text-2xl lg:text-3xl xl:text-4xl";
      case 'medium': return "text-2xl md:text-4xl lg:text-5xl xl:text-6xl";
      case 'large': return "text-3xl md:text-5xl lg:text-6xl xl:text-7xl";
      case 'xl': return "text-4xl md:text-6xl lg:text-7xl xl:text-8xl";
      default: return "text-3xl md:text-5xl lg:text-6xl xl:text-7xl";
    }
  };

  const renderedText = React.useMemo(() => {
    const sizeClass = getTextSizeClass();

    return content.split('').map((char, idx) => {
      // Phase 3: Flattened DOM to minimize depth
      const style: React.CSSProperties = {};
      let className = `inline text-center transition-all duration-75 px-[0.5px] ${sizeClass} `;

      if (idx === cursorIndex) {
        className += "bg-brand/80 text-white rounded-lg shadow-[0_0_20px_rgba(var(--brand-rgb),0.5)] glow-text scale-110 relative z-10 mx-1";
        if (shake) className += " animate-pulse bg-red-500 shadow-red-500/50";
      } else if (idx < cursorIndex) {
        className += errors.includes(idx) ? "text-red-500/80" : "text-white/20";
      } else {
        className += "text-white/40";
        if (fontColor) style.color = fontColor;
      }

      return (
        <span key={idx} className={className} style={style}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  }, [content, cursorIndex, errors, shake, fontSize, fontColor, fontFamily]);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative outline-none py-10"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="none"
        className="absolute opacity-0 pointer-events-none"
        onKeyDown={handleKeyDown}
        onChange={() => { }}
        value=""
        autoFocus
        autoComplete="off"
        spellCheck="false"
      />

      <div
        ref={containerRef}
        style={{ fontFamily: fontFamily }}
        className={`w-full h-full max-w-[95vw] mx-auto px-4 md:px-8 lg:px-12 flex flex-wrap content-center justify-center leading-relaxed tracking-tight select-none transition-all duration-500 ${shake ? 'animate-shake' : ''}`}
      >
        {renderedText}
      </div>
    </div>
  );
};

export default React.memo(TypingArea);
