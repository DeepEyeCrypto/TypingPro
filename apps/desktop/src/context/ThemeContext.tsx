import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSettingsStore } from '../core/store/settingsStore';

type ThemeType = 'vision' | 'arctic' | 'cyberpunk' | 'aurora' | 'nature' | 'neural' | 'neumorphism' | 'liquid';

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme, setTheme: setGlobalTheme } = useSettingsStore();
    const [mounted, setMounted] = useState(false);

    // Reactively sync theme to document body whenever it changes
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        setMounted(true);
    }, [theme]);

    const setTheme = (newTheme: ThemeType) => {
        setGlobalTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme: theme as ThemeType, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
