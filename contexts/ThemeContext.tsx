import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, THEMES } from '../theme/themes';

interface ThemeContextType {
    activeTheme: Theme;
    setTheme: (name: string) => void;
    availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [themeName, setThemeName] = useState<string>(() => {
        return localStorage.getItem('typingpro_zen_theme') || 'midnight';
    });

    const activeTheme = THEMES[themeName] || THEMES.midnight;

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--bg', activeTheme.background);
        root.style.setProperty('--main', activeTheme.main);
        root.style.setProperty('--sub', activeTheme.sub);
        root.style.setProperty('--accent', activeTheme.accent);
        root.style.setProperty('--caret', activeTheme.caret);
        root.style.setProperty('--error', activeTheme.error);
        root.style.setProperty('--success', activeTheme.success);

        localStorage.setItem('typingpro_zen_theme', themeName);
    }, [activeTheme, themeName]);

    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const availableThemes = Object.keys(THEMES);
                const nextIdx = (availableThemes.indexOf(themeName) + 1) % availableThemes.length;
                setThemeName(availableThemes[nextIdx]);
            }
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [themeName]);

    const setTheme = (name: string) => {
        if (THEMES[name]) setThemeName(name);
    };

    const availableThemes = Object.keys(THEMES);

    return (
        <ThemeContext.Provider value={{ activeTheme, setTheme, availableThemes }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
