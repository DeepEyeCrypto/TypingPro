
import React, { useMemo } from 'react';
import { KEYBOARD_ROWS, getKeyForChar, getFingerForKeyId, requiresShift, Finger } from '../utils/keyToFingerMap';
import { KeyStats } from '../types';

interface KeyboardHandsOverlayProps {
    currentChar: string | null;
    className?: string;
    heatmapStats?: Record<string, KeyStats>;
}

// Layout Constants
const KEY_BASE_SIZE = 50;
const KEY_GAP = 6;
const KEY_RADIUS = 6;
const KEYBOARD_PADDING = 20;

// Render Constants
const KEYBOARD_WIDTH = 1000; // Increased to ensure full layout fits (approx 15u + padding)
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

const KeyboardHandsOverlay: React.FC<KeyboardHandsOverlayProps> = ({ currentChar, className = '', heatmapStats }) => {
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

    // Helper to get heat color
    const getHeatColor = (keyLabel: string) => {
        if (!heatmapStats) return null;
        const char = keyLabel.toLowerCase();
        const stat = heatmapStats[char];
        if (!stat || stat.errorCount === 0) return null;

        // Gradient from slight orange to deep red based on error count
        // Cap at 10 errors for max redness
        // We return TAILWIND COLORS suitable for SVG usage if we were using tailwind classes, 
        // but this SVG uses inline classes or styles.
        // 'fill-red-500' works because we likely have tailwind config?
        // But SVG fill needs proper color values if we don't trust classes in complex SVGs.
        // Let's stick to the class approach used in the original component.

        if (stat.errorCount > 5) return 'fill-red-500 dark:fill-red-600';
        if (stat.errorCount > 2) return 'fill-orange-400 dark:fill-orange-500';
        return 'fill-orange-200 dark:fill-orange-800';
    };

    // Active Key Center
    const targetKeyPos = activeKeyId ? getKeyCenter(activeKeyId) : null;
    const activeFingerPos = activeFinger ? getFingerTip(activeFinger) : null;

    return (
        <div className={`w-full flex justify-center ${className}`}>
            <svg
                viewBox="0 0 800 300"
                className="w-full h-auto select-none"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* REMOVED: Redundant Keyboard Base to fix overlap */}

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
                                    const keyX = currentX;
                                    const heatClass = getHeatColor(key.label);

                                    // Update X for next key
                                    currentX += w + KEY_GAP;

                                    return (
                                        <g key={key.id} transform={`translate(${keyX}, ${currentY})`}>
                                            <rect
                                                width={w}
                                                height={h}
                                                rx={6}
                                                className={`
                            transition-all duration-150 stroke-[1.5px]
                            ${isActive
                                                        ? 'fill-[#cfe8ff] dark:fill-blue-900 stroke-[#4a90e2] dark:stroke-blue-500'
                                                        : heatClass
                                                            ? `${heatClass} stroke-red-300 dark:stroke-red-700`
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
                                                        : heatClass
                                                            ? 'fill-red-900 dark:fill-red-100 font-bold'
                                                            : 'fill-[#555555] dark:fill-gray-400 font-medium'
                                                    }
                          `}
                                            >
                                                {key.label}
                                            </text>
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    })}
                </g>

                {/* --- HANDS LAYER --- */}
                {/* 
                   Human-like Hand Construction using individual finger paths.
                   Each finger is a path relative to the hand center.
                */}

                {/* Left Hand */}
                <g transform={`translate(${LEFT_HAND_POS.x}, ${LEFT_HAND_POS.y}) scale(${HAND_SCALE})`}>
                    {/* Palm Base */}
                    <path
                        d="M -40 20 Q -45 50 -20 60 Q 30 60 45 40 Q 50 10 40 -10 Q 0 -10 -40 20"
                        className="fill-[#e0e0e0] dark:fill-gray-700 stroke-[#bbbbbb] dark:stroke-gray-600 stroke-2"
                    />

                    {/* Fingers (Pinky to Thumb) */}
                    {[
                        { id: 'left-pinky', d: "M -40 20 Q -55 -10 -45 -30 Q -35 -35 -25 -20 L -30 20" },
                        { id: 'left-ring', d: "M -25 -10 Q -30 -40 -20 -60 Q -5 -65 0 -40 L -5 -10" },
                        { id: 'left-middle', d: "M -5 -10 Q -5 -50 10 -70 Q 25 -70 25 -40 L 20 -10" },
                        { id: 'left-index', d: "M 20 -10 Q 25 -40 40 -60 Q 55 -55 45 -20 L 35 10" },
                        { id: 'left-thumb', d: "M 35 10 Q 60 10 70 30 Q 75 50 50 50 L 40 40" }
                    ].map(f => {
                        const isActive = f.id === activeFinger || f.id === activeShiftFinger;
                        return (
                            <path
                                key={f.id}
                                d={f.d}
                                className={`
                                    transition-all duration-200 stroke-2
                                    ${isActive
                                        ? 'fill-[#4a90e2] stroke-[#2d68a8] dark:fill-blue-600 dark:stroke-blue-400'
                                        : 'fill-[#e0e0e0] dark:fill-gray-700 stroke-[#bbbbbb] dark:stroke-gray-600'
                                    }
                                `}
                            />
                        );
                    })}
                </g>

                {/* Right Hand (Mirrored logic manually for paths or transform scale-x?) 
                    Transform scale(-1, 1) keeps Y same, flips X. 
                    We need to adjust position to flip around its own center, or just flip the group and translate properly.
                */}
                <g transform={`translate(${RIGHT_HAND_POS.x}, ${RIGHT_HAND_POS.y}) scale(-${HAND_SCALE}, ${HAND_SCALE})`}>
                    {/* Palm Base (Same path, just flipped via group transform) */}
                    <path
                        d="M -40 20 Q -45 50 -20 60 Q 30 60 45 40 Q 50 10 40 -10 Q 0 -10 -40 20"
                        className="fill-[#e0e0e0] dark:fill-gray-700 stroke-[#bbbbbb] dark:stroke-gray-600 stroke-2"
                    />

                    {/* Fingers (Pinky to Thumb - mapped to RIGHT finger IDs) 
                        Note: Since we flipped X, 'left' logic visual applies, but IDs need strictly RIGHT mapping.
                        Left layout was Pinky -> Thumb (Left to Right visually).
                        Flipped X means Left visual becomes Right visual. 
                        So the leftmost path in local coords (Pinky path) becomes Rightmost in global.
                        Wait, standard flip: (-x, y). 
                        Original Left Pinky is at x=-40. Flipped it is at x=40 (Right side). 
                        A Right Pinky is on the Right side of the Right Hand. 
                        So Left Pinky path -> Right Pinky visual location.
                    */}
                    {[
                        { id: 'right-pinky', d: "M -40 20 Q -55 -10 -45 -30 Q -35 -35 -25 -20 L -30 20" }, // Far Left in local = Far Right in global (Pinky)
                        { id: 'right-ring', d: "M -25 -10 Q -30 -40 -20 -60 Q -5 -65 0 -40 L -5 -10" },
                        { id: 'right-middle', d: "M -5 -10 Q -5 -50 10 -70 Q 25 -70 25 -40 L 20 -10" },
                        { id: 'right-index', d: "M 20 -10 Q 25 -40 40 -60 Q 55 -55 45 -20 L 35 10" },
                        { id: 'right-thumb', d: "M 35 10 Q 60 10 70 30 Q 75 50 50 50 L 40 40" }
                    ].map(f => {
                        const isActive = f.id === activeFinger || f.id === activeShiftFinger;
                        return (
                            <path
                                key={f.id}
                                d={f.d}
                                className={`
                                    transition-all duration-200 stroke-2
                                    ${isActive
                                        ? 'fill-[#4a90e2] stroke-[#2d68a8] dark:fill-blue-600 dark:stroke-blue-400'
                                        : 'fill-[#e0e0e0] dark:fill-gray-700 stroke-[#bbbbbb] dark:stroke-gray-600'
                                    }
                                `}
                            />
                        );
                    })}
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
