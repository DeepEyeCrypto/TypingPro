export class SoundManager {
    private context: AudioContext | null = null;
    private buffers: Map<string, AudioBuffer> = new Map();
    private clickVariations: string[] = ['click', 'click1', 'click2', 'click3', 'click4', 'click5'];
    private isMuted: boolean = false;
    private volume: number = 0.5;

    constructor() {
        // Initialize AudioContext lazily to comply with browser autoplay policies
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.context = new AudioContextClass();

            // FIX: Resume AudioContext on first interaction
            const resumeAudio = () => {
                if (this.context && this.context.state === 'suspended') {
                    this.context.resume().then(() => {
                        console.log('AudioContext resumed successfully');
                    });
                }
            };

            window.addEventListener('keydown', resumeAudio, { once: true });
            window.addEventListener('click', resumeAudio, { once: true });

        } catch (e) {
            console.error('Web Audio API is not supported in this browser', e);
        }
    }

    public async loadSound(key: string, url: string) {
        if (!this.context) return;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.buffers.set(key, audioBuffer);
        } catch (err) {
            // Warn only for base sounds, suppress for optional variations
            if (key === 'click' || key === 'space' || key === 'error') {
                console.warn(`Sound missing: ${key} (${url}). Logic continues without sound.`);
            }
        }
    }

    public async init() {
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
        }
        // Preload sounds (Pointing to public/sounds/mechanical by default)
        const loadPromises = [
            this.loadSound('space', '/sounds/mechanical/space.wav'),
            this.loadSound('error', '/sounds/mechanical/error.wav'),
            // Base click
            this.loadSound('click', '/sounds/mechanical/click.wav'),
        ];

        // Load variations
        for (let i = 1; i <= 5; i++) {
            loadPromises.push(this.loadSound(`click${i}`, `/sounds/mechanical/click${i}.wav`));
        }

        await Promise.all(loadPromises);
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
        // Find available click keys
        const available = this.clickVariations.filter(k => this.buffers.has(k));

        if (available.length > 0) {
            const randomKey = available[Math.floor(Math.random() * available.length)];
            // Slight pitch randomization for mechanical feel
            const rate = 0.98 + Math.random() * 0.04;
            this.play(randomKey, { rate });
        }
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
