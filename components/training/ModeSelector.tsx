import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Type, Code, Terminal, Target, Zap } from 'lucide-react';
import { PracticeMode, ModeConfig } from '../../types';

interface ModeSelectorProps {
    config: ModeConfig;
    onChange: (config: ModeConfig) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ config, onChange }) => {
    const modes: { id: PracticeMode; label: string; icon: any }[] = [
        { id: 'curriculum', label: 'Curriculum', icon: Target },
        { id: 'time', label: 'Time', icon: Clock },
        { id: 'words', label: 'Words', icon: Type },
        { id: 'code', label: 'Code', icon: Code },
        { id: 'custom', label: 'Custom', icon: Terminal },
        { id: 'smart', label: 'Smart', icon: Zap },
    ];

    const timeOptions = [15, 30, 60, 120];
    const wordOptions = [10, 25, 50, 100, 250];

    const handleModeChange = (mode: PracticeMode) => {
        onChange({ ...config, mode });
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Primary Mode Selector */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl overflow-hidden">
                {modes.map((m) => {
                    const isActive = config.mode === m.id;
                    const Icon = m.icon;
                    return (
                        <button
                            key={m.id}
                            onClick={() => handleModeChange(m.id)}
                            className={`
                                relative flex items-center gap-2 px-6 py-2.5 rounded-[20px] transition-all duration-300
                                ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'}
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-sky-500 shadow-lg shadow-sky-500/20"
                                    style={{ borderRadius: 20 }}
                                />
                            )}
                            <Icon size={14} className="relative z-10" />
                            <span className="text-[10px] font-black uppercase tracking-widest relative z-10">
                                {m.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Sub-Options (Conditional) */}
            <div className="h-10 flex items-center justify-center">
                {config.mode === 'time' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10"
                    >
                        {timeOptions.map(t => (
                            <button
                                key={t}
                                onClick={() => onChange({ ...config, duration: t as any })}
                                className={`text-[10px] font-black px-3 py-1 rounded-lg transition-all ${config.duration === t ? 'bg-white/10 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {t}s
                            </button>
                        ))}
                    </motion.div>
                )}

                {config.mode === 'words' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10"
                    >
                        {wordOptions.map(w => (
                            <button
                                key={w}
                                onClick={() => onChange({ ...config, wordCount: w as any })}
                                className={`text-[10px] font-black px-3 py-1 rounded-lg transition-all ${config.wordCount === w ? 'bg-white/10 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {w} words
                            </button>
                        ))}
                    </motion.div>
                )}

                {config.mode === 'custom' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[9px] font-bold text-slate-500 uppercase tracking-widest"
                    >
                        Paste custom text to begin training
                    </motion.div>
                )}
            </div>
        </div>
    );
};
