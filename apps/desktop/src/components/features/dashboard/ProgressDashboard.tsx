import { Card } from '../../ui/Card'
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
            <div className="dashboard-header mb-12">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-3" style={{ color: 'var(--text-primary)' }}>Your Progress</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30" style={{ color: 'var(--text-primary)' }}>Track your typing journey and advancement</p>
            </div>

            <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Rank Badge */}
                <Card className="rank-card md:col-span-2 bg-[var(--glass-bg)] border border-glass rounded-3xl p-8 shadow-xl" title="Current Standing">
                    <div className="flex items-center justify-between">
                        {currentRank && <RankBadge rank={currentRank} progress={progress} />}
                        {nextRank && (
                            <div className="next-rank-info text-right">
                                <div className="text-sm font-black uppercase tracking-tight italic" style={{ color: 'var(--text-primary)' }}>Next: {nextRank.icon} {nextRank.name}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-30" style={{ color: 'var(--text-primary)' }}>+{wpmToNext} WPM needed</div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Average WPM */}
                <Card title="Average WPM" subtitle="Last 10 sessions" className="bg-[var(--glass-bg)] border border-glass rounded-3xl p-6 shadow-xl">
                    <div className="text-5xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{averageWPM}</div>
                </Card>

                {/* Peak WPM */}
                <Card title="Peak WPM" subtitle="All-time best" className="bg-[var(--glass-bg)] border border-glass rounded-3xl p-6 shadow-xl">
                    <div className="text-5xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{peakWPM}</div>
                </Card>

                {/* Total Sessions */}
                <Card title="Total Sessions" subtitle="Practice makes perfect" className="bg-[var(--glass-bg)] border border-glass rounded-3xl p-6 shadow-xl">
                    <div className="text-5xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{sessionHistory.length}</div>
                </Card>
            </div>

            {/* 30-Day Chart */}
            <Card title="30-Day Progress" subtitle="Average WPM per day" className="bg-[var(--glass-bg)] border border-glass rounded-[2rem] p-8 shadow-2xl">
                {chartData.length > 0 ? (
                    <div className="chart flex gap-6 h-72 mt-8">
                        <div className="chart-y-axis flex flex-col justify-between text-[10px] font-black uppercase tracking-[0.2em] opacity-20 pr-4 border-r border-glass" style={{ color: 'var(--text-primary)' }}>
                            <span>{maxWPM}</span>
                            <span>{Math.round(maxWPM / 2)}</span>
                            <span>0</span>
                        </div>
                        <div className="chart-area flex-1 flex items-end gap-2 px-2">
                            {chartData.map((point, idx) => {
                                const height = (point.wpm / maxWPM) * 100
                                return (
                                    <div key={idx} className="chart-bar-container flex-1 h-full flex items-end">
                                        <div
                                            className="chart-bar w-full rounded-t-xl hover:bg-[var(--text-accent)] transition-all cursor-crosshair shadow-lg group relative"
                                            style={{
                                                height: `${height}%`,
                                                background: 'var(--accent-soft)'
                                            }}
                                            title={`${point.date}: ${point.wpm} WPM`}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--text-accent)] text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {point.wpm}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="chart-empty text-center py-24 text-[10px] font-black uppercase tracking-[0.4em] opacity-20" style={{ color: 'var(--text-primary)' }}>
                        Complete more sessions to see your progress chart
                    </div>
                )}
            </Card>
        </div>
    )
}
