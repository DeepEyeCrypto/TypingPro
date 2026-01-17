import React, { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick }) => {
    return (
        <div
            className={`glass-ultra ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
