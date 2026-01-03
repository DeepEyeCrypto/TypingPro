import { useCallback } from 'react'
import useSound from 'use-sound'
import { SOUND_PROFILES, SoundProfile } from '@src/data/soundProfiles'
import { useSettingsStore } from '@src/stores/settingsStore'

// Web Audio API Context (Singleton)
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null
if (audioCtx) console.log('[Sound] AudioContext initialized')

export const useSoundSystem = () => {
    const { soundVolume, activeSoundProfileId, soundEnabled } = useSettingsStore()
    const activeProfile = SOUND_PROFILES.find(p => p.id === activeSoundProfileId) || SOUND_PROFILES[0]

    // File-based playback (kept for future if assets are added)
    const soundUrl = activeProfile.type === 'file' ? activeProfile.path : null
    const [playActiveFile] = useSound(soundUrl || '', {
        volume: (soundVolume / 100) * (activeProfile.volume || 1),
        interrupt: true,
        onload: () => console.log(`Loaded sound: ${activeProfile.name}`)
    })

    const playSynth = useCallback((profile: SoundProfile) => {
        if (!audioCtx) {
            console.warn('[Sound] No AudioContext')
            return
        }

        // Auto-resume if suspended
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(e => console.error('[Sound] Resume failed:', e))
        }

        console.log(`[Sound] Playing ${profile.id} (Vol: ${soundVolume}, State: ${audioCtx.state})`)

        const osc = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()

        osc.connect(gainNode)
        gainNode.connect(audioCtx.destination)

        const vol = (soundVolume / 100) * (profile.volume || 0.5)
        const now = audioCtx.currentTime

        // Synth logic based on ID
        switch (profile.id) {
            case 'sine':
            case 'triangle':
            case 'square':
            case 'sawtooth':
                osc.type = profile.id as any
                osc.frequency.setValueAtTime(440 + Math.random() * 50, now)
                gainNode.gain.setValueAtTime(vol, now)
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
                osc.start(now)
                osc.stop(now + 0.15)
                break

            case 'click':
            case 'rubber':
                osc.type = 'sine'
                osc.frequency.setValueAtTime(800, now)
                gainNode.gain.setValueAtTime(vol * 0.5, now)
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)
                osc.start(now)
                osc.stop(now + 0.05)
                break

            case 'beep':
                osc.type = 'square'
                osc.frequency.setValueAtTime(600, now)
                gainNode.gain.setValueAtTime(vol * 0.3, now)
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
                osc.start(now)
                osc.stop(now + 0.1)
                break

            case 'mechanical':
                // Clicky square
                osc.type = 'square'
                osc.frequency.setValueAtTime(300 + Math.random() * 50, now)
                gainNode.gain.setValueAtTime(vol * 0.4, now)
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08)
                osc.start(now)
                osc.stop(now + 0.08)
                break

            case 'typewriter':
                // Sharp sawtooth
                osc.type = 'sawtooth'
                osc.frequency.setValueAtTime(400 + Math.random() * 200, now)
                gainNode.gain.setValueAtTime(vol * 0.3, now)
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12)
                osc.start(now)
                osc.stop(now + 0.12)
                break

            case 'creamy':
                // Soft triangle
                osc.type = 'triangle'
                osc.frequency.setValueAtTime(250 + Math.random() * 30, now)
                gainNode.gain.setValueAtTime(vol * 0.8, now)
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
                osc.start(now)
                osc.stop(now + 0.2)
                break

            case 'pop':
                // Sine pitch drop
                osc.type = 'sine'
                osc.frequency.setValueAtTime(600, now)
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.1)
                gainNode.gain.setValueAtTime(vol, now)
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
                osc.start(now)
                osc.stop(now + 0.1)
                break

            case 'hitmarker':
                // High frequency burst
                osc.type = 'sawtooth'
                osc.frequency.setValueAtTime(1200, now)
                gainNode.gain.setValueAtTime(vol * 0.4, now)
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)
                osc.start(now)
                osc.stop(now + 0.05)
                break

            case 'fist_fight':
                // Low punchy sine
                osc.type = 'sine'
                osc.frequency.setValueAtTime(150, now)
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.1)
                gainNode.gain.setValueAtTime(vol, now)
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
                osc.start(now)
                osc.stop(now + 0.15)
                break

            case 'pentatonic':
                // Random note from pentatonic scale
                const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]
                const note = scale[Math.floor(Math.random() * scale.length)]
                osc.type = 'sine'
                osc.frequency.setValueAtTime(note, now)
                gainNode.gain.setValueAtTime(vol, now)
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
                osc.start(now)
                osc.stop(now + 0.3)
                break

            default:
                // Fallback click
                osc.type = 'triangle'
                osc.frequency.setValueAtTime(300, now)
                gainNode.gain.setValueAtTime(vol, now)
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
                osc.start(now)
                osc.stop(now + 0.1)
        }
    }, [soundVolume])

    const playKeystroke = useCallback(() => {
        if (!soundEnabled || activeProfile.id === 'off') return

        if (activeProfile.type === 'file') {
            playActiveFile()
        } else {
            playSynth(activeProfile)
        }
    }, [soundEnabled, activeProfile, playActiveFile, playSynth])

    return {
        playKeystroke
    }
}
