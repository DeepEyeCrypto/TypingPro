import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeType = 'vision' | 'arctic' | 'cyberpunk' | 'aurora' | 'nature' | 'neural' | 'neumorphism' | 'liquid';

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeType>('nature');
    const [mounted, setMounted] = useState(false);

    // Load theme from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('typingpro-theme') as ThemeType || 'nature';
        setThemeState(saved);
        document.body.setAttribute('data-theme', saved);
        setMounted(true);
    }, []);

    const setTheme = (newTheme: ThemeType) => {
        setThemeState(newTheme);
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('typingpro-theme', newTheme);
    };

    // We must always wrap children in the provider, even if not fully mounted yet,
    // to prevent hooks (like useTheme) in child components from throwing during initial render.
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
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
