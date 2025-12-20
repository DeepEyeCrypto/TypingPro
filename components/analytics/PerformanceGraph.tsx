
import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceGraphProps {
    data: { timestamp: number; wpm: number }[];
    height?: number | string;
    isLive?: boolean;
}

const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ data, height = 200, isLive = false }) => {
    // Normalize data for recharts
    const chartData = useMemo(() => {
        if (data.length === 0) return [];
        const firstTs = data[0].timestamp;
        return data.map((point, index) => ({
            ...point,
            time: Math.round((point.timestamp - firstTs) / 1000), // Seconds from start
            displayWpm: point.wpm
        }));
    }, [data]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full glass-card p-4 rounded-3xl overflow-hidden relative"
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-slate-400 dark:text-white/40 uppercase tracking-widest">WPM Performance</h3>
                    {isLive && (
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-xs font-bold text-rose-500 uppercase tracking-tighter">Live Stream</span>
                        </div>
                    )}
                </div>
                {data.length > 0 && (
                    <div className="text-right">
                        <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
                            {data[data.length - 1].wpm}
                        </span>
                        <span className="text-xs font-bold ml-1 text-slate-400 dark:text-white/60">WPM</span>
                    </div>
                )}
            </div>

            <div style={{ height }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="rgba(255,255,255,0.05)"
                        />
                        <XAxis
                            dataKey="time"
                            hide={!isLive}
                            stroke="rgba(255,255,255,0.2)"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
                        />
                        <YAxis
                            domain={[0, 'auto']}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(12px)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: '#64748b' }}
                            labelFormatter={(label) => `${label}s`}
                        />
                        <Area
                            type="monotone"
                            dataKey="displayWpm"
                            stroke="#38bdf8"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorWpm)"
                            isAnimationActive={!isLive}
                            animationDuration={500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default PerformanceGraph;
