import React, { useEffect, useRef, useState } from 'react'
import { useSettingsStore } from '@src/stores/settingsStore'
import { ReplayData } from '@src/stores/statsStore'
import './TypingField.css'

interface TypingFieldProps {
    targetText: string,
    input: string,
    active: boolean,
    onKeyDown: (e: any) => void,
    isPaused?: boolean,
    ghostReplay?: ReplayData
}

export const TypingField = ({ targetText, input, active, onKeyDown, isPaused, ghostReplay }: TypingFieldProps) => {
    const { fontSize, caretStyle } = useSettingsStore()
    const inputRef = useRef<HTMLInputElement>(null)

    // Ghost Logic
    const [ghostIndex, setGhostIndex] = useState(0)
    const startTimeRef = useRef<number | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    useEffect(() => {
        if (!active || !ghostReplay || isPaused) {
            setGhostIndex(0)
            startTimeRef.current = null
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
            return
        }

        if (startTimeRef.current === null) {
            startTimeRef.current = Date.now()
        }

        const updateGhost = () => {
            if (!startTimeRef.current || !ghostReplay) return
            const elapsed = Date.now() - startTimeRef.current

            // Find current index based on elapsed time matching replay timestamps
            // Replay data is sorted by time.
            // We want the last index where replay[i].time <= elapsed
            // Optimization: Start specific search from current ghostIndex?
            let newIndex = ghostIndex
            for (let i = ghostIndex; i < ghostReplay.charAndTime.length; i++) {
                if (ghostReplay.charAndTime[i].time <= elapsed) {
                    newIndex = i + 1 // Cursor is AFTER the char
                } else {
                    break
                }
            }

            if (newIndex !== ghostIndex) {
                setGhostIndex(newIndex)
            }

            if (newIndex < ghostReplay.charAndTime.length) {
                animationFrameRef.current = requestAnimationFrame(updateGhost)
            }
        }

        animationFrameRef.current = requestAnimationFrame(updateGhost)

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        }
    }, [active, ghostReplay, isPaused, ghostIndex]) // Dep on ghostIndex might cause loop, better to use ref for logic

    // Fix dependency loop: remove ghostIndex from dep array and use ref for current index tracking?
    // Actually, setGhostIndex triggers re-render, which re-runs effect.
    // Standard Loop Pattern:
    useEffect(() => {
        if (!active || !ghostReplay || isPaused) {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
            return
        }

        // Reset if starting fresh
        if (input.length === 0) {
            startTimeRef.current = Date.now()
            setGhostIndex(0)
        }

        const loop = () => {
            const elapsed = Date.now() - (startTimeRef.current || Date.now())
            let newIndex = 0
            // Simple linear scan (fast enough for < 500 chars)
            for (let i = 0; i < ghostReplay.charAndTime.length; i++) {
                if (ghostReplay.charAndTime[i].time <= elapsed) {
                    newIndex = i + 1
                } else {
                    break
                }
            }
            setGhostIndex(newIndex)
            animationFrameRef.current = requestAnimationFrame(loop)
        }
        loop()
        return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current) }
    }, [active, isPaused, ghostReplay, input.length === 0]) // Reset on input 0

    // Auto-Focus Logic
    useEffect(() => {
        const focusInput = () => {
            if (active && inputRef.current) {
                inputRef.current.focus({ preventScroll: true })
            }
        }
        focusInput()
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isInteractive = target.closest('button') || target.closest('a') || target.closest('input') || target.closest('.settings-panel')
            if (!isInteractive) focusInput()
        }
        window.addEventListener('click', handleGlobalClick)
        window.addEventListener('focus', focusInput)
        return () => {
            window.removeEventListener('click', handleGlobalClick)
            window.removeEventListener('focus', focusInput)
        }
    }, [active])

    return (
        <div className="typing-field" style={{ fontSize: `${fontSize}px` }} onClick={() => inputRef.current?.focus()}>
            <input
                ref={inputRef}
                className="hidden-input-field"
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                autoFocus
                onKeyDown={onKeyDown}
                onChange={() => { }}
                value=""
            />

            {targetText.split('').map((char: string, i: number) => {
                let state: 'pending' | 'correct' | 'incorrect' = 'pending'
                if (i < input.length) {
                    state = input[i] === char ? 'correct' : 'incorrect'
                }

                return (
                    <span key={i} className={`char ${state} ${i === ghostIndex && active ? 'ghost-active' : ''}`}>
                        {char === ' ' ? '\u00A0' : char}
                        {i === input.length && active && (
                            <div className={`caret blinking caret-${caretStyle}`} />
                        )}
                        {/* Ghost Cursor */}
                        {i === ghostIndex && active && ghostReplay && (
                            <div className={`caret caret-${caretStyle}`} style={{ opacity: 0.3, background: 'cyan', boxShadow: '0 0 10px cyan' }} />
                        )}
                    </span>
                )
            })}

            {isPaused && (
                <div className="paused-overlay">
                    <span>PAUSED</span>
                </div>
            )}
        </div>
    )
}
