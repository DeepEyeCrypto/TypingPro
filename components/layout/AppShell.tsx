import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import FuturisticBackground from './FuturisticBackground';

interface AppShellProps {
    header?: React.ReactNode;
    sidebar?: React.ReactNode;
    children: React.ReactNode;
    rightPanel?: React.ReactNode;
    className?: string;
}

/**
 * AppShell - Adaptive Grid System
 * Breakpoints:
 * - Desktop (xl): 3-column (Sidebar | Main | RightPanel)
 * - Tablet (lg): 2-column (Sidebar | Main + TopBar Stats)
 * - Mobile (md/sm): 1-column stack (Hamburger Menu for Sidebar)
 */
export const AppShell: React.FC<AppShellProps> = ({
    header,
    sidebar,
    children,
    rightPanel,
    className = ''
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className={`grid grid-rows-[auto_1fr] h-screen w-full bg-deep-charcoal text-white/90 selection:bg-cyber-cyan/30 relative overflow-hidden ${className}`}>
            {/* Phase 1: Sci-Fi Animated Background */}
            <FuturisticBackground />

            {/* Header: Full Width */}
            {header && (
                <header className="z-[60] glass-panel border-b border-white/5 relative h-16 md:h-20 flex items-center px-4 md:px-6">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-white/40 hover:text-white transition-colors mr-4"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="flex-1">
                        {header}
                    </div>
                </header>
            )}

            {/* 3-Zone Content Grid */}
            <div className={`grid grid-cols-1 lg:grid-cols-[250px_1fr] 2xl:grid-cols-[280px_1fr_minmax(0,320px)] h-full overflow-hidden`}>

                {/* 1. Left Sidebar */}
                {sidebar && (
                    <>
                        <aside className="hidden lg:block h-full glass-panel border-r border-white/5 overflow-y-auto scrollbar-hide">
                            {sidebar}
                        </aside>

                        {/* Mobile Side Drawer */}
                        {isMobileMenuOpen && (
                            <div className="fixed inset-0 z-[100] lg:hidden">
                                <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
                                <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#050508] border-r border-white/10 shadow-3xl animate-in slide-in-from-left duration-500">
                                    <div className="flex justify-between items-center p-6 border-b border-white/5">
                                        <span className="font-black text-xl tracking-tighter">TYPINGPRO</span>
                                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/40 hover:text-white transition-colors"><X /></button>
                                    </div>
                                    <div className="h-[calc(100%-80px)] overflow-y-auto p-2">
                                        {sidebar}
                                    </div>
                                </aside>
                            </div>
                        )}
                    </>
                )}

                {/* 2. Center Stage (Main Content) */}
                <main className="relative h-full overflow-hidden flex flex-col min-w-0">
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="h-full w-full">
                            {children}
                        </div>
                    </div>
                </main>

                {/* 3. Right Panel (Ultra-wide screens) */}
                {rightPanel ? (
                    <aside className="hidden 2xl:block h-full glass-panel border-l border-white/5 overflow-y-auto scrollbar-hide">
                        {rightPanel}
                    </aside>
                ) : (
                    <div className="hidden 2xl:block" /> // Empty column for symmetry on 2xl
                )}
            </div>
        </div>
    );
};
