
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
  { title: "Stage 1: Home Row Anchors", range: "1 - 5", active: true },
  { title: "Stage 2: Top Row Words", range: "6 - 10", active: false },
  { title: "Stage 3: Bottom Row", range: "11 - 15", active: false },
  { title: "Advanced Practice", range: "16+", active: false }
];

export const XP_LEVELS = [
  { title: 'Recruit', minXp: 0 },
  { title: 'Pilot', minXp: 500 },
  { title: 'Commander', minXp: 2000 },
  { title: 'Legend', minXp: 5000 },
];

export const LESSONS: Lesson[] = [
  // --- Stage 1: Home Row Foundation (Muscle Memory Anchors) ---
  {
    id: 1,
    title: "Anchor Point: F & J",
    description: "The most important keys. Feel the bumps with your index fingers.",
    keys: ['f', 'j', ' '],
    newKeys: ['f', 'j'],
    content: "fff jjj fj fj jf jf ff jj fff jjj fjf jfj f j f j ff jj",
    videoUrl: "https://videos2.edclub.com/hls/196638853/3c53ad84-d876-4af8-ad8a-4140ab7bf929/index-1.m3u8"
  },
  {
    id: 2,
    title: "Inner Stretch: D & K",
    description: "Middle fingers. Maintain the index finger anchors.",
    keys: ['d', 'k', 'f', 'j', ' '],
    newKeys: ['d', 'k'],
    content: "ddd kkk dk dk kd kd df jk df jk ddd kkk dkd kdk dk dk"
  },
  {
    id: 3,
    title: "Ring Stability: S & L",
    description: "Ring fingers. These are often the weakest; keep them steady.",
    keys: ['s', 'l', 'd', 'k', 'f', 'j', ' '],
    newKeys: ['s', 'l'],
    content: "sss lll sl sl ls ls sdf jkl sdf jkl sss lll sls lsl sl sl"
  },
  {
    id: 4,
    title: "Pinky Power: A & ;",
    description: "The edges of the home row. Use your pinkies.",
    keys: ['a', ';', 's', 'l', 'd', 'k', 'f', 'j', ' '],
    newKeys: ['a', ';'],
    content: "aaa ;;; a; a; ;a ;a asdf jkl; asdf jkl; aaa ;;; ada ;k; a; ;a"
  },
  {
    id: 5,
    title: "Home Row Mastery",
    description: "The full home row. Speed up now while maintaining form.",
    keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'g', 'h', ' '],
    newKeys: ['g', 'h'],
    content: "asdf jkl; asdf jkl; gh gh fg jh hg jf salad asks dash flask"
  },
  // --- Stage 2: Top Row Integration (Precise Reaches) ---
  {
    id: 6,
    title: "Index Reach: R & U",
    description: "Index fingers reach UP one row. Return to home immediately.",
    keys: ['r', 'u', ' '],
    newKeys: ['r', 'u'],
    content: "fr ju fr ju rrr uuu fur jug rug fur rug jug fur ju fr r u"
  },
  {
    id: 7,
    title: "Middle Reach: E & I",
    description: "Middle fingers reach UP. Keep your index fingers on F and J.",
    keys: ['e', 'i', ' '],
    newKeys: ['e', 'i'],
    content: "de ki de ki eee iii die kid led lid side risk fire ride e i"
  },
  {
    id: 8,
    title: "Ring Reach: W & O",
    description: "Ring fingers reach UP. This requires palm lift.",
    keys: ['w', 'o', ' '],
    newKeys: ['w', 'o'],
    content: "sw lo sw lo www ooo low owl work word slow wool flow w o"
  },
  {
    id: 9,
    title: "Pinky Reach: Q & P",
    description: "Pinky fingers reach to the upper corners.",
    keys: ['q', 'p', ' '],
    newKeys: ['q', 'p'],
    content: "aq ;p aq ;p qqq ppp up pulp quit past pure quiet page q p"
  },
  {
    id: 10,
    title: "Upper Row Fluency",
    description: "Mixing top and home rows. Focus on the vertical movement.",
    keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ' '],
    newKeys: ['t', 'y'],
    content: "type your word tree root power quiet water tower party you"
  },
  // --- Stage 3: High Frequency & Technique ---
  {
    id: 11,
    title: "Common: THE, AND, THAT",
    description: "Short bursts of the most common English words.",
    keys: [' '],
    content: "the and that with have this from they will would there their"
  },
  {
    id: 12,
    title: "Bottom Reach: V & M",
    description: "Index fingers reach DOWN. Tuck them in tightly.",
    keys: ['v', 'm', ' '],
    newKeys: ['v', 'm'],
    content: "fv jm fv jm vvv mmm move view main game volume move main v m"
  },
  {
    id: 13,
    title: "High-Frequency I",
    description: "The most common words in English. (Burst Mode)",
    keys: ["t", "h", "e", "a", "n", "d", "i"],
    content: "the and the and the and the and",
    newKeys: ["the", "and"],
    type: "burst"
  },
  {
    id: 14,
    title: "High-Frequency II",
    description: "Focusing on transitions. (Burst Mode)",
    keys: ["o", "f", "t", "o", "i", "n", "u"],
    content: "of to in of to in of to in",
    newKeys: ["of", "to", "in"],
    type: "burst"
  },
  {
    id: 15,
    title: "Speed Mastery Final",
    description: "Full row integration at speed. (Burst Mode)",
    keys: ["a-z"],
    content: "the quick brown fox jumps over the lazy dog",
    newKeys: ["all"],
    type: "burst"
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
