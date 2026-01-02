import React from 'react'
import { useSettingsStore } from '@src/stores/settingsStore'
import './TypingField.css'

interface TypingFieldProps {
    targetText: string,
    input: string,
    active: boolean
}

export const TypingField = ({ targetText, input, active }: TypingFieldProps) => {
    const { fontSize, caretStyle } = useSettingsStore()

    return (
        <div className="typing-field" style={{ fontSize: `${fontSize}px` }}>
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
        </div>
    )
}
