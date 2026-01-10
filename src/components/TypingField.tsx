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

interface CharacterProps {
    char: string;
    state: 'pending' | 'correct' | 'incorrect';
    isGhost: boolean;
    isCaret: boolean;
    caretStyle: string;
}

const Character = React.memo(({ char, state, isGhost, isCaret, caretStyle }: CharacterProps) => {
    return (
        <span className={`char ${state} ${isGhost ? 'ghost-active' : ''}`}>
            {char === ' ' ? '\u00A0' : char}
            {isCaret && <div className={`caret blinking caret-${caretStyle}`} />}
            {isGhost && <div className={`caret caret-${caretStyle}`} style={{ opacity: 0.3, background: 'cyan', boxShadow: '0 0 10px cyan' }} />}
        </span>
    );
});

export const TypingField = ({ targetText, input, active, onKeyDown, isPaused, ghostReplay }: TypingFieldProps) => {
    const { fontSize, caretStyle } = useSettingsStore()
    const inputRef = useRef<HTMLInputElement>(null)

    // LOCAL BUFFER for sub-1ms feedback
    const [localInput, setLocalInput] = useState(input)

    // Synchronize local input when global input changes (e.g. on reset or pause)
    useEffect(() => {
        setLocalInput(input)
    }, [input])

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
    // OPTIMIZED GHOST LOGIC (O(1) approach)
    const ghostIndexRef = useRef(0)
    useEffect(() => {
        if (!active || !ghostReplay || isPaused) {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
            return
        }

        // Reset if starting fresh
        if (localInput.length === 0) {
            startTimeRef.current = Date.now()
            ghostIndexRef.current = 0
            setGhostIndex(0)
        }

        const loop = () => {
            if (!startTimeRef.current) return
            const elapsed = Date.now() - startTimeRef.current

            // Incrementally find the next index instead of scanning everything
            let changed = false
            while (
                ghostIndexRef.current < ghostReplay.charAndTime.length &&
                ghostReplay.charAndTime[ghostIndexRef.current].time <= elapsed
            ) {
                ghostIndexRef.current++
                changed = true
            }

            if (changed) {
                setGhostIndex(ghostIndexRef.current)
            }

            animationFrameRef.current = requestAnimationFrame(loop)
        }
        loop()
        return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current) }
    }, [active, isPaused, ghostReplay, localInput.length === 0])

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
                onKeyDown={(e) => {
                    // Immediate local update for backspace or single keys
                    if (e.key === 'Backspace' && localInput.length > 0) {
                        setLocalInput(prev => prev.slice(0, -1))
                    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                        setLocalInput(prev => prev + e.key)
                    }
                    onKeyDown(e)
                }}
                onChange={() => { }}
                value=""
            />

            {targetText.split('').map((char: string, i: number) => {
                let state: 'pending' | 'correct' | 'incorrect' = 'pending'
                if (i < localInput.length) {
                    state = localInput[i] === char ? 'correct' : 'incorrect'
                }

                return (
                    <Character
                        key={i}
                        char={char}
                        state={state}
                        isGhost={i === ghostIndex}
                        isCaret={i === localInput.length && active}
                        caretStyle={caretStyle}
                    />
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
