export type Finger = 'pinky-left' | 'ring-left' | 'middle-left' | 'index-left' | 'thumb-left' | 'thumb-right' | 'index-right' | 'middle-right' | 'ring-right' | 'pinky-right';

export interface KeyData {
    id: string; // "kA", "kSpace"
    label: string;
    row: number; // 0-3 (0 is top row QWERTY)
    width?: number; // relative width unit (1 = standard key)
    finger: Finger;
}

// Very basic QWERTY mapping for demo purposes
// In a real app we'd map every key code.
export const KEYBOARD_LAYOUT: KeyData[][] = [
    // ROW 1
    [
        { id: 'Backquote', label: '`', row: 0, finger: 'pinky-left' },
        { id: 'Digit1', label: '1', row: 0, finger: 'pinky-left' },
        { id: 'Digit2', label: '2', row: 0, finger: 'ring-left' },
        { id: 'Digit3', label: '3', row: 0, finger: 'middle-left' },
        { id: 'Digit4', label: '4', row: 0, finger: 'index-left' },
        { id: 'Digit5', label: '5', row: 0, finger: 'index-left' },
        { id: 'Digit6', label: '6', row: 0, finger: 'index-right' },
        { id: 'Digit7', label: '7', row: 0, finger: 'index-right' },
        { id: 'Digit8', label: '8', row: 0, finger: 'middle-right' },
        { id: 'Digit9', label: '9', row: 0, finger: 'ring-right' },
        { id: 'Digit0', label: '0', row: 0, finger: 'pinky-right' },
        { id: 'Minus', label: '-', row: 0, finger: 'pinky-right' },
        { id: 'Equal', label: '=', row: 0, finger: 'pinky-right' },
        { id: 'Backspace', label: '⌫', row: 0, width: 2, finger: 'pinky-right' },
    ],
    // ROW 2
    [
        { id: 'Tab', label: 'Tab', row: 1, width: 1.5, finger: 'pinky-left' },
        { id: 'KeyQ', label: 'Q', row: 1, finger: 'pinky-left' },
        { id: 'KeyW', label: 'W', row: 1, finger: 'ring-left' },
        { id: 'KeyE', label: 'E', row: 1, finger: 'middle-left' },
        { id: 'KeyR', label: 'R', row: 1, finger: 'index-left' },
        { id: 'KeyT', label: 'T', row: 1, finger: 'index-left' },
        { id: 'KeyY', label: 'Y', row: 1, finger: 'index-right' },
        { id: 'KeyU', label: 'U', row: 1, finger: 'index-right' },
        { id: 'KeyI', label: 'I', row: 1, finger: 'middle-right' },
        { id: 'KeyO', label: 'O', row: 1, finger: 'ring-right' },
        { id: 'KeyP', label: 'P', row: 1, finger: 'pinky-right' },
        { id: 'BracketLeft', label: '[', row: 1, finger: 'pinky-right' },
        { id: 'BracketRight', label: ']', row: 1, finger: 'pinky-right' },
        { id: 'Backslash', label: '\\', row: 1, width: 1.5, finger: 'pinky-right' },
    ],
    // ROW 3
    [
        { id: 'CapsLock', label: 'Caps', row: 2, width: 1.8, finger: 'pinky-left' },
        { id: 'KeyA', label: 'A', row: 2, finger: 'pinky-left' },
        { id: 'KeyS', label: 'S', row: 2, finger: 'ring-left' },
        { id: 'KeyD', label: 'D', row: 2, finger: 'middle-left' },
        { id: 'KeyF', label: 'F', row: 2, finger: 'index-left' },
        { id: 'KeyG', label: 'G', row: 2, finger: 'index-left' },
        { id: 'KeyH', label: 'H', row: 2, finger: 'index-right' },
        { id: 'KeyJ', label: 'J', row: 2, finger: 'index-right' },
        { id: 'KeyK', label: 'K', row: 2, finger: 'middle-right' },
        { id: 'KeyL', label: 'L', row: 2, finger: 'ring-right' },
        { id: 'Semicolon', label: ';', row: 2, finger: 'pinky-right' },
        { id: 'Quote', label: '\'', row: 2, finger: 'pinky-right' },
        { id: 'Enter', label: 'Enter', row: 2, width: 2.2, finger: 'pinky-right' },
    ],
    // ROW 4
    [
        { id: 'ShiftLeft', label: 'Shift', row: 3, width: 2.4, finger: 'pinky-left' },
        { id: 'KeyZ', label: 'Z', row: 3, finger: 'pinky-left' },
        { id: 'KeyX', label: 'X', row: 3, finger: 'ring-left' },
        { id: 'KeyC', label: 'C', row: 3, finger: 'middle-left' },
        { id: 'KeyV', label: 'V', row: 3, finger: 'index-left' },
        { id: 'KeyB', label: 'B', row: 3, finger: 'index-left' },
        { id: 'KeyN', label: 'N', row: 3, finger: 'index-right' },
        { id: 'KeyM', label: 'M', row: 3, finger: 'index-right' },
        { id: 'Comma', label: ',', row: 3, finger: 'middle-right' },
        { id: 'Period', label: '.', row: 3, finger: 'ring-right' },
        { id: 'Slash', label: '/', row: 3, finger: 'pinky-right' },
        { id: 'ShiftRight', label: 'Shift', row: 3, width: 2.4, finger: 'pinky-right' },
    ],
    // ROW 5 (Space)
    [
        // Simplify row 5
        { id: 'Space', label: '', row: 4, width: 6.2, finger: 'thumb-right' }, // or left
    ]
];

export const getFingerForKey = (char: string | null): Finger | null => {
    if (!char) return null;
    const upper = char.toUpperCase();
    // Find key in layout
    for (const row of KEYBOARD_LAYOUT) {
        for (const key of row) {
            // Simple heuristic matching
            if (key.label === upper) return key.finger;
            // Space
            if (char === ' ' && key.id === 'Space') return key.finger;
            // Punctuation exact match
            if (key.label === char) return key.finger;
        }
    }
    return null;
};

export const getKeyIdForChar = (char: string | null): string | null => {
    if (!char) return null;
    if (char === ' ') return 'Space';
    const upper = char.toUpperCase();

    // Map alphanumeric
    if (/^[A-Z0-9]$/.test(upper)) {
        if (/[0-9]/.test(upper)) return `Digit${upper}`;
        return `Key${upper}`;
    }

    // Common punctuation map
    const punctMap: Record<string, string> = {
        ',': 'Comma', '.': 'Period', '/': 'Slash',
        ';': 'Semicolon', '\'': 'Quote',
        '[': 'BracketLeft', ']': 'BracketRight', '\\': 'Backslash',
        '-': 'Minus', '=': 'Equal', '`': 'Backquote'
    };
    return punctMap[char] || null;
};
