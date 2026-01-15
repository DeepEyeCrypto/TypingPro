import React from 'react'
import { useStatsStore } from '@src/stores/statsStore'
import { GlassCard } from '@src/components/ui/GlassCard'

export const SessionTable = () => {
    const { sessionHistory } = useStatsStore()

    return (
        <GlassCard className="p-10 col-span-2 overflow-hidden !bg-black/25 backdrop-blur-[64px]">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-8 font-black block">Mission_History</span>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-spacing-0 border-collapse">
                    <thead>
                        <tr className="text-white/20 border-b border-white/5 uppercase tracking-widest text-[10px] font-black">
                            <th className="pb-6 pl-2">Timeline</th>
                            <th className="pb-6">Sector</th>
                            <th className="pb-6">Velocity</th>
                            <th className="pb-6">Precision</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/2">
                        {sessionHistory.slice(0, 10).map(s => (
                            <tr key={s.id} className="hover:bg-white/2 transition-all group">
                                <td className="py-5 pl-2 text-white/40 font-black text-[10px] tracking-wider uppercase group-hover:text-white transition-colors">
                                    {new Date(s.timestamp).toLocaleDateString()}
                                </td>
                                <td className="py-5 text-white/60 font-bold group-hover:text-white transition-colors uppercase italic">{s.lessonId}</td>
                                <td className="py-5">
                                    <div className="flex items-baseline gap-2 group-hover:scale-110 transition-transform origin-left">
                                        <span className="text-lg font-black text-white">{Math.round(s.wpm)}</span>
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">WPM</span>
                                    </div>
                                </td>
                                <td className="py-5">
                                    <div className="flex items-baseline gap-2 group-hover:scale-110 transition-transform origin-left">
                                        <span className="text-lg font-black text-white">{Math.round(s.accuracy)}</span>
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {sessionHistory.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-16 text-center text-white/20 text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">
                                    No_Recorded_Telemetry
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    )
}
