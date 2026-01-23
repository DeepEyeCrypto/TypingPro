import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemePreviewCarousel: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className="glass-panel rounded-[3rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden group">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div>
                    <h2 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase italic leading-none" style={{ color: 'var(--text-primary)' }}>
                        System_Aesthetics
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-3 opacity-30" style={{ color: 'var(--text-primary)' }}>
                        Current_Calibration: {theme.toUpperCase()}
                    </p>
                </div>
                <div className="px-6 py-2 bg-[var(--text-accent)] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Neural Theme Engine v2.5
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Accent Brilliance */}
                <div className="p-8 bg-[var(--text-accent)] rounded-[2rem] shadow-[0_20px_40px_rgba(var(--text-accent),0.2)] flex flex-col justify-end h-48 group/accent">
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Accent_Primary</span>
                    <span className="text-2xl font-black text-white italic tracking-tighter uppercase">High Speed Precision</span>
                </div>

                {/* Glass Transparency */}
                <div className="p-8 glass-panel rounded-[2rem] shadow-xl flex flex-col justify-end h-48 backdrop-blur-3xl">
                    <span className="text-[8px] font-black opacity-30 uppercase tracking-[0.3em] mb-2" style={{ color: 'var(--text-primary)' }}>Neural_Glass</span>
                    <span className="text-2xl font-black italic tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>Liquid Clarity</span>
                </div>

                {/* Typography Hierarchy */}
                <div className="p-8 glass-panel rounded-[2rem] shadow-inner flex flex-col justify-end h-48">
                    <span className="text-[8px] font-black opacity-30 uppercase tracking-[0.3em] mb-2" style={{ color: 'var(--text-primary)' }}>Data_Structure</span>
                    <div className="space-y-1">
                        <div className="text-xl font-black uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>Elite_Input</div>
                        <div className="text-[10px] font-black opacity-40 uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Sub-Baseline Protocol</div>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4 justify-center">
                {['Vision', 'Arctic', 'Cyberpunk', 'Aurora', 'Nature'].map(t => (
                    <div key={t} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${theme.toLowerCase() === t.toLowerCase() ? 'bg-[var(--text-accent)] text-white border-[var(--text-accent)]' : 'border-white/10 opacity-20'}`} style={theme.toLowerCase() === t.toLowerCase() ? {} : { color: 'var(--text-primary)' }}>
                        {t}
                    </div>
                ))}
            </div>
        </div>
    );
};
