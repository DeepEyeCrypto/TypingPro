export type SoundType = 'file' | 'synth' | 'custom'

export interface SoundProfile {
    id: string
    name: string
    type: SoundType
    path?: string
    volume: number // Base volume adjustment
    detune?: boolean // Randomize pitch slightly?
}

export const SOUND_PROFILES: SoundProfile[] = [
    { id: 'off', name: 'Off', type: 'synth', volume: 0 },
    { id: 'mechanical', name: 'Mechanical (Blue)', type: 'synth', volume: 1.0 },
    { id: 'creamy', name: 'Minimalist (Cream)', type: 'synth', volume: 1.0 }, // Renamed to Minimalist
    { id: 'pop', name: 'Bubble (Pop)', type: 'synth', volume: 0.8 }, // Renamed to Bubble
    { id: 'click', name: 'Click', type: 'synth', volume: 1.0, detune: true },
    { id: 'beep', name: 'Beep', type: 'synth', volume: 0.8 },
    { id: 'typewriter', name: 'Typewriter', type: 'synth', volume: 1.2 },
    { id: 'osu', name: 'osu!', type: 'synth', volume: 0.7 },
    { id: 'hitmarker', name: 'Hitmarker', type: 'synth', volume: 0.9 },
    { id: 'sine', name: 'Sine', type: 'synth', volume: 0.6 },
    { id: 'sawtooth', name: 'Sawtooth', type: 'synth', volume: 0.4 },
    { id: 'square', name: 'Square', type: 'synth', volume: 0.3 },
    { id: 'triangle', name: 'Triangle', type: 'synth', volume: 0.6 },
    { id: 'pentatonic', name: 'Pentatonic', type: 'synth', volume: 0.6 },
    { id: 'wholetone', name: 'Whole Tone', type: 'synth', volume: 0.6 },
    { id: 'fist_fight', name: 'Fist Fight', type: 'synth', volume: 1.0 },
    { id: 'rubber', name: 'Rubber Keys', type: 'synth', volume: 1.0 },
]
