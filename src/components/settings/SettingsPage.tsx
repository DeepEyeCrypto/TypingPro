import React from 'react'
import { useSettingsStore, ThemeType } from '../../stores/settingsStore'
import { motion } from 'framer-motion'
import { useSoundEngine } from '../../hooks/useSoundEngine'

interface SettingsPageProps {
    onBack?: () => void
}

const BACKGROUNDS = [
    { id: 'default', name: 'Midnight Void', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop' },
    { id: 'custom1', name: 'Caribbean Landscape', url: '/backgrounds/caribbean-landscape.jpg', thumb: '/backgrounds/caribbean-landscape.jpg' },
    { id: 'custom2', name: 'Modern Living Room', url: '/backgrounds/elegant-modern-living-room-with-comfortable-sofa-generated-by-ai.jpg', thumb: '/backgrounds/elegant-modern-living-room-with-comfortable-sofa-generated-by-ai.jpg' },
    { id: 'custom3', name: 'Luxury Dining', url: '/backgrounds/3d-rendering-modern-dining-room-living-room-with-luxury-decor-green-sofa.jpg', thumb: '/backgrounds/3d-rendering-modern-dining-room-living-room-with-luxury-decor-green-sofa.jpg' },
    { id: 'my-custom', name: 'Your Upload', url: '/8DE38A64-A816-45C7-B624-DD45B2F7EA9A.JPG', thumb: '/8DE38A64-A816-45C7-B624-DD45B2F7EA9A.JPG' }
]

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
    // Hooks
    const settings = useSettingsStore()
    const { toggleMute, isMuted } = useSoundEngine() // using hook directly for mute logic if needed, but store sets enabled
    // Sync store enabled with engine mute if they differ? Store is source of truth.

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in w-full max-w-5xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0 mb-4">
                <div>
                    <h2 className="text-3xl font-black text-white">
                        Settings
                    </h2>
                    <p className="text-white/40 text-sm mt-1">Configure your typing environment.</p>
                </div>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="glass-perfect px-6 py-2 hover:bg-white/20 transition-all font-bold text-white shadow-lg"
                    >
                        Back
                    </button>
                )}
            </div>

            <div className="overflow-y-auto pb-20 custom-scrollbar space-y-8">

                {/* 1. VISUAL SETTINGS */}
                <div className="glass-perfect p-8">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Appearance</h3>

                    {/* Theme */}
                    <div className="mb-6">
                        <label className="text-sm font-bold text-white/70 mb-3 block">THEME PRESET</label>
                        <div className="flex flex-wrap gap-3">
                            {(['classic', 'glass', 'high-contrast', 'cyberpunk', 'dracula', 'matrix', 'nord', 'emerald'] as ThemeType[]).map(t => (
                                <button
                                    key={t}
                                    onClick={() => settings.setTheme(t)}
                                    className={`px-4 py-2 rounded-lg transition-all font-mono text-sm ${settings.theme === t
                                            ? 'bg-neon-lime text-black font-bold shadow-neon-glow'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {t.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Family */}
                    <div className="mb-6">
                        <label className="text-sm font-bold text-white/70 mb-3 block">TYPOGRAPHY</label>
                        <select
                            value={settings.fontFamily}
                            onChange={(e) => settings.setFontFamily(e.target.value)}
                            className="glass-perfect w-full md:w-1/2 p-3 rounded-lg bg-black/20 text-white focus:outline-none focus:border-neon-lime"
                        >
                            <option value="JetBrains Mono">JetBrains Mono</option>
                            <option value="Fira Code">Fira Code</option>
                            <option value="Monospace">Monospace</option>
                            <option value="Inter">Inter</option>
                        </select>
                    </div>

                    {/* Font Size */}
                    <div>
                        <label className="text-sm font-bold text-white/70 mb-2 block">FONT SIZE ({settings.fontSize}px)</label>
                        <input
                            type="range"
                            min="12"
                            max="36"
                            value={settings.fontSize}
                            onChange={(e) => settings.setFontSize(parseInt(e.target.value))}
                            className="w-full md:w-1/2 accent-neon-lime"
                        />
                    </div>
                </div>

                {/* 2. AUDIO SETTINGS */}
                <div className="glass-perfect p-8">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Audio Experience</h3>

                    <div className="flex items-center gap-4 mb-6">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.soundEnabled}
                                onChange={(e) => {
                                    settings.setSoundEnabled(e.target.checked)
                                    // Also toggle engine if needed, but store listener should handle it normally
                                    if (e.target.checked !== !isMuted) toggleMute()
                                }}
                                className="w-5 h-5 rounded border-white/30 bg-white/5 text-neon-lime focus:ring-neon-lime"
                            />
                            <span className="ml-3 text-white font-bold">ENABLE SOUND EFFECTS</span>
                        </label>
                    </div>

                    {settings.soundEnabled && (
                        <div>
                            <label className="text-sm font-bold text-white/70 mb-2 block">MASTER VOLUME ({settings.soundVolume}%)</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.soundVolume}
                                onChange={(e) => settings.setSoundVolume(parseInt(e.target.value))}
                                className="w-full md:w-1/2 accent-neon-lime"
                            />
                        </div>
                    )}
                </div>

                {/* 3. ENVIRONMENT BACKGROUNDS (Preserved) */}
                <div className="glass-perfect p-8">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Environment</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {BACKGROUNDS.map((bg) => (
                            <motion.div
                                key={bg.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => settings.setBackgroundImage(bg.url)}
                                className={`
                                    relative group cursor-pointer overflow-hidden rounded-xl border transition-all duration-300
                                    ${settings.backgroundImage === bg.url
                                        ? 'border-neon-lime ring-2 ring-neon-lime/20 shadow-neon-glow'
                                        : 'border-white/10 hover:border-white/30'}
                                `}
                            >
                                <div className="aspect-video w-full bg-black/50 relative">
                                    <img
                                        src={bg.thumb}
                                        alt={bg.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Selected Indicator */}
                                    {settings.backgroundImage === bg.url && (
                                        <div className="absolute inset-0 bg-neon-lime/10 flex items-center justify-center backdrop-blur-[1px]">
                                            <div className="bg-neon-lime text-black p-2 rounded-full shadow-lg">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    {/* Unselected Label */}
                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                        <span className="text-sm font-bold text-white">{bg.name}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 4. ACCOUNT (Placeholder) */}
                <div className="glass-perfect p-8 opacity-60 hover:opacity-100 transition-opacity">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Data Management</h3>
                    <div className="flex gap-4">
                        <button className="glass-perfect px-4 py-2 text-white hover:bg-white/10 transition-colors text-sm">Export Statistics</button>
                        <button className="glass-perfect px-4 py-2 text-red-400 hover:bg-red-500/10 border-red-500/30 transition-colors text-sm">Reset All Progress</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
