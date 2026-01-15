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
            <span className="text-[10px] uppercase tracking-[0.3em] text-black opacity-30 mb-6 font-black block">Error Heatmap</span>
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
                                        ${isHot ? 'text-black font-black shadow-lg' : 'text-black opacity-30 bg-black/5'}
                                    `}
                                    style={{
                                        // Monochrome Scale: From subtle gray to solid black
                                        backgroundColor: isHot
                                            ? `rgba(0, 0, 0, ${0.1 + intensity * 0.7})`
                                            : undefined,
                                        border: isHot
                                            ? `1px solid rgba(0, 0, 0, ${0.2 + intensity * 0.4})`
                                            : '1px solid transparent',
                                        boxShadow: isHot ? `0 0 ${intensity * 15}px rgba(0, 0, 0, ${intensity * 0.2})` : 'none',
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
