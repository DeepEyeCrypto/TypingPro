import { Howl } from 'howler'
import { SoundProfile, SOUND_PROFILES } from '@src/data/soundProfiles'
import { convertFileSrc } from '@tauri-apps/api/core'

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle'

export class AudioEngine {
    private static instance: AudioEngine
    private context: AudioContext | null = null
    private masterGain: GainNode | null = null
    private enabled: boolean = true
    private volume: number = 0.5
    private soundCache: Map<string, Howl> = new Map()

    private constructor() {
        // Lazy init
    }

    public static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine()
        }
        return AudioEngine.instance
    }

    public init(initialVolume: number = 50) {
        if (this.context) return

        try {
            // 1. Init Web Audio API (for Synth Fallback)
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)()
            this.masterGain = this.context.createGain()
            this.masterGain.connect(this.context.destination)
            this.setMasterVolume(initialVolume)

            // 2. Preload Howler Assets
            this.preloadSounds()

            // 3. Resume context on interaction
            if (this.context.state === 'suspended') {
                const resume = () => {
                    this.context?.resume()
                    window.removeEventListener('click', resume)
                    window.removeEventListener('keydown', resume)
                }
                window.addEventListener('click', resume)
                window.addEventListener('keydown', resume)
            }
        } catch (e) {
            console.error('AudioEngine: Failed to initialize', e)
        }
    }

    private preloadSounds() {
        SOUND_PROFILES.forEach(profile => {
            if (profile.type === 'file' && profile.path) {
                // Determine source path - Try multiple strategies
                const paths = this.buildAssetPaths(profile.path)

                const sound = new Howl({
                    src: paths,
                    volume: profile.volume * this.volume,
                    preload: true,
                    onload: () => {
                        // Silent success for production
                    },
                    onloaderror: (_id, err) => {
                        // Silently fail and fallback to synth
                    }
                })
                this.soundCache.set(profile.id, sound)
            }
        })
    }

    private buildAssetPaths(path: string): string[] {
        const paths: string[] = []

        // Strategy 1: Public folder (Vite dev)
        paths.push(path)

        // Strategy 2: Tauri asset protocol (Production)
        try {
            const assetPath = path.replace('/sounds/', 'sounds/')
            const converted = convertFileSrc(assetPath, 'asset')
            paths.push(converted)
        } catch (e) {
            // convertFileSrc not available (browser mode)
        }

        // Strategy 3: Alternative asset path
        paths.push(path.replace('/sounds/', '/assets/sounds/'))

        return paths
    }


    public setMasterVolume(vol: number) {
        this.volume = vol / 100

        // Update Synth Gain
        if (this.masterGain && this.context) {
            this.masterGain.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.05)
        }

        // Update Howler Global Volume (or individual cached sounds)
        // Howler.volume(this.volume) // Global Howler volume
        this.soundCache.forEach(sound => sound.volume(this.volume))
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled
    }

    public play(profileId: string, key?: string) {
        if (!this.enabled) return

        // Global Resume Check
        if (this.context?.state === 'suspended') this.context.resume()

        // 1. Special Keys (Backspace) - Always Synth for consistency
        if (key === 'Backspace') {
            this.playBackspace()
            return
        }

        // 2. Try File-Based Playback
        if (this.soundCache.has(profileId)) {
            const sound = this.soundCache.get(profileId)
            if (sound && sound.state() === 'loaded') {
                // Randomize playback slightly for realism
                const rate = 0.95 + Math.random() * 0.1
                const id = sound.play()
                sound.rate(rate, id)
                // sound.volume(this.volume, id) // Handled by setMasterVolume
                return
            }
        }

        // 3. Fallback to Synth Engine
        this.playSynth(profileId, key)
    }

    private playSynth(profileId: string, key?: string) {
        if (!this.context || !this.masterGain) return

        // Spacebar "Thump" modifier
        let pitchMod = 0
        let volMod = 1.0

        if (key === ' ') {
            pitchMod = -200
            volMod = 1.2
        } else {
            pitchMod = (Math.random() * 100) - 50
        }

        switch (profileId) {
            case 'mechanical': // Fallback if file missing
                this.playMechanicalClick(pitchMod, volMod)
                break
            case 'typewriter':
                this.playTypewriter(pitchMod, volMod)
                break
            case 'creamy':
                this.playCreamy(pitchMod, volMod)
                break
            case 'pop':
                this.playPop(pitchMod, volMod)
                break
            case 'bubble': // Alias
                this.playPop(pitchMod, volMod)
                break
            case 'rubber':
                this.playRubber(pitchMod, volMod)
                break
            case 'hitmarker':
                this.playHitmarker(pitchMod)
                break
            case 'sine':
            case 'square':
            case 'sawtooth':
            case 'triangle':
                this.playTone(profileId as OscillatorType, pitchMod, volMod)
                break
            case 'click':
            default:
                this.playGenericClick(pitchMod, volMod)
                break
        }
    }

    // --- SYNTH METHODS (Unchanged High-Quality Generators) ---

    private playBackspace() {
        const t = this.context!.currentTime
        const osc = this.context!.createOscillator()
        const g = this.context!.createGain()
        const filter = this.context!.createBiquadFilter()

        osc.type = 'square'
        osc.frequency.setValueAtTime(150, t)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(800, t)
        filter.frequency.exponentialRampToValueAtTime(100, t + 0.1)

        g.gain.setValueAtTime(0.3 * this.volume, t)
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.1)

        osc.connect(filter)
        filter.connect(g)
        g.connect(this.masterGain!)

        osc.start(t)
        osc.stop(t + 0.1)
    }

    // ... (Keeping all other procedural generators: playMechanicalClick, playTypewriter, etc. identical to before)
    // For brevity in this replacement, assume we are restoring them. 
    // I will explicitly write them out to ensure they are not lost.

    private playMechanicalClick(detune: number, volMod: number) {
        const t = this.context!.currentTime
        const osc = this.context!.createOscillator()
        const oscGain = this.context!.createGain()

        osc.type = 'square'
        osc.frequency.setValueAtTime(150, t)
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.08)
        osc.detune.value = detune

        oscGain.gain.setValueAtTime(0.5 * volMod, t)
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08)

        osc.connect(oscGain)
        oscGain.connect(this.masterGain!)

        osc.start(t)
        osc.stop(t + 0.1)

        this.playNoiseBurst(t, 0.04, 0.2 * volMod)
    }

    private playTypewriter(detune: number, volMod: number) {
        const t = this.context!.currentTime
        const osc = this.context!.createOscillator()
        const oscGain = this.context!.createGain()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(800, t)
        osc.detune.value = detune

        oscGain.gain.setValueAtTime(0.4 * volMod, t)
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05)

        osc.connect(oscGain)
        oscGain.connect(this.masterGain!)
        osc.start(t)
        osc.stop(t + 0.05)
        this.playNoiseBurst(t, 0.02, 0.3 * volMod)
    }

    private playCreamy(detune: number, volMod: number) {
        const t = this.context!.currentTime
        const osc = this.context!.createOscillator()
        const g = this.context!.createGain()
        const filter = this.context!.createBiquadFilter()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(200, t)
        osc.detune.value = detune

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(600, t)
        filter.frequency.linearRampToValueAtTime(200, t + 0.1)

        g.gain.setValueAtTime(0.6 * volMod, t)
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.15)

        osc.connect(filter)
        filter.connect(g)
        g.connect(this.masterGain!)

        osc.start(t)
        osc.stop(t + 0.15)
    }

    private playHitmarker(detune: number) {
        const t = this.context!.currentTime
        const osc = this.context!.createOscillator()
        const oscGain = this.context!.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(2000, t)
        osc.detune.value = detune

        oscGain.gain.setValueAtTime(0.3, t)
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05)

        osc.connect(oscGain)
        oscGain.connect(this.masterGain!)
        osc.start(t)
        osc.stop(t + 0.05)
    }

    private playPop(detune: number, volMod: number) {
        const t = this.context!.currentTime
        const osc = this.context!.createOscillator()
        const g = this.context!.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(800, t)
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.1)
        osc.detune.value = detune

        g.gain.setValueAtTime(0.5 * volMod, t)
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.1)

        osc.connect(g)
        g.connect(this.masterGain!)
        osc.start(t)
        osc.stop(t + 0.1)
    }

    private playRubber(detune: number, volMod: number) {
        const t = this.context!.currentTime
        const osc = this.context!.createOscillator()
        const g = this.context!.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(200, t)
        osc.detune.value = detune

        g.gain.setValueAtTime(0.6 * volMod, t)
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.08)

        osc.connect(g)
        g.connect(this.masterGain!)
        osc.start(t)
        osc.stop(t + 0.08)
    }

    private playTone(type: OscillatorType, detune: number, volMod: number) {
        const t = this.context!.currentTime
        const osc = this.context!.createOscillator()
        const oscGain = this.context!.createGain()

        osc.type = type
        osc.frequency.setValueAtTime(600, t)
        osc.detune.value = detune

        oscGain.gain.setValueAtTime(0.3 * volMod, t)
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1)

        osc.connect(oscGain)
        oscGain.connect(this.masterGain!)
        osc.start(t)
        osc.stop(t + 0.1)
    }

    private playGenericClick(detune: number, volMod: number) {
        this.playNoiseBurst(this.context!.currentTime, 0.03, 0.15 * volMod)
    }

    private playNoiseBurst(startTime: number, duration: number, volume: number) {
        const bufferSize = this.context!.sampleRate * duration
        const buffer = this.context!.createBuffer(1, bufferSize, this.context!.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1
        }
        const noise = this.context!.createBufferSource()
        noise.buffer = buffer
        const noiseGain = this.context!.createGain()
        noiseGain.gain.setValueAtTime(volume, startTime)
        noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
        noise.connect(noiseGain)
        noiseGain.connect(this.masterGain!)
        noise.start(startTime)
    }

    public playError() {
        if (!this.enabled || !this.context || !this.masterGain) return
        const t = this.context.currentTime
        const osc = this.context.createOscillator()
        const oscGain = this.context.createGain()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(100, t)
        osc.frequency.linearRampToValueAtTime(50, t + 0.1)

        const filter = this.context.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(300, t)

        oscGain.gain.setValueAtTime(0.5, t)
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15)

        osc.connect(filter)
        filter.connect(oscGain)
        oscGain.connect(this.masterGain)

        osc.start(t)
        osc.stop(t + 0.15)
    }

    public playSuccess() {
        if (!this.enabled || !this.context) return
        const t = this.context.currentTime
        const notes = [523.25, 659.25, 783.99, 1046.50]
        notes.forEach((freq, i) => {
            const osc = this.context!.createOscillator()
            const g = this.context!.createGain()
            osc.type = 'sine'
            osc.frequency.value = freq
            g.gain.setValueAtTime(0.1, t + i * 0.1)
            g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.4)
            osc.connect(g)
            g.connect(this.masterGain!)
            osc.start(t + i * 0.1)
            osc.stop(t + i * 0.1 + 0.4)
        })
    }

    public playFailure() {
        if (!this.enabled || !this.context) return
        const t = this.context.currentTime
        const notes = [300, 212]
        notes.forEach((freq, i) => {
            const osc = this.context!.createOscillator()
            const g = this.context!.createGain()
            osc.type = 'sawtooth'
            osc.frequency.value = freq
            g.gain.setValueAtTime(0.2, t + i * 0.2)
            g.gain.linearRampToValueAtTime(0.001, t + i * 0.2 + 0.5)
            osc.connect(g)
            g.connect(this.masterGain!)
            osc.start(t + i * 0.2)
            osc.stop(t + i * 0.2 + 0.5)
        })
    }
}
