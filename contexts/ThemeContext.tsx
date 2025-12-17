import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
    children,
    defaultTheme = 'system',
    storageKey = 'typingpro-theme'
}: {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}) => {
    const [theme, setThemeState] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    );

    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            root.classList.add(systemTheme);
            setResolvedTheme(systemTheme);
            return;
        }

        root.classList.add(theme);
        setResolvedTheme(theme);
    }, [theme]);

    // Listen for system changes if mode is system
    useEffect(() => {
        if (theme !== 'system') return;

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? 'dark' : 'light';
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(newTheme);
            setResolvedTheme(newTheme);
        };

        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [theme]);

    const setTheme = (value: Theme) => {
        localStorage.setItem(storageKey, value);
        setThemeState(value);
    };

    const toggleTheme = () => {
        // If system, lock to the opposite of what resolved is
        if (theme === 'system') {
            setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
        } else {
            setTheme(theme === 'light' ? 'dark' : 'light');
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
