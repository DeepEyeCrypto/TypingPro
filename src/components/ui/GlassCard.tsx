import React from 'react';
import { SpotlightCard } from './SpotlightCard';
import { useContrastText } from '../../hooks/useContrastText';
import { GlassSurface } from './glass/GlassSurface';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    bgColor?: string; // Optional background color to determine text contrast
    elevation?: 'low' | 'mid' | 'high' | 'matte';
    interactive?: boolean;
    prismatic?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    bgColor,
    elevation = 'matte',
    interactive = true,
    prismatic = true
}) => {
    const { textColor } = useContrastText(bgColor || 'transparent');

    return (
        <GlassSurface
            elevation={elevation}
            cornerRadius="xl"
            className={`${className} glass-perfect ${prismatic ? 'prismatic-sheen' : ''}`}
            interactive={interactive}
        >
            <SpotlightCard
                className="relative overflow-hidden w-full h-full p-0 flex flex-col"
                style={bgColor ? { '--card-bg': bgColor, color: textColor } as any : { color: textColor } as any}
            >
                {/* Background Tint if provided */}
                {bgColor && (
                    <div
                        className="absolute inset-0 z-0 opacity-10"
                        style={{ backgroundColor: bgColor }}
                    />
                )}

                {/* Content Container */}
                <div className="relative z-10 h-full w-full" style={{ '--contrast-text': textColor } as any}>
                    {children}
                </div>
            </SpotlightCard>
        </GlassSurface>
    );
};
