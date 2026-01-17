import React from 'react';
import { motion } from 'framer-motion';
import { useContrastText } from '../../../hooks/useContrastText';

interface FloatingMenuItemProps {
    id: string;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: (id: string) => void;
    bgColor?: string; // Optional parent background color
}

export const FloatingMenuItem: React.FC<FloatingMenuItemProps> = ({
    id,
    label,
    icon,
    isActive,
    onClick,
    bgColor = 'transparent'
}) => {
    const { textColor } = useContrastText(bgColor);
    const isDarkBackground = textColor === '#FFFFFF';

    return (
        <button
            onClick={() => onClick(id)}
            className={`
                relative w-full px-4 py-3 flex items-center gap-4 group transition-all duration-200
                ${isActive ? '' : 'opacity-60 hover:opacity-100'}
            `}
            style={{ color: isActive ? textColor : undefined }}
        >
            {/* Active Highlight (Shared Layout Transition) */}
            {isActive && (
                <motion.div
                    layoutId="active-pill"
                    className={`absolute inset-0 rounded-xl border z-0 ${isDarkBackground
                            ? 'bg-white/10 border-white/20 shadow-inner'
                            : 'bg-black/10 border-black/20 shadow-inner'
                        }`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            {/* Icon Wrapper */}
            <div className={`
                relative z-10 transition-colors duration-200
                ${isActive ? 'text-cyan-400' : 'opacity-40 group-hover:opacity-70'}
            `}>
                {icon}
            </div>

            {/* Label */}
            <span className="relative z-10 font-medium text-[15px] tracking-tight uppercase" style={{ color: isActive ? textColor : 'inherit' }}>
                {label}
            </span>
        </button>
    );
};
