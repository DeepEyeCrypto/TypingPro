import { useEffect, useCallback } from 'react'
import useSound from 'use-sound'
import { SOUND_PROFILES } from '@src/data/soundProfiles'
import { useSettingsStore } from '@src/stores/settingsStore'
import { AudioEngine } from '@src/lib/AudioEngine'

export const useSoundSystem = () => {
    const { soundVolume, activeSoundProfileId, soundEnabled } = useSettingsStore()
    const activeProfile = SOUND_PROFILES.find(p => p.id === activeSoundProfileId) || SOUND_PROFILES[0]

    // Initialize Audio Engine once
    useEffect(() => {
        const engine = AudioEngine.getInstance()
        engine.init(soundVolume)
    }, [])

    // Sync Volume & Enabled State
    useEffect(() => {
        const engine = AudioEngine.getInstance()
        engine.setMasterVolume(soundVolume)
        engine.setEnabled(soundEnabled)
    }, [soundVolume, soundEnabled])

    // File-based playback (Legacy support)
    const soundUrl = activeProfile.type === 'file' ? activeProfile.path : null
    const [playActiveFile] = useSound(soundUrl || '', {
        volume: (soundVolume / 100) * (activeProfile.volume || 1),
        interrupt: true,
    })

    const playKeystroke = useCallback((key?: string) => {
        if (!soundEnabled || activeProfile.id === 'off') return

        if (activeProfile.type === 'file') {
            playActiveFile()
        } else {
            // Delegate to AudioEngine for zero-latency procedural sound
            AudioEngine.getInstance().play(activeProfile.id, key)
        }
    }, [soundEnabled, activeProfile, playActiveFile])

    return {
        playKeystroke
    }
}

