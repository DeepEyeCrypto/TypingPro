import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@src/stores/authStore';
import { friendService } from '@src/services/friendService';
import { db } from '@src/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import './DuelArena.css';

interface Props {
    duelId: string;
    onEnd: () => void;
}

import { invoke } from '@tauri-apps/api/core';

export const DuelArena: React.FC<Props> = ({ duelId, onEnd }) => {
    const { profile, user } = useAuthStore();
    const [duelData, setDuelData] = useState<any>(null);
    const [input, setInput] = useState('');
    const [myProgress, setMyProgress] = useState(0);
    const [text, setText] = useState('The quick brown fox jumps over the lazy dog.'); // Example text

    useEffect(() => {
        if (!duelId) return;

        const unsub = onSnapshot(doc(db, 'active_duels', duelId), (doc) => {
            if (doc.exists()) {
                setDuelData(doc.data());
            }
        });

        // Initialize Discord Presence for Duel
        invoke('update_presence', {
            state: 'In 1v1 Duel',
            details: `Vs Opponent | Text: ${text.substring(0, 10)}...`
        });

        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key.length === 1) {
                handleKeystroke(e.key);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);

        return () => {
            unsub();
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [duelId, input, text]);

    const handleKeystroke = async (char: string) => {
        const nextInput = input + char;
        if (text.startsWith(nextInput)) {
            setInput(nextInput);
            const progress = (nextInput.length / text.length) * 100;
            const wpm = Math.floor((nextInput.length / 5) / (1 / 60)); // Placeholder

            setMyProgress(progress);
            const role = user?.id === duelData?.challenger ? 'challenger' : 'opponent';
            await friendService.updateDuelProgress(duelId, role, progress, wpm);

            if (nextInput === text) {
                // Handle victory
                invoke('update_presence', { state: 'Victory!', details: 'Won a 1v1 Duel' });
            }
        }
    };

    const myWpm = user?.id === duelData?.challenger ? duelData?.challengerWPM : duelData?.opponentWPM;
    const oppWpm = user?.id === duelData?.challenger ? duelData?.opponentWPM : duelData?.challengerWPM;
    const oppProgress = user?.id === duelData?.challenger ? duelData?.opponentProgress : duelData?.challengerProgress;

    return (
        <div className="duel-arena-overlay">
            <div className="duel-header">
                <div className="match-badge">MATCH POINT</div>
                <div className="duel-timer">LIVE</div>
            </div>

            <div className="duel-split-container">
                <div className="duel-section player-me">
                    <div className="player-info">
                        <img src={profile?.avatar_url} alt="Me" className="mini-avatar" />
                        <span>{profile?.username} (You)</span>
                        <div className="intensity-bar-v">
                            <div className="fill" style={{ height: `${(myWpm || 0) / 1.5}%` }}></div>
                            <label>{myWpm || 0} WPM</label>
                        </div>
                    </div>
                    <div className="typing-zone-mini glass-panel">
                        {/* Interactive typing input would emit handleProgress */}
                        <div className="progress-indicator" style={{ width: `${myProgress}%` }}></div>
                    </div>
                </div>

                <div className="duel-divider"></div>

                <div className="duel-section player-opponent">
                    <div className="player-info">
                        <div className="intensity-bar-v opponent">
                            <div className="fill" style={{ height: `${(oppWpm || 0) / 1.5}%` }}></div>
                            <label>{oppWpm || 0} WPM</label>
                        </div>
                        <span>Opponent</span>
                        <img src="https://via.placeholder.com/40" alt="Opponent" className="mini-avatar" />
                    </div>
                    <div className="typing-zone-mini glass-panel ghost">
                        <div className="progress-indicator opponent" style={{ width: `${oppProgress || 0}%` }}></div>
                        <span className="ghost-text">Typing...</span>
                    </div>
                </div>
            </div>

            <button onClick={onEnd} className="forfeit-btn">Forfeit Duel</button>
        </div>
    );
};
