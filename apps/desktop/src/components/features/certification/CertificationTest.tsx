// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION TEST - 5-minute timed typing test UI
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CertificationTier, CertificationTest as CertTest, TIER_COLORS, TIER_ICONS } from '../../../types/certifications';
import { CERTIFICATION_TIERS } from '../../../data/certifications';
import { formatTimeRemaining } from '../../../core/certificationService';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Zap, Target, ShieldAlert } from 'lucide-react';

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
        <div className="min-h-full p-6 lg:p-10 flex flex-col max-w-7xl mx-auto pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 border-b border-glass pb-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onCancel}
                        className="p-3 rounded-2xl bg-[var(--glass-bg)] border border-glass shadow-lg hover:scale-110 active:scale-95 transition-all text-[var(--text-primary)]"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] block mb-1 opacity-40" style={{ color: 'var(--text-primary)' }}>Validation_In_Progress</span>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{icon}</span>
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                                {tierInfo?.name} <span className="text-[var(--text-accent)]">Protocol</span>
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Timer */}
                <div
                    className={`
                        flex items-center gap-4 px-8 py-4 rounded-3xl bg-[var(--glass-bg)] border-2 transition-all duration-500
                        ${timeLeft <= 60 ? 'border-[var(--text-accent)] shadow-[0_0_20px_var(--text-accent)]/20 animate-pulse' : 'border-glass shadow-xl'}
                    `}
                >
                    <Clock size={20} className={timeLeft <= 60 ? 'text-[var(--text-accent)]' : 'opacity-40'} />
                    <span className="text-4xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                        {formatTimeRemaining(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Requirements reminder */}
            <div className="flex gap-8 mb-10">
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--glass-bg)] border border-glass rounded-xl shadow-md">
                    <Zap size={14} className="text-[var(--text-accent)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: 'var(--text-primary)' }}>Required:</span>
                    <span className="text-xs font-black italic text-[var(--text-accent)]">{tierInfo?.min_wpm}+ WPM</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--glass-bg)] border border-glass rounded-xl shadow-md">
                    <Target size={14} className="text-[var(--text-accent)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: 'var(--text-primary)' }}>Precision:</span>
                    <span className="text-xs font-black italic text-[var(--text-accent)]">{tierInfo?.min_accuracy}%+</span>
                </div>
            </div>

            {/* Text display */}
            <div className="flex-1 bg-[var(--glass-bg)] border border-glass rounded-[4rem] p-12 lg:p-16 mb-10 overflow-auto shadow-2xl relative">
                {!isStarted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center h-full gap-8 text-center"
                    >
                        <div className="text-9xl drop-shadow-[0_0_30px_rgba(var(--text-accent),0.5)] mb-4">{icon}</div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>Synchronize Pulse</h2>
                            <p className="text-sm opacity-40 max-w-md font-bold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                You will have 5 minutes to validate your synaptic throughput.
                                Any error below {tierInfo?.min_accuracy}% results in immediate protocol failure.
                            </p>
                        </div>
                        <button
                            onClick={startTest}
                            className="px-12 py-5 bg-[var(--text-accent)] text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-[var(--text-accent)]/30 hover:scale-110 active:scale-95 transition-all"
                        >
                            Initiate_Sequence
                        </button>
                    </motion.div>
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
                <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
                    <div className="flex justify-between items-end mb-2 px-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic" style={{ color: 'var(--text-primary)' }}>Validation_Spectrum</span>
                        <div className="flex gap-10">
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-20 block mb-1" style={{ color: 'var(--text-primary)' }}>Precision</span>
                                <span className={`text-2xl font-black italic tracking-tighter ${accuracy < (tierInfo?.min_accuracy || 95) ? 'text-red-500 animate-pulse' : 'text-[var(--text-accent)]'}`}>
                                    {accuracy}%
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-20 block mb-1" style={{ color: 'var(--text-primary)' }}>Errors</span>
                                <span className="text-2xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{errors}</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-4 w-full bg-[var(--glass-bg)] border border-glass rounded-full overflow-hidden p-1 shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-[var(--text-accent)] rounded-full shadow-[0_0_15px_var(--text-accent)]"
                        />
                    </div>
                    <div className="flex justify-between px-4">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-20" style={{ color: 'var(--text-primary)' }}>Buffer: {charIndex} / {test.text.length} Signals</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-accent)]">{Math.round(progress)}% Processed</span>
                    </div>
                </div>
            )}
        </div>
    );
};
