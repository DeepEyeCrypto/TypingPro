import { create } from 'zustand'

export type ThemeType = 'classic' | 'glass' | 'high-contrast'
export type CaretStyle = 'line' | 'block' | 'underline' | 'hidden'

interface SettingsState {
    theme: ThemeType,
    fontSize: number,
    fontFamily: string,
    caretStyle: CaretStyle,
    soundEnabled: boolean,
    setTheme: (theme: ThemeType) => void,
    setFontSize: (size: number) => void,
    setFontFamily: (font: string) => void,
    setCaretStyle: (style: CaretStyle) => void,
    setSoundEnabled: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
    theme: (localStorage.getItem('pref_theme') as ThemeType) || 'glass',
    fontSize: Number(localStorage.getItem('pref_font_size')) || 24,
    fontFamily: localStorage.getItem('pref_font_family') || 'JetBrains Mono',
    caretStyle: (localStorage.getItem('pref_caret') as CaretStyle) || 'line',
    soundEnabled: localStorage.getItem('pref_sound') === 'true',

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
    }
}))
