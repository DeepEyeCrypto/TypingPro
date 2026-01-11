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
                    // Handle special case for Space (mapping might have blank char)
                    const isSpace = char === ' ' || char === 'space';
                    const isActive = char === activeCharLower || (isSpace && activeChar === ' ');
                    const isHome = ['f', 'j'].includes(char);
                    const label = isSpace ? 'SPACE' : char;

                    return (
                        <div
                            key={char}
                            className={`key ${isActive ? 'active' : ''} ${isHome ? 'home-marker' : ''}`}
                            data-char={char}
                            style={{
                                left: `${pos.x}px`,
                                top: `${pos.y}px`,
                                width: isSpace ? '300px' : '40px' // Dynamic width for Spacebar if position is center
                            }}
                        >
                            {label}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
