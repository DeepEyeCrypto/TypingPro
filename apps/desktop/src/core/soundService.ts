import { Howl } from 'howler';
import { useSettingsStore } from './store/settingsStore';

class SoundService {
    private clickSound: Howl | null = null;
    private errorSound: Howl | null = null;
    private spaceSound: Howl | null = null;
    private isMuted: boolean = false;

    constructor() {
        this.initSounds();
    }

    private initSounds() {
        this.clickSound = new Howl({ src: ['/sounds/click.mp3', '/sounds/click.wav'], volume: 0.5 });
        this.errorSound = new Howl({ src: ['/sounds/error.mp3', '/sounds/error.wav'], volume: 0.6 });
        this.spaceSound = new Howl({ src: ['/sounds/space.mp3', '/sounds/space.wav'], volume: 0.5 });
    }

    public setMute(muted: boolean) {
        this.isMuted = muted;
    }

    public playClick() {
        if (this.isMuted) return;
        // Randomize pitch slightly for mechanical feel
        const rate = 0.9 + Math.random() * 0.2;
        this.clickSound?.rate(rate);
        this.clickSound?.play();
    }

    public playError() {
        if (this.isMuted) return;
        this.errorSound?.play();
    }

    public playSpace() {
        if (this.isMuted) return;
        this.spaceSound?.play();
    }
}

export const soundService = new SoundService();
