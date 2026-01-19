import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemePreviewCarousel: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className="glass-panel p-6 mb-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">🎨 Active Theme Preview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sample Cards */}
                <div className="glass-panel p-6 h-32 flex items-center justify-center">
                    <div className="text-lg font-semibold">Glass Panel</div>
                </div>

                <div className="glass-panel-dark p-6 h-32 flex items-center justify-center">
                    <div className="text-lg font-semibold text-white">Dark Card</div>
                </div>

                <div className="glass-panel p-6 h-32 flex flex-col items-center justify-center space-y-2">
                    <div className="text-primary text-lg font-semibold">Typography</div>
                    <div className="text-secondary text-sm">Primary -  Secondary</div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-center text-sm opacity-75">
                    Current: <span className="font-bold capitalize">{theme}</span> theme
                </p>
            </div>
        </div>
    );
};
