import { useState, useEffect } from 'react'
import { getRankForWPM, calculateProgress, Rank } from '@src/services/rankSystem'
import { useStatsStore } from '@src/stores/statsStore'

export const useRankProgression = () => {
    const sessionHistory = useStatsStore(s => s.sessionHistory)
    const [averageWPM, setAverageWPM] = useState(0)
    const [peakWPM, setPeakWPM] = useState(0)
    const [currentRank, setCurrentRank] = useState<Rank | null>(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (sessionHistory.length === 0) return

        // Calculate average WPM from last 10 sessions
        const recentSessions = sessionHistory.slice(0, 10)
        const avg = recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length

        // Find peak WPM
        const peak = Math.max(...sessionHistory.map(s => s.wpm))

        setAverageWPM(Math.round(avg))
        setPeakWPM(Math.round(peak))

        // Use average for rank calculation
        const rank = getRankForWPM(avg)
        const prog = calculateProgress(avg)

        setCurrentRank(rank)
        setProgress(prog)
    }, [sessionHistory])

    return {
        averageWPM,
        peakWPM,
        currentRank,
        progress,
        sessionHistory
    }
}
