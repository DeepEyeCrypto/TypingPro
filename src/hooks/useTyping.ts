import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { startSession, handleKeystroke, TypingMetrics } from '@src/lib/tauri'
import { CURRICULUM, Lesson } from '@src/data/lessons'
import { useStatsStore } from '@src/stores/statsStore'

import { syncService } from '@src/services/syncService'
import { useTypingSounds } from '@src/hooks/useTypingSounds'

export const useTyping = () => {
    const { playTypingSound, playErrorSound } = useTypingSounds()
    const [view, setView] = useState<'selection' | 'typing' | 'analytics'>('selection')
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
    const [metrics, setMetrics] = useState<TypingMetrics>({
        raw_wpm: 0,
        adjusted_wpm: 0,
        accuracy: 100,
        consistency: 100,
        is_bot: false,
        cheat_flags: ''
    })
    const [input, setInput] = useState('')
    const [startTime, setStartTime] = useState<number>(0)
    const [totalKeystrokes, setTotalKeystrokes] = useState(0)
    const [finalStats, setFinalStats] = useState({
        netWpm: 0,
        errorCount: 0,
        timeTaken: 0,
        rawWpm: 0,
        consistency: 0,
        totalKeystrokes: 0
    })
    const [errors, setErrors] = useState<Record<string, number>>({})
    const [unlockedIds, setUnlockedIds] = useState<string[]>(['l1'])
    const [completedIds, setCompletedIds] = useState<string[]>([])
    const [showResult, setShowResult] = useState(false)

    const recordAttempt = useStatsStore((s: any) => s.recordAttempt)

    // Initialization & Persistence
    useEffect(() => {
        const savedUnlocked = localStorage.getItem('unlockedIds')
        const savedCompleted = localStorage.getItem('completedIds')
        if (savedUnlocked) setUnlockedIds(JSON.parse(savedUnlocked))
        if (savedCompleted) setCompletedIds(JSON.parse(savedCompleted))
    }, [])

    useEffect(() => {
        localStorage.setItem('unlockedIds', JSON.stringify(unlockedIds))
        localStorage.setItem('completedIds', JSON.stringify(completedIds))
    }, [unlockedIds, completedIds])

    const activeChar = useMemo(() => {
        if (!currentLesson) return ''
        return currentLesson.text[input.length] || ''
    }, [input, currentLesson])

    // State for Idle Timer & Graph
    const [isPaused, setIsPaused] = useState(false)
    const [totalPausedTime, setTotalPausedTime] = useState(0)
    const [lastPauseStart, setLastPauseStart] = useState<number | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const graphDataRef = useRef<{ time: number, wpm: number, raw: number }[]>([])
    const metricsRef = useRef(metrics)

    // Sync metricsRef for interval access
    useEffect(() => { metricsRef.current = metrics }, [metrics])

    // Clear timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    const startIdleTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            setIsPaused(true)
            setLastPauseStart(Date.now())
        }, 2000)
    }, [])

    const resumeTimer = useCallback(() => {
        if (isPaused && lastPauseStart) {
            const pausedDuration = Date.now() - lastPauseStart
            setTotalPausedTime(prev => prev + pausedDuration)
            setIsPaused(false)
            setLastPauseStart(null)
        }
        startIdleTimer()
    }, [isPaused, lastPauseStart, startIdleTimer])

    // Real-Time Graph Sampling (1s interval)
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (view === 'typing' && !isPaused && startTime > 0) {
            interval = setInterval(() => {
                const elapsed = (Date.now() - startTime - totalPausedTime) / 1000
                if (elapsed > 0) {
                    graphDataRef.current.push({
                        time: Math.round(elapsed),
                        wpm: Math.round(metricsRef.current.adjusted_wpm), // Net
                        raw: Math.round(metricsRef.current.raw_wpm)
                    })
                }
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [view, isPaused, startTime, totalPausedTime])

    // Ghost Replay Logic
    const currentReplayRef = useRef<{ char: string, time: number }[]>([])

    // Get Best Replay for current lesson
    const bestReplays = useStatsStore((s: any) => s.bestReplays)
    const ghostReplay = useMemo(() => {
        if (!currentLesson) return undefined
        const data = bestReplays[currentLesson.id]
        if (!data) return undefined
        return data  // Should match ReplayData interface
    }, [currentLesson, bestReplays])

    const startLesson = async (lesson: Lesson) => {
        setCurrentLesson(lesson)
        setInput('')
        setErrors({})
        setMetrics({ raw_wpm: 0, adjusted_wpm: 0, accuracy: 100, consistency: 100, is_bot: false, cheat_flags: '' })
        setStartTime(Date.now())
        setTotalKeystrokes(0)
        setFinalStats({ netWpm: 0, errorCount: 0, timeTaken: 0, rawWpm: 0, consistency: 0, totalKeystrokes: 0 })

        setIsPaused(false)
        setTotalPausedTime(0)
        setLastPauseStart(null)
        graphDataRef.current = []
        currentReplayRef.current = [] // Reset replay recorder

        await startSession(lesson.text)
        setView('typing')
        setShowResult(false)
        startIdleTimer()
    }

    const retryLesson = async () => {
        if (currentLesson) {
            await startLesson(currentLesson)
        }
    }

    const handleResult = useCallback(() => {
        if (!currentLesson) return
        if (timerRef.current) clearTimeout(timerRef.current)

        const endTime = Date.now()
        // Deduct paused time from total duration
        const activeDuration = Math.max(0, endTime - startTime - totalPausedTime)
        const timeTaken = activeDuration / 1000 // Seconds
        const totalErrors = (Object.values(errors) as number[]).reduce((a: number, b: number) => a + b, 0)

        // Formulas
        const calculatedRawWpm = timeTaken > 0 ? ((totalKeystrokes / 5) / (timeTaken / 60)) : 0
        const netWpm = timeTaken > 0 ? Math.max(0, ((totalKeystrokes - totalErrors) / 5) / (timeTaken / 60)) : 0

        setFinalStats({
            rawWpm: Math.round(calculatedRawWpm),
            netWpm: Math.round(netWpm),
            errorCount: totalErrors,
            consistency: Math.round(metrics.consistency),
            timeTaken: timeTaken,
            totalKeystrokes: totalKeystrokes
        })

        // Record stats including errors, graph data, and REPLAY data
        const replayData = { charAndTime: currentReplayRef.current }
        recordAttempt(currentLesson.id, metrics.raw_wpm, metrics.accuracy, errors, graphDataRef.current, replayData)
        syncService.pushToCloud()

        // Gatekeeper rule: Accuracy == 100% AND Speed >= targetWPM (min 28)
        const speedTarget = Math.max(28, currentLesson.targetWPM)
        const passed = Math.round(metrics.accuracy) === 100 && Math.round(metrics.raw_wpm) >= speedTarget

        if (passed) {
            if (!completedIds.includes(currentLesson.id)) {
                setCompletedIds((prev: string[]) => [...prev, currentLesson.id])
            }
            const currentIndex = CURRICULUM.findIndex((l: Lesson) => l.id === currentLesson.id)
            if (currentIndex < CURRICULUM.length - 1) {
                const nextId = CURRICULUM[currentIndex + 1].id
                if (!unlockedIds.includes(nextId)) {
                    setUnlockedIds((prev: string[]) => [...prev, nextId])
                }
            }
        } else {
            playErrorSound()
        }
        setShowResult(true)
    }, [metrics, currentLesson, completedIds, unlockedIds, recordAttempt, errors, startTime, totalKeystrokes, totalPausedTime])

    useEffect(() => {
        if (currentLesson && input.length === currentLesson.text.length && input.length > 0) {
            handleResult()
        }
    }, [input, currentLesson, handleResult])

    const onKeyDown = async (e: KeyboardEvent) => {
        if (view !== 'typing' || !currentLesson || showResult) return

        // Resume timer on any interaction
        resumeTimer()

        if (e.key === 'Backspace') {
            setInput((prev: string) => prev.slice(0, -1))
            playTypingSound('Backspace')
            return
        }

        if (e.key.length === 1 && input.length < currentLesson.text.length) {
            const char = e.key
            const targetChar = currentLesson.text[input.length]
            const timestamp = Date.now()

            // Record Replay Key
            // Time is relative to start minus pause time
            const relativeTime = timestamp - startTime - totalPausedTime
            if (activeChar) { // Ensure tracking valid chars
                currentReplayRef.current.push({ char, time: relativeTime })
            }

            // Track error locally
            if (char !== targetChar) {
                setErrors((prev: Record<string, number>) => ({
                    ...prev,
                    [targetChar]: (prev[targetChar] || 0) + 1
                }))
                playErrorSound()
            } else {
                playTypingSound(char)
            }

            setTotalKeystrokes((prev: number) => prev + 1)
            setInput((prev: string) => prev + char)


            try {
                const latestMetrics = await handleKeystroke(char, timestamp)
                setMetrics(latestMetrics)
            } catch (err) {
                console.error('Keystroke handling failed:', err)
            }
        }
    }

    return {
        view,
        setView,
        currentLesson,
        metrics,
        input,
        unlockedIds,
        completedIds,
        showResult,
        setShowResult,
        activeChar,
        startLesson,
        retryLesson,
        onKeyDown,
        finalStats,
        errors,
        isPaused,
        ghostReplay // Export ghost data for UI
    }
}
