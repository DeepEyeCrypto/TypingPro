// ═══════════════════════════════════════════════════════════════════
// GLASS SURFACE: Simplified glass wrapper component
// Re-exports from GlassCard for backward compatibility
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

interface GlassSurfaceProps {
    children: React.ReactNode;
    className?: string;
    elevation?: 'low' | 'medium' | 'high';
    cornerRadius?: 'sm' | 'md' | 'lg';
}

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
    children,
    className = '',
    elevation = 'medium',
    cornerRadius = 'md',
}) => {
    const radiusMap = {
        sm: 'rounded-lg',
        md: 'rounded-xl',
        lg: 'rounded-2xl',
    };

    return (
        <div className={`glass-unified ${radiusMap[cornerRadius]} ${className}`}>
            {children}
        </div>
    );
};

export default GlassSurface;
