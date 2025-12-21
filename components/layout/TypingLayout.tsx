import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypingLayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export const TypingLayout: React.FC<TypingLayoutProps> = ({ children, header, footer }) => {
    return (
        <div
            className="w-screen h-screen flex flex-col items-center justify-between overflow-hidden relative select-none"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--main)' }}
        >
            {/* Top Bar Overlay */}
            <div className="w-full max-w-[1200px] px-8 pt-8 z-50">
                {header}
            </div>

            {/* Main Center Content */}
            <main className="flex-1 w-full flex items-center justify-center px-4 relative">
                <div className="w-full max-w-[900px]">
                    {children}
                </div>
            </main>

            {/* Bottom Bar Overlay */}
            <div className="w-full max-w-[1200px] px-8 pb-8 z-50">
                {footer}
            </div>

            {/* Background Grain/Noise (Subtle) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};
