import React from 'react';
import { motion } from 'framer-motion';

interface FloatingMenuItemProps {
    id: string;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: (id: string) => void;
}

export const FloatingMenuItem: React.FC<FloatingMenuItemProps> = ({
    id,
    label,
    icon,
    isActive,
    onClick
}) => {
    return (
        <button
            onClick={() => onClick(id)}
            className={`
                relative w-full px-4 py-3 flex items-center gap-4 group transition-all duration-200
                ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}
            `}
        >
            {/* Active Highlight (Shared Layout Transition) */}
            {isActive && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/20 shadow-inner z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            {/* Icon Wrapper */}
            <div className={`
                relative z-10 transition-colors duration-200
                ${isActive ? 'text-cyan-400' : 'text-white/40 group-hover:text-white/70'}
            `}>
                {icon}
            </div>

            {/* Label */}
            <span className="relative z-10 font-medium text-[15px] tracking-tight uppercase">
                {label}
            </span>
        </button>
    );
};
