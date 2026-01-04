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
                                        text-sm font-mono uppercase transition-colors
                                        ${isHot ? 'text-white' : 'text-gray-600 bg-white/5'}
                                    `}
                                    style={{
                                        backgroundColor: isHot
                                            ? `rgba(255, 0, 60, ${0.2 + intensity * 0.8})`
                                            : undefined,
                                        border: isHot
                                            ? `1px solid rgba(255, 0, 60, ${0.5 + intensity * 0.5})`
                                            : '1px solid transparent'
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
