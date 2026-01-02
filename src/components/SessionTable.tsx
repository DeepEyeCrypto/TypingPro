import React from 'react'
import { useStatsStore } from '@src/stores/statsStore'

export const SessionTable = () => {
    const { sessionHistory } = useStatsStore()

    return (
        <div className="analytics-card" style={{ gridColumn: 'span 2' }}>
            <span className="card-title">Recent Activity</span>
            <table className="session-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Lesson</th>
                        <th>WPM</th>
                        <th>Accuracy</th>
                    </tr>
                </thead>
                <tbody>
                    {sessionHistory.slice(0, 10).map(s => (
                        <tr key={s.id}>
                            <td>{new Date(s.timestamp).toLocaleDateString()}</td>
                            <td>{s.lessonId}</td>
                            <td className={s.wpm > 40 ? 'stat-high' : ''}>{Math.round(s.wpm)}</td>
                            <td className={s.accuracy === 100 ? 'stat-high' : (s.accuracy < 90 ? 'stat-low' : '')}>
                                {Math.round(s.accuracy)}%
                            </td>
                        </tr>
                    ))}
                    {sessionHistory.length === 0 && (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', color: '#333', padding: '2rem' }}>
                                No recorded sessions
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
