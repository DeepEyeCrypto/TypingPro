import React from 'react';
import { SpotlightCard } from './SpotlightCard';

interface MasterGlassCardProps {
    children: React.ReactNode;
    className?: string;
    highlight?: boolean; // Slot for "Saved" icon/badge if needed
}

export const MasterGlassCard: React.FC<MasterGlassCardProps> = ({
    children,
    className = '',
    highlight = false
}) => {
    return (
        <SpotlightCard
            className={`
        glass-panel
        rounded-[32px]
        ${className}
      `}
        >
            {/* Optional Highlight/Badge Slot Wrapper */}
            {highlight && (
                <div className="absolute top-6 right-6 z-20">
                    {/* Content injected via children usually, or specific prop logic here */}
                </div>
            )}

            {/* Content Container - Ensures content feels "inside" */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>

            {/* Optional: Subtle noise or gradient overlay could go here for extra depth */}
        </SpotlightCard>
    );
};
