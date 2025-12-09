
import { Lesson, Badge, KeyboardLayoutType, HistoryEntry, LessonProgress } from './types';

export const COLORS = {
  header: '#ffffff', // White/Translucent
  headerDark: '#111827', // Dark Gray
  inputBorder: '#E5E7EB',
  inputBorderDark: '#374151',
  keyBase: '#FFFFFF', 
  keyBaseDark: '#1F2937',
  keyActive: '#007AFF', 
  keySuccess: '#34C759', 
  error: '#FF3B30', 
  text: '#1F2937',
  textDark: '#F3F4F6',
  windowBg: '#F5F5F7',
  windowBgDark: '#0B1120'
};

export const FANCY_FONTS = [
    { name: 'Default (Inter)', family: 'Inter', category: 'Sans', url: '' },
    { name: 'Allura', family: 'Allura', category: 'Script', url: 'https://fonts.googleapis.com/css2?family=Allura&display=swap' },
    { name: 'Great Vibes', family: 'Great Vibes', category: 'Script', url: 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap' },
    { name: 'Dancing Script', family: 'Dancing Script', category: 'Script', url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap' },
    { name: 'Sacramento', family: 'Sacramento', category: 'Script', url: 'https://fonts.googleapis.com/css2?family=Sacramento&display=swap' },
    { name: 'Parisienne', family: 'Parisienne', category: 'Script', url: 'https://fonts.googleapis.com/css2?family=Parisienne&display=swap' },
    { name: 'Cinzel', family: 'Cinzel', category: 'Serif', url: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap' },
    { name: 'Old Standard TT', family: 'Old Standard TT', category: 'Serif', url: 'https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap' },
    { name: 'Libre Baskerville', family: 'Libre Baskerville', category: 'Serif', url: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap' },
    { name: 'Zilla Slab', family: 'Zilla Slab', category: 'Slab', url: 'https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@400;700&display=swap' },
    { name: 'Tecton (Teko)', family: 'Teko', category: 'Display', url: 'https://fonts.googleapis.com/css2?family=Teko:wght@400;600&display=swap' } // Using Teko as valid Google Font alternative
];

export const SECTIONS = [
    { title: "Home Row", range: "1 - 23", active: true },
    { title: "Top Row", range: "24 - 51", active: false },
    { title: "Bottom Row", range: "52 - 88", active: false },
    { title: "Basic Level 1", range: "89 - 126", active: false },
    { title: "Tricky Words 1", range: "127 - 137", active: false },
    { title: "Shift Key", range: "138 - 191", active: false },
    { title: "Common Patterns", range: "192 - 202", active: false },
    { title: "Numbers", range: "245 - 274", active: false },
    { title: "Symbols", range: "317 - 346", active: false },
];

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Keys f & j",
    description: "Home Row Anchors",
    keys: ['f', 'j'],
    content: "jj ff jf fj jfjf fjfj ffff jjjj fff jjj jf jf jf jf ff jj fj jf ff jj jf fj ff jj"
  },
  {
    id: 2,
    title: "Space Bar",
    description: "Thumbs",
    keys: ['f', 'j', ' '],
    content: "jj ff jf fj j j f f jf jf ff jj f f j j jf jf j f j f ff jj jf fj"
  },
  {
    id: 3,
    title: "Review f & j",
    description: "Speed Building",
    keys: ['f', 'j', ' '],
    content: "jf jf ff jj f j f j ff jj jj ff jf jf f f j j jf fj jf fj"
  },
  {
    id: 4,
    title: "Keys d & k",
    description: "Middle Fingers",
    keys: ['d', 'k', ' '],
    content: "dd kk dk kd dkdk kdkd dddd kkkk ddd kkk dk dk dk dk dd kk dk kd dd kk dk kd dd kk"
  },
  {
    id: 5,
    title: "Review d & k",
    description: "Pattern Mix",
    keys: ['d', 'k', 'f', 'j', ' '],
    content: "df jk df jk dd ff kk jj d f j k dk fj kd jf df jk kd jf d k f j"
  },
  {
    id: 6,
    title: "Practice All",
    description: "Mastery",
    keys: ['f', 'j', 'd', 'k', ' '],
    content: "dad fad kad jak dak all fall jaffa flask ask add dad lad fall salads dad all salads fall"
  }
];

// Physical layout definition (Row 0-4)
// We use a 'code' to map physical keys to characters based on layout
export const KEYBOARD_ROWS = [
  [
    { code: 'Backquote', width: 1, finger: 'left-pinky' },
    { code: 'Digit1', width: 1, finger: 'left-pinky' },
    { code: 'Digit2', width: 1, finger: 'left-ring' },
    { code: 'Digit3', width: 1, finger: 'left-middle' },
    { code: 'Digit4', width: 1, finger: 'left-index' },
    { code: 'Digit5', width: 1, finger: 'left-index' },
    { code: 'Digit6', width: 1, finger: 'right-index' },
    { code: 'Digit7', width: 1, finger: 'right-index' },
    { code: 'Digit8', width: 1, finger: 'right-middle' },
    { code: 'Digit9', width: 1, finger: 'right-ring' },
    { code: 'Digit0', width: 1, finger: 'right-pinky' },
    { code: 'Minus', width: 1, finger: 'right-pinky' },
    { code: 'Equal', width: 1, finger: 'right-pinky' },
    { code: 'Backspace', width: 2, finger: 'right-pinky', label: 'Backspace' }
  ],
  [
    { code: 'Tab', width: 1.5, finger: 'left-pinky', label: 'Tab' },
    { code: 'KeyQ', width: 1, finger: 'left-pinky' },
    { code: 'KeyW', width: 1, finger: 'left-ring' },
    { code: 'KeyE', width: 1, finger: 'left-middle' },
    { code: 'KeyR', width: 1, finger: 'left-index' },
    { code: 'KeyT', width: 1, finger: 'left-index' },
    { code: 'KeyY', width: 1, finger: 'right-index' },
    { code: 'KeyU', width: 1, finger: 'right-index' },
    { code: 'KeyI', width: 1, finger: 'right-middle' },
    { code: 'KeyO', width: 1, finger: 'right-ring' },
    { code: 'KeyP', width: 1, finger: 'right-pinky' },
    { code: 'BracketLeft', width: 1, finger: 'right-pinky' },
    { code: 'BracketRight', width: 1, finger: 'right-pinky' },
    { code: 'Backslash', width: 1.5, finger: 'right-pinky' }
  ],
  [
    { code: 'CapsLock', width: 1.8, finger: 'left-pinky', label: 'Caps' },
    { code: 'KeyA', width: 1, finger: 'left-pinky' },
    { code: 'KeyS', width: 1, finger: 'left-ring' },
    { code: 'KeyD', width: 1, finger: 'left-middle' },
    { code: 'KeyF', width: 1, finger: 'left-index', homing: true },
    { code: 'KeyG', width: 1, finger: 'left-index' },
    { code: 'KeyH', width: 1, finger: 'right-index' },
    { code: 'KeyJ', width: 1, finger: 'right-index', homing: true },
    { code: 'KeyK', width: 1, finger: 'right-middle' },
    { code: 'KeyL', width: 1, finger: 'right-ring' },
    { code: 'Semicolon', width: 1, finger: 'right-pinky' },
    { code: 'Quote', width: 1, finger: 'right-pinky' },
    { code: 'Enter', width: 2.2, finger: 'right-pinky', label: 'Enter' }
  ],
  [
    { code: 'ShiftLeft', width: 2.4, finger: 'left-pinky', label: 'Shift' },
    { code: 'KeyZ', width: 1, finger: 'left-pinky' },
    { code: 'KeyX', width: 1, finger: 'left-ring' },
    { code: 'KeyC', width: 1, finger: 'left-middle' },
    { code: 'KeyV', width: 1, finger: 'left-index' },
    { code: 'KeyB', width: 1, finger: 'left-index' },
    { code: 'KeyN', width: 1, finger: 'right-index' },
    { code: 'KeyM', width: 1, finger: 'right-index' },
    { code: 'Comma', width: 1, finger: 'right-middle' },
    { code: 'Period', width: 1, finger: 'right-ring' },
    { code: 'Slash', width: 1, finger: 'right-pinky' },
    { code: 'ShiftRight', width: 2.4, finger: 'right-pinky', label: 'Shift' }
  ],
  [
    { code: 'Space', width: 6.2, finger: 'thumb', label: 'Space' }
  ]
];

// Layout Mappings: code -> { default, shift }
// This allows visual switching of keyboard layout
export const LAYOUTS: Record<KeyboardLayoutType, Record<string, { default: string, shift: string }>> = {
    qwerty: {
        Backquote: { default: '`', shift: '~' }, Digit1: { default: '1', shift: '!' }, Digit2: { default: '2', shift: '@' }, Digit3: { default: '3', shift: '#' }, Digit4: { default: '4', shift: '$' }, Digit5: { default: '5', shift: '%' }, Digit6: { default: '6', shift: '^' }, Digit7: { default: '7', shift: '&' }, Digit8: { default: '8', shift: '*' }, Digit9: { default: '9', shift: '(' }, Digit0: { default: '0', shift: ')' }, Minus: { default: '-', shift: '_' }, Equal: { default: '=', shift: '+' },
        KeyQ: { default: 'q', shift: 'Q' }, KeyW: { default: 'w', shift: 'W' }, KeyE: { default: 'e', shift: 'E' }, KeyR: { default: 'r', shift: 'R' }, KeyT: { default: 't', shift: 'T' }, KeyY: { default: 'y', shift: 'Y' }, KeyU: { default: 'u', shift: 'U' }, KeyI: { default: 'i', shift: 'I' }, KeyO: { default: 'o', shift: 'O' }, KeyP: { default: 'p', shift: 'P' }, BracketLeft: { default: '[', shift: '{' }, BracketRight: { default: ']', shift: '}' }, Backslash: { default: '\\', shift: '|' },
        KeyA: { default: 'a', shift: 'A' }, KeyS: { default: 's', shift: 'S' }, KeyD: { default: 'd', shift: 'D' }, KeyF: { default: 'f', shift: 'F' }, KeyG: { default: 'g', shift: 'G' }, KeyH: { default: 'h', shift: 'H' }, KeyJ: { default: 'j', shift: 'J' }, KeyK: { default: 'k', shift: 'K' }, KeyL: { default: 'l', shift: 'L' }, Semicolon: { default: ';', shift: ':' }, Quote: { default: "'", shift: '"' },
        KeyZ: { default: 'z', shift: 'Z' }, KeyX: { default: 'x', shift: 'X' }, KeyC: { default: 'c', shift: 'C' }, KeyV: { default: 'v', shift: 'V' }, KeyB: { default: 'b', shift: 'B' }, KeyN: { default: 'n', shift: 'N' }, KeyM: { default: 'm', shift: 'M' }, Comma: { default: ',', shift: '<' }, Period: { default: '.', shift: '>' }, Slash: { default: '/', shift: '?' }, Space: { default: ' ', shift: ' ' }
    },
    dvorak: {
        Backquote: { default: '`', shift: '~' }, Digit1: { default: '1', shift: '!' }, Digit2: { default: '2', shift: '@' }, Digit3: { default: '3', shift: '#' }, Digit4: { default: '4', shift: '$' }, Digit5: { default: '5', shift: '%' }, Digit6: { default: '6', shift: '^' }, Digit7: { default: '7', shift: '&' }, Digit8: { default: '8', shift: '*' }, Digit9: { default: '9', shift: '(' }, Digit0: { default: '0', shift: ')' }, Minus: { default: '[', shift: '{' }, Equal: { default: ']', shift: '}' },
        KeyQ: { default: "'", shift: '"' }, KeyW: { default: ',', shift: '<' }, KeyE: { default: '.', shift: '>' }, KeyR: { default: 'p', shift: 'P' }, KeyT: { default: 'y', shift: 'Y' }, KeyY: { default: 'f', shift: 'F' }, KeyU: { default: 'g', shift: 'G' }, KeyI: { default: 'c', shift: 'C' }, KeyO: { default: 'r', shift: 'R' }, KeyP: { default: 'l', shift: 'L' }, BracketLeft: { default: '/', shift: '?' }, BracketRight: { default: '=', shift: '+' }, Backslash: { default: '\\', shift: '|' },
        KeyA: { default: 'a', shift: 'A' }, KeyS: { default: 'o', shift: 'O' }, KeyD: { default: 'e', shift: 'E' }, KeyF: { default: 'u', shift: 'U' }, KeyG: { default: 'i', shift: 'I' }, KeyH: { default: 'd', shift: 'D' }, KeyJ: { default: 'h', shift: 'H' }, KeyK: { default: 't', shift: 'T' }, KeyL: { default: 'n', shift: 'N' }, Semicolon: { default: 's', shift: 'S' }, Quote: { default: '-', shift: '_' },
        KeyZ: { default: ';', shift: ':' }, KeyX: { default: 'q', shift: 'Q' }, KeyC: { default: 'j', shift: 'J' }, KeyV: { default: 'k', shift: 'K' }, KeyB: { default: 'x', shift: 'X' }, KeyN: { default: 'b', shift: 'B' }, KeyM: { default: 'm', shift: 'M' }, Comma: { default: 'w', shift: 'W' }, Period: { default: 'v', shift: 'V' }, Slash: { default: 'z', shift: 'Z' }, Space: { default: ' ', shift: ' ' }
    },
    colemak: {
        Backquote: { default: '`', shift: '~' }, Digit1: { default: '1', shift: '!' }, Digit2: { default: '2', shift: '@' }, Digit3: { default: '3', shift: '#' }, Digit4: { default: '4', shift: '$' }, Digit5: { default: '5', shift: '%' }, Digit6: { default: '6', shift: '^' }, Digit7: { default: '7', shift: '&' }, Digit8: { default: '8', shift: '*' }, Digit9: { default: '9', shift: '(' }, Digit0: { default: '0', shift: ')' }, Minus: { default: '-', shift: '_' }, Equal: { default: '=', shift: '+' },
        KeyQ: { default: 'q', shift: 'Q' }, KeyW: { default: 'w', shift: 'W' }, KeyE: { default: 'f', shift: 'F' }, KeyR: { default: 'p', shift: 'P' }, KeyT: { default: 'g', shift: 'G' }, KeyY: { default: 'j', shift: 'J' }, KeyU: { default: 'l', shift: 'L' }, KeyI: { default: 'u', shift: 'U' }, KeyO: { default: 'y', shift: 'Y' }, KeyP: { default: ';', shift: ':' }, BracketLeft: { default: '[', shift: '{' }, BracketRight: { default: ']', shift: '}' }, Backslash: { default: '\\', shift: '|' },
        KeyA: { default: 'a', shift: 'A' }, KeyS: { default: 'r', shift: 'R' }, KeyD: { default: 's', shift: 'S' }, KeyF: { default: 't', shift: 'T' }, KeyG: { default: 'd', shift: 'D' }, KeyH: { default: 'h', shift: 'H' }, KeyJ: { default: 'n', shift: 'N' }, KeyK: { default: 'e', shift: 'E' }, KeyL: { default: 'i', shift: 'I' }, Semicolon: { default: 'o', shift: 'O' }, Quote: { default: "'", shift: '"' },
        KeyZ: { default: 'z', shift: 'Z' }, KeyX: { default: 'x', shift: 'X' }, KeyC: { default: 'c', shift: 'C' }, KeyV: { default: 'v', shift: 'V' }, KeyB: { default: 'b', shift: 'B' }, KeyN: { default: 'k', shift: 'K' }, KeyM: { default: 'm', shift: 'M' }, Comma: { default: ',', shift: '<' }, Period: { default: '.', shift: '>' }, Slash: { default: '/', shift: '?' }, Space: { default: ' ', shift: ' ' }
    }
};

export const BADGES: Badge[] = [
    {
        id: 'beginner',
        title: 'First Steps',
        description: 'Complete your first lesson.',
        icon: 'Footprints',
        condition: (h, p) => h.length >= 1
    },
    {
        id: 'speedster',
        title: 'Speed Demon',
        description: 'Achieve 60+ WPM in a lesson.',
        icon: 'Zap',
        condition: (h, p) => h.some(e => e.wpm >= 60)
    },
    {
        id: 'perfect',
        title: 'Perfectionist',
        description: 'Complete a lesson with 100% accuracy.',
        icon: 'Target',
        condition: (h, p) => h.some(e => e.accuracy === 100 && e.errors === 0)
    },
    {
        id: 'dedicated',
        title: 'Dedicated',
        description: 'Complete 10 lessons.',
        icon: 'Award',
        condition: (h, p) => h.length >= 10
    },
    {
        id: 'master',
        title: 'Type Master',
        description: 'Unlock all basic lessons.',
        icon: 'Crown',
        condition: (h, p) => Object.values(p).filter(l => l.unlocked).length >= LESSONS.length
    }
];
