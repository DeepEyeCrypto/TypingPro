import { useCallback, useEffect, useState } from 'react';
import { soundManager } from '../utils/SoundManager';
import { useSettingsStore } from '../stores/settingsStore';

export const useSoundEngine = () => {
    const { soundEnabled, setSoundEnabled } = useSettingsStore();
    const [isMuted, setIsMuted] = useState(!soundEnabled);

    useEffect(() => {
        setIsMuted(!soundEnabled);
    }, [soundEnabled]);

    const playClick = useCallback(() => {
        soundManager.playClick();
    }, []);

    const playError = useCallback(() => {
        soundManager.play('error');
    }, []);

    const toggleMute = useCallback(() => {
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        soundManager.setVolume(newState ? 0.5 : 0); // Default volume 50%
    }, [soundEnabled, setSoundEnabled]);

    return {
        playClick,
        playError,
        toggleMute,
        isMuted
    };
};
