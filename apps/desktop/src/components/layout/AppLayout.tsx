// ═══════════════════════════════════════════════════════════════════
// APP LAYOUT: Root layout with floating glass panels
// VisionOS-style glassmorphism design
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { SideNav } from './SideNav';


interface AppLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    topbar?: React.ReactNode;
    activeView?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    sidebar,
    topbar,
    activeView
}) => {


    return (
        <div className="relative flex h-screen w-screen overflow-hidden bg-transparent">
            {/* 1. Environment Layer - NOW HANDLED BY CSS THEME ENGINE */}
            <div className="fixed inset-0 z-0 bg-transparent transition-all duration-1000" />



            {/* Main layout container with padding for floating effect */}
            <div className="relative z-10 flex w-full h-full p-4 gap-6">

                {/* Left: Sidebar */}
                {sidebar && (
                    <div className="w-16 shrink-0 hidden md:block">
                        {sidebar}
                    </div>
                )}

                {/* Right: Main content area */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">

                    {/* Top bar */}
                    {topbar && (
                        <div className="shrink-0">
                            {topbar}
                        </div>
                    )}

                    {/* Content area */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden rounded-3xl">
                        {children}
                    </main>
                </div>
            </div>

            {/* Noise texture overlay */}
            <div
                className="fixed inset-0 z-[9999] opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />
        </div>
    );
};

export default AppLayout;
