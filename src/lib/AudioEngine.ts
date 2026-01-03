import { SoundProfile } from '@src/data/soundProfiles'

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle'

export class AudioEngine {
    private static instance: AudioEngine
    private context: AudioContext | null = null
    private masterGain: GainNode | null = null
    private enabled: boolean = true
    private volume: number = 0.5

    private constructor() {
        // Lazy initialization in init() to adhere to browser policies
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
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)()
            this.masterGain = this.context.createGain()
            this.masterGain.connect(this.context.destination)
            this.setMasterVolume(initialVolume)

            // Resume context on first interaction if suspended
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
            console.error('AudioEngine: Failed to initialize Web Audio API', e)
        }
    }

    public setMasterVolume(vol: number) {
        this.volume = vol / 100
        if (this.masterGain && this.context) {
            // Smooth transition to avoid clicks
            this.masterGain.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.05)
        }
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled
    }

    /**
     * Play a sound based on the profile ID.
     * Generates a unique, procedural sound instance for every call (zero latency).
     */
    public play(profileId: string, key?: string) {
        if (!this.enabled || !this.context || !this.masterGain) return

        if (this.context.state === 'suspended') {
            this.context.resume()
        }

        // --- STAGE 8: Special Keys ---
        if (key === 'Backspace') {
            this.playBackspace()
            return
        }

        // Spacebar "Thump" modifier
        let pitchMod = 0
        let volMod = 1.0

        if (key === ' ') {
            pitchMod = -200 // Drop pitch significantly for spacebar
            volMod = 1.2
        } else {
            // Random pitch variation (+/- 5%) for organic feel
            pitchMod = (Math.random() * 100) - 50
        }

        switch (profileId) {
            case 'mechanical':
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

    /**
     * Play a distinct error sound (Low pitch "Crunch/Thud").
     */
    public playError() {
        if (!this.enabled || !this.context || !this.masterGain) return

        if (this.context.state === 'suspended') {
            this.context.resume()
        }

        const t = this.context.currentTime

        // 1. Low frequency Sawtooth "Buzz"
        const osc = this.context.createOscillator()
        const oscGain = this.context.createGain()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(100, t) // Low frequency
        osc.frequency.linearRampToValueAtTime(50, t + 0.1) // Drop pitch

        // 2. Filter for "Crunch" effect
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

        // Ascending major arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6

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

        // Descending dissonant tritone
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

    private playBackspace() {
        // "Receding" or "Delete" sound - Filters closing down
        const t = this.context!.currentTime
        const osc = this.context!.createOscillator()
        const g = this.context!.createGain()
        const filter = this.context!.createBiquadFilter()

        osc.type = 'square'
        osc.frequency.setValueAtTime(150, t)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(800, t)
        filter.frequency.exponentialRampToValueAtTime(100, t + 0.1)

        g.gain.setValueAtTime(0.3, t)
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.1)

        osc.connect(filter)
        filter.connect(g)
        g.connect(this.masterGain!)

        osc.start(t)
        osc.stop(t + 0.1)
    }

    // --- PROCEDURAL SOUND GENERATORS ---

    /**
     * Mechanical Switch Sound
     * Complex layering of a low "thuck" (square wave) and a high "click" (noise burst).
     */
    private playMechanicalClick(detune: number, volMod: number) {
        const t = this.context!.currentTime

        // 1. The "Thuck" (Body of the switch)
        const osc = this.context!.createOscillator()
        const oscGain = this.context!.createGain()

        osc.type = 'square'
        osc.frequency.setValueAtTime(150, t) // Low frequency thud
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.08) // Pitch drop
        osc.detune.value = detune

        oscGain.gain.setValueAtTime(0.5 * volMod, t)
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08)

        osc.connect(oscGain)
        oscGain.connect(this.masterGain!)

        osc.start(t)
        osc.stop(t + 0.1)

        // 2. The "Click" (High frequency noise burst)
        this.playNoiseBurst(t, 0.04, 0.2 * volMod)
    }

    private playTypewriter(detune: number, volMod: number) {
        const t = this.context!.currentTime
        // Sharp, high-pitch mechanical "clack"
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

        // Add a metallic ring
        this.playNoiseBurst(t, 0.02, 0.3 * volMod)
    }

    private playCreamy(detune: number, volMod: number) {
        const t = this.context!.currentTime
        // Soft, filtered switch (Thock)
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

    /**
     * Hitmarker Sound
     * High pitched, short burst of filtered noise.
     */
    private playHitmarker(detune: number) {
        const t = this.context!.currentTime

        // High frequency Sine ping
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

    /**
     * Simple Tone Generator
     * For presets: Sine, Square, Triangle, Sawtooth
     */
    private playPop(detune: number, volMod: number) {
        const t = this.context!.currentTime
        // High Sine Pitch Drop
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
        // Dull, low sine/triangle thud
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
        osc.frequency.setValueAtTime(600, t) // Standard pitch
        osc.detune.value = detune

        oscGain.gain.setValueAtTime(0.3 * volMod, t)
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1)

        osc.connect(oscGain)
        oscGain.connect(this.masterGain!)

        osc.start(t)
        osc.stop(t + 0.1)
    }

    private playGenericClick(detune: number, volMod: number) {
        // Simple short noise click
        this.playNoiseBurst(this.context!.currentTime, 0.03, 0.15 * volMod)
    }

    // --- HELPER: WHITE NOISE ---

    private playNoiseBurst(startTime: number, duration: number, volume: number) {
        const bufferSize = this.context!.sampleRate * duration
        const buffer = this.context!.createBuffer(1, bufferSize, this.context!.sampleRate)
        const data = buffer.getChannelData(0)

        // Generate white noise
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
}
