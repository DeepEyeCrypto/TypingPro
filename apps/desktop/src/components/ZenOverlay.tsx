import { useState, useEffect, useCallback } from 'react'
import { SmartLessonGenerator } from '@src/utils/SmartLessonGenerator'

export const ZenOverlay = () => {
    const [text, setText] = useState('')
    const [input, setInput] = useState('')
    const [isComplete, setIsComplete] = useState(false)
    const [stats, setStats] = useState({ wpm: 0, accuracy: 0 })
    const [startTime, setStartTime] = useState<number | null>(null)

    const loadDrill = useCallback(async () => {
        const drill = await SmartLessonGenerator.generateIntelligentDrill(12)
        setText(drill)
        setInput('')
        setIsComplete(false)
        setStartTime(null)
        setStats({ wpm: 0, accuracy: 0 })
    }, [])

    useEffect(() => {
        loadDrill()
    }, [loadDrill])

    const calculateStats = useCallback((currentInput: string) => {
        if (!startTime) return

        const now = Date.now()
        const minutes = (now - startTime) / 1000 / 60
        const wordsTyped = currentInput.length / 5
        const currentWpm = Math.round(wordsTyped / minutes) || 0

        let correctChars = 0
        for (let i = 0; i < currentInput.length; i++) {
            if (currentInput[i] === text[i]) correctChars++
        }
        const currentAccuracy = Math.round((correctChars / currentInput.length) * 100) || 0

        setStats({ wpm: currentWpm, accuracy: currentAccuracy })
    }, [startTime, text])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (isComplete) return

        if (e.key.length === 1 && input.length < text.length) {
            if (!startTime) setStartTime(Date.now())

            const newInput = input + e.key
            setInput(newInput)
            calculateStats(newInput)

            if (newInput.length === text.length) {
                setIsComplete(true)
                setTimeout(() => loadDrill(), 2000)
            }
        } else if (e.key === 'Backspace') {
            const newInput = input.slice(0, -1)
            setInput(newInput)
            if (newInput.length > 0) calculateStats(newInput)
        }
    }

    return (
        <div className="zen-container" onKeyDown={handleKeyDown} tabIndex={0} autoFocus>
            <div className="zen-rank-badge">
                {/* Simplified SVG Rank Placeholder */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            </div>

            <div className="zen-text">
                {text.split('').map((char, idx) => {
                    const inputChar = input[idx]
                    const isCurrent = idx === input.length
                    return (
                        <span
                            key={idx}
                            className={`${inputChar === undefined ? '' :
                                    inputChar === char ? 'correct' : 'error'
                                } ${isCurrent ? 'current' : ''}`}
                        >
                            {char}
                        </span>
                    )
                })}
            </div>

            {isComplete ? (
                <div className="zen-complete">✓ Session Complete</div>
            ) : (
                <div className="zen-stats">
                    <div className="stat-item">
                        <span className="stat-value">{stats.wpm}</span>
                        <span className="stat-label">WPM</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{stats.accuracy}%</span>
                        <span className="stat-label">ACC</span>
                    </div>
                </div>
            )}

            <div className="zen-hint">ESC / Cmd+Alt+T to exit</div>
        </div>
    )
}
