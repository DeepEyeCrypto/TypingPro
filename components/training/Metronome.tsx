import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';

export const Metronome: React.FC = () => {
    const { isMetronomeActive, metronomeBpm } = useApp();
    const [beat, setBeat] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const controls = useAnimation();

    useEffect(() => {
        if (!isMetronomeActive) return;

        const interval = (60 / metronomeBpm) * 1000;
        const tick = () => {
            setBeat(prev => (prev + 1) % 4);

            // Visual Pulse
            controls.start({
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.8, 0.3],
                transition: { duration: 0.1 }
            });

            // Audio Click (Optional: using a simple synth click or sample)
            // For now, visual only as we need a solid audio file
        };

        const timer = setInterval(tick, interval);
        return () => clearInterval(timer);
    }, [isMetronomeActive, metronomeBpm, controls]);

    if (!isMetronomeActive) return null;

    return (
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg">
            <div className="flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        animate={beat === i ? {
                            backgroundColor: '#0ea5e9',
                            scale: 1.2,
                            boxShadow: '0 0 15px rgba(14, 165, 233, 0.5)'
                        } : {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            scale: 1,
                            boxShadow: '0 0 0px rgba(0,0,0,0)'
                        }}
                        className="w-2.5 h-2.5 rounded-full"
                    />
                ))}
            </div>
            <div className="text-xs font-black text-sky-500 uppercase tracking-widest tabular-nums">
                {metronomeBpm} BPM
            </div>
            <motion.div
                animate={controls}
                className="w-4 h-4 rounded-full bg-sky-500/50 absolute -left-1 -top-1 blur-md pointer-events-none"
            />
        </div>
    );
};
