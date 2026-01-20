import React from 'react';

interface CardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
    glimmer?: boolean; // Enable glimmer effect
    blurLevel?: string;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, className = '', action, glimmer = false }) => {
    return (
        <div className={`bg-[var(--glass-bg)] border border-glass p-6 relative overflow-hidden group ${className}`}>
            {/* Minimal top highlight for depth */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--text-primary)]/5 to-transparent pointer-events-none" />

            {/* Hardware-accelerated Glimmer Effect */}
            {glimmer && (
                <div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    aria-hidden="true"
                >
                    <div
                        className="absolute -inset-full w-[200%] h-[200%] rotate-45"
                        style={{
                            background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)',
                            animation: 'glimmer 6s ease-in-out infinite',
                            willChange: 'transform'
                        }}
                    />
                </div>
            )}

            {(title || action) && (
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        {title && <h3 className="font-black text-2xl tracking-tighter uppercase italic leading-none" style={{ color: 'var(--text-primary)' }}>{title}</h3>}
                        {subtitle && <p className="text-[10px] mt-2 uppercase tracking-[0.3em] font-black opacity-30" style={{ color: 'var(--text-primary)' }}>{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}

            <div className="relative z-10">
                {children}
            </div>

            {/* Inject keyframes via style tag */}
            <style>{`
    @keyframes glimmer {
        0% { transform: translateX(-100%) rotate(45deg); }
        100% { transform: translateX(100%) rotate(45deg); }
    }
    `}</style>
        </div>
    );
};
