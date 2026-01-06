import { invoke } from '@tauri-apps/api/core'

export const useRustAudio = () => {
    const playTypingSound = (soundType: 'mechanical' | 'backspace' | 'error') => {
        // Ultra-fast: no async overhead
        invoke('play_typing_sound', { soundType }).catch(console.error)
    }

    const setVolume = (volume: number) => {
        invoke('set_audio_volume', { volume }).catch(console.error)
    }

    const toggleAudio = (enabled: boolean) => {
        invoke('toggle_audio', { enabled }).catch(console.error)
    }

    return {
        playTypingSound,
        setVolume,
        toggleAudio
    }
}
