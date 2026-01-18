// ═══════════════════════════════════════════════════════════════════
// APP LAYOUT: Root layout with floating glass panels
// VisionOS-style glassmorphism design
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { SideNav } from './SideNav';
import { useSettingsStore } from '../../core/store/settingsStore';

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
    const { backgroundImage } = useSettingsStore();

    return (
        <div className="relative flex h-screen w-screen overflow-hidden bg-black">
            {/* 1. Environment Layer (Image or Gradient) */}
            {backgroundImage ? (
                <div
                    className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    {/* Darkening veil & subtle environment blur for glass legibility */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
                </div>
            ) : (
                <div
                    className="fixed inset-0 z-0"
                    style={{
                        background: `
                            radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
                            radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
                            radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%)
                        `
                    }}
                />
            )}

            {/* Aurora orbs for depth (Reduced opacity if background image exists) */}
            <div className={`fixed top-0 left-0 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] animate-pulse pointer-events-none z-0 ${backgroundImage ? 'opacity-10' : 'opacity-40'}`} />
            <div className={`fixed top-0 right-0 w-[500px] h-[500px] bg-cyan-600 rounded-full mix-blend-screen filter blur-[128px] pointer-events-none z-0 ${backgroundImage ? 'opacity-5' : 'opacity-30'}`} style={{ animationDelay: '2s' }} />
            <div className={`fixed -bottom-8 left-20 w-[600px] h-[600px] bg-pink-600 rounded-full mix-blend-screen filter blur-[128px] pointer-events-none z-0 ${backgroundImage ? 'opacity-5' : 'opacity-30'}`} style={{ animationDelay: '4s' }} />

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
