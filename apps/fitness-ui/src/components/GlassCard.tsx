import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const GlassCard = ({ children, className, onClick }: GlassCardProps) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white/40 backdrop-blur-xl border border-white/40 shadow-lg rounded-3xl p-4 transition-all hover:bg-white/50",
                className
            )}
        >
            {children}
        </div>
    );
};
