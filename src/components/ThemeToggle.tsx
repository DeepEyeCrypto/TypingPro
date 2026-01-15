import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-3 rounded-full transition-all duration-500 hover:scale-110 active:scale-90 bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 group shadow-2xl"
            aria-label="Toggle Theme"
        >
            <div className="relative w-5 h-5 overflow-hidden">
                <div
                    className={`absolute inset-0 transition-transform duration-700 cubic-bezier(0.22, 1, 0.36, 1) transform ${theme === 'dark' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                        }`}
                >
                    <Moon className="w-5 h-5 text-white opacity-80" />
                </div>
                <div
                    className={`absolute inset-0 transition-transform duration-700 cubic-bezier(0.22, 1, 0.36, 1) transform ${theme === 'light' ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                        }`}
                >
                    <Sun className="w-5 h-5 text-white opacity-80" />
                </div>
            </div>
        </button>
    );
};
