import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import FuturisticBackground from './FuturisticBackground';

interface AppShellProps {
    header?: React.ReactNode;
    sidebar?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    isSidebarCollapsed?: boolean;
    onToggleSidebar?: (collapsed: boolean) => void;
    isFocused?: boolean; // New prop for focus dimming
}

export const AppShell: React.FC<AppShellProps> = ({
    header,
    sidebar,
    children,
    footer,
    isSidebarCollapsed = true,
    onToggleSidebar,
    isFocused = false
}) => {
    return (
        <div className="h-screen w-screen bg-[#020617] text-white overflow-hidden relative font-inter">
            <FuturisticBackground />

            {/* 3-Tier Vertical Grid */}
            <div className={`flex flex-col h-full w-full transition-all duration-1000 ${isFocused ? 'gap-0' : 'gap-2'}`}>

                {/* 1. TOP (Navbar - 10%) */}
                <header className={`h-[10%] shrink-0 z-[60] transition-all duration-700 ${isFocused ? 'dim-focus translate-y-[-20px]' : ''}`}>
                    {header}
                </header>

                {/* 2. CENTER (Active Zone - 70/80%) */}
                <main className="flex-1 min-h-0 relative z-50 flex flex-col items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        {children}
                    </div>
                </main>

                {/* 3. BOTTOM (Utility Zone - 10/20%) */}
                <footer className={`h-[15%] shrink-0 z-[60] transition-all duration-700 ${isFocused ? 'dim-focus translate-y-[20px]' : ''}`}>
                    {footer}
                </footer>
            </div>

            {/* COLLAPSIBLE SIDEBAR DRAWER (Slide-out) */}
            {sidebar && (
                <>
                    {/* Backdrop for sidebar */}
                    {!isSidebarCollapsed && (
                        <div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500"
                            onClick={() => onToggleSidebar?.(true)}
                        />
                    )}

                    <aside
                        className={`fixed top-0 left-0 h-full w-[350px] z-[110] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`}
                    >
                        <div className="h-full w-full glass-premium border-r border-white/10 shadow-3xl overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-xl font-black">Curriculum</h3>
                                <button
                                    onClick={() => onToggleSidebar?.(true)}
                                    className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                                >
                                    <ChevronRight className="rotate-180" size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto scroll-premium p-4">
                                {sidebar}
                            </div>
                        </div>
                    </aside>

                    {/* Sidebar Trigger (Only when collapsed) */}
                    <button
                        onClick={() => onToggleSidebar?.(false)}
                        className={`fixed left-6 top-1/2 -translate-y-1/2 z-[80] p-4 glass-premium text-sky-400 hover:scale-110 active:scale-95 transition-all duration-500 ${isSidebarCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}
                        title="Open Curriculum"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}
        </div>
    );
};
