import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useApp } from './AppContext';

type SoundType = 'off' | 'click' | 'typewriter' | 'mech';

interface SoundContextType {
    soundType: SoundType;
    setSoundType: (type: SoundType) => void;
    playSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Web Audio API helper to generate synthetic sounds (lightweight, no assets needed)
const createClickSound = (ctx: AudioContext, type: SoundType) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'click') {
        // High pitched short click
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.type = 'sine';
    } else if (type === 'typewriter') {
        // Mechanical heavy clack
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.05);
        gain.gain.setValueAtTime(0.8, t); // Louder
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        osc.type = 'square';
    } else if (type === 'mech') {
        // Cherry Blue style (high click + low thud)
        osc.frequency.setValueAtTime(1500, t);
        osc.frequency.exponentialRampToValueAtTime(1000, t + 0.02);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);
        osc.type = 'sawtooth';

        // Add a thud
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.frequency.setValueAtTime(200, t);
        osc2.frequency.exponentialRampToValueAtTime(50, t + 0.1);
        gain2.gain.setValueAtTime(0.4, t);
        gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(t);
        osc2.stop(t + 0.1);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { settings } = useApp();
    const [soundType, setSoundType] = useState<SoundType>('mech'); // Default to mechanical
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Initialize AudioContext on first user interaction (or mount if allowed)
    useEffect(() => {
        const initAudio = () => {
            try {
                if (!audioCtxRef.current) {
                    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                    if (AudioContextClass) {
                        audioCtxRef.current = new AudioContextClass();
                    }
                }
                if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
                    audioCtxRef.current.resume().catch(e => console.warn("Audio resume failed", e));
                }
            } catch (error) {
                console.error("Failed to initialize AudioContext", error);
            }
        };
        window.addEventListener('keydown', initAudio, { once: true });
        window.addEventListener('click', initAudio, { once: true });
        return () => {
            window.removeEventListener('keydown', initAudio);
            window.removeEventListener('click', initAudio);
        };
    }, []);

    const playSound = () => {
        if (soundType === 'off' || !settings.soundEnabled) return;
        if (audioCtxRef.current) {
            // ensure context is running
            if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
            createClickSound(audioCtxRef.current, soundType);
        }
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
