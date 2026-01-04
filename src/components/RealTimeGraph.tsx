import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { GlassCard } from './ui/GlassCard'
import { useSettingsStore } from '../stores/settingsStore'

interface RealTimeGraphProps {
    data: { time: number, wpm: number, raw: number }[]
}

export const RealTimeGraph = ({ data }: RealTimeGraphProps) => {
    const { theme } = useSettingsStore()

    // Dynamic colors based on theme
    const getThemeColors = () => {
        switch (theme) {
            case 'cyberpunk': return { stroke: '#fce300', grid: '#333', raw: '#00f0ff' }
            case 'dracula': return { stroke: '#bd93f9', grid: '#44475a', raw: '#ff79c6' }
            case 'matrix': return { stroke: '#00ff41', grid: '#003300', raw: '#008f11' }
            case 'nord': return { stroke: '#88c0d0', grid: '#4c566a', raw: '#81a1c1' }
            default: return { stroke: '#ffffff', grid: 'rgba(255,255,255,0.1)', raw: 'rgba(255,255,255,0.3)' }
        }
    }

    const colors = getThemeColors()

    if (!data || data.length === 0) {
        return (
            <GlassCard className="h-64 flex items-center justify-center text-gray-500">
                Waiting for data...
            </GlassCard>
        )
    }

    return (
        <GlassCard className="p-6 h-80 w-full animate-fade-in relative overflow-hidden">
            <div className="absolute top-4 left-6 z-10 flex gap-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest opacity-70" style={{ color: colors.stroke }}>Net WPM</span>
                <span className="text-xs font-mono font-bold uppercase tracking-widest opacity-50" style={{ color: colors.raw }}>Raw</span>
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
                        tick={{ fill: colors.stroke, fontSize: 10, opacity: 0.5 }}
                        domain={[0, 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: `1px solid ${colors.stroke}`,
                            borderRadius: '4px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                        }}
                        itemStyle={{ color: colors.stroke, fontFamily: 'monospace' }}
                        labelStyle={{ display: 'none' }}
                        cursor={{ stroke: colors.stroke, strokeWidth: 1, strokeDasharray: '4 4' }}
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
                        shadow={`0 0 10px ${colors.stroke}`}
                    />
                </LineChart>
            </ResponsiveContainer>
        </GlassCard>
    )
}
