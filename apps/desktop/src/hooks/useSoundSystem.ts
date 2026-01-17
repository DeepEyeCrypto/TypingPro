import { useEffect } from 'react'
import { soundManager } from '../utils/SoundManager'
import { useSettingsStore } from '../core/store/settingsStore'

export const useSoundSystem = () => {
    const { soundEnabled, soundVolume } = useSettingsStore()

    useEffect(() => {
        soundManager.init()
    }, [])

    useEffect(() => {
        soundManager.setMute(!soundEnabled)
    }, [soundEnabled])

    useEffect(() => {
        // Assuming soundVolume is 0-100 in store, normalize to 0-1
        soundManager.setVolume(soundVolume / 100)
    }, [soundVolume])

    return {
        playClick: () => soundManager.playClick(),
        playSpace: () => soundManager.playSpace(),
        playError: () => soundManager.playError(),
        manager: soundManager
    }
}
