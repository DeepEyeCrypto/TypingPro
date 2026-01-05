import React from 'react'
import { KEY_MAP } from '@src/lib/keyboardMapping'
import './KeyboardOverlay.css'

interface KeyboardOverlayProps {
    activeChar: string
}

export const KeyboardOverlay = ({ activeChar }: KeyboardOverlayProps) => {
    const activeCharLower = activeChar.toLowerCase()

    return (
        <div className="keyboard-overlay">
            <div className="keyboard-grid">
                {(Object.entries(KEY_MAP) as [string, any][]).map(([char, pos]) => {
                    const isActive = char === activeCharLower
                    const isHome = ['f', 'j'].includes(char)

                    return (
                        <div
                            key={char}
                            className={`key ${isActive ? 'active' : ''} ${isHome ? 'home-marker' : ''}`}
                            data-char={char}
                            style={{
                                left: `${pos.x}px`,
                                top: `${pos.y}px`
                            }}
                        >
                            {char === ' ' ? '' : char}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
