import React from 'react'
import { TypingField } from './TypingField'
import { KeyboardOverlay } from './KeyboardOverlay'
import { ReplayData } from '@src/stores/statsStore'
import './TypingArea.css'

interface TypingAreaProps {
    targetText: string,
    input: string,
    activeChar: string,
    onBack: () => void,
    onKeyDown: (e: any) => void,
    isPaused: boolean,
    ghostReplay?: ReplayData
}

export const TypingArea = ({
    targetText,
    input,
    activeChar,
    onBack,
    onKeyDown,
    isPaused,
    ghostReplay
}: TypingAreaProps) => {
    return (
        <div className="typing-area">
            <TypingField
                targetText={targetText}
                input={input}
                active={true}
                onKeyDown={onKeyDown}
                isPaused={isPaused}
                ghostReplay={ghostReplay}
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
