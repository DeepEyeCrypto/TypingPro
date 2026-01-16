import React from 'react';

/**
 * GlassSurface: The architectural primitive for all glassmorphism in TypingPro.
 * Handles backdrop-filter tiers and base container styles.
 */

interface GlassSurfaceProps {
    children: React.ReactNode;
    className?: string;
    elevation?: 'low' | 'mid' | 'high' | 'matte';
    cornerRadius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'pill';
    interactive?: boolean;
    style?: React.CSSProperties;
}

const cornerRadiusMap = {
    sm: 'rounded-lg',
    md: 'rounded-2xl',
    lg: 'rounded-[32px]',
    xl: 'rounded-[40px]',
    '2xl': 'rounded-[48px]',
    pill: 'rounded-full',
};

// Elevation Tiers: Low (Pills), Mid (Cards), High (Navigation), Matte (Deep Glass)
const elevationMap: Record<string, string> = {
    low: 'glass-elevation-low',
    mid: 'glass-matte', // Standardized to Deep Matte for Phase L
    high: 'glass-elevation-high',
    matte: 'glass-matte',
};

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
    children,
    className = '',
    elevation = 'mid',
    cornerRadius = 'lg',
    interactive = false,
    style
}) => {
    return (
        <div
            className={`
                relative overflow-hidden border
                transition-all duration-300
                gpu-accelerated
                ${cornerRadiusMap[cornerRadius as keyof typeof cornerRadiusMap]} 
                ${elevationMap[elevation]} 
                ${interactive ? 'hover:bg-white/15 hover:border-white/40' : ''}
                ${className}
            `}
            style={style}
        >
            {children}
        </div>
    );
};
