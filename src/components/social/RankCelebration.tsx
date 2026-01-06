import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@src/stores/authStore';
import { getRank, RankTier } from '@src/utils/rankSystem';
import './RankStyles.css';
import { useRustAudio } from '@src/hooks/useRustAudio';

export const RankCelebration = () => {
    const { profile } = useAuthStore();
    const { playTypingSound } = useRustAudio(); // Assuming we have a 'success' or 'level-up' sound mapped
    const [show, setShow] = useState(false);
    const [newRank, setNewRank] = useState<RankTier | null>(null);
    const [prevWpm, setPrevWpm] = useState<number>(0);

    useEffect(() => {
        if (!profile) return;

        // Initial load - don't celebrate
        if (prevWpm === 0) {
            setPrevWpm(profile.highest_wpm);
            return;
        }

        const oldRank = getRank(prevWpm);
        const currentRank = getRank(profile.highest_wpm);

        if (profile.highest_wpm > prevWpm && currentRank.label !== oldRank.label) {
            // LEVEL UP!
            setNewRank(currentRank.label);
            setShow(true);
            playTypingSound('error'); // Placeholder for now, ideally 'success'

            // Auto hide after 5s
            const timer = setTimeout(() => setShow(false), 5000);
            return () => clearTimeout(timer);
        }

        setPrevWpm(profile.highest_wpm);
    }, [profile?.highest_wpm]);

    if (!show || !newRank) return null;

    const rankInfo = getRank(profile!.highest_wpm);

    return (
        <div className="celebration-overlay">
            <h1 className="levelup-title">Rank Up!</h1>
            <div className="levelup-rank" style={{ color: rankInfo.color }}>
                {newRank} Tier Unlocked
            </div>
            <button className="levelup-btn" onClick={() => setShow(false)}>
                Awesome!
            </button>
        </div>
    );
};
