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
        <div className={`flex flex-col h-screen w-full bg-[#f0f4f8] dark:bg-[#0a0e27] text-slate-900 dark:text-white/90 selection:bg-sky-500/30 relative overflow-hidden transition-colors duration-700 ${className}`}>
            <FuturisticBackground />

            {header && (
                <div className="z-[60] shrink-0">
                    {header}
                </div>
            )}

            <div className="flex flex-1 overflow-hidden relative">
                {/* 1. Left Sidebar */}
                {sidebar && (
                    <>
                        <aside
                            className={`hidden lg:flex flex-col h-full bg-white/40 dark:bg-black/20 backdrop-blur-3xl border-r border-black/5 dark:border-white/5 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) relative overflow-hidden ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-[320px] opacity-100'}`}
                        >
                            <div className="flex-1 overflow-y-auto scrollbar-hide w-[320px]">
                                {sidebar}
                            </div>
                        </aside>

                        {/* Floating Trigger (Only visible when collapsed) */}
                        <button
                            onClick={() => onToggleSidebar?.(false)}
                            className={`hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-[70] p-4 bg-white dark:bg-sky-500 text-sky-600 dark:text-white rounded-[24px] shadow-2xl hover:scale-110 active:scale-95 transition-all duration-500 transform ${isSidebarCollapsed ? 'translate-x-0 scale-100' : '-translate-x-32 scale-50'}`}
                            title="Show Sidebar"
                        >
                            <ChevronRight size={24} />
                        </button>
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

                {/* 3. Right Panel (Stats etc.) */}
                {rightPanel && (
                    <aside className="hidden 2xl:block w-[320px] h-full bg-black/5 border-l border-black/5 dark:border-white/5 overflow-y-auto scrollbar-hide">
                        {rightPanel}
                    </aside>
                )}
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <aside className="absolute left-4 top-4 bottom-4 w-[300px] glass-card-modern shadow-3xl animate-ios-slide p-0 overflow-hidden border-white/20">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <span className="font-bold text-xl tracking-tight">TypingPro</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/40 hover:text-white transition-colors"><X /></button>
                        </div>
                        <div className="h-[calc(100%-80px)] overflow-y-auto p-4">
                            {sidebar}
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};
