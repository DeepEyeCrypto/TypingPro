import React from 'react';
import { CURRICULUM } from '../data/CurriculumDatabase';
import './ProgressTracker.css';

interface ProgressTrackerProps {
    currentStage: number;
    lessonsCompleted: number;
    currentWPM: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
    currentStage,
    lessonsCompleted,
    currentWPM,
}) => {
    const totalLessons = CURRICULUM.length;
    const progressPercentage = (lessonsCompleted / totalLessons) * 100;

    const stageTitles = [
        'Home Row Mastery',
        'Alpha Expansion',
        'Numbers & Symbols',
        'Flow State',
        'Muscle Memory',
        'Speed Acceleration',
        'Elite Technique',
        'Champion Training',
    ];

    return (
        <div className="progress-tracker glass-morphism">
            <div className="progress-header">
                <div className="stage-info">
                    <h3>Stage {currentStage}:</h3>
                    <p>{stageTitles[currentStage - 1] || 'Advanced Training'}</p>
                </div>
                <div className="wpm-badge">
                    <span className="wpm-val">{currentWPM}</span>
                    <span className="wpm-unit">WPM</span>
                </div>
            </div>

            <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>

            <p className="progress-stats-text">
                <strong>{lessonsCompleted}</strong> of <strong>{totalLessons}</strong> lessons completed
            </p>

            <div className="stage-milestones">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(stage => (
                    <div
                        key={stage}
                        className={`milestone ${stage < currentStage ? 'completed' : stage === currentStage ? 'active' : 'pending'}`}
                        title={stageTitles[stage - 1]}
                    >
                        {stage}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressTracker;
