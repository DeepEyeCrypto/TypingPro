// ═══════════════════════════════════════════════════════════════════
// STATS CARD - Warm Glass Design (WPM, Accuracy, Keystones, Streak)
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

interface StatsCardProps {
    icon: string;
    value: string | number;
    label: string;
    unit?: string;
    color?: 'orange' | 'teal' | 'green' | 'purple';
    visual?: 'bar' | 'ring' | 'wave' | 'none';
    progress?: number; // 0-100 for ring visual
}

const colorMap = {
    orange: { bg: '#fff7ed', icon: '#ff7f50', gradient: 'from-orange-400 to-orange-500' },
    teal: { bg: '#f0fdfa', icon: '#4ecdc4', gradient: 'from-teal-400 to-teal-500' },
    green: { bg: '#f0fdf4', icon: '#2ecc71', gradient: 'from-green-400 to-green-500' },
    purple: { bg: '#faf5ff', icon: '#9b59b6', gradient: 'from-purple-400 to-purple-500' },
};

export const StatsCard: React.FC<StatsCardProps> = ({
    icon,
    value,
    label,
    unit,
    color = 'orange',
    visual = 'none',
    progress = 0,
}) => {
    const colors = colorMap[color];

    return (
        <div className="wg-card wg-stats-card">
            {/* Icon Badge */}
            <div
                className="wg-stats-icon"
                style={{ backgroundColor: colors.bg }}
            >
                <span style={{ color: colors.icon }}>{icon}</span>
            </div>

            {/* Visual Element */}
            {visual === 'bar' && (
                <div className="h-8 flex items-end gap-0.5">
                    {[40, 60, 80, 50, 70, 90, 75, 85, 65, 80].map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 rounded-sm transition-all duration-300"
                            style={{
                                height: `${h}%`,
                                backgroundColor: i === 9 ? colors.icon : `${colors.icon}40`,
                            }}
                        />
                    ))}
                </div>
            )}

            {visual === 'wave' && (
                <div className="h-8 flex items-center justify-center">
                    <svg viewBox="0 0 100 30" className="w-full h-full">
                        <path
                            d="M0,15 Q10,5 20,15 T40,15 T60,15 T80,15 T100,15"
                            fill="none"
                            stroke={colors.icon}
                            strokeWidth="2"
                            className="animate-pulse"
                        />
                    </svg>
                </div>
            )}

            {visual === 'ring' && (
                <div className="wg-progress-ring mx-auto">
                    <svg viewBox="0 0 80 80" className="w-full h-full">
                        <circle
                            className="track"
                            cx="40"
                            cy="40"
                            r="34"
                            strokeWidth="8"
                        />
                        <circle
                            className="progress"
                            cx="40"
                            cy="40"
                            r="34"
                            strokeWidth="8"
                            style={{
                                stroke: colors.icon,
                                strokeDasharray: `${2 * Math.PI * 34}`,
                                strokeDashoffset: `${2 * Math.PI * 34 * (1 - progress / 100)}`,
                            }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold" style={{ color: colors.icon }}>
                            {value}
                        </span>
                    </div>
                </div>
            )}

            {/* Value & Label */}
            <div className="mt-auto">
                <div className="wg-stats-value">
                    {value}
                    {unit && <span className="text-base font-normal text-gray-400 ml-1">{unit}</span>}
                </div>
                <div className="wg-stats-label">{label}</div>
            </div>
        </div>
    );
};
