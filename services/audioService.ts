
let audioContext: AudioContext | null = null;
let masterVolume = 0.5;
let typingSoundBuffer: AudioBuffer | null = null;
let isLoading = false;

const initAudio = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        // Preload sound immediately when context is created
        loadTypingSound();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume().catch(() => { });
    }
    return audioContext;
};

const loadTypingSound = async () => {
    if (typingSoundBuffer || isLoading || !audioContext) return;
    isLoading = true;
    try {
        const response = await fetch('assets/typing-sound.mp3');
        const arrayBuffer = await response.arrayBuffer();
        typingSoundBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (e) {
        console.error('Failed to load typing sound:', e);
    } finally {
        isLoading = false;
    }
};

export const setVolume = (val: number) => {
    masterVolume = Math.max(0, Math.min(1, val));
};

export const playSound = (type: 'click' | 'error') => {
    if (masterVolume <= 0) return;

    const ctx = initAudio();
    if (!ctx) return;

    const t = ctx.currentTime;
    const mainGain = ctx.createGain();
    mainGain.connect(ctx.destination);
    mainGain.gain.setValueAtTime(masterVolume, t);

    if (type === 'click') {
        if (typingSoundBuffer) {
            // Play Sample
            const source = ctx.createBufferSource();
            source.buffer = typingSoundBuffer;
            // randomize pitch slightly for realism
            source.playbackRate.value = 0.95 + Math.random() * 0.1;
            source.connect(mainGain);
            source.start(t);
        } else {
            // Fallback if not loaded yet (or failed): simpler synth click
            // Just a tiny noise burst to acknowledge input
            const osc = ctx.createOscillator();
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
            osc.connect(mainGain);
            osc.start(t);
            osc.stop(t + 0.05);

            // Try loading again
            loadTypingSound();
        }
    } else {
        // --- Error Sound (Unchanged) ---
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.15);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, t);
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
