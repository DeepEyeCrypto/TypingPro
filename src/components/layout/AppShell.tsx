import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useSoundEngine } from '../../hooks/useSoundEngine';
import { GlassSurface } from '../ui/glass/GlassSurface';

const MuteToggle: React.FC = () => {
    const { toggleMute, isMuted } = useSoundEngine();
    return (
        <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border border-white/5
                ${isMuted ? 'bg-white/5 text-white/20' : 'glass-perfect text-white shadow-glass-edge'} 
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
            className="flex h-screen w-screen bg-transparent overflow-hidden select-none font-sans relative"
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

                <header className="flex-none h-16 mx-6 mt-4 md:ml-32 transition-all z-50">
                    {topbar}
                </header>

                {/* SCROLLABLE CONTENT */}
                <main className="flex-1 overflow-y-auto relative p-4 md:p-6 lg:p-12 md:pl-28 lg:pl-32 custom-scrollbar contain-content bg-transparent">
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
