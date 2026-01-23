import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Signal, Activity, Waves } from 'lucide-react';

interface CognitiveRadioGridProps {
    wpm: number;
    accuracy: number;
    className?: string;
}

export const CognitiveRadioGrid: React.FC<CognitiveRadioGridProps> = ({ wpm, accuracy, className }) => {
    // SNR calculation: Hits (Accuracy) over Noise (Errors)
    const snr = accuracy / (100.1 - accuracy);
    const snrDb = Math.round(10 * Math.log10(Math.max(1, snr)));

    return (
        <div className={`glass-panel rounded-[3rem] p-8 overflow-hidden relative flex flex-col ${className}`}>
            <div className="flex justify-between items-start mb-12 z-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-500">
                            <Radio size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Biological_Frequency</span>
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Cognitive_Radio</h3>
                </div>

                <div className="text-right">
                    <div className="text-[9px] font-black uppercase tracking-widest opacity-20 mb-1">SNR_Ratio</div>
                    <div className="text-2xl font-black italic tracking-tighter text-cyan-500">{snrDb} dB</div>
                </div>
            </div>

            {/* Spectrogram Grid */}
            <div className="flex-1 min-h-[160px] grid grid-cols-12 gap-1 mb-8 z-10">
                {Array(60).fill(0).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.1 }}
                        animate={{
                            opacity: [0.1, Math.random() * (accuracy / 100), 0.1],
                            scaleY: [1, 1 + Math.random() * (wpm / 100), 1]
                        }}
                        transition={{
                            duration: 2 + Math.random() * 3,
                            repeat: Infinity,
                            delay: i * 0.05
                        }}
                        className="w-full h-full rounded-full bg-gradient-to-t from-cyan-500/40 to-cyan-300/10 origin-bottom"
                    />
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4 z-10">
                <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">Carrier</div>
                    <div className="text-xs font-black italic text-cyan-400">{Math.round(wpm * 1.5)} Hz</div>
                </div>
                <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">Bandwidth</div>
                    <div className="text-xs font-black italic text-cyan-400">{(accuracy * 0.8).toFixed(1)} MHz</div>
                </div>
                <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">Mode</div>
                    <div className="text-xs font-black italic text-cyan-400">AUTONOMOUS</div>
                </div>
            </div>

            {/* Signal Ripple Effect */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
                <motion.div
                    animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-64 h-64 border-2 border-cyan-500 rounded-full"
                />
            </div>
        </div>
    );
};
