import React from 'react'
import { useStatsStore } from '@src/stores/statsStore'

export const TrendChart = () => {
    const { sessionHistory } = useStatsStore()

    // Show last 20 sessions
    const displayHistory = [...sessionHistory].reverse().slice(-20)
    const maxWPM = Math.max(...displayHistory.map(s => s.wpm), 60)

    return (
        <div className="analytics-card">
            <span className="card-title">Performance Trend (Last 20)</span>
            <div className="trend-chart-box">
                {displayHistory.map((s, i) => (
                    <div
                        key={s.id}
                        className="chart-bar"
                        style={{ height: `${(s.wpm / maxWPM) * 100}%` }}
                        data-value={`${Math.round(s.wpm)} WPM`}
                    />
                ))}
                {displayHistory.length === 0 && (
                    <div style={{ color: '#333', fontSize: '0.7rem', width: '100%', textAlign: 'center' }}>
                        No data recorded yet
                    </div>
                )}
            </div>
        </div>
    )
}
