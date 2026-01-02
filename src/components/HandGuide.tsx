import React, { useMemo } from 'react'
import { FingerId, FINGER_HOME, KEY_MAP } from '@src/lib/keyboardMapping'
import './HandGuide.css'

interface HandGuideProps {
    activeChar: string
}

const Finger = ({
    id,
    active,
    targetX,
    targetY
}: { id: FingerId, active: boolean, targetX: number, targetY: number }) => {
    const home = FINGER_HOME[id]
    const currentX = active ? targetX : home.x
    const currentY = active ? targetY : home.y

    const isLeft = id.startsWith('L')

    // Base points for each finger to make it look more like a hand
    const fingerBases: Record<FingerId, { x: number, y: number }> = {
        LP: { x: 45, y: 190 },
        LR: { x: 75, y: 185 },
        LM: { x: 105, y: 185 },
        LI: { x: 135, y: 190 },
        LT: { x: 165, y: 210 },
        RI: { x: 385, y: 190 },
        RM: { x: 415, y: 185 },
        RR: { x: 445, y: 185 },
        RP: { x: 475, y: 190 },
        RT: { x: 355, y: 210 }
    }

    const base = fingerBases[id]

    return (
        <g className={`finger-group ${id}`}>
            {/* Finger Bone */}
            <line
                x1={base.x}
                y1={base.y}
                x2={currentX + 18}
                y2={currentY + 18}
                className={`finger-path ${active ? 'active' : ''}`}
            />
            {/* Finger Tip */}
            <circle
                cx={currentX + 18}
                cy={currentY + 18}
                r="5"
                className={`finger-tip ${active ? 'active' : ''}`}
            />
        </g>
    )
}

export const HandGuide = ({ activeChar }: HandGuideProps) => {
    const mapping = useMemo(() => {
        const char = activeChar.toLowerCase()
        return KEY_MAP[char] || null
    }, [activeChar])

    const fingers = useMemo(() => {
        return (Object.keys(FINGER_HOME) as FingerId[]).map(id => {
            const isActive = mapping?.finger === id
            return (
                <Finger
                    key={id}
                    id={id}
                    active={isActive}
                    targetX={mapping?.x ?? 0}
                    targetY={mapping?.y ?? 0}
                />
            )
        })
    }, [mapping])

    return (
        <div className="hand-guide-container">
            <svg className="hand-svg" viewBox="0 0 520 240">
                {/* Left Palm */}
                <path
                    d="M30,220 Q30,240 60,240 L150,240 Q180,240 180,210 L180,190 Q180,170 150,170 L60,170 Q30,170 30,190 Z"
                    className="hand-outline"
                    style={{ opacity: 0.3 }}
                />
                {/* Right Palm */}
                <path
                    d="M340,210 Q340,240 370,240 L460,240 Q490,240 490,220 L490,190 Q490,170 460,170 L370,170 Q340,170 340,190 Z"
                    className="hand-outline"
                    style={{ opacity: 0.3 }}
                />
                {fingers}
            </svg>
        </div>
    )
}
