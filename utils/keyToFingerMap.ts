
export type Finger =
    | 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'left-thumb'
    | 'right-thumb' | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky';

export interface KeyConfig {
    id: string; // Unique ID for finding the SVG element (e.g., 'key-q')
    label: string; // Display label
    code: string; // Physical key code (event.code) or char
    finger: Finger | null; // Which finger presses this key
    width?: number; // Width relative to standard key (1 unit = 40px usually)
    x?: number; // computed x position
    y?: number; // computed y position
}

// Standard QWERTY Layout Definitions
// Each row is an array of Key configurations

const ROW_1: KeyConfig[] = [
    { id: 'key-backtick', label: '`', code: 'Backquote', finger: 'left-pinky' },
    { id: 'key-1', label: '1', code: 'Digit1', finger: 'left-pinky' },
    { id: 'key-2', label: '2', code: 'Digit2', finger: 'left-ring' },
    { id: 'key-3', label: '3', code: 'Digit3', finger: 'left-middle' },
    { id: 'key-4', label: '4', code: 'Digit4', finger: 'left-index' },
    { id: 'key-5', label: '5', code: 'Digit5', finger: 'left-index' },
    { id: 'key-6', label: '6', code: 'Digit6', finger: 'right-index' },
    { id: 'key-7', label: '7', code: 'Digit7', finger: 'right-index' },
    { id: 'key-8', label: '8', code: 'Digit8', finger: 'right-middle' },
    { id: 'key-9', label: '9', code: 'Digit9', finger: 'right-ring' },
    { id: 'key-0', label: '0', code: 'Digit0', finger: 'right-pinky' },
    { id: 'key-minus', label: '-', code: 'Minus', finger: 'right-pinky' },
    { id: 'key-equal', label: '=', code: 'Equal', finger: 'right-pinky' },
    { id: 'key-backspace', label: '⌫', code: 'Backspace', finger: 'right-pinky', width: 2.0 }, // slightly wider
];

const ROW_2: KeyConfig[] = [
    { id: 'key-tab', label: 'Tab', code: 'Tab', finger: 'left-pinky', width: 1.5 },
    { id: 'key-q', label: 'Q', code: 'KeyQ', finger: 'left-pinky' },
    { id: 'key-w', label: 'W', code: 'KeyW', finger: 'left-ring' },
    { id: 'key-e', label: 'E', code: 'KeyE', finger: 'left-middle' },
    { id: 'key-r', label: 'R', code: 'KeyR', finger: 'left-index' },
    { id: 'key-t', label: 'T', code: 'KeyT', finger: 'left-index' },
    { id: 'key-y', label: 'Y', code: 'KeyY', finger: 'right-index' },
    { id: 'key-u', label: 'U', code: 'KeyU', finger: 'right-index' },
    { id: 'key-i', label: 'I', code: 'KeyI', finger: 'right-middle' },
    { id: 'key-o', label: 'O', code: 'KeyO', finger: 'right-ring' },
    { id: 'key-p', label: 'P', code: 'KeyP', finger: 'right-pinky' },
    { id: 'key-lbracket', label: '[', code: 'BracketLeft', finger: 'right-pinky' },
    { id: 'key-rbracket', label: ']', code: 'BracketRight', finger: 'right-pinky' },
    { id: 'key-backslash', label: '\\', code: 'Backslash', finger: 'right-pinky', width: 1.5 },
];

const ROW_3: KeyConfig[] = [
    { id: 'key-caps', label: 'Caps', code: 'CapsLock', finger: 'left-pinky', width: 1.8 },
    { id: 'key-a', label: 'A', code: 'KeyA', finger: 'left-pinky' },
    { id: 'key-s', label: 'S', code: 'KeyS', finger: 'left-ring' },
    { id: 'key-d', label: 'D', code: 'KeyD', finger: 'left-middle' },
    { id: 'key-f', label: 'F', code: 'KeyF', finger: 'left-index' },
    { id: 'key-g', label: 'G', code: 'KeyG', finger: 'left-index' },
    { id: 'key-h', label: 'H', code: 'KeyH', finger: 'right-index' },
    { id: 'key-j', label: 'J', code: 'KeyJ', finger: 'right-index' },
    { id: 'key-k', label: 'K', code: 'KeyK', finger: 'right-middle' },
    { id: 'key-l', label: 'L', code: 'KeyL', finger: 'right-ring' },
    { id: 'key-semicolon', label: ';', code: 'Semicolon', finger: 'right-pinky' },
    { id: 'key-quote', label: "'", code: 'Quote', finger: 'right-pinky' },
    { id: 'key-enter', label: 'Enter', code: 'Enter', finger: 'right-pinky', width: 2.2 },
];

const ROW_4: KeyConfig[] = [
    { id: 'key-lshift', label: 'Shift', code: 'ShiftLeft', finger: 'left-pinky', width: 2.4 },
    { id: 'key-z', label: 'Z', code: 'KeyZ', finger: 'left-pinky' },
    { id: 'key-x', label: 'X', code: 'KeyX', finger: 'left-ring' },
    { id: 'key-c', label: 'C', code: 'KeyC', finger: 'left-middle' },
    { id: 'key-v', label: 'V', code: 'KeyV', finger: 'left-index' },
    { id: 'key-b', label: 'B', code: 'KeyB', finger: 'left-index' },
    { id: 'key-n', label: 'N', code: 'KeyN', finger: 'right-index' },
    { id: 'key-m', label: 'M', code: 'KeyM', finger: 'right-index' },
    { id: 'key-comma', label: ',', code: 'Comma', finger: 'right-middle' },
    { id: 'key-dot', label: '.', code: 'Period', finger: 'right-ring' },
    { id: 'key-slash', label: '/', code: 'Slash', finger: 'right-pinky' },
    { id: 'key-rshift', label: 'Shift', code: 'ShiftRight', finger: 'right-pinky', width: 2.6 },
];

const ROW_5: KeyConfig[] = [
    { id: 'key-space', label: ' ', code: 'Space', finger: 'right-thumb', width: 6.0 }, // Space bar
];

export const KEYBOARD_ROWS = [ROW_1, ROW_2, ROW_3, ROW_4, ROW_5];

// Map character to KeyConfig
export function getKeyForChar(char: string | null): string | null {
    if (!char) return null;
    const lower = char.toLowerCase();

    // Find key by label (approximate match) or specific overrides

    // Map symbols to their base keys (for highlighting)
    const symbolMap: Record<string, string> = {
        '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
        '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'", '<': ',', '>': '.', '?': '/'
    };

    const targetLabel = symbolMap[char] || lower;

    // Search
    for (const row of KEYBOARD_ROWS) {
        for (const key of row) {
            if (key.label.toLowerCase() === targetLabel) {
                return key.id;
            }
            // Special cases
            if (key.code === 'Space' && char === ' ') return key.id;
        }
    }
    return null;
}

export function getFingerForKeyId(keyId: string): Finger | null {
    for (const row of KEYBOARD_ROWS) {
        const key = row.find(k => k.id === keyId);
        if (key) return key.finger;
    }
    return null;
}

// Special check for Shift requirement
export function requiresShift(char: string | null): boolean {
    if (!char) return false;
    return /[A-Z!@#$%^&*()_+{}:"<>?~|]/.test(char);
}
