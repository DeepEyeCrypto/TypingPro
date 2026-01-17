import React from 'react';

interface KeystonesDisplayProps {
    amount: number;
    showChange?: number; // +10 or -50 to show temporarily
    size?: 'sm' | 'md' | 'lg';
}

export const KeystonesDisplay: React.FC<KeystonesDisplayProps> = ({
    amount,
    showChange,
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-1.5 text-base',
        lg: 'px-4 py-2 text-lg',
    };

    const iconSizes = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-xl',
    };

    return (
        <div className={`relative flex items-center gap-2 bg-black/5 border border-black/10 rounded-lg ${sizeClasses[size]}`}>
            <span className={`${iconSizes[size]}`}>💎</span>
            <span
                key={amount}
                className="font-bold font-mono text-black animate-pulse-monochrome"
            >
                {amount.toLocaleString()}
            </span>

            {showChange !== undefined && showChange !== 0 && (
                <span
                    className={`absolute -top-5 right-0 text-sm font-bold animate-float-up text-black`}
                >
                    {showChange > 0 ? '+' : ''}{showChange}
                </span>
            )}

            <style>{`
                @keyframes pulse-monochrome {
                    0% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
                .animate-pulse-monochrome {
                    animation: pulse-monochrome 0.3s ease-out;
                }
                @keyframes float-up {
                    0% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-20px); }
                }
                .animate-float-up {
                    animation: float-up 1.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
