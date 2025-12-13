import React, { useMemo } from 'react';
import { KEYBOARD_ROWS, getKeyForChar, getFingerForKeyId, requiresShift, Finger } from '../utils/keyToFingerMap';

interface KeyboardHandsOverlayProps {
    currentChar: string | null;
    className?: string;
}

// Layout Constants
const KEY_BASE_SIZE = 50;
const KEY_GAP = 6;
const KEY_RADIUS = 6;
const KEYBOARD_PADDING = 20;

// Render Constants
const KEYBOARD_WIDTH = 15 * (KEY_BASE_SIZE + KEY_GAP); // Approx width
const KEYBOARD_HEIGHT = 5 * (KEY_BASE_SIZE + KEY_GAP) + 50;

// Hand Constants
const HAND_Y_OFFSET = KEYBOARD_HEIGHT * 0.7;
const HAND_SCALE = 0.9; // Slightly larger to match reference

// Palm Paths from User SVG (Centered roughly at 0,0 for the palm center)
// Original Left Palm: M150 210 C130 210 110 230 110 250 L110 260 C110 275 135 285 155 285 L185 285 C205 285 230 275 230 260 L230 245 C230 225 210 210 190 210 Z
// We translate this to be relative to a "wrist" center for our component's coordinate system
const LEFT_PALM_PATH = "M -20 -35 C -40 -35 -60 -15 -60 5 L -60 15 C -60 30 -35 40 -15 40 L 15 40 C 35 40 60 30 60 15 L 60 0 C 60 -20 40 -35 20 -35 Z";

// Mirrored for Right Hand
const RIGHT_PALM_PATH = "M 20 -35 C 40 -35 60 -15 60 5 L 60 15 C 60 30 35 40 15 40 L -15 40 C -35 40 -60 30 -60 15 L -60 0 C -60 -20 -40 -35 -20 -35 Z";


// Finger Origins (approximate attachment points on the palm path)
const FINGER_COORDS: Record<Finger, { x: number, y: number, length: number }> = {
    // Left Hand
    'left-pinky': { x: -50, y: -10, length: 35 },
    'left-ring': { x: -25, y: -30, length: 45 },
    'left-middle': { x: 0, y: -35, length: 50 },
    'left-index': { x: 30, y: -30, length: 45 },
    'left-thumb': { x: 50, y: 0, length: 30 },

    // Right Hand
    'right-thumb': { x: -50, y: 0, length: 30 },
    'right-index': { x: -30, y: -30, length: 45 },
    'right-middle': { x: 0, y: -35, length: 50 },
    'right-ring': { x: 25, y: -30, length: 45 },
    'right-pinky': { x: 50, y: -10, length: 35 },
};

// Hand Positioning
const LEFT_HAND_POS = { x: 230, y: 410 };
const RIGHT_HAND_POS = { x: 670, y: 410 };

