import React from 'react'
import { useStatsStore } from '@src/stores/statsStore'
import { GlassCard } from '@src/components/ui/GlassCard'

export const SessionTable = () => {
    const { sessionHistory } = useStatsStore()

    return (
        <GlassCard className="p-6 col-span-2 overflow-hidden">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4 font-bold block">Recent Activity</span>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-gray-500 border-b border-gray-800">
                            <th className="pb-3 font-medium pl-2">Date</th>
                            <th className="pb-3 font-medium">Lesson</th>
                            <th className="pb-3 font-medium">WPM</th>
                            <th className="pb-3 font-medium">Accuracy</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {sessionHistory.slice(0, 10).map(s => (
                            <tr key={s.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-3 pl-2 text-gray-400 font-mono text-xs">
                                    {new Date(s.timestamp).toLocaleDateString()}
                                </td>
                                <td className="py-3 text-gray-300">{s.lessonId}</td>
                                <td className={`py-3 font-bold ${s.wpm > 40 ? 'text-neon-cyan' : 'text-gray-400'}`}>
                                    {Math.round(s.wpm)}
                                </td>
                                <td className={`py-3 font-bold ${s.accuracy === 100 ? 'text-neon-cyan' : (s.accuracy < 90 ? 'text-neon-red' : 'text-white')}`}>
                                    {Math.round(s.accuracy)}%
                                </td>
                            </tr>
                        ))}
                        {sessionHistory.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-600 text-xs uppercase tracking-widest">
                                    No recorded sessions
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    )
}
