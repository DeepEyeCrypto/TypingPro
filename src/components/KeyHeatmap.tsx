import { useStatsStore } from '@src/stores/statsStore'
import { GlassCard } from '@src/components/ui/GlassCard'

export const KeyHeatmap = () => {
    const { characterErrors } = useStatsStore()

    const rows = [
        'qwertyuiop'.split(''),
        'asdfghjkl'.split(''),
        'zxcvbnm'.split('')
    ]
    const maxErrors = Math.max(...Object.values(characterErrors), 1)

    return (
        <GlassCard className="p-6">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 font-bold block">Error Heatmap</span>
            <div className="flex flex-col gap-2 items-center">
                {rows.map((row, i) => (
                    <div key={i} className="flex gap-1.5">
                        {row.map(key => {
                            const count = characterErrors[key] || 0
                            const intensity = (count / maxErrors)
                            const isHot = intensity > 0

                            return (
                                <div
                                    key={key}
                                    className={`
                                        w-8 h-8 md:w-10 md:h-10 rounded flex items-center justify-center
                                        text-sm font-mono uppercase transition-all duration-300
                                        ${isHot ? 'text-white font-bold shadow-lg' : 'text-gray-600 bg-white/5'}
                                    `}
                                    style={{
                                        // Red Scale: From subtle pink/red to deep crimson
                                        backgroundColor: isHot
                                            ? `rgba(255, ${Math.max(0, 100 - intensity * 100)}, ${Math.max(0, 100 - intensity * 100)}, ${0.3 + intensity * 0.7})`
                                            : undefined,
                                        border: isHot
                                            ? `1px solid rgba(255, 0, 0, ${0.5 + intensity * 0.5})`
                                            : '1px solid transparent',
                                        boxShadow: isHot ? `0 0 ${intensity * 15}px rgba(255, 0, 0, ${intensity * 0.6})` : 'none',
                                        transform: isHot ? `scale(${1 + intensity * 0.1})` : 'scale(1)'
                                    }}
                                    title={`${count} errors`}
                                >
                                    {key}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </GlassCard>
    )
}
