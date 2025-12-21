import React, { useMemo } from 'react';
import { getFingerForKeyId, Finger, requiresShift } from '../utils/keyToFingerMap';

interface HandGuideProps {
    activeKey: string | null;
    className?: string;
}

const HAND_SCALE = 1.0;
const LEFT_HAND_POS = { x: 180, y: 150 };
const RIGHT_HAND_POS = { x: 420, y: 150 };

const HandGuide: React.FC<HandGuideProps> = ({ activeKey, className = '' }) => {
    // 1. Calculate active finger and shift requirements
    const activeFinger = useMemo(() => activeKey ? getFingerForKeyId(activeKey) : null, [activeKey]);
    const isShiftNeeded = useMemo(() => requiresShift(activeKey), [activeKey]);

    const activeShiftFinger = useMemo(() => {
        if (!isShiftNeeded || !activeFinger) return null;
        return activeFinger.startsWith('left') ? 'right-pinky' : 'left-pinky';
    }, [isShiftNeeded, activeFinger]);

    const renderHand = (side: 'left' | 'right') => {
        const isLeft = side === 'left';
        const pos = isLeft ? LEFT_HAND_POS : RIGHT_HAND_POS;
        const fingers = isLeft ? [
            { id: 'left-pinky', d: "M -45 10 Q -60 -20 -50 -45 Q -40 -50 -30 -30 L -35 15" },
            { id: 'left-ring', d: "M -30 -15 Q -35 -50 -25 -75 Q -10 -80 -5 -50 L -10 -15" },
            { id: 'left-middle', d: "M -10 -15 Q -10 -60 5 -85 Q 20 -85 20 -55 L 15 -15" },
            { id: 'left-index', d: "M 15 -15 Q 20 -50 35 -75 Q 50 -70 40 -35 L 30 15" },
            { id: 'left-thumb', d: "M 35 15 Q 70 15 85 40 Q 90 65 60 65 L 45 50" }
        ] : [
            { id: 'right-pinky', d: "M 45 10 Q 60 -20 50 -45 Q 40 -50 30 -30 L 35 15" },
            { id: 'right-ring', d: "M 30 -15 Q 35 -50 25 -75 Q 10 -80 5 -50 L 10 -15" },
            { id: 'right-middle', d: "M 10 -15 Q 10 -60 -5 -85 Q -20 -85 -20 -55 L -15 -15" },
            { id: 'right-index', d: "M -15 -15 Q -20 -50 -35 -75 Q -50 -70 -40 -35 L -30 15" },
            { id: 'right-thumb', d: "M -35 15 Q -70 15 -85 40 Q -90 65 -60 65 L -45 50" }
        ];

        return (
            <g transform={`translate(${pos.x}, ${pos.y}) scale(${HAND_SCALE})`}>
                {/* Palm */}
                <path
                    d={isLeft
                        ? "M -45 20 Q -50 60 -20 75 Q 30 75 45 55 Q 50 20 40 -15 Q 0 -15 -45 20"
                        : "M 45 20 Q 50 60 20 75 Q -30 75 -45 55 Q -50 20 -40 -15 Q 0 -15 45 20"
                    }
                    className="fill-white/5 stroke-white/10 stroke-[1.5]"
                />
                {/* Fingers */}
                {fingers.map(f => {
                    const isActive = f.id === activeFinger || f.id === activeShiftFinger;
                    return (
                        <path
                            key={f.id}
                            d={f.d}
                            className={`transition-all duration-300 stroke-[2] ${isActive
                                    ? 'fill-sky-500 stroke-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)] animate-pulse'
                                    : 'fill-white/10 stroke-white/20'
                                }`}
                        />
                    );
                })}
            </g>
        );
    };

    return (
        <div className={`w-full max-w-[600px] aspect-[2/1] relative pointer-events-none ${className}`}>
            <svg viewBox="0 0 600 300" className="w-full h-full drop-shadow-2xl">
                {renderHand('left')}
                {renderHand('right')}
            </svg>
        </div>
    );
};

export default React.memo(HandGuide);
