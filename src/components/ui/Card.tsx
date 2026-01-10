import React from 'react';

interface CardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
    glimmer?: boolean; // Enable glimmer effect
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, className = '', action, glimmer = false }) => {
    return (
        <div className={`bg-midnight-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group will-change-transform ${className}`}>
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-hacker/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Hardware-accelerated Glimmer Effect */}
            {glimmer && (
                <div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    aria-hidden="true"
                >
                    <div
                        className="absolute -inset-full w-[200%] h-[200%] rotate-45"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(0,255,65,0.08), transparent)',
                            animation: 'glimmer 3s ease-in-out infinite',
                            willChange: 'transform'
                        }}
                    />
                </div>
            )}

            {(title || action) && (
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div>
                        {title && <h3 className="text-white/90 font-bold text-lg tracking-tight">{title}</h3>}
                        {subtitle && <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-medium">{subtitle}</p>}
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
                    50%, 100% { transform: translateX(100%) rotate(45deg); }
                }
            `}</style>
        </div>
    );
};
