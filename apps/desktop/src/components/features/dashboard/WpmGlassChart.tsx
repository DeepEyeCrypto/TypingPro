import React from 'react';
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
} from 'recharts';
import { Payload, ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-unified rounded-lg p-3 shadow-xl bg-black/60">
                <p className="text-white/60 text-xs mb-1">{label}</p>
                <p className="text-white font-bold text-sm">
                    {payload[0].value} <span className="text-white/60 font-normal">WPM</span>
                </p>
            </div>
        );
    }
    return null;
};

interface WpmGlassChartProps {
    data: any[];
}

export const WpmGlassChart: React.FC<WpmGlassChartProps> = ({ data }) => {
    return (
        <div className="w-full h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: 'white', strokeWidth: 1, strokeDasharray: '4 4', strokeOpacity: 0.2 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="wpm"
                        stroke="white" // Using white directly for strict monochrome ensuring visibility on dark glass
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: 'white', stroke: 'rgba(0,0,0,0.5)', strokeWidth: 2 }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WpmGlassChart;
