import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    hoverEffect = false
}) => {
    return (
        <div
            className={`
        bg-glass-bg 
        backdrop-blur-md 
        border border-glass-border 
        rounded-lg 
        shadow-lg
        ${hoverEffect ? 'transition-all duration-300 hover:bg-white/5 hover:border-white/10 hover:shadow-neon-cyan/20' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};
