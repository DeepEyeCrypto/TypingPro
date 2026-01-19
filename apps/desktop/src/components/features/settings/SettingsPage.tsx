// ═══════════════════════════════════════════════════════════════════
// SETTINGS PAGE: VisionOS-style glass configuration panel
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { useSettingsStore } from '../../../core/store/settingsStore';
import { useTheme } from '../../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useSoundEngine } from '../../../hooks/useSoundEngine';
import { GlassCard } from '../../ui/GlassCard';

interface SettingsPageProps {
    onBack?: () => void;
}

const BACKGROUNDS = [
    { id: 'default', name: 'Midnight Void', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop' },
    { id: 'custom1', name: 'Caribbean Landscape', url: '/backgrounds/caribbean-landscape.jpg', thumb: '/backgrounds/caribbean-landscape.jpg' },
    { id: 'custom2', name: 'Modern Living Room', url: '/backgrounds/elegant-modern-living-room-with-comfortable-sofa-generated-by-ai.jpg', thumb: '/backgrounds/elegant-modern-living-room-with-comfortable-sofa-generated-by-ai.jpg' },
    { id: 'custom3', name: 'Luxury Dining', url: '/backgrounds/3d-rendering-modern-dining-room-living-room-with-luxury-decor-green-sofa.jpg', thumb: '/backgrounds/3d-rendering-modern-dining-room-living-room-with-luxury-decor-green-sofa.jpg' },
    { id: 'my-custom', name: 'Your Upload', url: '/8DE38A64-A816-45C7-B624-DD45B2F7EA9A.JPG', thumb: '/8DE38A64-A816-45C7-B624-DD45B2F7EA9A.JPG' }
];

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
    const settings = useSettingsStore();
    const { theme, setTheme } = useTheme();
    const { toggleMute, isMuted } = useSoundEngine();

    const themes = [
        { id: 'vision', label: 'Vision', emoji: '🔮' },
        { id: 'arctic', label: 'Arctic', emoji: '❄️' },
        { id: 'aurora', label: 'Aurora', emoji: '🌌' },
        { id: 'nature', label: 'Evergreen', emoji: '🌲' },
        { id: 'neural', label: 'Neural', emoji: '🧠' },
        { id: 'neumorphism', label: 'Soft', emoji: '🫧' },
    ] as const;

    return (
        <div className="flex flex-col gap-8 p-4 md:p-6 w-full max-w-4xl mx-auto pb-24">

            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>System Configuration</h1>
                    <p className="text-[var(--text-secondary)] text-sm mt-1 opacity-60">Fine-tune your neural typing interface.</p>
                </div>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="px-6 py-2 rounded-2xl text-sm font-black uppercase tracking-widest transition-all bg-[var(--text-accent)] text-white shadow-xl hover:scale-105 active:scale-95"
                    >
                        Save & Exit
                    </button>
                )}
            </div>

            <GlassCard variant="large" className="w-full">

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   Appearance Section
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <section className="py-6 border-b border-glass">
                    <h3 className="text-lg font-bold mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>Appearance</h3>

                    <div className="flex flex-col gap-8">
                        {/* Theme Grid */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block opacity-40" style={{ color: 'var(--text-primary)' }}>
                                Visual Theme
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {themes.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id as any)}
                                        className={`
                                            px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2
                                            ${theme === t.id
                                                ? 'bg-[var(--text-accent)] text-white shadow-lg scale-105'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] bg-[var(--glass-bg)] border border-glass'
                                            }
                                        `}
                                    >
                                        <span>{t.emoji}</span>
                                        <span>{t.label.toUpperCase()}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block opacity-30" style={{ color: 'var(--text-primary)' }}>
                                    Typography
                                </label>
                                <select
                                    value={settings.fontFamily}
                                    onChange={(e) => settings.setFontFamily(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-[var(--glass-bg)] text-[var(--text-primary)] font-black text-sm outline-none border border-glass focus:border-[var(--text-accent)] transition-all shadow-inner"
                                >
                                    <option value="Inter">Inter (Sans)</option>
                                    <option value="JetBrains Mono">JetBrains Mono (Console)</option>
                                    <option value="Fira Code">Fira Code (Ligatures)</option>
                                    <option value="Monospace">System Mono</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block opacity-30" style={{ color: 'var(--text-primary)' }}>
                                    Contrast Scale ({settings.fontSize}px)
                                </label>
                                <input
                                    type="range"
                                    min="12"
                                    max="36"
                                    value={settings.fontSize}
                                    onChange={(e) => settings.setFontSize(parseInt(e.target.value))}
                                    className="w-full mt-4 h-1.5 bg-[var(--glass-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-accent)]"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   Audio Section
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <section className="py-6 border-b border-glass">
                    <h3 className="text-lg font-bold mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>Audio Experience</h3>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-black opacity-80" style={{ color: 'var(--text-primary)' }}>Enable Tactile Feedback</span>
                            <button
                                onClick={() => settings.setSoundEnabled(!settings.soundEnabled)}
                                className={`
                                    w-14 h-8 rounded-full p-1 transition-all duration-300 shadow-inner
                                    ${settings.soundEnabled ? 'bg-[var(--text-accent)]' : 'bg-[var(--glass-bg)] border border-glass'}
                                `}
                            >
                                <div className={`
                                    w-6 h-6 rounded-full transition-transform duration-300 shadow-md
                                    ${settings.soundEnabled ? 'translate-x-6 bg-white' : 'translate-x-0 bg-[var(--text-secondary)] opacity-50'}
                                `} />
                            </button>
                        </div>

                        {settings.soundEnabled && (
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap opacity-30" style={{ color: 'var(--text-primary)' }}>
                                    Output Vol
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings.soundVolume}
                                    onChange={(e) => settings.setSoundVolume(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-[var(--glass-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-accent)]"
                                />
                                <span className="text-xs font-mono opacity-60 w-8" style={{ color: 'var(--text-primary)' }}>{settings.soundVolume}%</span>
                            </div>
                        )}
                    </div>
                </section>



                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   Danger Zone
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <section className="py-6">
                    <h3 className="text-lg font-black text-red-500 mb-6 tracking-tight uppercase italic">Integrity & Data</h3>
                    <div className="flex flex-wrap gap-4">
                        <button className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-[var(--glass-bg)] border border-glass text-[var(--text-primary)] hover:bg-[var(--glass-hover)] transition-all">
                            Sync Local Cache
                        </button>
                        <button className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                            Purge All Data
                        </button>
                    </div>
                </section>

            </GlassCard>
        </div>
    );
};
