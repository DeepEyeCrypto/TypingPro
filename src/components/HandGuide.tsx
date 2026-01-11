import React, { useMemo } from 'react'
import { FingerId, FINGER_HOME, KEY_MAP } from '@src/lib/keyboardMapping'
import './HandGuide.css'

const HandGuideContainer = React.memo(({ activeChar }: { activeChar: string }) => {
    const mapping = useMemo(() => {
        const char = activeChar.toLowerCase()
        return KEY_MAP[char] || null
    }, [activeChar])

    const activeFinger = mapping?.finger || null

    // Anatomical Paths (Simplified Ghost Hands)
    // Left Hand Path
    const leftHandPath = "M60 220 L60 200 Q60 180 80 160 L100 120 Q110 100 130 110 L140 130  L160 100 Q170 80 190 90 L200 120 L230 100 Q240 90 260 100 L260 130 L290 130 Q300 130 310 150 L310 180 Q310 200 290 220 Z"
    // Right Hand Path (Mirrored-ish concept)
    const rightHandPath = "M590 220 L590 200 Q590 180 570 160 L550 120 Q540 100 520 110 L510 130 L490 100 Q480 80 460 90 L450 120 L420 100 Q410 90 390 100 L390 130 L360 130 Q350 130 340 150 L340 180 Q340 200 360 220 Z"

    // Finger Highlight Paths
    // We overlay specific finger shapes when active
    const fingerPaths: Record<FingerId, string> = {
        LP: "M55 210 L55 180 Q55 170 70 150 L90 120 Q100 100 120 110 L130 140 L110 170 L90 200 Z",
        LR: "M130 140 L160 100 Q170 80 190 90 L200 120 L180 150 Z",
        LM: "M200 120 L230 100 Q240 90 260 100 L260 140 L240 160 Z",
        LI: "M260 140 L260 130 L290 130 Q300 130 310 150 L310 180 Z",
        LT: "M310 180 L340 190 L330 210 Z", // Thumb rudimentary
        RI: "", // ... (would define right hand fingers similarly if needed for full anatomical precision)
        RM: "",
        RR: "",
        RP: "",
        RT: ""
    }

    // For now, using a simpler visual strategy:
    // Draw the full ghost hands always. 
    // Draw an overlay DOT on the finger knuckle/tip position from `FINGER_HOME`.

    return (
        <div className="hand-guide-container">
            <svg className="hand-svg" viewBox="0 0 650 250" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="handGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Left Hand Ghost */}
                <path
                    d="M 50 250 C 50 200, 40 150, 60 130 L 75 80 C 80 70, 95 70, 100 80 L 110 130 L 125 70 C 130 60, 145 60, 150 70 L 160 130 L 180 60 C 185 50, 200 50, 205 60 L 215 130 L 240 80 C 245 70, 260 70, 265 80 L 270 140 L 300 160 C 310 170, 300 190, 290 200 L 250 250"
                    fill="url(#handGradient)"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.5"
                />

                {/* Right Hand Ghost (Mirrored roughly) */}
                <path
                    d="M 600 250 C 600 200, 610 150, 590 130 L 575 80 C 570 70, 555 70, 550 80 L 540 130 L 525 70 C 520 60, 505 60, 500 70 L 490 130 L 470 60 C 465 50, 450 50, 445 60 L 435 130 L 410 80 C 405 70, 390 70, 385 80 L 380 140 L 350 160 C 340 170, 350 190, 360 200 L 400 250"
                    fill="url(#handGradient)"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.5"
                />

                {/* Active Finger Indicators */}
                {(Object.keys(FINGER_HOME) as FingerId[]).map(id => {
                    const home = FINGER_HOME[id]
                    const isActive = activeFinger === id
                    // Adjust home positions to match new hand drawing scale if needed
                    // For now, using FINGER_HOME directly as they are somewhat calibrated to 650x250

                    if (!isActive) return null

                    return (
                        <g key={id} filter="url(#glow)">
                            <circle
                                cx={home.x + (id.startsWith('R') ? 50 : 20)} // offset tweak for visual alignment
                                cy={home.y}
                                r={isActive ? 8 : 4}
                                fill={isActive ? "#00ff41" : "rgba(255,255,255,0.1)"}
                                className="transition-all duration-200"
                            />
                            {isActive && (
                                <circle
                                    cx={home.x + (id.startsWith('R') ? 50 : 20)}
                                    cy={home.y}
                                    r={15}
                                    fill="none"
                                    stroke="#00ff41"
                                    strokeWidth="2"
                                    className="animate-ping opacity-50"
                                />
                            )}
                        </g>
                    )
                })}
            </svg>
        </div>
    )
})

export const HandGuide = HandGuideContainer
