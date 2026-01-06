import { useRankProgression } from '@src/hooks/useRankProgression'
import { RankBadge } from './RankBadge'
import { getNextRank, getWPMToNextRank } from '@src/services/rankSystem'
import './ProgressDashboard.css'

export const ProgressDashboard = () => {
    const { averageWPM, peakWPM, currentRank, progress, sessionHistory } = useRankProgression()

    // Get last 30 days of data
    const getLast30Days = () => {
        const days: { date: string, wpm: number }[] = []
        const now = Date.now()
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)

        // Group sessions by day
        const sessionsByDay = new Map<string, number[]>()

        sessionHistory.forEach(session => {
            if (session.timestamp >= thirtyDaysAgo) {
                const date = new Date(session.timestamp).toLocaleDateString()
                if (!sessionsByDay.has(date)) {
                    sessionsByDay.set(date, [])
                }
                sessionsByDay.get(date)!.push(session.wpm)
            }
        })

        // Calculate average WPM per day
        sessionsByDay.forEach((wpms, date) => {
            const avg = wpms.reduce((sum, wpm) => sum + wpm, 0) / wpms.length
            days.push({ date, wpm: Math.round(avg) })
        })

        return days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    const chartData = getLast30Days()
    const maxWPM = Math.max(...chartData.map(d => d.wpm), 100)
    const nextRank = currentRank ? getNextRank(currentRank) : null
    const wpmToNext = getWPMToNextRank(averageWPM)

    return (
        <div className="progress-dashboard">
            <div className="dashboard-header">
                <h1>Your Progress</h1>
                <p>Track your typing journey and advancement</p>
            </div>

            <div className="stats-grid">
                {/* Rank Badge */}
                <div className="stat-card rank-card">
                    {currentRank && <RankBadge rank={currentRank} progress={progress} />}
                    {nextRank && (
                        <div className="next-rank-info">
                            <div>Next: {nextRank.icon} {nextRank.name}</div>
                            <div className="wpm-needed">+{wpmToNext} WPM needed</div>
                        </div>
                    )}
                </div>

                {/* Average WPM */}
                <div className="stat-card">
                    <div className="stat-label">Average WPM</div>
                    <div className="stat-value">{averageWPM}</div>
                    <div className="stat-note">Last 10 sessions</div>
                </div>

                {/* Peak WPM */}
                <div className="stat-card">
                    <div className="stat-label">Peak WPM</div>
                    <div className="stat-value" style={{ color: '#00f0ff' }}>{peakWPM}</div>
                    <div className="stat-note">All-time best</div>
                </div>

                {/* Total Sessions */}
                <div className="stat-card">
                    <div className="stat-label">Total Sessions</div>
                    <div className="stat-value">{sessionHistory.length}</div>
                    <div className="stat-note">Practice makes perfect</div>
                </div>
            </div>

            {/* 30-Day Chart */}
            <div className="chart-container">
                <h2>30-Day Progress</h2>
                {chartData.length > 0 ? (
                    <div className="chart">
                        <div className="chart-y-axis">
                            <span>{maxWPM}</span>
                            <span>{Math.round(maxWPM / 2)}</span>
                            <span>0</span>
                        </div>
                        <div className="chart-area">
                            {chartData.map((point, idx) => {
                                const height = (point.wpm / maxWPM) * 100
                                return (
                                    <div key={idx} className="chart-bar-container">
                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: `${height}%`,
                                                background: currentRank?.accentColor || '#00f0ff'
                                            }}
                                            title={`${point.date}: ${point.wpm} WPM`}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="chart-empty">
                        Complete more sessions to see your progress chart
                    </div>
                )}
            </div>
        </div>
    )
}
