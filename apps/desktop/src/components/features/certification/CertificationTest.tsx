// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION TEST - 5-minute timed typing test UI
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CertificationTier, CertificationTest as CertTest, TIER_COLORS, TIER_ICONS } from '../../../types/certifications';
import { CERTIFICATION_TIERS } from '../../../data/certifications';
import { formatTimeRemaining } from '../../../core/certificationService';

interface CertificationTestProps {
    test: CertTest;
    onComplete: (wpm: number, accuracy: number) => void;
    onCancel: () => void;
}

export const CertificationTest: React.FC<CertificationTestProps> = ({
    test,
    onComplete,
    onCancel,
}) => {
    const tierInfo = CERTIFICATION_TIERS.find(t => t.tier === test.tier);
    const color = TIER_COLORS[test.tier];
    const icon = TIER_ICONS[test.tier];

    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(test.duration_seconds);
    const [isStarted, setIsStarted] = useState(false);
    const [charIndex, setCharIndex] = useState(0);
    const [errors, setErrors] = useState(0);
    const [totalTyped, setTotalTyped] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const startTimeRef = useRef<number>(0);

    // Timer
    useEffect(() => {
        if (!isStarted || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    finishTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isStarted]);

    const finishTest = useCallback(() => {
        const elapsedMinutes = (test.duration_seconds - timeLeft) / 60 || 0.01;
        const wordsTyped = charIndex / 5; // Standard: 5 chars = 1 word
        const wpm = Math.round(wordsTyped / elapsedMinutes);
        const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
        onComplete(wpm, accuracy);
    }, [charIndex, errors, totalTyped, timeLeft, test.duration_seconds, onComplete]);

    const startTest = () => {
        setIsStarted(true);
        startTimeRef.current = Date.now();
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isStarted) return;

        // Complete on text end
        if (charIndex >= test.text.length) {
            finishTest();
            return;
        }

        if (e.key.length === 1) {
            setTotalTyped(prev => prev + 1);

            if (e.key === test.text[charIndex]) {
                setCharIndex(prev => prev + 1);
                setInput(prev => prev + e.key);
            } else {
                setErrors(prev => prev + 1);
            }
        } else if (e.key === 'Backspace' && charIndex > 0) {
            setCharIndex(prev => prev - 1);
            setInput(prev => prev.slice(0, -1));
        }
    };

    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
    const progress = (charIndex / test.text.length) * 100;

    return (
        <div className="min-h-full p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onCancel}
                        className="text-white opacity-60 hover:opacity-100 transition-colors"
                    >
                        ← Cancel
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{icon}</span>
                        <h1 className="text-xl font-bold" style={{ color }}>
                            {tierInfo?.name} Certification Test
                        </h1>
                    </div>
                </div>

                {/* Timer */}
                <div
                    className={`
            text-3xl font-mono font-bold px-4 py-2 rounded-lg
            ${timeLeft <= 60 ? 'bg-black/10 text-white animate-pulse border border-black/20' : 'bg-black/5 text-white'}
          `}
                >
                    {formatTimeRemaining(timeLeft)}
                </div>
            </div>

            {/* Requirements reminder */}
            <div className="flex gap-6 mb-6 text-sm">
                <div className="text-white opacity-60">
                    Required: <span style={{ color }}>{tierInfo?.min_wpm}+ WPM</span>
                </div>
                <div className="text-white opacity-60">
                    Accuracy: <span style={{ color }}>{tierInfo?.min_accuracy}%+</span>
                </div>
            </div>

            {/* Text display */}
            <div className="flex-1 bg-white/5 rounded-xl p-6 mb-6 overflow-auto">
                {!isStarted ? (
                    <div className="flex flex-col items-center justify-center h-full gap-6">
                        <div className="text-6xl">{icon}</div>
                        <h2 className="text-2xl font-bold text-white">Ready to begin?</h2>
                        <p className="text-white opacity-60 text-center max-w-md">
                            You will have 5 minutes to type the text below as quickly and accurately as possible.
                            Focus on both speed and precision.
                        </p>
                        <button
                            onClick={startTest}
                            className="px-8 py-4 bg-white text-black rounded-xl text-lg font-bold hover:bg-white/90 transition-all"
                        >
                            Start Test
                        </button>
                    </div>
                ) : (
                    <div className="text-lg leading-relaxed font-mono">
                        {test.text.split('').map((char, i) => {
                            let className = 'text-white opacity-30'; // Upcoming
                            if (i < charIndex) {
                                className = input[i] === char ? 'text-white' : 'text-white opacity-100 underline decoration-white decoration-2';
                            } else if (i === charIndex) {
                                className = 'text-white bg-black/10 px-0.5';
                            }
                            return (
                                <span key={i} className={className}>
                                    {char}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Hidden input for capturing keystrokes */}
            <input
                ref={inputRef}
                type="text"
                className="absolute -top-full opacity-0"
                onKeyDown={handleKeyDown}
                autoFocus={isStarted}
            />

            {/* Stats bar */}
            {isStarted && (
                <div className="space-y-4">
                    {/* Progress bar */}
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: color,
                            }}
                        />
                    </div>

                    {/* Live stats */}
                    <div className="flex justify-between text-sm">
                        <div className="text-white opacity-60">
                            Progress: <span className="text-white font-bold">{Math.round(progress)}%</span>
                        </div>
                        <div className="text-white opacity-60">
                            Characters: <span className="text-white font-bold">{charIndex}/{test.text.length}</span>
                        </div>
                        <div className="text-white opacity-60">
                            Accuracy: <span className={accuracy >= (tierInfo?.min_accuracy || 95) ? 'text-white' : 'text-white font-black underline'}>
                                {accuracy}%
                            </span>
                        </div>
                        <div className="text-white opacity-60">
                            Errors: <span className="text-white font-black">{errors}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
