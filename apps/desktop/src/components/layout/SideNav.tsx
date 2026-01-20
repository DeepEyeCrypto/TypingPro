// ═══════════════════════════════════════════════════════════════════
// SIDE NAV: VisionOS-style glass sidebar navigation
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { useSoundEngine } from '../../hooks/useSoundEngine';
import { useContrastText } from '../../hooks/useContrastText';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
    bgColor?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICON COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Volume2 = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const VolumeX = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SIDENAV COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SideNavComponent: React.FC<SideNavProps> = ({
    items,
    footer,
    syncing = false,
    bgColor = '#ffffff'
}) => {
    const { toggleMute, isMuted } = useSoundEngine();
    const { textColor } = useContrastText(bgColor);

    return (
        <aside
            className="glass-panel gpu-accelerated flex flex-col items-center justify-between h-full w-14 py-5 transition-transform duration-300 ease-in-out fixed left-0 top-0 z-40 transform -translate-x-full md:translate-x-0 md:relative"
        >
            {/* Navigation Items */}
            <nav className="flex flex-col items-center gap-2 w-full">
                {items.filter(item => item.id !== 'settings').map((item) => (
                    <button
                        key={item.id}
                        onClick={item.onClick}
                        className={`
                            w-9 h-9 flex items-center justify-center rounded-lg 
                            transition-all duration-300 ease-out shrink-0
                            ${item.active
                                ? 'bg-[var(--text-accent)] text-white shadow-lg scale-110'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] border border-transparent hover:border-glass'
                            }
                        `}
                        title={item.label}
                    >
                        {React.cloneElement(item.icon as React.ReactElement, { size: 16 })}
                    </button>
                ))}
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom Controls */}
            <div className="flex flex-col gap-2 items-center w-full">
                {/* Sync indicator */}
                {syncing && (
                    <div className="text-[8px] text-[var(--text-accent)] animate-pulse font-black tracking-[0.15em] mb-1 uppercase">
                        SYNC
                    </div>
                )}

                {/* Volume Toggle */}
                <button
                    onClick={toggleMute}
                    className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] border border-transparent hover:border-glass"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                {/* Settings (if in items) */}
                {items.find(i => i.id === 'settings') && (
                    <button
                        onClick={items.find(i => i.id === 'settings')?.onClick}
                        className={`
                            w-9 h-9 flex items-center justify-center rounded-lg 
                            transition-all duration-300 ease-out border
                            ${items.find(i => i.id === 'settings')?.active
                                ? 'bg-[var(--text-accent)] text-white shadow-lg border-[var(--text-accent)] scale-110'
                                : 'bg-[var(--glass-bg)] border-glass text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)]'
                            }
                        `}
                        title="Settings"
                    >
                        {React.cloneElement(
                            items.find(i => i.id === 'settings')?.icon as React.ReactElement,
                            { size: 16 }
                        )}
                    </button>
                )}

                {/* Footer content */}
                {footer && (
                    <div className="mt-2">
                        {footer}
                    </div>
                )}
            </div>
        </aside>
    );
};

// React.memo for performance optimization during typing
export const SideNav = React.memo(SideNavComponent);
export default SideNav;
