
import React, { useEffect, useRef, useState } from 'react';
import { Stats, FontSize, CursorStyle, KeyStats, TrainingMode } from '../types';
import { playSound } from '../services/audioService';
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
  onSessionStats?: (stats: Record<string, KeyStats>) => void;
  fontFamily: string;
  fontSize: FontSize;
  cursorStyle: CursorStyle;
  stopOnError: boolean;
  trainingMode: TrainingMode;
  newKeys?: string[];
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
  newKeys
}) => {
  const [input, setInput] = useState('');
  const [cursorIndex, setCursorIndex] = useState(0);
  const [errors, setErrors] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [currentKeyStats, setCurrentKeyStats] = useState<Record<string, KeyStats>>({});

  // Advanced Timing: Idle Time Tracking
  const [totalIdleTime, setTotalIdleTime] = useState(0);
  const lastInputTime = useRef<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
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
        onStatsUpdate(stats);
      }, 500);
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

      return {
        ...prev,
        [key]: {
          ...current,
          totalPresses: newTotal,
          errorCount: newErrors,
          accuracy: newAcc
        }
      };
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
      if (soundEnabled) playSound('click');
      updateKeyStat(keyChar, false);
    } else {
      // Incorrect key press
      if (soundEnabled) playSound('error');

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
      case 'small': return "text-2xl md:text-3xl lg:text-4xl";
      case 'medium': return "text-3xl md:text-5xl lg:text-6xl";
      case 'large': return "text-5xl md:text-7xl lg:text-8xl"; // Default
      case 'xl': return "text-6xl md:text-8xl lg:text-9xl";
      default: return "text-5xl md:text-7xl lg:text-8xl";
    }
  };

  const getCursorClass = () => {
    const base = " animate-pulse text-white";
    // Accuracy mode: Blue cursor? Regular: Orange.
    const color = trainingMode === 'accuracy' ? 'bg-blue-500 border-blue-500' : 'bg-[#F97316] border-[#F97316]';

    // Actually, text color needs to be handled too if block
    switch (cursorStyle) {
      case 'block': return base + ` ${color} rounded-[6px]`;
      case 'line': return ` animate-pulse border-l-4 ${color} -ml-[2px]`;
      case 'underline': return ` animate-pulse border-b-4 ${color}`;
      case 'box': return ` animate-pulse border-2 ${color} text-inherit bg-transparent rounded-[6px]`;
      default: return base + ` ${color} rounded-[6px]`;
    }
  };

  const renderText = () => {
    const sizeClass = getTextSizeClass();
    const cursorClass = getCursorClass();

    return content.split('').map((char, idx) => {
      let className = `inline-block text-center border-b-4 border-transparent transition-all duration-75 leading-none px-[2px] font-normal ${sizeClass}`;

      if (idx < cursorIndex) {
        // PAST TEXT
        if (errors.includes(idx)) {
          // Error (Red)
          className += " text-[#EF4444] dark:text-[#EF4444]";
        } else {
          // Correct (Green)
          className += " text-[#10B981] dark:text-[#34C759]";
        }
      } else if (idx === cursorIndex) {
        // CURRENT CURSOR
        className += cursorClass;
        if (cursorStyle === 'box') {
          className += " text-gray-800 dark:text-gray-100";
        }
      } else {
        // FUTURE TEXT
        className += " text-gray-800 dark:text-gray-300";
      }

      return (
        <span key={idx} className={className}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  // Check if we are at start and have new keys to show
  const showNewKeysTip = cursorIndex === 0 && newKeys && newKeys.length > 0;

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full relative outline-none py-2"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 top-0 left-0 w-full h-full cursor-default"
        onKeyDown={handleKeyDown}
        autoFocus
        autoComplete="off"
      />

      <div
        ref={containerRef}
        style={{ fontFamily: fontFamily }}
        className={`
            w-full max-w-7xl mx-auto
            bg-white dark:bg-[#1F2937]
            rounded-3xl border border-gray-100 dark:border-gray-700
            p-6 md:p-8
            leading-relaxed tracking-normal
            flex flex-wrap content-center justify-center
            shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]
            h-full select-none transition-all duration-100
            ${shake ? 'translate-x-[2px] border-red-400 dark:border-red-500' : ''}
        `}
      >
        {renderText()}
      </div>

      {showNewKeysTip && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 animate-bounce">
          <AlertCircle size={16} />
          New Keys: {newKeys.map(k => k.toUpperCase()).join(" & ")}
        </div>
      )}
    </div>
  );
};

export default React.memo(TypingArea);
