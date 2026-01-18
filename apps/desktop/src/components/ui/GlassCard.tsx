// ═══════════════════════════════════════════════════════════════════
// GLASS CARD: Reusable VisionOS-style glass surface component
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    interactive?: boolean;
    onClick?: () => void;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'compact' | 'large';
    delay?: number; // Animation delay for staggered entrances
    elevation?: 'low' | 'medium' | 'high' | 'matte';
    cornerRadius?: 'sm' | 'md' | 'lg' | 'xl';
    prismatic?: boolean; // Special glow effect
    style?: React.CSSProperties;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLASS CARD COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    interactive = false,
    onClick,
    title,
    subtitle,
    icon,
    variant = 'default',
    delay = 0,
    elevation = 'medium',
    cornerRadius = 'lg',
    prismatic = false,
    style,
}) => {
    // Variant-based padding
    const paddingMap = {
        compact: 'p-4',
        default: 'p-6',
        large: 'p-8',
    };

    // Corner radius map
    const radiusMap = {
        sm: 'rounded-xl',
        md: 'rounded-2xl',
        lg: 'rounded-3xl',
        xl: 'rounded-[32px]',
    };

    // Build class string
    const baseClasses = `
        glass-unified
        ${paddingMap[variant]}
        ${radiusMap[cornerRadius]}
        ${interactive ? 'cursor-pointer glass-interactive' : ''}
        ${prismatic ? 'ring-1 ring-white/20 ring-offset-2 ring-offset-transparent' : ''}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    // Animation styles
    const animationStyle: React.CSSProperties = {
        animationDelay: `${delay}s`,
        ...style,
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <div
            className={baseClasses}
            onClick={interactive || onClick ? handleClick : undefined}
            style={animationStyle}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
        >
            {/* Optional Header */}
            {(title || icon) && (
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white/70">
                                {icon}
                            </div>
                        )}
                        <div className="flex flex-col">
                            {title && (
                                <h3 className="text-lg font-bold text-white tracking-tight">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <span className="text-xs text-white/50 font-medium">
                                    {subtitle}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className={title || icon ? '' : ''}>
                {children}
            </div>
        </div>
    );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLASS SURFACE (Simplified version for internal use)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

export default GlassCard;

/*
 * USAGE EXAMPLES:
 * 
 * Basic card:
 * <GlassCard>
 *   <p>Content goes here</p>
 * </GlassCard>
 * 
 * Interactive card with title:
 * <GlassCard title="Certification Test" interactive onClick={handleStart}>
 *   <p>Take a certification typing test</p>
 * </GlassCard>
 * 
 * Card with icon:
 * <GlassCard icon={<FocusIcon />} title="Focus: F & J" subtitle="Accuracy: 98%">
 *   <ProgressBar value={98} />
 * </GlassCard>
 * 
 * Compact variant:
 * <GlassCard variant="compact" className="w-48">
 *   <StatDisplay value={120} label="WPM" />
 * </GlassCard>
 */
