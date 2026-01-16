import React from 'react';
import { useSoundEngine } from '../../hooks/useSoundEngine';
import { useContrastText } from '../../hooks/useContrastText';

interface NavItem {
    id: string;
    icon: React.ReactNode;
    label?: string;
    active?: boolean;
    onClick: () => void;
}

interface SideNavProps {
    items: NavItem[];
    footer?: React.ReactNode;
    syncing?: boolean;
    bgColor?: string; // High-level background color detection
}

/* ICONS */
const Volume2 = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
);

const VolumeX = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
);

import { GlassSurface } from '../ui/glass/GlassSurface';

// Explicitly using GlassSurface to align with the universal glass system
const SideNavComponent: React.FC<SideNavProps> = ({ items, bgColor = '#ffffff' }) => {
    const { toggleMute, isMuted } = useSoundEngine();
    const { textColor } = useContrastText(bgColor);

    return (
        <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-50 h-[85vh] w-16 hidden md:block" style={{ '--contrast-text': textColor } as any}>
            <GlassSurface
                elevation="high"
                cornerRadius="pill"
                className="w-full h-full flex flex-col items-center py-8 justify-between glass-perfect"
                style={{ color: textColor }}
            >

                {/* 1. NAVIGATION (Top) */}
                <nav className="flex flex-col items-center gap-6 w-full pt-4">
                    {items.filter(i => i.id !== 'settings').map((item) => (
                        <button
                            key={item.id}
                            onClick={item.onClick}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 shrink-0 ${item.active
                                ? 'bg-white/20 shadow-inner' // Removal of hardcoded neon-lime for contrast
                                : 'opacity-60 hover:opacity-100 hover:bg-white/5'
                                }`}
                            style={{ color: item.active ? 'var(--contrast-text)' : 'inherit' }}
                        >
                            {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                        </button>
                    ))}
                </nav>

                {/* 2. SYSTEM ICONS (Bottom) */}
                <div className="flex flex-col gap-6 items-center w-full pb-4">
                    {/* Volume Toggle */}
                    <button onClick={toggleMute} className="w-10 h-10 flex items-center justify-center rounded-xl opacity-50 hover:opacity-100 hover:bg-white/5 transition-all" title={isMuted ? "Unmute" : "Mute"}>
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    {/* Settings */}
                    {items.find(i => i.id === 'settings') && (
                        <button
                            onClick={items.find(i => i.id === 'settings')?.onClick}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl opacity-50 hover:opacity-100 hover:bg-white/5 transition-all ${items.find(i => i.id === 'settings')?.active ? 'opacity-100' : ''}`}
                        >
                            {React.cloneElement(items.find(i => i.id === 'settings')?.icon as React.ReactElement, { size: 20 })}
                        </button>
                    )}
                </div>
            </GlassSurface>
        </aside>
    );
};

// React.memo optimization to prevent sidebar re-renders during high-speed typing
export const SideNav = React.memo(SideNavComponent);
