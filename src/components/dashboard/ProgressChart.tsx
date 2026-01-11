// ═══════════════════════════════════════════════════════════════════
// PROGRESS CHART - Activity tracking chart for typing progress
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

interface ProgressChartProps {
    data?: { day: string; wpm: number }[];
    title?: string;
    currentWpm?: number;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
    data,
    title = 'Typing Progress',
    currentWpm = 0,
}) => {
    // Default data if none provided
    const chartData = data || [
        { day: 'Mon', wpm: 45 },
        { day: 'Tue', wpm: 52 },
        { day: 'Wed', wpm: 48 },
        { day: 'Thu', wpm: 60 },
        { day: 'Fri', wpm: 55 },
        { day: 'Sat', wpm: 68 },
        { day: 'Sun', wpm: 62 },
    ];

    const maxWpm = Math.max(...chartData.map(d => d.wpm), 100);

    // Create SVG path for smooth curve
    const points = chartData.map((d, i) => ({
        x: (i / (chartData.length - 1)) * 100,
        y: 100 - (d.wpm / maxWpm) * 80,
    }));

    const pathD = points.reduce((acc, point, i) => {
        if (i === 0) return `M ${point.x} ${point.y}`;
        const prev = points[i - 1];
        const cpX = (prev.x + point.x) / 2;
        return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
    }, '');

    // Area fill path
    const areaD = `${pathD} L 100 100 L 0 100 Z`;

    return (
        <div className="wg-card wg-chart-container">
            {/* Header */}
            <div className="wg-chart-header">
                <h3 className="wg-chart-title">{title}</h3>
                <select className="wg-chart-dropdown">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>All Time</option>
                </select>
            </div>

            {/* Chart */}
            <div className="relative h-48">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-gray-400">
                    <span>100%</span>
                    <span>80%</span>
                    <span>60%</span>
                    <span>40%</span>
                    <span>20%</span>
                </div>

                {/* Chart area */}
                <div className="absolute left-10 right-0 top-0 bottom-8">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                        {/* Grid lines */}
                        <defs>
                            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(255, 127, 80, 0.3)" />
                                <stop offset="100%" stopColor="rgba(255, 127, 80, 0)" />
                            </linearGradient>
                        </defs>

                        {/* Area fill */}
                        <path d={areaD} fill="url(#chartGradient)" />

                        {/* Line */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="#ff7f50"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />

                        {/* Data points */}
                        {points.map((point, i) => (
                            <g key={i}>
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="3"
                                    fill="white"
                                    stroke="#ff7f50"
                                    strokeWidth="2"
                                />
                                {i === points.length - 1 && (
                                    <g>
                                        <rect
                                            x={point.x - 12}
                                            y={point.y - 20}
                                            width="24"
                                            height="14"
                                            rx="4"
                                            fill="#ff7f50"
                                        />
                                        <text
                                            x={point.x}
                                            y={point.y - 10}
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="6"
                                            fontWeight="bold"
                                        >
                                            {chartData[i].wpm}
                                        </text>
                                    </g>
                                )}
                            </g>
                        ))}
                    </svg>
                </div>

                {/* X-axis labels */}
                <div className="absolute left-10 right-0 bottom-0 flex justify-between text-xs text-gray-400">
                    {chartData.map((d, i) => (
                        <span key={i}>{d.day}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};
