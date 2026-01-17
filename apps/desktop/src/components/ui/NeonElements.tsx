import React from 'react';

// NEON BUTTON
interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost';
    isLoading?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ variant = 'primary', isLoading, className = '', children, ...props }) => {
    const base = "rounded-full font-bold transition-all duration-300 active:scale-95 disabled:opacity-50";

    const variants = {
        primary: "bg-neon text-black shadow-neon-sm hover:shadow-neon-lg hover:scale-105 border border-neon/50",
        ghost: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20"
    };

    return (
        <button className={`${base} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
            {isLoading ? "..." : children}
        </button>
    );
};

// NEON INPUT
export const NeonInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
    return (
        <input
            className={`
                bg-black/20 border border-white/5 rounded-full text-white placeholder:text-slate-600
                focus:border-neon/50 focus:shadow-neon-sm outline-none transition-all duration-300
                px-6 py-3 w-full
                ${className}
            `}
            {...props}
        />
    );
};
