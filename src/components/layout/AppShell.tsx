import { motion, AnimatePresence } from 'framer-motion';

interface AppShellProps {
    sidebar: React.ReactNode;
    topbar: React.ReactNode;
    children: React.ReactNode;
    activeView?: string; // Add activeView to trigger transitions
}

/**
 * AppShell: The master layout primitive for TypingPro.
 * It establishes a persistent Sidebar, a TopBar, and a scroll-locked MainContent area.
 */
export const AppShell: React.FC<AppShellProps> = ({ sidebar, topbar, children, activeView }) => {
    return (
        <div className="flex h-screen w-screen bg-midnight overflow-hidden select-none">
            {/* SIDEBAR AREA */}
            <aside className="h-full border-r border-white/5 bg-midnight-surface/50 backdrop-blur-md z-50">
                {sidebar}
            </aside>

            {/* CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-14 border-b border-white/5 bg-midnight-surface/30 backdrop-blur-sm z-40">
                    {topbar}
                </header>

                <section className="flex-1 overflow-auto relative p-6">
                    <div className="max-w-7xl mx-auto h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                                transition={{
                                    duration: 0.3,
                                    ease: [0.23, 1, 0.32, 1] // Custom ease-out expo 
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
