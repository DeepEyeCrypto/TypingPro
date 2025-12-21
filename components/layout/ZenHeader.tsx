import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Settings, User, Command, Zap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';

export const ZenHeader: React.FC = () => {
    const { setTheme, availableThemes, activeTheme } = useTheme();
    const [showThemes, setShowThemes] = useState(false);

    return (
        <div className="flex items-center justify-between w-full h-12 relative">
            {/* Logo */}
            <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-500">
                    <Zap size={18} className="text-[var(--bg)] -rotate-45 group-hover:-rotate-90 transition-transform duration-500" />
                </div>
                <h1 className="text-xl font-black tracking-tighter text-[var(--main)] group-hover:text-[var(--accent)] transition-colors">
                    Typing<span className="opacity-40">Pro</span>
                </h1>
            </div>

            {/* Center: Mode Indicator (Simplified) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.3em] text-[var(--sub)]">
                <span className="text-[var(--accent)] cursor-pointer hover:opacity-100 opacity-80 transition-opacity">Practice</span>
                <span className="cursor-pointer hover:text-[var(--main)] transition-colors">Course</span>
                <span className="cursor-pointer hover:text-[var(--main)] transition-colors">Code</span>
                <span className="cursor-pointer hover:text-[var(--main)] transition-colors">Zen</span>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-4">
                {/* Theme Selector Overlay Trigger */}
                <div className="relative">
                    <button
                        onClick={() => setShowThemes(!showThemes)}
                        className="p-2 hover:text-[var(--accent)] transition-colors text-[var(--sub)]"
                    >
                        <Palette size={20} />
                    </button>

                    {showThemes && (
                        <div className="absolute right-0 top-12 w-48 bg-[var(--bg)] border border-[var(--sub)]/20 p-2 rounded-xl shadow-2xl z-[100] animate-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-1 gap-1">
                                {availableThemes.map(name => (
                                    <button
                                        key={name}
                                        onClick={() => {
                                            setTheme(name);
                                            setShowThemes(false);
                                        }}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest ${activeTheme.name.toLowerCase() === name ? 'bg-[var(--accent)] text-[var(--bg)]' : 'hover:bg-[var(--sub)]/10'}`}
                                    >
                                        {name}
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                                            <div className="w-2 h-2 rounded-full border border-[var(--sub)]/20" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button className="p-2 hover:text-[var(--accent)] transition-colors text-[var(--sub)]">
                    <Settings size={20} />
                </button>
                <button className="p-2 hover:text-[var(--accent)] transition-colors text-[var(--sub)]">
                    <User size={20} />
                </button>
            </div>
        </div>
    );
};
