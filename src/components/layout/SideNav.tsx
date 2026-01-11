import React from 'react';

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
}

export const SideNav: React.FC<SideNavProps> = ({ items, footer, syncing = false }) => {
    return (
        <nav className="flex flex-col items-center w-full h-full justify-between py-2">
            {/* LOGO / SYNC TRIGGER */}
            <div
                className={`
                    w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 cursor-pointer
                    ${syncing
                        ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.4)] animate-pulse'
                        : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30'
                    }
                `}
                title={syncing ? 'Syncing to Cloud...' : 'Cloud Synced'}
            >
                {syncing ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    "TP"
                )}
            </div>

            {/* NAV ITEMS */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={item.onClick}
                        className={`
              group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
              ${item.active
                                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110'
                                : 'text-white/40 hover:text-white hover:bg-white/10 hover:scale-105'
                            }
            `}
                    >
                        {item.icon}

                        {/* TOOLTIP/LABEL overlay on hover */}
                        {item.label && (
                            <span className="absolute left-14 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-xl border border-white/10 text-[10px] text-white/90 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                                {item.label}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* FOOTER AREA */}
            {footer && (
                <div className="pb-4">
                    {footer}
                </div>
            )}
        </nav>
    );
};