const KeyboardHandsOverlay: React.FC<KeyboardHandsOverlayProps> = ({ currentChar, className = '' }) => {
    // 1. Determine Active Key and Finger
    const activeKeyId = useMemo(() => getKeyForChar(currentChar), [currentChar]);
    const activeFinger = useMemo(() => activeKeyId ? getFingerForKeyId(activeKeyId) : null, [activeKeyId]);
    const isShiftNeeded = useMemo(() => requiresShift(currentChar), [currentChar]);

    // If shift is needed, we need to highlight the Shift key on the OPPOSITE hand
    const activeShiftKeyId = useMemo(() => {
        if (!isShiftNeeded || !activeFinger) return null;
        return activeFinger.startsWith('left') ? 'key-rshift' : 'key-lshift';
    }, [isShiftNeeded, activeFinger]);

    const activeShiftFinger = useMemo(() => activeShiftKeyId ? getFingerForKeyId(activeShiftKeyId) : null, [activeShiftKeyId]);


    // 2. Helper to get coordinates of a key center
    const getKeyCenter = (keyId: string): { x: number, y: number } | null => {
        let currentY = KEYBOARD_PADDING + 80; // Shift down for base rect
        for (const row of KEYBOARD_ROWS) {
            let currentX = KEYBOARD_PADDING + 50;
            // Center the 5th row (spacebar)
            if (row === KEYBOARD_ROWS[4]) {
                // quick hack to center space row roughly if needed, or just standard alignment
                currentX = KEYBOARD_PADDING + 200; // Indent space row
            }

            for (const key of row) {
                const w = (key.width || 1) * KEY_BASE_SIZE;

                if (key.id === keyId) {
                    return { x: currentX + w / 2, y: currentY + KEY_BASE_SIZE / 2 };
                }
                currentX += w + KEY_GAP;
            }
            currentY += KEY_BASE_SIZE + KEY_GAP;
        }
        return null;
    };

    // 3. Helper to get coordinates of a finger tip (absolute SVG coords)
    const getFingerTip = (finger: Finger): { x: number, y: number } | null => {
        const isLeft = finger.startsWith('left');
        const basePos = isLeft ? LEFT_HAND_POS : RIGHT_HAND_POS;
        const coords = FINGER_COORDS[finger];
        if (!coords) return null;

        // Calculate tip based on base + offset + length (simple vertical extension for resting)
        // For active, we'd need the target key pos.
        // This is just a helper for the CONNECTION LINE origin.
        // We'll use the "Resting" tip position for the origin.
        return {
            x: basePos.x + (coords.x * HAND_SCALE),
            y: basePos.y + (coords.y * HAND_SCALE) - (coords.length * HAND_SCALE)
        };
    };

    // Active Key Center
    const targetKeyPos = activeKeyId ? getKeyCenter(activeKeyId) : null;
    const activeFingerPos = activeFinger ? getFingerTip(activeFinger) : null;

    return (
        <div className={`w-full flex justify-center ${className}`}>
            <svg
                viewBox={`0 0 ${KEYBOARD_WIDTH} 550`}
                className="w-full max-w-[800px] h-auto select-none"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* --- KEYBOARD BASE --- */}
                <rect x="60" y="80" width={KEYBOARD_WIDTH - 100} height={320} rx="16" ry="16"
                    className="fill-[#f5f5f5] dark:fill-gray-900 stroke-[#cccccc] dark:stroke-gray-700 stroke-2" />

                {/* --- KEYBOARD KEYS --- */}
                <g>
                    {KEYBOARD_ROWS.map((row, rIdx) => {
                        let currentX = KEYBOARD_PADDING + 50;
                        if (rIdx === 4) currentX = KEYBOARD_PADDING + 200;

                        const currentY = KEYBOARD_PADDING + 80 + rIdx * (KEY_BASE_SIZE + KEY_GAP);

                        return (
                            <g key={rIdx}>
                                {row.map((key) => {
                                    const w = (key.width || 1) * KEY_BASE_SIZE;
                                    const h = KEY_BASE_SIZE;
                                    const isActive = key.id === activeKeyId || key.id === activeShiftKeyId;

                                    return (
                                        <g key={key.id} transform={`translate(${currentX}, ${currentY})`}>
                                            <rect
                                                width={w}
                                                height={h}
                                                rx={6}
                                                className={`
                            transition-all duration-150 stroke-[1.5px]
                            ${isActive
                                                        ? 'fill-[#cfe8ff] dark:fill-blue-900 stroke-[#4a90e2] dark:stroke-blue-500'
                                                        : 'fill-white dark:fill-gray-800 stroke-[#bbbbbb] dark:stroke-gray-600'
                                                    }
                          `}
                                            />
                                            <text
                                                x={w / 2}
                                                y={h / 2 + 6}
                                                textAnchor="middle"
                                                className={`
                            text-[16px] font-sans transition-colors duration-150 select-none
                            ${isActive
                                                        ? 'fill-[#255a9b] dark:fill-blue-100 font-bold'
                                                        : 'fill-[#555555] dark:fill-gray-400 font-medium'
                                                    }
                          `}
                                            >
                                                {key.label}
                                            </text>
                                        </g>
                                    );
                                    currentX += w + KEY_GAP;
                                })}
                            </g>
                        );
                    })}
                </g>

                {/* --- HANDS LAYER --- */}
                {/* Helper to render a finger */}
                {/* We use specific logic: simple line for resting, curve for active?
            For simplicity and robustness, we'll keep using lines but style them thick.
        */}

                {/* Left Hand */}
                <g transform={`translate(${LEFT_HAND_POS.x}, ${LEFT_HAND_POS.y}) scale(${HAND_SCALE})`}>
                    {['left-pinky', 'left-ring', 'left-middle', 'left-index', 'left-thumb'].map(f => {
                        const coords = FINGER_COORDS[f as Finger];
                        const isActive = f === activeFinger || f === activeShiftFinger;

                        // If active, we could ideally point TO the key.
                        // But calculating that inverse kinematics inside SVG JSX is heavy.
                        // We will stick to the "Highlight" strategy + Connection Line for clarity.

                        return (
                            <line
                                key={f}
                                x1={0} y1={0} x2={coords.x} y2={coords.y - coords.length}
                                className={`
                            stroke-linecap-round transition-all duration-200 stroke-[10px]
                            ${isActive ? 'stroke-[#4a90e2] dark:stroke-blue-500' : 'stroke-[#cccccc] dark:stroke-gray-600'}
                        `}
                            />
                        )
                    })}
                    {/* Palm */}
                    <path
                        d={LEFT_PALM_PATH}
                        className="fill-[#f0f0f0] dark:fill-gray-800 stroke-[#cccccc] dark:stroke-gray-600 stroke-[3px]"
                    />
                </g>

                {/* Right Hand */}
                <g transform={`translate(${RIGHT_HAND_POS.x}, ${RIGHT_HAND_POS.y}) scale(${HAND_SCALE})`}>
                    {['right-thumb', 'right-index', 'right-middle', 'right-ring', 'right-pinky'].map(f => {
                        const coords = FINGER_COORDS[f as Finger];
                        const isActive = f === activeFinger || f === activeShiftFinger;
                        return (
                            <line
                                key={f}
                                x1={0} y1={0} x2={coords.x} y2={coords.y - coords.length}
                                className={`
                            stroke-linecap-round transition-all duration-200 stroke-[10px]
                            ${isActive ? 'stroke-[#4a90e2] dark:stroke-blue-500' : 'stroke-[#cccccc] dark:stroke-gray-600'}
                        `}
                            />
                        )
                    })}
                    {/* Palm */}
                    <path
                        d={RIGHT_PALM_PATH}
                        className="fill-[#f0f0f0] dark:fill-gray-800 stroke-[#cccccc] dark:stroke-gray-600 stroke-[3px]"
                    />
                </g>

                {/* --- CONNECTION LINES (Overlay) --- */}
                {activeKeyId && activeFinger && targetKeyPos && activeFingerPos && (
                    <path
                        d={`M ${activeFingerPos.x} ${activeFingerPos.y} Q ${activeFingerPos.x} ${targetKeyPos.y} ${targetKeyPos.x} ${targetKeyPos.y}`}
                        fill="none"
                        stroke="#4a90e2"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                        className="opacity-60 animate-pulse"
                    />
                )}

            </svg>
        </div>
    );
};

export default React.memo(KeyboardHandsOverlay);
