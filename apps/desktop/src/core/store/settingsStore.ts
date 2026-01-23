import { create } from 'zustand'

export type ThemeType = 'vision' | 'arctic' | 'cyberpunk' | 'aurora' | 'nature' | 'neural' | 'neumorphism' | 'liquid';
export type CaretStyle = 'line' | 'block' | 'underline' | 'hidden'

interface SettingsState {
    theme: ThemeType,
    fontSize: number,
    fontFamily: string,
    caretStyle: CaretStyle,
    soundEnabled: boolean,
    soundVolume: number,
    activeSoundProfileId: string,
    backgroundImage: string, // [NEW] Custom Background Support
    setTheme: (theme: ThemeType) => void,
    setFontSize: (size: number) => void,
    setFontFamily: (font: string) => void,
    setCaretStyle: (style: CaretStyle) => void,
    setSoundEnabled: (enabled: boolean) => void,
    setSoundVolume: (volume: number) => void,
    setSoundProfile: (id: string) => void,
    setBackgroundImage: (url: string) => void,
    isInitialized: boolean,
    initialize: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
    theme: 'vision',
    fontSize: 24,
    fontFamily: 'JetBrains Mono',
    caretStyle: 'line',
    soundEnabled: true,
    soundVolume: 50,
    activeSoundProfileId: 'mechanical',
    backgroundImage: '',
    isInitialized: false,

    initialize: () => {
        if (get().isInitialized) return;

        try {
            const theme = (localStorage.getItem('pref_theme') as ThemeType) || 'vision';
            const fontSize = Number(localStorage.getItem('pref_font_size')) || 24;
            const fontFamily = localStorage.getItem('pref_font_family') || 'JetBrains Mono';
            const caretStyle = (localStorage.getItem('pref_caret') as CaretStyle) || 'line';
            const soundEnabled = localStorage.getItem('pref_sound') !== 'false'; // Default to true
            const soundVolume = Number(localStorage.getItem('pref_sound_volume')) || 50;
            const activeSoundProfileId = localStorage.getItem('pref_sound_profile') || 'mechanical';
            const backgroundImage = localStorage.getItem('pref_bg_image') || '';

            set({
                theme,
                fontSize,
                fontFamily,
                caretStyle,
                soundEnabled,
                soundVolume,
                activeSoundProfileId,
                backgroundImage,
                isInitialized: true
            });
        } catch (e) {
            console.error("[SettingsStore] Hydration Failed", e);
            set({ isInitialized: true });
        }
    },

    setTheme: (theme) => {
        localStorage.setItem('pref_theme', theme)
        set({ theme })
    },
    setFontSize: (fontSize) => {
        localStorage.setItem('pref_font_size', fontSize.toString())
        set({ fontSize })
    },
    setFontFamily: (fontFamily) => {
        localStorage.setItem('pref_font_family', fontFamily)
        set({ fontFamily })
    },
    setCaretStyle: (caretStyle) => {
        localStorage.setItem('pref_caret', caretStyle)
        set({ caretStyle })
    },
    setSoundEnabled: (soundEnabled) => {
        localStorage.setItem('pref_sound', soundEnabled.toString())
        set({ soundEnabled })
    },
    setSoundVolume: (soundVolume) => {
        localStorage.setItem('pref_sound_volume', soundVolume.toString())
        set({ soundVolume })
    },
    setSoundProfile: (activeSoundProfileId) => {
        localStorage.setItem('pref_sound_profile', activeSoundProfileId)
        set({ activeSoundProfileId })
    },
    setBackgroundImage: (backgroundImage) => {
        localStorage.setItem('pref_bg_image', backgroundImage)
        set({ backgroundImage })
    }
}))
