import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FocusModeProps {
    isActive: boolean;
    children: React.ReactNode;
}

export const FocusMode: React.FC<FocusModeProps> = ({ isActive, children }) => {
    const [isFullyFocused, setIsFullyFocused] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isActive) {
            timeout = setTimeout(() => setIsFullyFocused(true), 1000);
        } else {
            setIsFullyFocused(false);
        }
        return () => clearTimeout(timeout);
    }, [isActive]);

    return (
        <div className="relative w-full h-full">
            <AnimatePresence>
                {!isActive && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-0 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <div className={`transition-all duration-1000 ${isActive ? 'scale-[1.02]' : 'scale-100'}`}>
                {children}
            </div>

            {isActive && (
                <style dangerouslySetInnerHTML={{
                    __html: `
                    header, aside, .stats-sidebar, footer {
                        opacity: 0 !important;
                        pointer-events: none !important;
                        transition: opacity 0.8s ease-in-out !important;
                    }
                    .typing-container {
                        margin-top: 10vh !important;
                    }
                `}} />
            )}
        </div>
    );
};
