import React from 'react';

interface GlassSurfaceProps {
    children: React.ReactNode;
    className?: string;
    elevation?: 'low' | 'mid' | 'high';
    cornerRadius?: 'sm' | 'md' | 'lg' | 'pill';
}

const cornerRadiusMap = {
    sm: 'rounded-sm',
    md: 'rounded-xl',
    lg: 'rounded-[24px]',
    pill: 'rounded-full',
};

const elevationMap = {
    low: 'bg-white/5 border-white/10',
    mid: 'bg-white/12 border-white/20',
    high: 'bg-white/18 border-white/30 shadow-glass',
};

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
    children,
    className = '',
    elevation = 'mid',
    cornerRadius = 'lg'
}) => {
    return (
        <div className={`
            backdrop-blur-[20px] 
            border 
            ${cornerRadiusMap[cornerRadius]} 
            ${elevationMap[elevation]} 
            ${className}
        `}>
            {children}
        </div>
    );
};
