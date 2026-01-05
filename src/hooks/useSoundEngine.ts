import { useEffect, useRef } from 'react'
import { AudioEngine } from '@src/lib/AudioEngine'
import { useSettingsStore } from '@src/stores/settingsStore'

export const useSoundEngine = () => {
    const { soundEnabled, soundVolume, activeSoundProfileId } = useSettingsStore()
    const engine = useRef(AudioEngine.getInstance())

    useEffect(() => {
        engine.current.init(soundVolume)
    }, [])

    useEffect(() => {
        engine.current.setMasterVolume(soundVolume)
    }, [soundVolume])

    useEffect(() => {
        engine.current.setEnabled(soundEnabled)
    }, [soundEnabled])

    const playTypingSound = (key: string) => {
        engine.current.play(activeSoundProfileId, key)
    }

    const playErrorSound = () => {
        engine.current.playError()
    }

    return { playTypingSound, playErrorSound }
}
