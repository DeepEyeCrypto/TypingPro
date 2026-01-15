import React, { useState, useEffect, memo } from 'react'
import { SmartLessonGenerator } from '@src/utils/SmartLessonGenerator'

interface ZenCharProps {
    char: string;
    state: 'pending' | 'correct' | 'error';
}

const ZenChar = memo(({ char, state }: ZenCharProps) => {
    return (
        <span className={state}>
            {char}
        </span>
    );
});

export const ZenOverlay = () => {
    const [text, setText] = useState('')
    const [input, setInput] = useState('')
    const [isComplete, setIsComplete] = useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus()
        }
    }, [])


    useEffect(() => {
        loadDrill()
    }, [])

    const loadDrill = async () => {
        const drill = await SmartLessonGenerator.generateIntelligentDrill(15)
        setText(drill)
        setInput('')
        setIsComplete(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key.length === 1 && input.length < text.length) {
            const newInput = input + e.key
            setInput(newInput)

            if (newInput.length === text.length) {
                setIsComplete(true)
                setTimeout(() => loadDrill(), 1500)
            }
        } else if (e.key === 'Backspace') {
            setInput(prev => prev.slice(0, -1))
        }
    }

    return (
        <div
            ref={containerRef}
            className="zen-container"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            onClick={() => containerRef.current?.focus()}
        >

            <div className="zen-text">
                {text.split(' ').map((word, wordIdx) => {
                    // pre-calculate prefix length for the word
                    const prefixLength = text.split(' ').slice(0, wordIdx).join(' ').length + (wordIdx > 0 ? 1 : 0);

                    return (
                        <span key={wordIdx} className="zen-word">
                            {word.split('').map((char, charIdx) => {
                                const totalIdx = prefixLength + charIdx
                                const inputChar = input[totalIdx]
                                let state: 'pending' | 'correct' | 'error' = 'pending'
                                if (inputChar !== undefined) {
                                    state = inputChar === char ? 'correct' : 'error'
                                }
                                return (
                                    <ZenChar
                                        key={charIdx}
                                        char={char}
                                        state={state}
                                    />
                                )
                            })}
                            {wordIdx < text.split(' ').length - 1 && ' '}
                        </span>
                    )
                })}
            </div>
            {isComplete && <div className="zen-complete">✓ Complete!</div>}
            <div className="zen-hint">Press Cmd/Ctrl+Alt+T to close</div>
        </div>
    )
}
