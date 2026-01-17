import React from 'react';

interface GlassSurfaceProps {
    children: React.ReactNode;
    className?: string;
    elevation?: 'low' | 'medium' | 'high';
    cornerRadius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const radiusMap = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full'
};

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
    children,
    className = '',
    elevation = 'medium',
    cornerRadius = 'lg'
}) => {
    const elevationStyles = {
        low: 'bg-white/5 backdrop-blur-md border border-white/10',
        medium: 'bg-white/10 backdrop-blur-xl border border-white/15 shadow-lg',
        high: 'bg-white/15 backdrop-blur-2xl border border-white/20 shadow-xl'
    };

    return (
        <div className={`${elevationStyles[elevation]} ${radiusMap[cornerRadius]} ${className}`}>
            {children}
        </div>
    );
};
