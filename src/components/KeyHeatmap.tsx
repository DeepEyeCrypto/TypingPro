import React from 'react'
import { useStatsStore } from '@src/stores/statsStore'

export const KeyHeatmap = () => {
    const { characterErrors } = useStatsStore()

    const keys = 'qwertyuiopasdfghjklzxcvbnm'.split('')
    const maxErrors = Math.max(...Object.values(characterErrors), 1)

    return (
        <div className="analytics-card">
            <span className="card-title">Error Heatmap (Weak Spots)</span>
            <div className="heatmap-container">
                {keys.map(key => {
                    const count = characterErrors[key] || 0
                    const intensity = (count / maxErrors)

                    return (
                        <div
                            key={key}
                            className="heat-key"
                            style={{
                                backgroundColor: intensity > 0
                                    ? `rgba(255, 68, 68, ${0.1 + intensity * 0.7})`
                                    : 'rgba(255, 255, 255, 0.02)',
                                color: intensity > 0.5 ? '#fff' : '#666'
                            }}
                            title={`${count} errors`}
                        >
                            {key}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
