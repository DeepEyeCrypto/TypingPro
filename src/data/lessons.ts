export interface Lesson {
    id: number;
    phase: number;
    title: string;
    description: string;
    text: string;
    difficulty: number;
    targetWPM: number;
    category: 'foundation' | 'speed' | 'endurance' | 'mastery';
}

export const LESSONS: Lesson[] = [
    // PHASE 1: FOUNDATION (Home Row)
    {
        id: 1,
        phase: 1,
        category: 'foundation',
        title: 'Home Row Basics: f j',
        description: 'Learn the anchor keys for your index fingers.',
        text: 'fff jjj fjf jfj ff jj f j f j ffjj jjff fffjjj jjjfff fj fj fj',
        difficulty: 1,
        targetWPM: 15
    },
    {
        id: 2,
        phase: 1,
        category: 'foundation',
        title: 'Home Row: d k',
        description: 'Introducing your middle fingers.',
        text: 'ddd kkk dkd kdk dk dk dd kk d k d k dddkkk ddkk dkkd kddk',
        difficulty: 1,
        targetWPM: 15
    },
    {
        id: 3,
        phase: 1,
        category: 'foundation',
        title: 'Home Row: s l',
        description: 'Introducing your ring fingers.',
        text: 'sss lll sls lsl sl sl ss ll s l s l ssslll ssll slls lssl',
        difficulty: 1,
        targetWPM: 15
    },
    {
        id: 4,
        phase: 1,
        category: 'foundation',
        title: 'Home Row: a ;',
        description: 'Mastering the pinky fingers.',
        text: 'aaa ;;; a;a ;a; a; ;a aa ;; a ; a ; aaa;;; aa;; a;;a ;aa;',
        difficulty: 2,
        targetWPM: 15
    },
    // ... Adding more foundation lessons
    {
        id: 10,
        phase: 1,
        category: 'foundation',
        title: 'Home Row Mastery',
        description: 'All home row keys combined.',
        text: 'asdf jkl; asdf jkl; a s d f j k l ; adsf jlk; safd kjl;',
        difficulty: 3,
        targetWPM: 25
    },

    // PHASE 2: SPEED BUILDING
    {
        id: 11,
        phase: 2,
        category: 'speed',
        title: 'Common Digraphs',
        description: 'Focus on "th", "he", "in", "er".',
        text: 'the then there that this her there here in into line ever very hard',
        difficulty: 4,
        targetWPM: 40
    },
    {
        id: 20,
        phase: 2,
        category: 'speed',
        title: 'Short Phrases',
        description: 'Practice fluid movement between words.',
        text: 'the quick brown fox jumps over the lazy dog in the bright sun',
        difficulty: 5,
        targetWPM: 50
    },

    // PHASE 3: ENDURANCE
    {
        id: 31,
        phase: 3,
        category: 'endurance',
        title: 'Technical Quotes',
        description: 'Longer blocks focusing on punctuation.',
        text: 'The primary purpose of a programming language is to facilitate the communication of complex ideas between humans; the computer is secondary.',
        difficulty: 7,
        targetWPM: 65
    },

    // PHASE 4: MASTERY
    {
        id: 41,
        phase: 4,
        category: 'mastery',
        title: 'Code Snippets (Rust)',
        description: 'Type common code structures.',
        text: 'fn main() { println!("Hello, world!"); let mut x = 42; if x > 10 { x -= 5; } }',
        difficulty: 9,
        targetWPM: 80
    },
    {
        id: 50,
        phase: 4,
        category: 'mastery',
        title: 'The Ultimate Challenge',
        description: 'Final test for typing pros.',
        text: 'Antigravity is not just a tool; it is a philosophy of speed, precision, and elegance in the digital workspace. Mastering the keys is mastering the world.',
        difficulty: 10,
        targetWPM: 100
    }
];
