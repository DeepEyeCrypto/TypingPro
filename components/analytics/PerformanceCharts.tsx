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
    Area,
} from 'recharts';
import { HistoryEntry } from '../../types';

interface PerformanceChartsProps {
    history: HistoryEntry[];
    type: 'wpm' | 'accuracy' | 'netWpm';
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ history, type }) => {
    const data = history.map((entry) => ({
        date: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        wpm: entry.wpm,
        accuracy: entry.accuracy,
        netWpm: entry.netWpm || 0,
        fullDate: new Date(entry.date).toLocaleString(),
    })).reverse();

    const getColor = () => {
        switch (type) {
            case 'wpm': return '#0ea5e9'; // sky-500
            case 'netWpm': return '#8b5cf6'; // violet-500
            case 'accuracy': return '#10b981'; // emerald-500
            default: return '#0ea5e9';
        }
    };

    const label = type === 'wpm' ? 'Gross WPM' : type === 'netWpm' ? 'Net WPM' : 'Accuracy %';

    return (
        <div className="w-full h-[300px] glass-card p-6 rounded-[32px] border border-white/10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">{label} Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={getColor()} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={getColor()} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 800 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 800 }}
                        domain={[0, 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                        }}
                        itemStyle={{ color: getColor(), fontWeight: 900, fontSize: '12px' }}
                        labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontSize: '10px', fontWeight: 800 }}
                    />
                    <Area
                        type="monotone"
                        dataKey={type}
                        stroke={getColor()}
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorMetric)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
