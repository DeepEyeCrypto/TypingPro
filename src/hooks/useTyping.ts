import { useState, useEffect, useCallback, useMemo } from 'react'
import { startSession, handleKeystroke, TypingMetrics } from '@src/lib/tauri'
import { CURRICULUM, Lesson } from '@src/data/lessons'
import { useStatsStore } from '@src/stores/statsStore'
import { syncService } from '@src/services/syncService'

export const useTyping = () => {
    const [view, setView] = useState<'selection' | 'typing' | 'analytics'>('selection')
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
    const [metrics, setMetrics] = useState<TypingMetrics>({
        raw_wpm: 0,
        adjusted_wpm: 0,
        accuracy: 100,
        consistency: 100
    })
    const [input, setInput] = useState('')
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

    const startLesson = async (lesson: Lesson) => {
        setCurrentLesson(lesson)
        setInput('')
        setErrors({})
        setMetrics({ raw_wpm: 0, adjusted_wpm: 0, accuracy: 100, consistency: 100 })
        await startSession(lesson.text)
        setView('typing')
        setShowResult(false)
    }

    const retryLesson = async () => {
        if (currentLesson) {
            await startLesson(currentLesson)
        }
    }

    const handleResult = useCallback(() => {
        if (!currentLesson) return

        // Record stats including errors
        recordAttempt(currentLesson.id, metrics.raw_wpm, metrics.accuracy, errors)

        // Update cloud if possible
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
        }
        setShowResult(true)
    }, [metrics, currentLesson, completedIds, unlockedIds, recordAttempt, errors])

    useEffect(() => {
        if (currentLesson && input.length === currentLesson.text.length && input.length > 0) {
            handleResult()
        }
    }, [input, currentLesson, handleResult])

    const onKeyDown = async (e: KeyboardEvent) => {
        if (view !== 'typing' || !currentLesson || showResult) return

        if (e.key === 'Backspace') {
            setInput((prev: string) => prev.slice(0, -1))
            return
        }

        if (e.key.length === 1 && input.length < currentLesson.text.length) {
            const char = e.key
            const targetChar = currentLesson.text[input.length]
            const timestamp = Date.now()

            // Track error locally
            if (char !== targetChar) {
                setErrors((prev: Record<string, number>) => ({
                    ...prev,
                    [targetChar]: (prev[targetChar] || 0) + 1
                }))
            }

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
        onKeyDown
    }
}
