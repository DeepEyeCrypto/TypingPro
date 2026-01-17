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
        <div className={`glass-ultra p-6 relative overflow-hidden group ${className}`}>
            {/* Minimal top highlight for depth */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Hardware-accelerated Glimmer Effect */}
            {glimmer && (
                <div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    aria-hidden="true"
                >
                    <div
                        className="absolute -inset-full w-[200%] h-[200%] rotate-45"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)',
                            animation: 'glimmer 3s ease-in-out infinite',
                            willChange: 'transform'
                        }}
                    />
                </div>
            )}

            {(title || action) && (
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        {title && <h3 className="text-white font-black text-2xl tracking-tight">{title}</h3>}
                        {subtitle && <p className="text-white opacity-30 text-xs mt-2 uppercase tracking-[0.2em] font-black">{subtitle}</p>}
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
