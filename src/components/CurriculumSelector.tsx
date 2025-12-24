import React, { useState } from 'react';
import { CURRICULUM, Lesson } from '../data/CurriculumDatabase';
import './CurriculumSelector.css';

interface CurriculumSelectorProps {
    onSelectLesson: (lesson: Lesson) => void;
}

export const CurriculumSelector: React.FC<CurriculumSelectorProps> = ({
    onSelectLesson,
}) => {
    const [expandedStage, setExpandedStage] = useState(1);

    // Group lessons by stage
    const lessonsByStage = Array.from({ length: 8 }, (_, i) => {
        const stage = i + 1;
        const stageLessons = CURRICULUM.filter(l => l.stage === stage);
        if (stageLessons.length === 0 && stage > 2) return null; // Only show stages with lessons

        return {
            stage,
            lessons: stageLessons,
            title: [
                'Home Row Mastery',
                'Alpha Expansion',
                'Numbers & Symbols',
                'Flow State',
                'Muscle Memory',
                'Speed Acceleration',
                'Elite Technique',
                'Champion Training',
            ][i],
        };
    }).filter(Boolean) as any[];

    return (
        <div className="curriculum-selector">
            <div className="selector-header">
                <h1>Choose Your Lesson</h1>
                <p>Select a lesson to begin your typing journey</p>
            </div>

            <div className="stages-container">
                {lessonsByStage.map(({ stage, lessons, title }) => (
                    <div key={stage} className="stage-section">
                        <button
                            className={`stage-header ${expandedStage === stage ? 'expanded' : ''}`}
                            onClick={() => setExpandedStage(expandedStage === stage ? -1 : stage)}
                        >
                            <span className="stage-number">Stage {stage}</span>
                            <span className="stage-title">{title}</span>
                            <span className="lesson-count">{lessons.length} lessons</span>
                            <span className="expand-icon">▼</span>
                        </button>

                        {expandedStage === stage && (
                            <div className="lessons-grid">
                                {lessons.map((lesson) => (
                                    <button
                                        key={lesson.id}
                                        className="lesson-card glass-morphism"
                                        onClick={() => onSelectLesson(lesson)}
                                    >
                                        <div className="lesson-number">{lesson.lessonNumber}</div>
                                        <div className="lesson-title">{lesson.title}</div>
                                        <div className="lesson-meta">
                                            <span className="target-wpm">{lesson.targetWPM} WPM</span>
                                            <span className="difficulty">{lesson.difficulty}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurriculumSelector;
