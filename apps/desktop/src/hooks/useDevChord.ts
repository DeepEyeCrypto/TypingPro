import { useEffect } from 'react';
import { useDevStore } from '../core/store/devStore';

/**
 * useDevChord Hook
 * 
 * Secret activation chord: Shift + Alt + D
 * Toggles Developer Mode and HUD visibility.
 */
export const useDevChord = () => {
    const toggleDevMode = useDevStore((state) => state.toggleDevMode);
    const toggleHud = useDevStore((state) => state.toggleHud);
    const isDevMode = useDevStore((state) => state.isDevMode);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Shift + Alt + D
            if (e.shiftKey && e.altKey && e.code === 'KeyD') {
                e.preventDefault();

                if (!isDevMode) {
                    toggleDevMode();
                    console.log('DEV_MODE: ACTIVATED');
                } else {
                    toggleHud();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDevMode, toggleDevMode, toggleHud]);
};
