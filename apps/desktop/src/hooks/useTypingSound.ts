import { useCallback } from 'react';
import { soundManager } from '../utils/SoundManager';

export const useTypingSound = () => {
    /**
     * Plays a mechanical keyboard click with randomized pitch
     */
    const playKeypress = useCallback(() => {
        soundManager.playClick(); // Already handles randomized pitch (0.9 - 1.1) in SoundManager
    }, []);

    /**
     * Plays a subtle thud for errors
     */
    const playError = useCallback(() => {
        soundManager.play('error');
    }, []);

    return {
        playKeypress,
        playError
    };
};
