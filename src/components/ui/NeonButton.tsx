import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'cyan' | 'red';
    glow?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
    children,
    variant = 'cyan',
    glow = true,
    className = '',
    ...props
}) => {
    const shadowColor = variant === 'cyan' ? 'rgba(0, 243, 255, 0.5)' : 'rgba(255, 0, 60, 0.5)';
    const baseColor = variant === 'cyan' ? '#00f3ff' : '#ff003c';

    return (
        <button
            className={`
        relative overflow-hidden
        px-6 py-2 rounded text-sm font-medium tracking-wider uppercase
        transition-all duration-300
        border
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
            style={{
                borderColor: baseColor,
                color: baseColor,
                boxShadow: glow ? `0 0 20px ${shadowColor}` : 'none'
            }}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            <div
                className={`absolute inset-0 opacity-10 transition-opacity duration-300 hover:opacity-20`}
                style={{ backgroundColor: baseColor }}
            />
        </button>
    );
};
