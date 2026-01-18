import React from 'react';
import { useTheme } from '../context/ThemeContext';

type ThemeType = 'vision' | 'arctic' | 'cyberpunk' | 'aurora' | 'nature';

const THEMES: { name: ThemeType; label: string; emoji: string }[] = [
    { name: 'vision', label: 'Vision', emoji: '🔮' },
    { name: 'arctic', label: 'Arctic', emoji: '❄️' },
    { name: 'cyberpunk', label: 'Cyber', emoji: '⚡' },
    { name: 'aurora', label: 'Aurora', emoji: '🌌' },
    { name: 'nature', label: 'Nature', emoji: '🌿' },
];

export const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="fixed top-6 right-6 z-50 flex gap-2 p-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/20 hover:bg-black/50 transition-all duration-300 shadow-lg">
            {THEMES.map((t) => (
                <button
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    title={t.label}
                    className={`
            px-3 py-1.5 rounded-full text-xs font-semibold capitalize
            transition-all duration-300 ease-out
            ${theme === t.name
                            ? 'bg-white/90 text-black shadow-lg scale-105'
                            : 'text-white/70 hover:bg-white/20 hover:text-white/90'
                        }
          `}
                >
                    <span className="mr-1">{t.emoji}</span>
                    {t.label}
                </button>
            ))}
        </div>
    );
};
