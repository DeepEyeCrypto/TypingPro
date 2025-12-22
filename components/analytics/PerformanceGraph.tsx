import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

interface PerformanceGraphProps {
    data: { timestamp: number; wpm: number }[];
}

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ data }) => {
    if (!data || data.length === 0) return null;

    // Format data for chart (normalize timestamps to seconds from start)
    const startTime = data[0].timestamp;
    const chartData = data.map(point => ({
        time: Math.round((point.timestamp - startTime) / 1000),
        wpm: point.wpm
    }));

    return (
        <div className="w-full h-48 mt-8 bg-black/10 rounded-3xl border border-white/5 p-4 overflow-hidden">
            <div className="text-[10px] font-black text-[var(--sub)] uppercase tracking-widest mb-4 flex justify-between items-center opacity-40">
                <span>Performance Timeline</span>
                <span>Speed (WPM) / Time (s)</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'var(--sub)', opacity: 0.5 }}
                        unit="s"
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'var(--sub)', opacity: 0.5 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(20, 20, 20, 0.9)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '10px',
                            color: 'var(--main)'
                        }}
                        itemStyle={{ color: 'var(--accent)' }}
                        cursor={{ stroke: 'var(--accent)', strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="wpm"
                        stroke="var(--accent)"
                        fillOpacity={1}
                        fill="url(#colorWpm)"
                        strokeWidth={3}
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
