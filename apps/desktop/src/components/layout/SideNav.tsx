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
            className="glass-unified flex flex-col items-center justify-between h-full w-16 py-6 transition-all"
            style={{ '--contrast-text': textColor } as React.CSSProperties}
        >
            {/* Navigation Items */}
            <nav className="flex flex-col items-center gap-4 w-full">
                {items.filter(item => item.id !== 'settings').map((item) => (
                    <button
                        key={item.id}
                        onClick={item.onClick}
                        className={`
                            w-10 h-10 flex items-center justify-center rounded-xl 
                            transition-all duration-200 ease-out shrink-0
                            ${item.active
                                ? 'glass-pill text-gray-900 shadow-lg'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }
                        `}
                        title={item.label}
                    >
                        {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                    </button>
                ))}
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom Controls */}
            <div className="flex flex-col gap-4 items-center w-full">
                {/* Sync indicator */}
                {syncing && (
                    <div className="text-[10px] text-white/50 animate-pulse font-medium tracking-wider">
                        SYNC
                    </div>
                )}

                {/* Volume Toggle */}
                <button
                    onClick={toggleMute}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                {/* Settings (if in items) */}
                {items.find(i => i.id === 'settings') && (
                    <button
                        onClick={items.find(i => i.id === 'settings')?.onClick}
                        className={`
                            w-10 h-10 flex items-center justify-center rounded-xl 
                            transition-all duration-200 ease-out
                            ${items.find(i => i.id === 'settings')?.active
                                ? 'glass-pill text-gray-900'
                                : 'text-white/50 hover:text-white hover:bg-white/10'
                            }
                        `}
                        title="Settings"
                    >
                        {React.cloneElement(
                            items.find(i => i.id === 'settings')?.icon as React.ReactElement,
                            { size: 18 }
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
