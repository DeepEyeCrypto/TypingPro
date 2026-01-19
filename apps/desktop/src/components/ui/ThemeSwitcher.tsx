import React from 'react';
import { useTheme } from '../../context/ThemeContext';

type ThemeType = 'vision' | 'arctic' | 'cyberpunk' | 'aurora' | 'nature';

interface ThemeConfig {
    name: ThemeType;
    label: string;
    emoji: string;
    gradient: string;
}

const THEMES: ThemeConfig[] = [
    { name: 'vision', label: 'Vision Pro', emoji: '🔮', gradient: 'from-purple-500/80 to-blue-500/80' },
    { name: 'arctic', label: 'Arctic', emoji: '❄️', gradient: 'from-blue-400/90 to-cyan-400/90' },
    { name: 'cyberpunk', label: 'Cyberpunk', emoji: '⚡', gradient: 'from-purple-600/80 to-pink-600/80' },
    { name: 'aurora', label: 'Aurora', emoji: '🌌', gradient: 'from-indigo-500/80 to-purple-600/80' },
    { name: 'nature', label: 'Nature', emoji: '🌿', gradient: 'from-green-500/80 to-emerald-500/80' },
];

export const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <>
            {/* Desktop: Horizontal Pill */}
            <div className="hidden md:flex fixed top-6 right-6 z-50 p-2 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl hover:shadow-glow">
                {THEMES.map((t) => (
                    <button
                        key={t.name}
                        onClick={() => setTheme(t.name)}
                        title={`${t.label} Theme`}
                        className={`
              px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-300
              backdrop-blur-sm border border-white/10
              ${theme === t.name
                                ? 'bg-gradient-to-r bg-white/95 text-black shadow-xl scale-105 ring-2 ring-white/50'
                                : 'text-white/80 hover:bg-white/20 hover:scale-105 hover:text-white'
                            }
            `}
                    >
                        <span className="mr-2">{t.emoji}</span>
                        {t.label.split(' ')}
                    </button>
                ))}
            </div>

            {/* Mobile: Compact Dropdown */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <div className="group relative">
                    <button className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 hover:bg-black/60 shadow-xl transition-all duration-300">
                        <span className="text-xl">{THEMES.find(t => t.name === theme)?.emoji || '🌿'}</span>
                    </button>

                    {/* Mobile Dropdown */}
                    <div className="absolute top-full right-0 mt-2 w-64 bg-black/70 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 scale-95 group-hover:scale-100">
                        <div className="p-3">
                            <p className="text-xs opacity-50 mb-3 px-3">Choose Theme</p>
                            <div className="space-y-2">
                                {THEMES.map((t) => (
                                    <button
                                        key={t.name}
                                        onClick={() => setTheme(t.name)}
                                        className={`
                      w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200
                      ${theme === t.name
                                                ? 'bg-gradient-to-r from-white/90 to-gray-100 text-black shadow-inner ring-2 ring-white/50 scale-105'
                                                : 'hover:bg-white/20 hover:scale-[1.02]'
                                            }
                    `}
                                    >
                                        <span className="text-xl">{t.emoji}</span>
                                        <div>
                                            <div className="font-semibold">{t.label}</div>
                                            <div className="text-xs opacity-60">{t.name}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
