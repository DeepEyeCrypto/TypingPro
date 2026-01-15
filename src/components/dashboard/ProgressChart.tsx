// ═══════════════════════════════════════════════════════════════════
// PROGRESS CHART - High Fidelity Deep Glass Overhaul
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

interface ProgressChartProps {
    data?: { day: string; wpm: number }[];
    title?: string;
    currentWpm?: number;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
    data,
    title = 'Session_Velocity_Telemetry',
    currentWpm = 0,
}) => {
    // Default data if none provided
    const chartData = data || [
        { day: 'MON', wpm: 45 },
        { day: 'TUE', wpm: 52 },
        { day: 'WED', wpm: 48 },
        { day: 'THU', wpm: 60 },
        { day: 'FRI', wpm: 55 },
        { day: 'SAT', wpm: 68 },
        { day: 'SUN', wpm: 62 },
    ];

    const maxWpm = Math.max(...chartData.map(d => d.wpm), 100);

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

    const areaD = `${pathD} L 100 100 L 0 100 Z`;

    return (
        <div className="bg-white/5 backdrop-blur-[64px] border border-white/10 rounded-[3rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white opacity-30">{title}</h3>
                <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
                    <button className="px-4 py-1.5 rounded-full text-[8px] font-black bg-white/10 text-white uppercase tracking-widest shadow-xl">Weekly</button>
                    <button className="px-4 py-1.5 rounded-full text-[8px] font-black text-white opacity-40 uppercase tracking-widest hover:opacity-100 transition-colors">Monthly</button>
                </div>
            </div>

            {/* Chart */}
            <div className="relative h-64">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-[8px] font-black text-white opacity-20 tracking-tighter">
                    <span>MAX</span>
                    <span>80%</span>
                    <span>60%</span>
                    <span>40%</span>
                    <span>20%</span>
                </div>

                {/* Chart area */}
                <div className="absolute left-12 right-0 top-0 bottom-10">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="chartGradientWhite" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
                                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                            </linearGradient>
                        </defs>

                        {/* Area fill */}
                        <path d={areaD} fill="url(#chartGradientWhite)" className="transition-all duration-1000" />

                        {/* Line */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                        />

                        {/* Data points */}
                        {points.map((point, i) => (
                            <g key={i}>
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="2.5"
                                    className="fill-white/10 stroke-white/20 stroke-1 transition-all hover:r-4 hover:fill-white/30"
                                />
                                {i === points.length - 1 && (
                                    <g className="filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                                        <rect
                                            x={point.x - 10}
                                            y={point.y - 18}
                                            width="20"
                                            height="12"
                                            rx="6"
                                            fill="white"
                                        />
                                        <text
                                            x={point.x}
                                            y={point.y - 10}
                                            textAnchor="middle"
                                            fill="#000000"
                                            fontSize="6"
                                            fontWeight="900"
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
                <div className="absolute left-12 right-0 bottom-0 flex justify-between text-[8px] font-black text-white opacity-20 tracking-[0.2em]">
                    {chartData.map((d, i) => (
                        <span key={i}>{d.day}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};
