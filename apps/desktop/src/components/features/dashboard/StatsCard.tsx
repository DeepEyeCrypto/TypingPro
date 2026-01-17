import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { MonoText } from '../../ui/MonoText';

interface StatsCardProps {
    icon: string;
    value: string | number;
    label: string;
    unit?: string;
    trend?: string;
    className?: string;
}

/**
 * Stage 3: Assembled Widget
 * Combines GlassCard and MonoText into a functional Dashboard element.
 */
export const StatsCard: React.FC<StatsCardProps> = ({
    icon,
    value,
    label,
    unit,
    trend = "Stable",
    className = ""
}) => {
    return (
        <GlassCard className={`p-6 lg:p-8 group hover:translate-y-[-4px] transition-all duration-500 ${className}`}>
            <div className="flex justify-between items-start mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-xl lg:text-2xl shadow-inner">
                    {icon}
                </div>

                {/* Stage 3: Glass Pill (Tag) */}
                <div className="px-2 lg:px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-white opacity-40 group-hover:opacity-80 transition-colors">
                        {trend}
                    </span>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex items-baseline gap-1 lg:gap-2">
                    {/* Stage 3: Primary MonoText */}
                    <MonoText
                        as="h2"
                        variant="primary"
                        className="text-2xl lg:text-4xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 drop-shadow-lg"
                    >
                        {value}
                    </MonoText>

                    {unit && (
                        <MonoText as="span" variant="secondary" className="text-[10px] lg:text-sm font-black uppercase tracking-widest opacity-40">
                            {unit}
                        </MonoText>
                    )}
                </div>

                {/* Stage 3: Secondary MonoText */}
                <MonoText as="p" variant="secondary" className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
                    {label}
                </MonoText>
            </div>

            {/* Stage 3: Decorative Glass Pill (Action/Badge) */}
            <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-white/5">
                <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all cursor-pointer">
                    <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-white opacity-60">View Analytics</span>
                </div>
            </div>
        </GlassCard>
    );
};
