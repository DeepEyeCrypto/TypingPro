export type FingerId =
    | 'LP' | 'LR' | 'LM' | 'LI' | 'LT'
    | 'RP' | 'RR' | 'RM' | 'RI' | 'RT'

export interface KeyMapping {
    finger: FingerId,
    x: number,
    y: number,
    row: number
}

export const KEY_MAP: Record<string, KeyMapping> = {
    // Row 1 (Numbers)
    '1': { finger: 'LP', x: 20, y: 0, row: 1 },
    '2': { finger: 'LP', x: 60, y: 0, row: 1 },
    '3': { finger: 'LR', x: 100, y: 0, row: 1 },
    '4': { finger: 'LM', x: 140, y: 0, row: 1 },
    '5': { finger: 'LI', x: 180, y: 0, row: 1 },
    '6': { finger: 'LI', x: 220, y: 0, row: 1 },
    '7': { finger: 'RI', x: 260, y: 0, row: 1 },
    '8': { finger: 'RI', x: 300, y: 0, row: 1 },
    '9': { finger: 'RM', x: 340, y: 0, row: 1 },
    '0': { finger: 'RR', x: 380, y: 0, row: 1 },
    '-': { finger: 'RP', x: 420, y: 0, row: 1 },
    '=': { finger: 'RP', x: 460, y: 0, row: 1 },

    // Row 2 (Top Row)
    'q': { finger: 'LP', x: 30, y: 40, row: 2 },
    'w': { finger: 'LR', x: 70, y: 40, row: 2 },
    'e': { finger: 'LM', x: 110, y: 40, row: 2 },
    'r': { finger: 'LI', x: 150, y: 40, row: 2 },
    't': { finger: 'LI', x: 190, y: 40, row: 2 },
    'y': { finger: 'RI', x: 230, y: 40, row: 2 },
    'u': { finger: 'RI', x: 270, y: 40, row: 2 },
    'i': { finger: 'RM', x: 310, y: 40, row: 2 },
    'o': { finger: 'RR', x: 350, y: 40, row: 2 },
    'p': { finger: 'RP', x: 390, y: 40, row: 2 },
    '[': { finger: 'RP', x: 430, y: 40, row: 2 },
    ']': { finger: 'RP', x: 470, y: 40, row: 2 },

    // Row 3 (Home Row)
    'a': { finger: 'LP', x: 40, y: 80, row: 3 },
    's': { finger: 'LR', x: 80, y: 80, row: 3 },
    'd': { finger: 'LM', x: 120, y: 80, row: 3 },
    'f': { finger: 'LI', x: 160, y: 80, row: 3 },
    'g': { finger: 'LI', x: 200, y: 80, row: 3 },
    'h': { finger: 'RI', x: 240, y: 80, row: 3 },
    'j': { finger: 'RI', x: 280, y: 80, row: 3 },
    'k': { finger: 'RM', x: 320, y: 80, row: 3 },
    'l': { finger: 'RR', x: 360, y: 80, row: 3 },
    ';': { finger: 'RP', x: 400, y: 80, row: 3 },
    "'": { finger: 'RP', x: 440, y: 80, row: 3 },

    // Row 4 (Bottom Row)
    'z': { finger: 'LP', x: 50, y: 120, row: 4 },
    'x': { finger: 'LR', x: 90, y: 120, row: 4 },
    'c': { finger: 'LM', x: 130, y: 120, row: 4 },
    'v': { finger: 'LI', x: 170, y: 120, row: 4 },
    'b': { finger: 'LI', x: 210, y: 120, row: 4 },
    'n': { finger: 'RI', x: 250, y: 120, row: 4 },
    'm': { finger: 'RI', x: 290, y: 120, row: 4 },
    ',': { finger: 'RM', x: 330, y: 120, row: 4 },
    '.': { finger: 'RR', x: 370, y: 120, row: 4 },
    '/': { finger: 'RP', x: 410, y: 120, row: 4 },
    ' ': { finger: 'LT', x: 230, y: 160, row: 5 }
}

export const FINGER_HOME: Record<FingerId, { x: number, y: number }> = {
    LP: { x: 40, y: 80 },
    LR: { x: 80, y: 80 },
    LM: { x: 120, y: 80 },
    LI: { x: 160, y: 80 },
    LT: { x: 180, y: 160 },
    RP: { x: 400, y: 80 },
    RR: { x: 360, y: 80 },
    RM: { x: 320, y: 80 },
    RI: { x: 280, y: 80 },
    RT: { x: 280, y: 160 }
}
