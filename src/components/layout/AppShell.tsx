import { motion, AnimatePresence } from 'framer-motion';

interface AppShellProps {
    sidebar: React.ReactNode;
    topbar: React.ReactNode;
    children: React.ReactNode;
    activeView?: string; // Add activeView to trigger transitions
}

import { useSettingsStore } from '../../stores/settingsStore';

/**
 * AppShell: The master layout primitive for TypingPro.
 * It establishes a persistent Sidebar, a TopBar, and a scroll-locked MainContent area.
 */
export const AppShell: React.FC<AppShellProps> = ({ sidebar, topbar, children, activeView }) => {
    const { backgroundImage } = useSettingsStore();

    return (
        <div
            className="flex h-screen w-screen bg-cover bg-center overflow-hidden select-none transition-all duration-700 ease-in-out"
            style={{ backgroundImage: `url("${backgroundImage}")` }}
        >
            {/* AMBIENT OVERLAY */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0" />

            {/* FLOATING SIDEBAR */}
            <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-50 h-[85vh]">
                <div className="h-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full py-4 px-2 shadow-2xl flex flex-col justify-center">
                    {sidebar}
                </div>
            </aside>

            {/* MAIN GLASS WINDOW */}
            <main className="relative z-10 flex-1 flex flex-col min-w-0 h-[92vh] my-auto mr-8 ml-32 bg-midnight/60 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden ring-1 ring-white/5">
                <header className="h-16 shrink-0 border-b border-white/5 bg-white/5 flex items-center px-6">
                    {topbar}
                </header>

                <section className="flex-1 overflow-auto relative p-6 custom-scrollbar">
                    <div className="max-w-7xl mx-auto h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                                className="h-full"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </div>
    );
};
