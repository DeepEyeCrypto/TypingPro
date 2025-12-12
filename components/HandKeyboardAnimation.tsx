import React, { useMemo } from 'react';
import { KEYBOARD_LAYOUT, getKeyIdForChar, getFingerForKey, Finger, KeyData } from '../utils/keyboardMaps';

interface HandKeyboardAnimationProps {
    activeKey: string | null; // The character to type
    pressedKeys: Set<string>; // Keys currently held down (optional visual feedback)
    theme?: 'light' | 'dark';
}

const KEY_WIDTH = 40;
const KEY_HEIGHT = 40;
const GAP = 4;
const KEYBOARD_PADDING = 10;

// Simple Hand SVG Paths (Abstract representation)
// Coordinates are relative to a 200x200 hand box
const LEFT_HAND_PATH = "M 60,180 C 40,180 30,160 30,140 L 20,80 C 18,70 18,60 25,60 C 32,60 32,70 34,80 L 40,110 L 45,60 C 43,50 43,40 50,40 C 57,40 57,50 59,60 L 65,110 L 70,40 C 68,30 68,20 75,20 C 82,20 82,30 84,40 L 90,110 L 100,60 C 98,50 98,40 105,40 C 112,40 112,50 114,60 L 120,130 C 125,150 120,170 100,180 Z";
const RIGHT_HAND_PATH = "M 140,180 C 160,180 170,160 170,140 L 180,80 C 182,70 182,60 175,60 C 168,60 168,70 166,80 L 160,110 L 155,60 C 157,50 157,40 150,40 C 143,40 143,50 141,60 L 135,110 L 130,40 C 132,30 132,20 125,20 C 118,20 118,30 116,40 L 110,110 L 100,60 C 102,50 102,40 95,40 C 88,40 88,50 86,60 L 80,130 C 75,150 80,170 100,180 Z";

// Map fingers to circle positions on the hand SVG (approximate)
const FINGER_POSITIONS: Record<Finger, { x: number; y: number; hand: 'left' | 'right' }> = {
    'pinky-left': { x: 26, y: 70, hand: 'left' },
    'ring-left': { x: 51, y: 50, hand: 'left' },
    'middle-left': { x: 76, y: 30, hand: 'left' },
    'index-left': { x: 106, y: 50, hand: 'left' },
    'thumb-left': { x: 140, y: 120, hand: 'left' }, // Approximated thumb position relative to path

    'pinky-right': { x: 174, y: 70, hand: 'right' },
    'ring-right': { x: 149, y: 50, hand: 'right' },
    'middle-right': { x: 124, y: 30, hand: 'right' },
    'index-right': { x: 94, y: 50, hand: 'right' },
    'thumb-right': { x: 60, y: 120, hand: 'right' },
};

