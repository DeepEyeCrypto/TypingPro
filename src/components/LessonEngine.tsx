import React, { useState, useEffect, useRef } from 'react';
import { Lesson } from '../data/CurriculumDatabase';
import FingerGuide from './FingerGuide';
import './LessonEngine.css';

interface LessonEngineProps {
    lesson: Lesson;
    onComplete: (stats: any) => void;
}

export const LessonEngine: React.FC<LessonEngineProps> = ({ lesson, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [stats, setStats] = useState({ wpm: 0, accuracy: 0, consistency: 95 });
    const typingInputRef = useRef<HTMLDivElement>(null);

    const chars = lesson.text.split('');

    // Track correct characters (only those typed and correct)
    const [correctFlags, setCorrectFlags] = useState<boolean[]>([]);

    useEffect(() => {
        typingInputRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent browser shortcuts
            if (e.ctrlKey || e.metaKey) return;

            if (!startTime && e.key.length === 1) {
                setStartTime(Date.now());
            }

            if (e.key === 'Backspace') {
                setCurrentIndex(Math.max(0, currentIndex - 1));
                return;
            }

            if (e.key.length === 1 && currentIndex < lesson.text.length) {
                const isCorrect = e.key === lesson.text[currentIndex];

                // Logical progression: we increment index either way, but mark correctness
                // For this specific engine, we only move forward if correct or we move forward anyway?
                // The prompt's CSS has .char.typed.correct and .char.typed.error, so we move regardless.

                const newCorrectFlags = [...correctFlags];
                newCorrectFlags[currentIndex] = isCorrect;
                setCorrectFlags(newCorrectFlags);

                setCurrentIndex(currentIndex + 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, startTime, lesson.text, correctFlags]);

    // Separate effect for stats calculation to avoid keydown lag
    useEffect(() => {
        if (!startTime || currentIndex === 0) return;

        const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
        const correctCount = correctFlags.filter(f => f).length;
        const wpm = Math.round((currentIndex / 5) / elapsedMinutes) || 0;
        const accuracy = Math.round((correctCount / currentIndex) * 100);

        setStats(prev => ({ ...prev, wpm, accuracy }));
    }, [currentIndex, startTime, correctFlags]);

    return (
        <div className="lesson-engine">
            <div className="lesson-header">
                <h2>{lesson.title}</h2>
                <p>{lesson.description}</p>
            </div>

            <FingerGuide fingersInvolved={lesson.fingersInvolved} />

            <div className="typing-well glass-morphism" ref={typingInputRef} tabIndex={0}>
                {chars.map((char, idx) => {
                    let statusClass = 'pending';
                    if (idx < currentIndex) {
                        statusClass = correctFlags[idx] ? 'typed correct' : 'typed error';
                    }
                    return (
                        <span
                            key={idx}
                            className={`char ${statusClass} ${idx === currentIndex ? 'active' : ''}`}
                        >
                            {char}
                        </span>
                    );
                })}
                {currentIndex < chars.length && <span className="cursor"></span>}
            </div>

            <div className="real-time-stats">
                <div className="stat-card">
                    <span className="label">WPM</span>
                    <span className="value">{stats.wpm}</span>
                    <span className="target">Target: {lesson.targetWPM}</span>
                </div>
                <div className="stat-card">
                    <span className="label">Accuracy</span>
                    <span className="value">{stats.accuracy}%</span>
                </div>
                <div className="stat-card">
                    <span className="label">Consistency</span>
                    <span className="value">{stats.consistency}%</span>
                </div>
            </div>

            {currentIndex === lesson.text.length && (
                <button className="btn-complete" onClick={() => onComplete(stats)}>
                    Lesson Complete! Next Lesson →
                </button>
            )}
        </div>
    );
};

export default LessonEngine;
