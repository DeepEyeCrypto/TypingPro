import React from 'react';
import './TrophyCard.css';

interface Props {
    rank: string;
    wpm: number;
    accuracy: number;
    streak: number;
    username: string;
}

export const TrophyCard: React.FC<Props> = ({ rank, wpm, accuracy, streak, username }) => {
    return (
        <div className="trophy-card glass-panel" id="trophy-capture-area">
            <div className="trophy-brand">TypingPro</div>

            <div className="trophy-badge-container">
                <div className={`rank-badge-large ${rank.toLowerCase()}`}>
                    {/* SVG would go here */}
                    <span className="rank-label">{rank} RANK</span>
                </div>
            </div>

            <div className="trophy-title">ELITE ACHIEVEMENT TROPHY</div>

            <div className="trophy-metrics">
                <div className="metric">
                    <span className="val">{wpm}</span>
                    <span className="lab">WPM</span>
                </div>
                <div className="metric">
                    <span className="val">{accuracy}%</span>
                    <span className="lab">ACC</span>
                </div>
            </div>

            <div className="trophy-streak">
                <span className="fire-icon">🔥</span>
                <span className="streak-val">{streak} DAY STREAK</span>
            </div>

            <div className="trophy-footer">
                <span className="user-tag">@{username}</span>
                <span className="verified-check">✓ Verified</span>
            </div>
        </div>
    );
};
