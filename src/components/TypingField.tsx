import React, { useEffect, useRef } from 'react'
import { useSettingsStore } from '@src/stores/settingsStore'
import './TypingField.css'

interface TypingFieldProps {
    targetText: string,
    input: string,
    active: boolean,
    onKeyDown: (e: any) => void,
    isPaused?: boolean
}

export const TypingField = ({ targetText, input, active, onKeyDown, isPaused }: TypingFieldProps) => {
    const { fontSize, caretStyle } = useSettingsStore()
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto-Focus Logic
    useEffect(() => {
        const focusInput = () => {
            if (active && inputRef.current) {
                // Prevent scrolling when focusing
                inputRef.current.focus({ preventScroll: true })
            }
        }

        focusInput()

        const handleGlobalClick = (e: MouseEvent) => {
            // If user clicks a button or interactive element, don't steal focus
            // Otherwise, refocus the typing input
            const target = e.target as HTMLElement
            const isInteractive = target.closest('button') || target.closest('a') || target.closest('input') || target.closest('.settings-panel')

            if (!isInteractive) {
                focusInput()
            }
        }

        window.addEventListener('click', handleGlobalClick)
        window.addEventListener('focus', focusInput) // Refocus when window regains focus

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
                onChange={() => { }} // Controlled input requires onChange
                value="" // Keep empty, we track state in useTyping
            />

            {targetText.split('').map((char: string, i: number) => {
                let state: 'pending' | 'correct' | 'incorrect' = 'pending'
                if (i < input.length) {
                    state = input[i] === char ? 'correct' : 'incorrect'
                }

                return (
                    <span key={i} className={`char ${state}`}>
                        {char === ' ' ? '\u00A0' : char}
                        {i === input.length && active && (
                            <div className={`caret blinking caret-${caretStyle}`} />
                        )}
                    </span>
                )
            })}

            {/* Paused Indicator */}
            {isPaused && (
                <div className="paused-overlay">
                    <span>PAUSED</span>
                </div>
            )}
        </div>
    )
}
