import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lesson } from '../data/CurriculumDatabase';
import { FingerGuideOverlay } from './FingerGuideOverlay';
import './TypingArea.css';

interface TypingAreaProps {
    lesson: Lesson;
    onBack: () => void;
    isLoggedIn: boolean;
}

interface CharState {
    char: string;
    status: 'pending' | 'correct' | 'error';
}

export const TypingArea: React.FC<TypingAreaProps> = ({ lesson, onBack, isLoggedIn }) => {
    const [charStates, setCharStates] = useState<CharState[]>(
        lesson.text.split('').map(char => ({ char, status: 'pending' }))
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [stats, setStats] = useState({ wpm: 0, accuracy: 0, consistency: 0 });
    const [isComplete, setIsComplete] = useState(false);
    const typingRef = useRef<HTMLDivElement>(null);

    // CRITICAL: Lock focus to this component
    useEffect(() => {
        const focusTyping = () => {
            if (typingRef.current) {
                typingRef.current.focus();
            }
        };

        // Auto-focus on mount
        focusTyping();

        // Re-focus if window loses focus
        window.addEventListener('focus', focusTyping);

        return () => window.removeEventListener('focus', focusTyping);
    }, []);

    // Handle keystroke
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Ignore if complete
            if (isComplete) return;

            // Allow refreshing (Cmd+R or F5)
            if ((e.metaKey || e.ctrlKey) && e.key === 'r') return;
            if (e.key === 'F5') return;

            // CRITICAL: Prevent default behavior for most keys to avoid scrolling/shortcuts
            if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
                e.preventDefault();
            } else {
                return; // Ignore other keys like Tab, Alt, etc.
            }

            // START TIMER on first keystroke
            if (!startTime && e.key.length === 1) {
                setStartTime(Date.now());
            }

            // BACKSPACE
            if (e.key === 'Backspace') {
                if (currentIndex > 0) {
                    const newIndex = currentIndex - 1;
                    setCurrentIndex(newIndex);
                    setCharStates(prev => {
                        const next = [...prev];
                        next[newIndex].status = 'pending';
                        return next;
                    });
                }
                return;
            }

            // REGULAR CHARACTER
            if (e.key.length === 1 && currentIndex < lesson.text.length) {
                const isCorrect = e.key === lesson.text[currentIndex];

                setCharStates(prev => {
                    const next = [...prev];
                    next[currentIndex].status = isCorrect ? 'correct' : 'error';
                    return next;
                });

                const nextIndex = currentIndex + 1;
                setCurrentIndex(nextIndex);

                // Calculate stats
                if (startTime) {
                    const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
                    const correctCount = charStates.filter(
                        (c, idx) => (idx < currentIndex && c.status === 'correct') || (idx === currentIndex && isCorrect)
                    ).length;
                    const wpm = Math.round((correctCount / 5) / elapsedMinutes) || 0;
                    const accuracy = Math.round((correctCount / nextIndex) * 100) || 0;

                    setStats({ wpm, accuracy, consistency: 95 });
                }

                // Check if complete
                if (nextIndex === lesson.text.length) {
                    setIsComplete(true);
                }
            }
        },
        [currentIndex, startTime, lesson.text, charStates, isComplete]
    );

    useEffect(() => {
        // CRITICAL: Use capture phase to ensure we catch keydown first
        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [handleKeyDown]);

    return (
        <div className="typing-area-container">
            {/* Finger Positioning Guide - Subtle Overlay */}
            <FingerGuideOverlay fingersInvolved={lesson.fingersInvolved} />

            {/* Main Content */}
            <div className="typing-content">
                {/* Lesson Title */}
                <div className="lesson-header">
                    <h2>{lesson.title}</h2>
                    <p>{lesson.description}</p>
                </div>

                {/* Typing Well - MAIN FOCUS */}
                <div
                    className="typing-well glass-morphism"
                    ref={typingRef}
                    tabIndex={0}
                    onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                >
                    {charStates.map((char, idx) => (
                        <span key={idx} className={`char char-${char.status} ${idx === currentIndex ? 'current' : ''}`}>
                            {char.char === ' ' ? '\u00A0' : char.char}
                        </span>
                    ))}
                    {!isComplete && <span className="cursor"></span>}
                </div>

                {/* Stats - Only if Complete */}
                {isComplete && (
                    <div className="stats-display glass-morphism">
                        <div className="stat">
                            <span className="stat-label">WPM</span>
                            <span className="stat-value">{stats.wpm}</span>
                            <span className="stat-target">Target: {lesson.targetWPM}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Accuracy</span>
                            <span className="stat-value">{stats.accuracy}%</span>
                            <span className="stat-target">Target: 99%</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Consistency</span>
                            <span className="stat-value">{stats.consistency}%</span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="btn-back" onClick={onBack}>
                        ← Back to Lessons
                    </button>

                    {isComplete && (
                        <button className="btn-next glass-morphism" onClick={onBack}>
                            Finish Lesson
                        </button>
                    )}
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="progress-bar-simple">
                <div
                    className="progress-fill"
                    style={{ width: `${(currentIndex / lesson.text.length) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export default TypingArea;
