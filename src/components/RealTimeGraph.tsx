import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { GlassCard } from './ui/GlassCard'
import { useSettingsStore } from '../stores/settingsStore'

interface RealTimeGraphProps {
    data: { time: number, wpm: number, raw: number }[]
}

export const RealTimeGraph = ({ data }: RealTimeGraphProps) => {
    const { theme } = useSettingsStore()

    // Locked Monochrome colors for pure glass aesthetic
    const colors = {
        stroke: '#ffffff',
        grid: 'rgba(255,255,255,0.05)',
        raw: 'rgba(255,255,255,0.2)'
    };

    if (!data || data.length === 0) {
        return (
            <GlassCard className="h-64 flex items-center justify-center text-white opacity-30 uppercase tracking-[0.3em] text-[10px] font-black">
                Waiting for telemetry...
            </GlassCard>
        )
    }

    return (
        <GlassCard blurLevel="l3" className="p-6 h-80 w-full animate-fade-in relative overflow-hidden">
            <div className="absolute top-4 left-6 z-10 flex gap-4">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white/40">Net WPM</span>
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white/20">Raw</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                    <XAxis
                        dataKey="time"
                        hide={true}
                        domain={['dataMin', 'dataMax']}
                    />
                    <YAxis
                        width={40}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: colors.stroke, fontSize: 10, fontWeight: 'bold' }}
                        domain={[0, 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: `1px solid rgba(255,255,255,0.1)`,
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(10px)'
                        }}
                        itemStyle={{ color: '#ffffff', fontFamily: 'monospace', fontWeight: '900' }}
                        labelStyle={{ display: 'none' }}
                        cursor={{ stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="raw"
                        stroke={colors.raw}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                        strokeOpacity={0.5}
                    />
                    <Line
                        type="monotone"
                        dataKey="wpm"
                        stroke={colors.stroke}
                        strokeWidth={3}
                        dot={false}
                        isAnimationActive={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </GlassCard>
    )
}
