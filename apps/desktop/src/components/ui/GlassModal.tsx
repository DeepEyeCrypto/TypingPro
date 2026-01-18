// ═══════════════════════════════════════════════════════════════════
// GLASS MODAL: VisionOS-style glass dialog component
// ═══════════════════════════════════════════════════════════════════

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface GlassModalAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
}

interface GlassModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    actions?: GlassModalAction[];
    maxWidth?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLASS MODAL COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const GlassModal: React.FC<GlassModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    actions,
    maxWidth = 'max-w-lg'
}) => {
    // Disable body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`relative w-full ${maxWidth} z-10 shadow-2xl`}
                    >
                        <GlassCard variant="large" className="w-full">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/10">
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight leading-none">
                                        {title}
                                    </h2>
                                    {subtitle && (
                                        <p className="glass-text-muted text-xs mt-2 font-bold uppercase tracking-widest">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center rounded-full glass-pill text-gray-900 shadow-lg hover:scale-110 transition-transform"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Body */}
                            <div className="py-2">
                                {children}
                            </div>

                            {/* Footer Actions */}
                            {actions && actions.length > 0 && (
                                <div className="flex flex-wrap gap-3 justify-end mt-8 pt-6 border-t border-white/10">
                                    {actions.map((action, idx) => (
                                        <button
                                            key={idx}
                                            onClick={action.onClick}
                                            className={`
                                                px-6 py-2.5 rounded-full text-sm font-bold shadow-xl transition-all active:scale-95
                                                ${action.variant === 'primary'
                                                    ? 'glass-pill text-gray-900'
                                                    : action.variant === 'danger'
                                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                                }
                                            `}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GlassModal;
