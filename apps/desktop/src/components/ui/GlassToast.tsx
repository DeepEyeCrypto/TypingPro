// ═══════════════════════════════════════════════════════════════════
// GLASS TOAST: VisionOS-style minimal glass notification
// ═══════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type ToastType = 'success' | 'error' | 'info';

interface GlassToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onDismiss?: () => void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLASS TOAST COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const GlassToast: React.FC<GlassToastProps> = ({
    message,
    type,
    duration = 4000,
    onDismiss
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onDismiss) setTimeout(onDismiss, 300); // Wait for exit animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onDismiss]);

    const typeIcons = {
        success: '✨',
        error: '⚠️',
        info: 'ℹ️'
    };

    const typeColors = {
        success: 'text-lime-400',
        error: 'text-red-400',
        info: 'text-cyan-400'
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9 }}
                    className="fixed bottom-8 right-8 z-[200] pointer-events-auto"
                >
                    <div className="glass-unified px-6 py-4 flex items-center gap-4 shadow-2xl min-w-[300px] border-l-4 border-l-white/20">
                        <div className="text-xl filter drop-shadow-md">
                            {typeIcons[type]}
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${typeColors[type]}`}>
                                {type.toUpperCase()}
                            </span>
                            <p className="text-sm font-bold text-white tracking-tight">
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-auto text-white/30 hover:text-white transition-colors text-xs font-black p-1"
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlassToast;
