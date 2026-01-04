
import { useCallback, useEffect, useRef } from 'react';
import { soundManager } from '../utils/SoundManager';

export const useTypingSounds = () => {
    // We use a ref to track if we've initialized the sound engine listeners
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            soundManager.init();
            initialized.current = true;
        }
    }, []);

    const playTypingSound = useCallback((key: string) => {
        if (key === ' ') {
            soundManager.play('space');
        } else if (key === 'Backspace') {
            soundManager.play('backspace');
        } else if (key === 'Enter') {
            soundManager.play('enter');
        } else {
            soundManager.playClick();
        }
    }, []);

    const playErrorSound = useCallback(() => {
        soundManager.play('error');
    }, []);

    return { playTypingSound, playErrorSound };
};
