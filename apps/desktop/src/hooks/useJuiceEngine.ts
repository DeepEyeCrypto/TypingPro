import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useJuiceEngine = (options: {
    isSurvivalMode?: boolean,
    onGameOver?: () => void
} = {}) => {
    const { theme } = useTheme();
    const [fuel, setFuel] = useState(100);
    const [combo, setCombo] = useState(0);
    const [isShakeActive, setIsShakeActive] = useState(false);
    const [isComboPulse, setIsComboPulse] = useState(false);

    // Survival Mode Logic
    useEffect(() => {
        if (!options.isSurvivalMode) return;

        const timer = setInterval(() => {
            setFuel(prev => {
                const next = prev - 0.5; // Drain 0.5% every 100ms
                if (next <= 0) {
                    clearInterval(timer);
                    options.onGameOver?.();
                    return 0;
                }
                return next;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [options.isSurvivalMode, options.onGameOver]);

    const triggerCorrect = useCallback(() => {
        if (options.isSurvivalMode) {
            setFuel(prev => Math.min(100, prev + 0.2)); // Refill slightly
        }
    }, [options.isSurvivalMode]);

    const triggerWordComplete = useCallback(() => {
        setCombo(prev => {
            const next = prev + 1;
            if (next % 10 === 0) {
                setIsComboPulse(true);
                setTimeout(() => setIsComboPulse(false), 500);
            }
            return next;
        });

        if (options.isSurvivalMode) {
            setFuel(prev => Math.min(100, prev + 2)); // Word completion bonus
        }
    }, [options.isSurvivalMode]);

    const triggerError = useCallback(() => {
        setCombo(0);
        setIsShakeActive(true);
        setTimeout(() => setIsShakeActive(false), 150);

        if (options.isSurvivalMode) {
            setFuel(prev => Math.max(0, prev - 5)); // Error penalty
        }
    }, [options.isSurvivalMode]);

    const getParticleColor = useCallback(() => {
        switch (theme) {
            case 'vision': return '#60a5fa'; // Space Blue
            case 'arctic': return '#3b82f6'; // Arctic Blue
            case 'cyberpunk': return '#22d3ee'; // Neon Cyan
            case 'nature': return '#34d399'; // Emerald
            case 'aurora': return '#fbbf24'; // Amber
            case 'neural': return '#a78bfa'; // Purple
            case 'neumorphism': return '#667eea'; // Indigo
            case 'liquid': return '#00f2ff'; // Liquid Cyan
            default: return '#3b82f6'; // Default Blue
        }
    }, [theme]);

    return {
        fuel,
        combo,
        isShakeActive,
        isComboPulse,
        triggerCorrect,
        triggerWordComplete,
        triggerError,
        getParticleColor
    };
};
