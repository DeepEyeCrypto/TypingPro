
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
  { title: "Foundation (1-5): Home Row Anchors", range: "1 - 5", active: true },
  { title: "Expansion (6-10): Top Row Integration", range: "6 - 10", active: false },
  { title: "Mastery (11-15): Bottom Row + Symbols", range: "11 - 15", active: false },
  { title: "Fluency (16-20): Common Words", range: "16 - 20", active: false },
  { title: "Speed Building (21-25): Mixed Passages", range: "21 - 25", active: false },
  { title: "Competitive (26-30): Timed Sprints", range: "26 - 30", active: false }
];

export const XP_LEVELS = [
  { title: 'Recruit', minXp: 0 },
  { title: 'Pilot', minXp: 1000 },
  { title: 'Commander', minXp: 5000 },
  { title: 'Legend', minXp: 15000 },
];

export const LESSONS: Lesson[] = [
  // --- Level 1: Foundation (Home Row Anchors) ---
  {
    id: 1,
    title: "Anchor Points: F & J",
    description: "Initialize muscle memory anchors. Feel the home row ridges.",
    keys: ['f', 'j', ' '],
    newKeys: ['f', 'j'],
    content: "fff jjj fj fj jf jf ff jj fjf jfj f j f j ff jj fjf jfj f f j j",
    targetAccuracy: 99
  },
  {
    id: 2,
    title: "Inner Stretch: D & K",
    description: "Maintain anchors while reaching with middle fingers.",
    keys: ['d', 'k', 'f', 'j', ' '],
    newKeys: ['d', 'k'],
    content: "ddd kkk dk dk kd kd df jk df jk dkd kdk dk dk fj f d k j d k",
    targetAccuracy: 99
  },
  {
    id: 3,
    title: "Outer Ring: S & L",
    description: "Strengthening the ring fingers for lateral balance.",
    keys: ['s', 'l', 'd', 'k', 'f', 'j', ' '],
    newKeys: ['s', 'l'],
    content: "sss lll sl sl ls ls sdf jkl sdf jkl sls lsl sl sl k l d s k l d s",
    targetAccuracy: 99
  },
  {
    id: 4,
    title: "Pinky Precision: A & ;",
    description: "Stabilizing the weak outer edges of the home row.",
    keys: ['a', ';', 's', 'l', 'd', 'k', 'f', 'j', ' '],
    newKeys: ['a', ';'],
    content: "aaa ;;; a; a; ;a ;a asdf jkl; asdf jkl; ada ;k; a; ;a j k l ; a s d f",
    targetAccuracy: 99
  },
  {
    id: 5,
    title: "Home Row Mastery",
    description: "Unconscious competence checkpoint. All home row fingers acting independently.",
    keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'g', 'h', ' '],
    newKeys: ['g', 'h'],
    content: "asdf jkl; gh gh fg jh hg jf salad asks dash flask glad slag alfalfa",
    targetAccuracy: 99
  },

  // --- Level 2: Expansion (Top Row Integration) ---
  {
    id: 6,
    title: "Index Reach: R & U",
    description: "Precise vertical reaches for the index fingers.",
    keys: ['r', 'u', ' '],
    newKeys: ['r', 'u'],
    content: "fr ju fr ju rrr uuu fur jug rug fur rug jug fur ju fr r u r r u u",
    targetAccuracy: 98
  },
  {
    id: 7,
    title: "Middle Reach: E & I",
    description: "Middle finger vertical reaches. Keep your index fingers anchored.",
    keys: ['e', 'i', ' '],
    newKeys: ['e', 'i'],
    content: "de ki de ki eee iii die kid led lid side risk fire ride red rid ire",
    targetAccuracy: 98
  },
  {
    id: 8,
    title: "Ring Reach: W & O",
    description: "Lateral Ring reach. Lift palm slightly if needed.",
    keys: ['w', 'o', ' '],
    newKeys: ['w', 'o'],
    content: "sw lo sw lo www ooo low owl work word slow wool flow row low old",
    targetAccuracy: 98
  },
  {
    id: 9,
    title: "Pinky Reach: Q & P",
    description: "Corner reaches. Don't let your hand drift from the home row.",
    keys: ['q', 'p', ' '],
    newKeys: ['q', 'p'],
    content: "aq ;p aq ;p qqq ppp up pulp quit past pure quiet page quip pipe gap",
    targetAccuracy: 98
  },
  {
    id: 10,
    title: "Expansion Mastery",
    description: "Integrating Home and Top rows for seamless flow.",
    keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ' '],
    newKeys: ['t', 'y'],
    content: "type your word tree root power quiet water tower party you toy top",
    targetAccuracy: 98
  },

  // --- Level 3: Mastery (Bottom Row + Symbols) ---
  {
    id: 11,
    title: "Index Drop: V & M",
    description: "Tucking the index fingers down. Precision is key.",
    keys: ['v', 'm', ' '],
    newKeys: ['v', 'm'],
    content: "fv jm fv jm vvv mmm move view main game volume move main vim mad",
    targetAccuracy: 98
  },
  {
    id: 12,
    title: "Middle Drop: C & ,",
    description: "Middle finger descent. Watch for 'mashing' the keys.",
    keys: ['c', ',', ' '],
    newKeys: ['c', ','],
    content: "dc k, dc k, ccc ,,, ice car cow code, corn, rice, mice, dice, cold,",
    targetAccuracy: 98
  },
  {
    id: 13,
    title: "Ring Drop: X & .",
    description: "Ring finger control. The most difficult reach for many.",
    keys: ['x', '.', ' '],
    newKeys: ['x', '.'],
    content: "sx l. sx l. xxx ... box fix wax tax. hex. sax. mix. six. lax. axe.",
    targetAccuracy: 98
  },
  {
    id: 14,
    title: "Pinky Drop: Z & /",
    description: "Corner descent. Keep the rest of the hand still.",
    keys: ['z', '/', ' '],
    newKeys: ['z', '/'],
    content: "az ;/ az ;/ zzz /// zip zap zoo/zeal/zone/zero/zinc/zest/jazz/buzz/",
    targetAccuracy: 98
  },
  {
    id: 15,
    title: "Bottom Row Completion",
    description: "Fluid movement across the lower deck.",
    keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', ' '],
    newKeys: ['b', 'n'],
    content: "bank name back next vine maze zero/fix. move next. bank down bank",
    targetAccuracy: 98
  },

  // --- Level 4: Fluency (Common Words) ---
  {
    id: 16,
    title: "Top 10 Words",
    description: "Muscle memory for the core of the English language.",
    keys: [' '],
    content: "the be to of and a in that have i the to of and that have in to the",
    targetAccuracy: 97
  },
  {
    id: 17,
    title: "Connecting Particles",
    description: "It, for, not, on, with, he, as, you, do, at.",
    keys: [' '],
    content: "it for not on with he as you do at it for not on with he as you at",
    targetAccuracy: 97
  },
  {
    id: 18,
    title: "Action Verbs",
    description: "Say, go, get, make, know. Dynamic flows.",
    keys: [' '],
    content: "say go get make know can will take find come want use help work go",
    targetAccuracy: 97
  },
  {
    id: 19,
    title: "High-Speed Transitions",
    description: "Common bigrams and trigrams (th, er, on, an).",
    keys: [' '],
    content: "the there than that other another then mother weather father rather",
    targetAccuracy: 97
  },
  {
    id: 20,
    title: "Fluency Checkpoint",
    description: "Mixing common words into complete sentences.",
    keys: [' '],
    content: "the quick brown fox and the lazy dog went to the park and played",
    targetAccuracy: 97
  },

  // --- Level 5: Speed Building (Mixed Passages) ---
  {
    id: 21,
    title: "Pacing Drill: 20 WPM",
    description: "Slow and steady. Focus on zero errors.",
    keys: [' '],
    content: "typing is a skill that requires both precision and patience to master",
    targetAccuracy: 95
  },
  {
    id: 22,
    title: "Pacing Drill: 40 WPM",
    description: "Maintain form as the speed increases.",
    keys: [' '],
    content: "it is better to type slowly and accurately than to type fast with errors",
    targetAccuracy: 95
  },
  {
    id: 23,
    title: "Rhythmic Hitting",
    description: "Find your tempo. Don't rush certain keys.",
    keys: [' '],
    content: "muscle memory is developed through consistent practice over many days",
    targetAccuracy: 95
  },
  {
    id: 24,
    title: "Technical Phrases",
    description: "Using numbers and symbols within sentences.",
    keys: ['0-9', '!', '@', '#', '$'],
    newKeys: ['1', '2', '3', '4', '5'],
    content: "the value is 100 dollars @ the rate of 5 percent per year today",
    targetAccuracy: 95
  },
  {
    id: 25,
    title: "Endurance Test",
    description: "Longer passage requiring sustained focus.",
    keys: [' '],
    content: "to achieve greatness one must be willing to endure the tedious work",
    targetAccuracy: 95
  },

  // --- Level 6: Competitive (Timed Sprints) ---
  {
    id: 26,
    title: "30-Second Sprint",
    description: "Max speed. Ignore the timer and trust your hands.",
    keys: [' '],
    type: "burst",
    content: "the quick brown fox jumps over the lazy dog again and again",
    targetAccuracy: 90
  },
  {
    id: 27,
    title: "60-Second Challenge",
    description: "Sustained high speed. Keep your breathing steady.",
    keys: [' '],
    content: "practice makes perfect and perfect practice makes for a perfect typist",
    targetAccuracy: 90
  },
  {
    id: 28,
    title: "Precision Sprint",
    description: "High speed with 95% accuracy requirement.",
    keys: [' '],
    content: "focus all of your energy on the next character and the speed will come",
    targetAccuracy: 95
  },
  {
    id: 29,
    title: "Full Text Integration",
    description: "Real-world text with mixed punctuation.",
    keys: [' '],
    content: "wait, did you see that? the fox was fast, but the dog was faster!",
    targetAccuracy: 90
  },
  {
    id: 30,
    title: "The Ultimate Mastery",
    description: "The final 100 WPM challenge.",
    keys: [' '],
    content: "you have achieved complete mastery of the keyboard and finger movement",
    targetAccuracy: 90
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
