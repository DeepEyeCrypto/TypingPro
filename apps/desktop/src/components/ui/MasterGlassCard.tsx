import React from 'react';
import { GlassCard } from './GlassCard';

interface MasterGlassCardProps {
    children: React.ReactNode;
    className?: string;
    highlight?: boolean;
}

export const MasterGlassCard: React.FC<MasterGlassCardProps> = ({
    children,
    className = '',
    highlight = false
}) => {
    return (
        <GlassCard
            elevation="mid"
            cornerRadius="lg"
            className={`${className}`}
            prismatic={true}
        >
            {/* Optional Highlight/Badge Slot Wrapper */}
            {highlight && (
                <div className="absolute top-6 right-6 z-20">
                    {/* Highlight content */}
                </div>
            )}

            {children}
        </GlassCard>
    );
};
