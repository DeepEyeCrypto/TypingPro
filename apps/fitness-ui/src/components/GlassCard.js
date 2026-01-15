import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// Utility for merging classes
function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export const GlassCard = ({ children, className, onClick }) => {
    return (_jsx("div", { onClick: onClick, className: cn("bg-white/40 backdrop-blur-xl border border-white/40 shadow-lg rounded-3xl p-4 transition-all hover:bg-white/50", className), children: children }));
};
//# sourceMappingURL=GlassCard.js.map