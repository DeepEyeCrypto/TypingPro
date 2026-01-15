import { Card } from './ui/Card'
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
        <div className="progress-dashboard space-y-8">
            <div className="dashboard-header">
                <h1 className="mono-text-interactive text-3xl font-bold mb-2 text-white">Your Progress</h1>
                <p className="mono-text-interactive text-white/40">Track your typing journey and advancement</p>
            </div>

            <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Rank Badge */}
                <Card className="rank-card md:col-span-2" title="Current Standing">
                    <div className="flex items-center justify-between">
                        {currentRank && <RankBadge rank={currentRank} progress={progress} />}
                        {nextRank && (
                            <div className="next-rank-info text-right">
                                <div className="mono-text-interactive text-sm">Next: {nextRank.icon} {nextRank.name}</div>
                                <div className="mono-text-interactive text-xs opacity-60">+{wpmToNext} WPM needed</div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Average WPM */}
                <Card title="Average WPM" subtitle="Last 10 sessions">
                    <div className="text-4xl font-mono font-bold mono-text-interactive">{averageWPM}</div>
                </Card>

                {/* Peak WPM */}
                <Card title="Peak WPM" subtitle="All-time best">
                    <div className="text-4xl font-mono font-bold mono-text-interactive">{peakWPM}</div>
                </Card>

                {/* Total Sessions */}
                <Card title="Total Sessions" subtitle="Practice makes perfect">
                    <div className="text-4xl font-mono font-bold mono-text-interactive">{sessionHistory.length}</div>
                </Card>
            </div>

            {/* 30-Day Chart */}
            <Card title="30-Day Progress" subtitle="Average WPM per day">
                {chartData.length > 0 ? (
                    <div className="chart flex gap-4 h-64 mt-4">
                        <div className="chart-y-axis flex flex-col justify-between text-[10px] mono-text-interactive opacity-40 pr-3 border-r border-white/5">
                            <span>{maxWPM}</span>
                            <span>{Math.round(maxWPM / 2)}</span>
                            <span>0</span>
                        </div>
                        <div className="chart-area flex-1 flex items-end gap-1">
                            {chartData.map((point, idx) => {
                                const height = (point.wpm / maxWPM) * 100
                                return (
                                    <div key={idx} className="chart-bar-container flex-1 h-full flex items-end">
                                        <div
                                            className="chart-bar w-full rounded-t-sm hover:bg-white transition-all cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                            style={{
                                                height: `${height}%`,
                                                background: 'rgba(255, 255, 255, 0.2)'
                                            }}
                                            title={`${point.date}: ${point.wpm} WPM`}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="chart-empty text-center py-20 mono-text-interactive opacity-40">
                        Complete more sessions to see your progress chart
                    </div>
                )}
            </Card>
        </div>
    )
}
