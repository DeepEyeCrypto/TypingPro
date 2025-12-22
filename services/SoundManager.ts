import { Howl } from 'howler';

export type SoundProfile = 'mechanical' | 'creamy' | 'laptop' | 'nk-cream';

const SOUNDS: Record<SoundProfile, string> = {
    mechanical: 'https://actions.google.com/sounds/v1/foley/key_press_click.ogg',
    creamy: 'https://actions.google.com/sounds/v1/foley/single_typewriter_key.ogg',
    laptop: 'https://actions.google.com/sounds/v1/foley/keyboard_typing.ogg',
    'nk-cream': 'https://actions.google.com/sounds/v1/foley/key_press_click.ogg' // Placeholder fallback
};

class SoundManager {
    private sounds: Map<SoundProfile, Howl> = new Map();
    private currentProfile: SoundProfile = 'mechanical';
    private masterVolume: number = 0.4;

    constructor() {
        this.init();
    }

    private init() {
        if (typeof window === 'undefined') return;

        // Preload all sounds
        Object.entries(SOUNDS).forEach(([profile, src]) => {
            this.sounds.set(profile as SoundProfile, new Howl({
                src: [src],
                volume: this.masterVolume,
                preload: true,
                html5: false
            }));
        });
    }

    public setProfile(profile: SoundProfile) {
        this.currentProfile = profile;
    }

    public setVolume(volume: number) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.sounds.forEach(h => h.volume(this.masterVolume));
    }

    public playMechanicalClick() {
        const howl = this.sounds.get(this.currentProfile);
        if (!howl) return;

        // Pitch variation for realism (0.95 to 1.05)
        const pitch = 0.95 + Math.random() * 0.1;

        // Use a clone or just play if simple enough
        // To avoid cutting off previous sound, we can play multiple
        const id = howl.play();
        howl.rate(pitch, id);
    }
}

export const soundManager = new SoundManager();
