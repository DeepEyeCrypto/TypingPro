// ═══════════════════════════════════════════════════════════════════
// SETTINGS PAGE: VisionOS-style glass configuration panel
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { useSettingsStore, ThemeType } from '../../../core/store/settingsStore';
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
    const { toggleMute, isMuted } = useSoundEngine();

    const themes: ThemeType[] = ['classic', 'glass', 'high-contrast', 'cyberpunk', 'dracula', 'matrix', 'nord', 'emerald'];

    return (
        <div className="flex flex-col gap-8 p-4 md:p-6 w-full max-w-4xl mx-auto pb-24">

            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">System Configuration</h1>
                    <p className="glass-text-muted text-sm mt-1">Fine-tune your neural typing interface.</p>
                </div>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="glass-pill px-6 py-2 text-sm font-bold text-gray-900 shadow-xl active:scale-95 transition-all"
                    >
                        Save & Exit
                    </button>
                )}
            </div>

            <GlassCard variant="large" className="w-full">

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   Appearance Section
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <section className="py-6 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Appearance</h3>

                    <div className="flex flex-col gap-8">
                        {/* Theme Grid */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 block">
                                Visual Theme
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {themes.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => settings.setTheme(t)}
                                        className={`
                                            px-4 py-2 rounded-xl text-xs font-bold transition-all
                                            ${settings.theme === t
                                                ? 'glass-pill text-gray-900'
                                                : 'text-white/60 hover:text-white hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        {t.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 block">
                                    Typography
                                </label>
                                <select
                                    value={settings.fontFamily}
                                    onChange={(e) => settings.setFontFamily(e.target.value)}
                                    className="glass-unified w-full p-3 rounded-2xl bg-black/20 text-white font-bold text-sm outline-none border-none ring-1 ring-white/10 focus:ring-white/30"
                                >
                                    <option value="Inter">Inter (Sans)</option>
                                    <option value="JetBrains Mono">JetBrains Mono (Console)</option>
                                    <option value="Fira Code">Fira Code (Ligatures)</option>
                                    <option value="Monospace">System Mono</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 block">
                                    Contrast Scale ({settings.fontSize}px)
                                </label>
                                <input
                                    type="range"
                                    min="12"
                                    max="36"
                                    value={settings.fontSize}
                                    onChange={(e) => settings.setFontSize(parseInt(e.target.value))}
                                    className="w-full mt-4 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   Audio Section
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <section className="py-6 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Audio Experience</h3>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white/80">Enable Tactile Feedback</span>
                            <button
                                onClick={() => settings.setSoundEnabled(!settings.soundEnabled)}
                                className={`
                                    w-14 h-8 rounded-full p-1 transition-all duration-300
                                    ${settings.soundEnabled ? 'bg-white' : 'bg-white/10'}
                                `}
                            >
                                <div className={`
                                    w-6 h-6 rounded-full transition-transform duration-300
                                    ${settings.soundEnabled ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white/40'}
                                `} />
                            </button>
                        </div>

                        {settings.soundEnabled && (
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 whitespace-nowrap">
                                    Output Vol
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings.soundVolume}
                                    onChange={(e) => settings.setSoundVolume(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                                />
                                <span className="text-xs font-mono text-white/60 w-8">{settings.soundVolume}%</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   Environment Section
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <section className="py-6 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Environmental Backgrounds</h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {BACKGROUNDS.map((bg) => (
                            <div
                                key={bg.id}
                                onClick={() => settings.setBackgroundImage(bg.url)}
                                className={`
                                    relative group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all aspect-video
                                    ${settings.backgroundImage === bg.url
                                        ? 'border-white ring-4 ring-white/10'
                                        : 'border-transparent hover:border-white/20'}
                                `}
                            >
                                <img
                                    src={bg.thumb}
                                    alt={bg.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{bg.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   Danger Zone
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <section className="py-6">
                    <h3 className="text-lg font-bold text-red-400 mb-6 tracking-tight">Integrity & Data</h3>
                    <div className="flex flex-wrap gap-4">
                        <button className="glass-pill px-6 py-2 text-xs font-bold text-gray-900">
                            Sync Local Cache
                        </button>
                        <button className="glass-pill px-6 py-2 text-xs font-bold bg-red-500 text-white hover:bg-red-600">
                            Purge All Data
                        </button>
                    </div>
                </section>

            </GlassCard>
        </div>
    );
};
