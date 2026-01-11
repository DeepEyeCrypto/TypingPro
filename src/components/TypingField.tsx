import React, { useEffect, useRef, useState } from 'react'
import { useSettingsStore } from '@src/stores/settingsStore'
import { ReplayData } from '@src/stores/statsStore'
import './TypingField.css'

interface TypingFieldProps {
    targetText: string,
    input: string,
    active: boolean,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void,
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
}, (prev, next) => {
    // Custom comparison for max speed
    return prev.state === next.state &&
        prev.isCaret === next.isCaret &&
        prev.isGhost === next.isGhost &&
        prev.char === next.char &&
        prev.caretStyle === next.caretStyle;
});

export const TypingField = React.memo(({ targetText, input, active, onKeyDown, isPaused, ghostReplay }: TypingFieldProps) => {
    const { fontSize, caretStyle } = useSettingsStore()
    const inputRef = useRef<HTMLInputElement>(null)

    // LOCAL BUFFER for sub-1ms feedback: Uncontrolled State
    // We only sync from props on reset or explicit change
    const [localInput, setLocalInput] = useState(input)

    // Synchronize local input only if it deviates significantly or is reset
    // The heuristic is: if prop input is empty but local is not, it's a reset.
    useEffect(() => {
        if (input !== localInput) {
            setLocalInput(input)
        }
    }, [input])

    // ... (Ghost Logic Omitted for brevity, assume optimized loops exist or are preserved) ...
    // Note: In a full refactor, we'd move ghost logic to a separate hook to keep this clean.
    // For now, retaining existing logic but ensuring it doesn't block.
    // Re-inserting the optimized ghost logic from previous view:
    const ghostIndexRef = useRef(0)
    const [ghostIndex, setGhostIndex] = useState(0)
    const startTimeRef = useRef<number | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    useEffect(() => {
        if (!active || !ghostReplay || isPaused) {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
            return
        }
        if (localInput.length === 0) {
            startTimeRef.current = Date.now()
            ghostIndexRef.current = 0
            setGhostIndex(0) // Sync state for render
        }

        const loop = () => {
            if (!startTimeRef.current) return
            const elapsed = Date.now() - startTimeRef.current
            let changed = false
            // Fast forward check
            while (
                ghostIndexRef.current < ghostReplay.charAndTime.length &&
                ghostReplay.charAndTime[ghostIndexRef.current].time <= elapsed
            ) {
                ghostIndexRef.current++
                changed = true
            }
            if (changed) setGhostIndex(ghostIndexRef.current)
            animationFrameRef.current = requestAnimationFrame(loop)
        }
        loop()
        return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current) }
    }, [active, isPaused, ghostReplay, localInput.length === 0])

    const focusInput = useCallback(() => {
        if (active && inputRef.current) inputRef.current.focus({ preventScroll: true })
    }, [active])

    useEffect(() => {
        focusInput()
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            // Expanded interactive check
            const isInteractive = target.closest('button') || target.closest('a') || target.closest('input') || target.closest('.settings-panel') || target.closest('.modal-overlay')
            if (!isInteractive) focusInput()
        }
        window.addEventListener('click', handleGlobalClick)
        window.addEventListener('focus', focusInput)
        return () => {
            window.removeEventListener('click', handleGlobalClick)
            window.removeEventListener('focus', focusInput)
        }
    }, [focusInput])

    // Memoize text splitting to avoid O(N) split on every render
    const textChars = React.useMemo(() => targetText.split(''), [targetText]);

    return (
        <div className="typing-field" style={{ fontSize: `${fontSize}px` }} onClick={focusInput}>
            <input
                ref={inputRef}
                className="hidden-input-field"
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                autoFocus
                onKeyDown={(e) => {
                    // Immediate local update for backspace or single keys
                    // logic echoes useTyping but happens 0ms locally
                    if (e.key === 'Backspace' && localInput.length > 0) {
                        setLocalInput(prev => prev.slice(0, -1))
                    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                        setLocalInput(prev => prev + e.key)
                    }
                    onKeyDown(e)
                }}
                onChange={() => { }}
                value=""
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
            />

            {textChars.map((char: string, i: number) => {
                // Derived state for child
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
});
