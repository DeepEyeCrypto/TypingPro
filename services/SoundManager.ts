/**
 * SoundManager - Mechanical Keyboard Sound Engine
 * Uses Web Audio API for low-latency click simulation.
 */
class SoundManager {
    private ctx: AudioContext | null = null;
    private masterVolume: number = 0.4;

    constructor() {
        this.init();
    }

    private init() {
        if (typeof window === 'undefined') return;

        const initAudio = () => {
            if (!this.ctx) {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContextClass) {
                    this.ctx = new AudioContextClass();
                }
            }
            if (this.ctx?.state === 'suspended') {
                this.ctx.resume();
            }
        };

        window.addEventListener('mousedown', initAudio, { once: true });
        window.addEventListener('keydown', initAudio, { once: true });
    }

    public setVolume(volume: number) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    public playMechanicalClick() {
        if (!this.ctx || this.ctx.state === 'suspended') return;

        const t = this.ctx.currentTime;
        const mainGain = this.ctx.createGain();
        mainGain.connect(this.ctx.destination);
        mainGain.gain.setValueAtTime(this.masterVolume, t);
        mainGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        // High frequency transient (The "Click")
        const clickOsc = this.ctx.createOscillator();
        clickOsc.type = 'sawtooth';
        clickOsc.frequency.setValueAtTime(1200, t);
        clickOsc.frequency.exponentialRampToValueAtTime(800, t + 0.02);

        const clickGain = this.ctx.createGain();
        clickGain.gain.setValueAtTime(0.5, t);
        clickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.02);

        clickOsc.connect(clickGain);
        clickGain.connect(mainGain);

        // Low frequency resonance (The "Housing Thud")
        const thudOsc = this.ctx.createOscillator();
        thudOsc.type = 'sine';
        thudOsc.frequency.setValueAtTime(150, t);
        thudOsc.frequency.exponentialRampToValueAtTime(50, t + 0.08);

        const thudGain = this.ctx.createGain();
        thudGain.gain.setValueAtTime(0.3, t);
        thudGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

        thudOsc.connect(thudGain);
        thudGain.connect(mainGain);

        clickOsc.start(t);
        clickOsc.stop(t + 0.02);
        thudOsc.start(t);
        thudOsc.stop(t + 0.08);
    }
}

export const soundManager = new SoundManager();
