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
}

export const SideNav: React.FC<SideNavProps> = ({ items, footer }) => {
    return (
        <nav className="flex flex-col items-center py-6 w-16 h-full space-y-8">
            {/* LOGO placeholder */}
            <div className="w-10 h-10 rounded-xl bg-hacker/10 border border-hacker/30 flex items-center justify-center mb-4">
                <span className="text-hacker font-bold text-xs">TP</span>
            </div>

            {/* NAV ITEMS */}
            <div className="flex-1 flex flex-col space-y-4">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={item.onClick}
                        className={`
              group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200
              ${item.active
                                ? 'bg-hacker/10 text-hacker border border-hacker/20 shadow-[0_0_15px_rgba(0,255,65,0.1)]'
                                : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                            }
            `}
                    >
                        {item.icon}

                        {/* TOOLTIP/LABEL overlay on hover */}
                        {item.label && (
                            <span className="absolute left-14 px-2 py-1 rounded bg-midnight-card border border-white/10 text-[10px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
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
