// God-Tier Sound Engine for TypingPro
// Zero-latency, polyphonic, randomized mechanical keyboard sounds.

class SoundManager {
    private static instance: SoundManager;
    private context: AudioContext | null = null;
    private buffers: Map<string, AudioBuffer> = new Map();
    private gainNode: GainNode | null = null;
    private isMuted: boolean = false;
    private masterVolume: number = 0.5;

    // The holy grail of click sounds
    private readonly CLICK_VARIANTS = ['click1', 'click2', 'click3', 'click4', 'click5'];

    private constructor() {
        this.initContext();
        // Bind the resume function to window events to bypass autoplay policy
        if (typeof window !== 'undefined') {
            const resumeAudio = () => {
                if (this.context && this.context.state === 'suspended') {
                    this.context.resume().then(() => {
                        console.log('AudioContext resumed successfully');
                    });
                }
                // Remove listeners once resumed
                if (this.context && this.context.state === 'running') {
                    window.removeEventListener('keydown', resumeAudio);
                    window.removeEventListener('click', resumeAudio);
                }
            };

            window.addEventListener('keydown', resumeAudio);
            window.addEventListener('click', resumeAudio);
        }
    }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    private initContext() {
        if (!this.context) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.context = new AudioContextClass();
            this.gainNode = this.context.createGain();
            this.gainNode.connect(this.context.destination);
            this.setVolume(this.masterVolume);
        }
    }

    // Preload all assets to memory buffers
    public async init() {
        this.initContext();
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
        }

        const loadPromises = [
            // Clicks
            ...this.CLICK_VARIANTS.map(name => this.loadSound(name, `/sounds/mechanical/${name}.wav`)),
            // Utility
            this.loadSound('space', '/sounds/mechanical/space.wav'),
            this.loadSound('error', '/sounds/mechanical/error.wav'),
            this.loadSound('enter', '/sounds/mechanical/enter.wav'),
            this.loadSound('backspace', '/sounds/mechanical/backspace.wav')
        ];

        try {
            await Promise.all(loadPromises);
            console.log('Sound Engine: All assets hydrated 💧');
        } catch (e) {
            console.error('Sound Engine: Preload failed', e);
        }
    }

    private async loadSound(key: string, url: string): Promise<void> {
        if (!this.context) return;
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.buffers.set(key, audioBuffer);
        } catch (error) {
            console.warn(`Failed to load sound: ${key} from ${url}`, error);
        }
    }

    public playClick() {
        if (this.isMuted) return;

        // Randomize click sound
        const variant = this.CLICK_VARIANTS[Math.floor(Math.random() * this.CLICK_VARIANTS.length)];

        // Slight pitch randomization (0.95 - 1.05) for organic feel
        // And volume diffs
        const rate = 0.98 + Math.random() * 0.04;
        const detune = (Math.random() - 0.5) * 50; // +/- 25 cents

        this.play(variant, { rate, detune });
    }

    public play(key: string, options: { rate?: number, volume?: number, detune?: number } = {}) {
        if (!this.context || !this.gainNode || this.isMuted) return;

        const buffer = this.buffers.get(key);
        // Fallback to generic click if variant missing, or just don't play
        if (!buffer) {
            // Try fallback if it's a click
            if (key.startsWith('click')) {
                const fallback = this.buffers.get('click1');
                if (fallback) this.playSoundBuffer(fallback, options);
            }
            return;
        }

        this.playSoundBuffer(buffer, options);
    }

    private playSoundBuffer(buffer: AudioBuffer, options: { rate?: number, volume?: number, detune?: number }) {
        if (!this.context || !this.gainNode) return;

        const source = this.context.createBufferSource();
        source.buffer = buffer;

        // Rate/Pitch
        if (options.rate) source.playbackRate.value = options.rate;
        if (options.detune) source.detune.value = options.detune;

        // Per-sound volume (optional)
        if (options.volume !== undefined) {
            const tempGain = this.context.createGain();
            tempGain.gain.value = options.volume;
            source.connect(tempGain);
            tempGain.connect(this.gainNode);
        } else {
            source.connect(this.gainNode);
        }

        source.start(0);
    }

    public setVolume(val: number) {
        this.masterVolume = Math.max(0, Math.min(1, val));
        if (this.gainNode) {
            this.gainNode.gain.value = this.isMuted ? 0 : this.masterVolume;
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        this.setVolume(this.masterVolume); // Re-applies mute logic
        return this.isMuted;
    }
}

export const soundManager = SoundManager.getInstance();
