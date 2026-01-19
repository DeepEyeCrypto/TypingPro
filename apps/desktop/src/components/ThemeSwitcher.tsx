import React from 'react';
import { useTheme } from '../context/ThemeContext';

type ThemeType = 'vision' | 'arctic' | 'aurora' | 'nature' | 'neural' | 'neumorphism';

const THEMES: { name: ThemeType; label: string; emoji: string }[] = [
    { name: 'vision', label: 'Vision', emoji: '🔮' },
    { name: 'arctic', label: 'Arctic', emoji: '❄️' },
    { name: 'aurora', label: 'Aurora', emoji: '🌌' },
    { name: 'nature', label: 'Evergreen', emoji: '🌲' },
    { name: 'neural', label: 'Neural', emoji: '🧠' },
    { name: 'neumorphism', label: 'Soft', emoji: '🫧' },
];

interface ThemeSwitcherProps {
    className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = "" }) => {
    const { theme, setTheme } = useTheme();

    return (
        <div className={`flex items-center gap-0.5 ${className}`}>
            {THEMES.map((t) => (
                <button
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    title={t.label}
                    className={`
                        relative w-8 h-8 rounded-lg text-base
                        transition-all duration-200 ease-out flex items-center justify-center group
                        ${theme === t.name
                            ? 'bg-[var(--text-accent)]/20 border border-[var(--text-accent)]/40 shadow-[0_0_12px_var(--text-accent)] scale-110'
                            : 'hover:bg-white/10 opacity-60 hover:opacity-100 hover:scale-105'
                        }
                    `}
                >
                    <span className={`transition-transform duration-200 ${theme === t.name ? 'scale-110' : ''}`}>
                        {t.emoji}
                    </span>

                    {/* Tooltip */}
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/90 text-[7px] font-black uppercase tracking-widest text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {t.label}
                    </div>
                </button>
            ))}
        </div>
    );
};
