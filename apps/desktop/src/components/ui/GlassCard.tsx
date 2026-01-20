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
    mode?: 'light' | 'dark'; // Theme mode
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
    mode = 'light',
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
        ${mode === 'dark' ? 'glass-panel-dark' : 'glass-panel'}
        gpu-accelerated
        ${paddingMap[variant]}
        ${radiusMap[cornerRadius]}
        ${interactive ? 'cursor-pointer hover:shadow-lg' : ''}
        ${prismatic ? 'border-accent' : ''}
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
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--text-accent)] border border-[var(--text-accent)]/20 shadow-inner">
                                {icon}
                            </div>
                        )}
                        <div className="flex flex-col">
                            {title && (
                                <h3 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--text-secondary)' }}>
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
        <div className={`glass-panel ${radiusMap[cornerRadius]} ${className}`}>
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
