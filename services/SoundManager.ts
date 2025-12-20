import { Howl } from 'howler';

class SoundManager {
    private sound: Howl | null = null;
    private masterVolume: number = 0.4;

    constructor() {
        this.init();
    }

    private init() {
        if (typeof window === 'undefined') return;

        // Preload Mechanical Click Sound
        this.sound = new Howl({
            src: ['https://actions.google.com/sounds/v1/foley/key_press_click.ogg'], // Using a standard public sound for demonstration
            volume: this.masterVolume,
            preload: true,
            html5: false // Use Web Audio for lower latency
        });
    }

    public setVolume(volume: number) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.sound) {
            this.sound.volume(this.masterVolume);
        }
    }

    public playMechanicalClick() {
        if (!this.sound) return;
        this.sound.play();
    }
}

export const soundManager = new SoundManager();
