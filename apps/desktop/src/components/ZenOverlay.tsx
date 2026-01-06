import { useState, useEffect } from 'react'
import { SmartLessonGenerator } from '@src/utils/SmartLessonGenerator'

export const ZenOverlay = () => {
    const [text, setText] = useState('')
    const [input, setInput] = useState('')
    const [isComplete, setIsComplete] = useState(false)

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
        <div className="zen-container" onKeyDown={handleKeyDown} tabIndex={0}>
            <div className="zen-text">
                {text.split(' ').map((word, wordIdx) => (
                    <span key={wordIdx} className="zen-word">
                        {word.split('').map((char, charIdx) => {
                            const totalIdx = text.substring(0, text.indexOf(word)).length + charIdx + wordIdx
                            const inputChar = input[totalIdx]
                            return (
                                <span
                                    key={charIdx}
                                    className={
                                        inputChar === undefined ? '' :
                                            inputChar === char ? 'correct' : 'error'
                                    }
                                >
                                    {char}
                                </span>
                            )
                        })}
                        {wordIdx < text.split(' ').length - 1 && ' '}
                    </span>
                ))}
            </div>
            {isComplete && <div className="zen-complete">✓ Complete!</div>}
            <div className="zen-hint">Press Cmd/Ctrl+Alt+T to close</div>
        </div>
    )
}
