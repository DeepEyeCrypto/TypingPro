import React, { useState } from 'react';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import FuturisticBackground from './FuturisticBackground';

interface AppShellProps {
    header?: React.ReactNode;
    sidebar?: React.ReactNode;
    children: React.ReactNode;
    rightPanel?: React.ReactNode;
    className?: string;
    isSidebarCollapsed?: boolean;
    onToggleSidebar?: (collapsed: boolean) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
    header,
    sidebar,
    children,
    rightPanel,
    className = '',
    isSidebarCollapsed = false,
    onToggleSidebar
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className={`flex flex-col h-screen w-full bg-deep-charcoal text-white/90 selection:bg-cyber-cyan/30 relative overflow-hidden ${className}`}>
            <FuturisticBackground />

            {header && (
                <header className="z-[60] glass-panel border-b border-white/5 h-16 md:h-20 flex items-center px-4 md:px-6 shrink-0 rounded-none">
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

            <div className="flex flex-1 overflow-hidden relative">
                {/* 1. Left Sidebar */}
                {sidebar && (
                    <>
                        <aside
                            className={`hidden lg:flex flex-col h-full bg-black/40 backdrop-blur-3xl border-r border-white/5 transition-all duration-300 ease-in-out relative overflow-hidden ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-[300px] opacity-100'}`}
                        >
                            <div className="flex-1 overflow-y-auto scrollbar-hide w-[300px]">
                                {sidebar}
                            </div>
                        </aside>

                        {/* Floating Trigger (Only visible when collapsed) */}
                        <button
                            onClick={() => onToggleSidebar?.(false)}
                            className={`hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-[70] p-3 bg-cyber-cyan text-deep-charcoal rounded-r-2xl shadow-cyan-glow hover:bg-cyan-400 transition-all duration-500 transform ${isSidebarCollapsed ? 'translate-x-0 scale-100' : '-translate-x-full scale-50'}`}
                            title="Show Sidebar"
                        >
                            <ChevronRight size={20} className="animate-pulse" />
                        </button>

                        {/* Mobile Side Drawer */}
                        {isMobileMenuOpen && (
                            <div className="fixed inset-0 z-[100] lg:hidden">
                                <div className="absolute inset-0 bg-black/95" onClick={() => setIsMobileMenuOpen(false)} />
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
                <main className="flex-1 relative h-full flex flex-col min-w-0 transition-all duration-500">
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="h-full w-full flex flex-col items-center">
                            {children}
                        </div>
                    </div>
                </main>

                {/* 3. Right Panel */}
                {rightPanel && (
                    <aside className="hidden 2xl:block w-[300px] h-full bg-black/10 border-l border-white/5 overflow-y-auto scrollbar-hide">
                        {rightPanel}
                    </aside>
                )}
            </div>
        </div>
    );
};
