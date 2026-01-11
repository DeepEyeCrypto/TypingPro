import { create } from 'zustand'

export type ThemeType = 'classic' | 'glass' | 'high-contrast' | 'cyberpunk' | 'dracula' | 'matrix' | 'nord' | 'emerald'
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
    setBackgroundImage: (url: string) => void // [NEW]
}

export const useSettingsStore = create<SettingsState>((set) => ({
    theme: (localStorage.getItem('pref_theme') as ThemeType) || 'glass',
    fontSize: Number(localStorage.getItem('pref_font_size')) || 24,
    fontFamily: localStorage.getItem('pref_font_family') || 'JetBrains Mono',
    caretStyle: (localStorage.getItem('pref_caret') as CaretStyle) || 'line',
    soundEnabled: localStorage.getItem('pref_sound') === 'true',
    soundVolume: Number(localStorage.getItem('pref_sound_volume')) || 50,
    activeSoundProfileId: localStorage.getItem('pref_sound_profile') || 'mechanical',
    backgroundImage: localStorage.getItem('pref_bg_image') || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',

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
