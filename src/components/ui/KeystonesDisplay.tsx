// ═══════════════════════════════════════════════════════════════════
// KEYSTONES DISPLAY - Animated currency indicator
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { motion } from 'framer-motion';

interface KeystonesDisplayProps {
    amount: number;
    showChange?: number; // +10 or -50 to show temporarily
    size?: 'sm' | 'md' | 'lg';
}

export const KeystonesDisplay: React.FC<KeystonesDisplayProps> = ({
    amount,
    showChange,
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-1.5 text-base',
        lg: 'px-4 py-2 text-lg',
    };

    const iconSizes = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-xl',
    };

    return (
        <div className={`relative flex items-center gap-2 bg-midnight-surface/50 rounded-lg ${sizeClasses[size]}`}>
            <span className={`${iconSizes[size]}`}>💎</span>
            <motion.span
                key={amount}
                initial={{ scale: 1.2, color: '#00ff41' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ duration: 0.3 }}
                className="font-bold font-mono"
            >
                {amount.toLocaleString()}
            </motion.span>

            {showChange !== undefined && showChange !== 0 && (
                <motion.span
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -20 }}
                    transition={{ duration: 1.5 }}
                    className={`absolute -top-5 right-0 text-sm font-bold ${showChange > 0 ? 'text-hacker' : 'text-red-400'
                        }`}
                >
                    {showChange > 0 ? '+' : ''}{showChange}
                </motion.span>
            )}
        </div>
    );
};
