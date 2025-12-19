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
const LEFT_PALM_PATH = "M -20 -35 C -40 -35 -60 -15 -60 5 L -60 15 C -60 30 -35 40 -15 40 L 15 40 C 35 40 60 30 60 15 L 60 0 C 60 -20 40 -35 20 -35 Z";
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
        let currentY = KEYBOARD_PADDING + 80;
        for (const row of KEYBOARD_ROWS) {
            let currentX = KEYBOARD_PADDING + 50;
            if (row === KEYBOARD_ROWS[4]) currentX = KEYBOARD_PADDING + 200;
            for (const key of row) {
                const w = (key.width || 1) * KEY_BASE_SIZE;
                if (key.id === keyId) return { x: currentX + w / 2, y: currentY + KEY_BASE_SIZE / 2 };
                currentX += w + KEY_GAP;
            }
            currentY += KEY_BASE_SIZE + KEY_GAP;
        }
        return null;
    };

    // 3. Helper to get coordinates of a finger tip
    const getFingerTip = (finger: Finger): { x: number, y: number } | null => {
        const isLeft = finger.startsWith('left');
        const basePos = isLeft ? LEFT_HAND_POS : RIGHT_HAND_POS;
        const coords = FINGER_COORDS[finger];
        if (!coords) return null;
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

                {/* REMOVED: Redundant Keyboard visuals to fix overlap issue */}

                {/* --- HANDS LAYER --- */}
                <g transform={`translate(${LEFT_HAND_POS.x}, ${LEFT_HAND_POS.y}) scale(${HAND_SCALE})`}>
                    <path
                        d="M -40 20 Q -45 50 -20 60 Q 30 60 45 40 Q 50 10 40 -10 Q 0 -10 -40 20"
                        className="fill-[#e0e0e0] dark:fill-gray-700 stroke-[#bbbbbb] dark:stroke-gray-600 stroke-2"
                    />
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
                                className={`transition-all duration-200 stroke-2 ${isActive ? 'fill-[#4a90e2] stroke-[#2d68a8] dark:fill-blue-600 dark:stroke-blue-400' : 'fill-[#e0e0e0] dark:fill-gray-700 stroke-[#bbbbbb] dark:stroke-gray-600'}`}
                            />
                        );
                    })}
                </g>

                <g transform={`translate(${RIGHT_HAND_POS.x}, ${RIGHT_HAND_POS.y}) scale(-${HAND_SCALE}, ${HAND_SCALE})`}>
                    <path
                        d="M -40 20 Q -45 50 -20 60 Q 30 60 45 40 Q 50 10 40 -10 Q 0 -10 -40 20"
                        className="fill-[#e0e0e0] dark:fill-gray-700 stroke-[#bbbbbb] dark:stroke-gray-600 stroke-2"
                    />
                    {[
                        { id: 'right-pinky', d: "M -40 20 Q -55 -10 -45 -30 Q -35 -35 -25 -20 L -30 20" },
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
                                className={`transition-all duration-200 stroke-2 ${isActive ? 'fill-[#4a90e2] stroke-[#2d68a8] dark:fill-blue-600 dark:stroke-blue-400' : 'fill-[#e0e0e0] dark:fill-gray-700 stroke-[#bbbbbb] dark:stroke-gray-600'}`}
                            />
                        );
                    })}
                </g>

            </svg>
        </div>
    );
};

export default React.memo(KeyboardHandsOverlay);
