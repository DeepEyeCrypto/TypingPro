import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

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
        <div className={`flex flex-col h-screen w-screen relative overflow-hidden selection:bg-brand/30 ${className}`}>
            {/* Phase 1: Animated Background Layer */}
            <div className="bg-animate" />
            <div className="bg-glow top-[-10%] left-[-10%] bg-brand/30" />
            <div className="bg-glow bottom-[-10%] right-[-10%] bg-purple-500/20" style={{ animationDelay: '-5s' }} />

            {/* Global Header */}
            {header && (
                <header className="flex-shrink-0 z-[60] glass-panel border-b border-white/5 shadow-2xl relative">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="xl:hidden p-4 text-white/40 hover:text-white transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="flex-1">
                            {header}
                        </div>
                    </div>
                </header>
            )}

            {/* Main Adaptive Layout */}
            <div className="flex flex-1 min-h-0 relative z-10 overflow-hidden">

                {/* 1. Left Sidebar (Fixed Width Glass Pane) */}
                {sidebar && (
                    <>
                        <aside className="hidden xl:block w-72 glass-panel border-r-0 border-white/5 h-full overflow-y-auto scrollbar-hide">
                            {sidebar}
                        </aside>

                        {/* Mobile Side Drawer */}
                        {isMobileMenuOpen && (
                            <div className="fixed inset-0 z-[100] xl:hidden">
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
                                <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#050508] border-r border-white/10 shadow-2xl animate-in slide-in-from-left duration-500">
                                    <div className="flex justify-end p-4">
                                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/40 hover:text-white transition-colors"><X /></button>
                                    </div>
                                    <div className="h-[calc(100%-60px)] overflow-y-auto">
                                        {sidebar}
                                    </div>
                                </aside>
                            </div>
                        )}
                    </>
                )}

                {/* 2. Main Canvas (Fluid & Minimal) */}
                <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden bg-transparent">
                    <div className="flex-1 overflow-y-auto scrollbar-none">
                        {children}
                    </div>
                </main>

                {/* 3. Right Stats Column (2xl+ Desktop only) */}
                {rightPanel && (
                    <aside className="hidden 2xl:block w-80 glass-panel border-l-0 border-white/5 h-full overflow-y-auto scrollbar-hide">
                        {rightPanel}
                    </aside>
                )}
            </div>
        </div>
    );
};
