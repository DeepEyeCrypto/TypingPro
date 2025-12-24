import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'midnight' | 'ocean' | 'sunset' | 'forest' | 'neon' | 'arctic';
export type CaretStyle = 'beam' | 'underline' | 'block';
export type CaretSpeed = 'off' | 'fast' | 'smooth';

interface SettingsState {
    theme: Theme;
    fontFamily: string;
    fontSize: 'small' | 'medium' | 'large' | 'xl';
    soundEnabled: boolean;
    keystrokeSound: 'mechanical' | 'click' | 'bubble' | 'retro';
    caretStyle: CaretStyle;
    caretSpeed: CaretSpeed;
    uiScale: number;
    stopOnError: boolean;

    // Actions
    setTheme: (theme: Theme) => void;
    setFontFamily: (font: string) => void;
    setFontSize: (size: SettingsState['fontSize']) => void;
    setSoundEnabled: (enabled: boolean) => void;
    setKeystrokeSound: (sound: SettingsState['keystrokeSound']) => void;
    setCaretStyle: (style: CaretStyle) => void;
    setCaretSpeed: (speed: CaretSpeed) => void;
    setUiScale: (scale: number) => void;
    setStopOnError: (stop: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'midnight',
            fontFamily: 'JetBrains Mono',
            fontSize: 'medium',
            soundEnabled: true,
            keystrokeSound: 'mechanical',
            caretStyle: 'beam',
            caretSpeed: 'smooth',
            uiScale: 1,
            stopOnError: false,

            setTheme: (theme) => set({ theme }),
            setFontFamily: (fontFamily) => set({ fontFamily }),
            setFontSize: (fontSize) => set({ fontSize }),
            setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
            setKeystrokeSound: (keystrokeSound) => set({ keystrokeSound }),
            setCaretStyle: (caretStyle) => set({ caretStyle }),
            setCaretSpeed: (caretSpeed) => set({ caretSpeed }),
            setUiScale: (uiScale) => set({ uiScale }),
            setStopOnError: (stopOnError) => set({ stopOnError }),
        }),
        {
            name: 'typingpro-settings',
        }
    )
);
