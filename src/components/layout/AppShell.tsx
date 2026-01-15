import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useSoundEngine } from '../../hooks/useSoundEngine';

const MuteToggle: React.FC = () => {
    const { toggleMute, isMuted } = useSoundEngine();
    return (
        <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border border-white/5
                ${isMuted ? 'bg-white/5 text-white/20' : 'bg-glass-surface text-white backdrop-blur-md shadow-glass-edge border-t-white/10'} 
                hover:scale-105 active:scale-95`}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
            {isMuted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            )}
        </button>
    )
}

interface AppShellProps {
    sidebar: React.ReactNode;
    topbar: React.ReactNode;
    children: React.ReactNode;
    activeView?: string;
}

/**
 * AppShell: The master layout primitive for TypingPro.
 * Overhauled for High-Fidelity Deep Glass aesthetic.
 */
export const AppShell: React.FC<AppShellProps> = ({ sidebar, topbar, children, activeView }) => {
    const { backgroundImage } = useSettingsStore();
    const effectiveBackgroundImage = backgroundImage || localStorage.getItem('pref_bg_image') || '';

    return (
        <div
            className="flex h-screen w-screen bg-deep-ocean overflow-hidden select-none font-sans relative"
            style={effectiveBackgroundImage ? { backgroundImage: `url("${effectiveBackgroundImage}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
            {/* Minimal Ambient Overlay - Optional or Removed based on "Invisible Container" */}
            <div className="absolute inset-0 bg-transparent z-0 pointer-events-none" />

            {/* DOCKED SIDEBAR - Floating Pill (Fixed Left) */}


            {/* DOCKED SIDEBAR - Provided by SideNav content */}
            {sidebar}

            {/* MAIN CONTENT AREA - Bento Grid Controller */}
            {/* Removed background color/blur from main wrapper to allow transparency */}
            <div className="flex-1 flex flex-col relative z-10 min-w-0 bg-transparent gpu-accelerated">

                {/* TOP BAR - Floating Glass (Consistent with Sidebar) */}
                <header className="flex-none h-14 mx-6 mt-4 backdrop-blur-[50px] bg-white/15 border border-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),_0_20px_40px_rgba(0,0,0,0.5)] rounded-[32px] flex items-center px-6 md:ml-32 transition-all">
                    {topbar}
                </header>

                {/* SCROLLABLE CONTENT */}
                <main className="flex-1 overflow-y-auto relative p-4 md:p-6 lg:p-12 md:pl-28 lg:pl-32 custom-scrollbar contain-content">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, scale: 0.99, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.01, filter: 'blur(10px)' }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};