const HandKeyboardAnimation: React.FC<HandKeyboardAnimationProps> = ({ activeKey, pressedKeys }) => {
    // Determine highlighted keys and fingers
    const activeFinger = getFingerForKey(activeKey);
    const activeKeyIds = new Set<string>();

    // Multiple keys might map to the character (e.g. shift + char)
    // For simplicity using the ID mapper
    const primaryId = getKeyIdForChar(activeKey);
    if (primaryId) activeKeyIds.add(primaryId);

    // Check for Shift requirement
    if (activeKey && /[A-Z!@#$%^&*()_+{}:"<>?~|]/.test(activeKey)) {
        // If left hand key, add Right Shift, else Left Shift
        if (activeFinger && activeFinger.includes('left')) {
            activeKeyIds.add('ShiftRight');
        } else {
            activeKeyIds.add('ShiftLeft');
        }
    }

    // Calculate Layout Dimensions
    const maxRowWidth = useMemo(() => {
        return Math.max(...KEYBOARD_LAYOUT.map(row =>
            row.reduce((acc, key) => acc + (key.width || 1) * KEY_WIDTH + GAP, 0)
        ));
    }, []);

    const totalHeight = KEYBOARD_LAYOUT.length * (KEY_HEIGHT + GAP) + KEYBOARD_PADDING * 2;
    const totalWidth = maxRowWidth + KEYBOARD_PADDING * 2;

    // Render Key
    const renderKey = (key: KeyData, x: number, y: number) => {
        const width = (key.width || 1) * KEY_WIDTH;
        const isActive = activeKeyIds.has(key.id);
        const isPressed = pressedKeys.has(key.id) || pressedKeys.has(key.label.toLowerCase()) || pressedKeys.has(key.label); // Loose matching for visuals

        let fill = "fill-gray-100 dark:fill-gray-700";
        if (isActive) fill = "fill-blue-500 dark:fill-blue-600";
        if (isPressed) fill = "fill-green-400 dark:fill-green-500";

        // Finger color hints (optional, usually educational apps color code keys)
        // We can add a subtle stroke or tint based on finger? 
        // For now, clean aesthetic as requested.

        return (
            <g key={key.id}>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={KEY_HEIGHT}
                    rx={4}
                    className={`${fill} transition-colors duration-150 stroke-gray-300 dark:stroke-gray-600 stroke-1`}
                />
                <text
                    x={x + width / 2}
                    y={y + KEY_HEIGHT / 2 + 5}
                    textAnchor="middle"
                    className={`text-[12px] font-bold select-none pointer-events-none ${isActive || isPressed ? 'fill-white' : 'fill-gray-600 dark:fill-gray-300'}`}
                >
                    {key.label}
                </text>
            </g>
        );
    };

    // Calculate finger tip position and key position for drawing trace line
    const getFingerTrace = () => {
        if (!activeFinger || !activeKeyIds.size) return null;

        const fingerPos = FINGER_POSITIONS[activeFinger];
        if (!fingerPos) return null;

        // Find the active key position
        let keyX = 0;
        let keyY = 0;
        for (let rIdx = 0; rIdx < KEYBOARD_LAYOUT.length; rIdx++) {
            const row = KEYBOARD_LAYOUT[rIdx];
            let currentX = 0;
            const rowY = rIdx * (KEY_HEIGHT + GAP);

            for (const key of row) {
                if (activeKeyIds.has(key.id)) {
                    const width = (key.width || 1) * KEY_WIDTH;
                    keyX = currentX + width / 2 + KEYBOARD_PADDING;
                    keyY = rowY + KEY_HEIGHT / 2 + KEYBOARD_PADDING;
                    break;
                }
                currentX += (key.width || 1) * KEY_WIDTH + GAP;
            }
            if (keyX > 0) break;
        }

        if (keyX === 0) return null;

        // Calculate hand offset
        const handScale = 0.7;
        const handX = fingerPos.hand === 'left'
            ? totalWidth * 0.15
            : totalWidth * 0.58;
        const handY = totalHeight + 20; // Y position of the hands' G element

        // Finger tip position relative to the SVG's root, considering hand's transform
        const fingerTipX = handX + fingerPos.x * handScale;
        const fingerTipY = handY + fingerPos.y * handScale;

        return { fingerTipX, fingerTipY, keyX, keyY };
    };

    const trace = getFingerTrace();

    return (
        <div className="flex flex-col items-center justify-center w-full select-none">
            <svg
                viewBox={`0 0 ${totalWidth} ${totalHeight + 200}`}
                className="w-full max-w-4xl h-auto"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* KEYBOARD */}
                <g transform={`translate(${KEYBOARD_PADDING}, ${KEYBOARD_PADDING})`}>
                    {KEYBOARD_LAYOUT.map((row, rIdx) => {
                        let currentX = 0;
                        const rowY = rIdx * (KEY_HEIGHT + GAP);
                        return (
                            <g key={rIdx}>
                                {row.map(key => {
                                    const k = renderKey(key, currentX, rowY);
                                    currentX += (key.width || 1) * KEY_WIDTH + GAP;
                                    return k;
                                })}
                            </g>
                        );
                    })}
                </g>

                {/* TRACE LINE FROM FINGER TO KEY */}
                {trace && (
                    <path
                        d={`M ${trace.fingerTipX} ${trace.fingerTipY} Q ${trace.fingerTipX} ${trace.keyY - 30}, ${trace.keyX} ${trace.keyY}`}
                        stroke="#3B82F6"
                        strokeWidth="3"
                        fill="none"
                        className="animate-pulse"
                        opacity="0.8"
                    />
                )}

                {/* HANDS BELOW KEYBOARD */}
                <g transform={`translate(0, ${totalHeight + 20})`}>
                    {/* Left Hand */}
                    <g transform={`translate(${totalWidth * 0.15}, 0) scale(0.7)`}>
                        <path
                            d={LEFT_HAND_PATH}
                            className="fill-none stroke-gray-400 dark:stroke-gray-500 stroke-2"
                        />
                        {/* Highlight Active Finger */}
                        {activeFinger && activeFinger.includes('left') && FINGER_POSITIONS[activeFinger] && (
                            <circle
                                cx={FINGER_POSITIONS[activeFinger].x}
                                cy={FINGER_POSITIONS[activeFinger].y}
                                r={8}
                                className="fill-blue-500 stroke-blue-600 stroke-2"
                            />
                        )}
                    </g>

                    {/* Right Hand */}
                    <g transform={`translate(${totalWidth * 0.58}, 0) scale(0.7)`}>
                        <path
                            d={RIGHT_HAND_PATH}
                            className="fill-none stroke-gray-400 dark:stroke-gray-500 stroke-2"
                        />
                        {/* Highlight Active Finger */}
                        {activeFinger && activeFinger.includes('right') && FINGER_POSITIONS[activeFinger] && (
                            <circle
                                cx={FINGER_POSITIONS[activeFinger].x}
                                cy={FINGER_POSITIONS[activeFinger].y}
                                r={8}
                                className="fill-blue-500 stroke-blue-600 stroke-2"
                            />
                        )}
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default React.memo(HandKeyboardAnimation);
