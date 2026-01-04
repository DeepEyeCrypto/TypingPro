export class SoundManager {
    private context: AudioContext | null = null;
    private buffers: Map<string, AudioBuffer> = new Map();
    private isMuted: boolean = false;
    private volume: number = 0.5;

    constructor() {
        // Initialize AudioContext lazily to comply with browser autoplay policies
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.context = new AudioContextClass();
        } catch (e) {
            console.error('Web Audio API is not supported in this browser', e);
        }
    }

    public async loadSound(key: string, url: string) {
        if (!this.context) return;
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.buffers.set(key, audioBuffer);
        } catch (err) {
            console.error(`Failed to load sound: ${key} from ${url}`, err);
        }
    }

    public async init() {
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
        }
        // Preload sounds
        await Promise.all([
            this.loadSound('click', '/sounds/click.wav'),
            this.loadSound('space', '/sounds/space.wav'),
            this.loadSound('error', '/sounds/error.wav'),
            // Optionally load variants if available, for now just base
        ]);
    }

    public play(key: string, options: { rate?: number, volume?: number } = {}) {
        if (this.isMuted || !this.context) return;

        const buffer = this.buffers.get(key);
        if (!buffer) return;

        // Create a new source for polyphony
        const source = this.context.createBufferSource();
        source.buffer = buffer;

        // Rate/Pitch
        if (options.rate) {
            source.playbackRate.value = options.rate;
        }

        // Volume
        const gainNode = this.context.createGain();
        gainNode.gain.value = (options.volume ?? 1.0) * this.volume;

        // Connect graph
        source.connect(gainNode);
        gainNode.connect(this.context.destination);

        source.start(0);
    }

    public playClick() {
        // Slight pitch randomization for mechanical feel
        const rate = 0.95 + Math.random() * 0.1;
        this.play('click', { rate });
    }

    public playSpace() {
        this.play('space', { volume: 1.2 });
    }

    public playError() {
        this.play('error', { volume: 0.8 });
    }

    public setMute(muted: boolean) {
        this.isMuted = muted;
    }

    public setVolume(vol: number) {
        this.volume = vol;
    }
}

export const soundManager = new SoundManager();
