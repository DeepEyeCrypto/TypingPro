// ═══════════════════════════════════════════════════════════════════
// CURRENT LESSON CARD - Warm Glass Design
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

interface CurrentLessonProps {
    title: string;
    stage: string;
    targetWpm: number;
    currentLesson: number;
    totalLessons: number;
    onContinue: () => void;
}

export const CurrentLesson: React.FC<CurrentLessonProps> = ({
    title,
    stage,
    targetWpm,
    currentLesson,
    totalLessons,
    onContinue,
}) => {
    const progress = Math.round((currentLesson / totalLessons) * 100);

    return (
        <div className="wg-card wg-lesson-card">
            {/* Header Image/Gradient */}
            <div
                className="h-40 rounded-t-[20px] flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, #00ff41 0%, #00d4aa 50%, #00aa66 100%)',
                }}
            >
                <div className="text-center text-white">
                    <span className="text-5xl">⌨️</span>
                    <p className="mt-2 text-sm opacity-80">{stage}</p>
                </div>
            </div>

            {/* Content */}
            <div className="wg-lesson-content">
                <h3 className="wg-lesson-title">{title}</h3>

                {/* Stats Row */}
                <div className="wg-lesson-stats">
                    <div className="wg-lesson-stat">
                        <span>⚡</span>
                        <strong>{targetWpm}</strong>
                        <span>WPM Target</span>
                    </div>
                    <div className="wg-lesson-stat">
                        <span>📊</span>
                        <strong>{currentLesson}/{totalLessons}</strong>
                        <span>Complete</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #00ff41, #00d4aa)',
                        }}
                    />
                </div>

                {/* Action Button */}
                <button className="wg-button w-full justify-center" onClick={onContinue}>
                    Continue Lesson
                    <span>→</span>
                </button>
            </div>
        </div>
    );
};
