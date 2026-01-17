import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../../../core/store/authStore';
import { getRank, RankInfo } from '../../../core/rankSystem';
import './RankStyles.css';
import { useRustAudio } from '../../../hooks/useRustAudio';

export const RankCelebration = () => {
    const { profile } = useAuthStore();
    const { playTypingSound } = useRustAudio();
    const [show, setShow] = useState(false);
    const [celebrationData, setCelebrationData] = useState<RankInfo | null>(null);
    const lastRankLabel = useRef<string | null>(null);

    useEffect(() => {
        if (!profile) return;

        const currentRank = getRank(profile.highest_wpm || 0);

        // Initial load to set baseline
        if (lastRankLabel.current === null) {
            lastRankLabel.current = currentRank.label;
            return;
        }

        // Detect Rank Change
        if (currentRank.label !== lastRankLabel.current) {
            setCelebrationData(currentRank);
            setShow(true);
            playTypingSound('mechanical'); // Placeholder for level-up sound

            lastRankLabel.current = currentRank.label;
        }
    }, [profile?.highest_wpm]);

    if (!show || !celebrationData || !profile) return null;

    return (
        <div className="celebration-overlay" onClick={() => setShow(false)}>
            <div className="celebration-content" onClick={e => e.stopPropagation()}>
                <h1 className="levelup-title">Rank Up!</h1>
                <div className="levelup-rank" style={{
                    color: celebrationData.color,
                    textShadow: `0 0 20px ${celebrationData.color}66`
                }}>
                    {celebrationData.label} Tier
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>
                    Your performance has elevated you to a new tier.
                </p>
                <button className="levelup-btn" onClick={() => setShow(false)}>
                    Continue
                </button>
            </div>
        </div>
    );
};
