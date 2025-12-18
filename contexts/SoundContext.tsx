import React, { createContext, useContext, useState, useCallback } from 'react';
import { soundManager } from '../services/SoundManager';
import { useApp } from './AppContext';

export type SoundType = 'off' | 'mech';

interface SoundContextType {
    soundType: SoundType;
    setSoundType: (type: SoundType) => void;
    playSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { settings } = useApp();
    const [soundType, setSoundState] = useState<SoundType>('mech');

    const playSound = useCallback(() => {
        if (soundType === 'off' || !settings.soundEnabled) return;
        soundManager.playMechanicalClick();
    }, [soundType, settings.soundEnabled]);

    const setSoundType = (type: SoundType) => {
        setSoundState(type);
    };

    return (
        <SoundContext.Provider value={{ soundType, setSoundType, playSound }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) throw new Error('useSound must be used within SoundProvider');
    return context;
};
