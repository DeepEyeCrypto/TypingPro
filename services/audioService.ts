
let audioContext: AudioContext | null = null;
let masterVolume = 0.5;

// Cache noise buffer for click transient to avoid garbage collection stutter
let noiseBuffer: AudioBuffer | null = null;

const initAudio = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {});
    }
    return audioContext;
};

const createNoiseBuffer = (ctx: AudioContext) => {
    if (noiseBuffer) return noiseBuffer;
    // 0.1s buffer is plenty for a click transient
    const bufferSize = ctx.sampleRate * 0.1; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    noiseBuffer = buffer;
    return buffer;
};

export const setVolume = (val: number) => {
    masterVolume = Math.max(0, Math.min(1, val));
};

export const playSound = (type: 'click' | 'error') => {
    if (masterVolume <= 0) return;
    
    const ctx = initAudio();
    if (!ctx) return;

    const t = ctx.currentTime;
    
    // Master gain for this specific sound event
    const mainGain = ctx.createGain();
    mainGain.connect(ctx.destination);
    mainGain.gain.setValueAtTime(masterVolume, t);

    if (type === 'click') {
        // --- Mechanical Switch Simulation ---
        
        // 1. Key "Body" (The Thock): Triangle wave sweeping down
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, t); // Start freq
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.08); // Drop quickly
        
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0, t);
        oscGain.gain.linearRampToValueAtTime(0.6, t + 0.005); // Attack
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1); // Decay

        osc.connect(oscGain);
        oscGain.connect(mainGain);
        osc.start(t);
        osc.stop(t + 0.1);

        // 2. Switch Mechanism (The Click): High-pass filtered noise
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx);
        
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 2000; // Crisp high end
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.03); // Very short

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(mainGain);
        noise.start(t);
        noise.stop(t + 0.03);

    } else {
        // --- Error Sound ---
        // A muted, low-pitched "bonk" that isn't too annoying
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.15);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, t); // Mute the harsh saw edges
        filter.frequency.linearRampToValueAtTime(100, t + 0.15);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0, t);
        oscGain.gain.linearRampToValueAtTime(0.4, t + 0.01);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        
        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(mainGain);
        
        osc.start(t);
        osc.stop(t + 0.2);
    }
};
