import React from 'react'
import { useStatsStore } from '@src/stores/statsStore'
import { GlassCard } from '@src/components/ui/GlassCard'
import { useSettingsStore } from '@src/stores/settingsStore'

export const TrendChart = () => {
    const { sessionHistory } = useStatsStore()
    const { theme } = useSettingsStore()

    // Show last 20 sessions
    const displayHistory = [...sessionHistory].reverse().slice(-20)
    const maxWPM = Math.max(...displayHistory.map(s => s.wpm), 60)
    const baseColor = theme === 'glass' ? '#00f3ff' : '#00ff41'

    return (
        <GlassCard className="p-6 h-[200px] flex flex-col hover:border-neon-cyan/50 transition-colors">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4 font-bold">Performance Trend</span>
            <div className="flex items-end justify-between flex-1 gap-1">
                {displayHistory.map((s, i) => (
                    <div
                        key={s.id}
                        className="w-full relative group transition-all duration-300 hover:opacity-100 opacity-60"
                        style={{
                            height: `${(s.wpm / maxWPM) * 100}%`,
                            backgroundColor: baseColor,
                        }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] bg-black border border-gray-800 p-1 rounded whitespace-nowrap z-50 pointer-events-none transition-opacity">
                            {Math.round(s.wpm)} WPM
                        </div>
                    </div>
                ))}
                {displayHistory.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-700 uppercase tracking-widest">
                        No Data Recorded
                    </div>
                )}
            </div>
        </GlassCard>
    )
}
