import React from 'react'
import { TypingField } from './TypingField'
import { KeyboardOverlay } from './KeyboardOverlay'
import './TypingArea.css'

interface TypingAreaProps {
    targetText: string,
    input: string,
    activeChar: string,
    onBack: () => void
}

export const TypingArea = ({
    targetText,
    input,
    activeChar,
    onBack
}: TypingAreaProps) => {
    return (
        <div className="typing-area">
            <TypingField
                targetText={targetText}
                input={input}
                active={true}
            />

            <div className="visual-guide-area">
                <KeyboardOverlay activeChar={activeChar} />
            </div>

            <button className="btn-back" onClick={onBack}>
                ESC to exit
            </button>
        </div>
    )
}
