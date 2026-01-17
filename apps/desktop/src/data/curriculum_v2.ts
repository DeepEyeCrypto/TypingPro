// ═══════════════════════════════════════════════════════════════════
// TYPINGPRO CURRICULUM - Zero to Hero for Absolute Beginners
// Scientifically structured using N-gram analysis & Muscle Memory
// ═══════════════════════════════════════════════════════════════════

export interface EnhancedLesson {
    id: number;
    lessonId: string;
    title: string;
    difficulty: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
    stage: string;
    instructions: string;
    tips: string;
    focusKeys: string[];
    focusFingers: string[];
    text: string;
    targetWPM: number;
    minAccuracy: number;
    xpReward: number;
    unlockAt?: number; // Lesson ID required to unlock
}

export const ENHANCED_CURRICULUM: EnhancedLesson[] = [
    // ═══════════════════════════════════════════════════════════════════
    // STAGE 1: THE ANCHOR (Levels 1-10) - Home Row Foundation
    // Focus: Absolute basics. Feel the bumps. No looking down.
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 1,
        lessonId: 'L1',
        title: 'First Steps: F & J',
        difficulty: 'Novice',
        stage: 'Home Row',
        instructions: 'Place your index fingers on the keys with the small bumps. These are your ANCHOR keys. You will always return here.',
        tips: 'Close your eyes. Feel the bumps on F and J. These are your home.',
        focusKeys: ['f', 'j'],
        focusFingers: ['LI', 'RI'],
        text: 'f j f j fj jf ff jj fj fj jf jf fff jjj fff jjj fj fj fj fj',
        targetWPM: 10,
        minAccuracy: 90,
        xpReward: 100
    },
    {
        id: 2,
        lessonId: 'L2',
        title: 'Expanding: D & K',
        difficulty: 'Novice',
        stage: 'Home Row',
        instructions: 'Keep your index fingers on F & J. Now let your MIDDLE fingers rest on D & K.',
        tips: 'Your hands should form a natural curve. Wrists slightly elevated.',
        focusKeys: ['d', 'k'],
        focusFingers: ['LM', 'RM'],
        text: 'd k d k dk kd dd kk dk dk kd kd ddd kkk ddd kkk dk dk dk dk',
        targetWPM: 12,
        minAccuracy: 90,
        xpReward: 100,
        unlockAt: 1
    },
    {
        id: 3,
        lessonId: 'L3',
        title: 'The Ring: S & L',
        difficulty: 'Novice',
        stage: 'Home Row',
        instructions: 'Your RING fingers go on S & L. All fingers should now be on the home row.',
        tips: 'Ring fingers are naturally weaker. Be patient with them.',
        focusKeys: ['s', 'l'],
        focusFingers: ['LR', 'RR'],
        text: 's l s l sl ls ss ll sl sl ls ls sss lll sss lll sl sl sl sl',
        targetWPM: 12,
        minAccuracy: 90,
        xpReward: 100,
        unlockAt: 2
    },
    {
        id: 4,
        lessonId: 'L4',
        title: 'The Pinkies: A & ;',
        difficulty: 'Novice',
        stage: 'Home Row',
        instructions: 'Your PINKY fingers rest on A & semicolon (;). The weakest fingers need the most practice.',
        tips: 'Pinkies are crucial for Shift and other keys. Train them well.',
        focusKeys: ['a', ';'],
        focusFingers: ['LP', 'RP'],
        text: 'a ; a ; a; ;a aa ;; a; a; ;a ;a aaa ;;; aaa ;;; a; a; a; a;',
        targetWPM: 10,
        minAccuracy: 85,
        xpReward: 100,
        unlockAt: 3
    },
    {
        id: 5,
        lessonId: 'L5',
        title: 'Home Row Flow',
        difficulty: 'Novice',
        stage: 'Home Row',
        instructions: 'Combine all home row keys. This is your BASE POSITION. Always return here.',
        tips: 'After every word, your fingers should snap back to asdf jkl;',
        focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        focusFingers: ['LP', 'LR', 'LM', 'LI', 'RI', 'RM', 'RR', 'RP'],
        text: 'asdf jkl; asdf jkl; fdsa ;lkj asdf jkl; asdfjkl; asdf jkl;',
        targetWPM: 15,
        minAccuracy: 90,
        xpReward: 150,
        unlockAt: 4
    },
    {
        id: 6,
        lessonId: 'L6',
        title: 'First Words: sad dad',
        difficulty: 'Novice',
        stage: 'Home Row',
        instructions: 'Time for REAL WORDS! These use only home row keys.',
        tips: 'Think of the word in your head, then let your fingers type it.',
        focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
        focusFingers: ['LP', 'LR', 'LM', 'LI', 'RI', 'RM', 'RR'],
        text: 'sad dad lad fad ask lass fall all add salad flasklass add sad',
        targetWPM: 18,
        minAccuracy: 90,
        xpReward: 150,
        unlockAt: 5
    },
    {
        id: 7,
        lessonId: 'L7',
        title: 'The Inner Reach: G & H',
        difficulty: 'Novice',
        stage: 'Home Row',
        instructions: 'G & H are reached with your INDEX fingers stretching INWARD. This is your first "reach".',
        tips: 'Keep your other fingers anchored. Only the index finger moves.',
        focusKeys: ['g', 'h'],
        focusFingers: ['LI', 'RI'],
        text: 'g h g h gh hg gg hh gh gh hg hg ggg hhh ggg hhh gh gh gh gh',
        targetWPM: 15,
        minAccuracy: 85,
        xpReward: 120,
        unlockAt: 6
    },
    {
        id: 8,
        lessonId: 'L8',
        title: 'Words with G & H',
        difficulty: 'Novice',
        stage: 'Home Row',
        instructions: 'Form words using your new G & H skills.',
        tips: 'Each new key unlocks hundreds of words. You are building vocabulary.',
        focusKeys: ['g', 'h', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        focusFingers: ['LI', 'RI', 'LP', 'LR', 'LM', 'RM', 'RR'],
        text: 'gash hash had haglag jag shag dash gall hall shall flash glad',
        targetWPM: 20,
        minAccuracy: 88,
        xpReward: 150,
        unlockAt: 7
    },
    {
        id: 9,
        lessonId: 'L9',
        title: 'Home Row Mastery Test',
        difficulty: 'Beginner',
        stage: 'Home Row',
        instructions: 'CHECKPOINT: Prove you have mastered the Home Row before moving on.',
        tips: 'Relax. Trust your fingers. They know where the keys are.',
        focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        focusFingers: ['All'],
        text: 'a sad dad had a glad lad.alls flags shall fall. jash dasks flask.',
        targetWPM: 22,
        minAccuracy: 92,
        xpReward: 250,
        unlockAt: 8
    },
    {
        id: 10,
        lessonId: 'L10',
        title: 'Home Row Certification',
        difficulty: 'Beginner',
        stage: 'Home Row',
        instructions: 'FINAL HOME ROW TEST. Pass this to unlock the Top Row.',
        tips: 'You have built your foundation. Now we reach for the stars.',
        focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        focusFingers: ['All'],
        text: 'glad halls shall fall as flash flags dash. all lads had salads.',
        targetWPM: 25,
        minAccuracy: 95,
        xpReward: 500,
        unlockAt: 9
    },

    // ═══════════════════════════════════════════════════════════════════
    // STAGE 2: THE REACH (Levels 11-20) - Top Row Introduction
    // Focus: Vertical finger movement. Vowels are crucial.
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 11,
        lessonId: 'L11',
        title: 'The Vowel Reach: E',
        difficulty: 'Beginner',
        stage: 'Top Row',
        instructions: 'E is the MOST COMMON letter in English. Your LEFT MIDDLE finger reaches UP from D.',
        tips: 'The reach motion: D → E → D. Always return to home row.',
        focusKeys: ['e', 'd'],
        focusFingers: ['LM'],
        text: 'ded ded ede ede e e e e deed deed feed feed deed seed need',
        targetWPM: 18,
        minAccuracy: 88,
        xpReward: 150,
        unlockAt: 10
    },
    {
        id: 12,
        lessonId: 'L12',
        title: 'The Vowel Reach: I',
        difficulty: 'Beginner',
        stage: 'Top Row',
        instructions: 'I is reached with your RIGHT MIDDLE finger from K.',
        tips: 'Mirror your left hand movement. K → I → K.',
        focusKeys: ['i', 'k'],
        focusFingers: ['RM'],
        text: 'kik kik iki iki i i i i kid kid lid lid did did aid said',
        targetWPM: 18,
        minAccuracy: 88,
        xpReward: 150,
        unlockAt: 11
    },
    {
        id: 13,
        lessonId: 'L13',
        title: 'E & I Combined',
        difficulty: 'Beginner',
        stage: 'Top Row',
        instructions: 'Combine the two most important vowels with home row.',
        tips: 'Vowels are the glue that holds words together.',
        focusKeys: ['e', 'i', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        focusFingers: ['LM', 'RM', 'All'],
        text: 'side life like deal file idea lied kids desk self else die lie',
        targetWPM: 22,
        minAccuracy: 88,
        xpReward: 180,
        unlockAt: 12
    },
    {
        id: 14,
        lessonId: 'L14',
        title: 'The Index Reach: R',
        difficulty: 'Beginner',
        stage: 'Top Row',
        instructions: 'R is reached with your LEFT INDEX finger from F.',
        tips: 'Index fingers are the strongest. They handle the most keys.',
        focusKeys: ['r', 'f'],
        focusFingers: ['LI'],
        text: 'frf frf rfr rfr r r r r red red are are free free fire fire',
        targetWPM: 18,
        minAccuracy: 88,
        xpReward: 150,
        unlockAt: 13
    },
    {
        id: 15,
        lessonId: 'L15',
        title: 'The Index Reach: U',
        difficulty: 'Beginner',
        stage: 'Top Row',
        instructions: 'U is reached with your RIGHT INDEX finger from J.',
        tips: 'Think of U and R as mirror positions on your keyboard.',
        focusKeys: ['u', 'j'],
        focusFingers: ['RI'],
        text: 'juj juj uju uju u u u u just just us us use use sure sure',
        targetWPM: 18,
        minAccuracy: 88,
        xpReward: 150,
        unlockAt: 14
    },
    {
        id: 16,
        lessonId: 'L16',
        title: 'R & U Combined',
        difficulty: 'Beginner',
        stage: 'Top Row',
        instructions: 'Combine R and U with your growing vocabulary.',
        tips: 'Notice how many words you can now type!',
        focusKeys: ['r', 'u', 'e', 'i', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        focusFingers: ['LI', 'RI', 'All'],
        text: 'rule rude fire sure user risk rise surf blur dear near fear',
        targetWPM: 24,
        minAccuracy: 88,
        xpReward: 180,
        unlockAt: 15
    },
    {
        id: 17,
        lessonId: 'L17',
        title: 'The Center Reach: T',
        difficulty: 'Beginner',
        stage: 'Top Row',
        instructions: 'T is a LEFT INDEX reach - it is next to R. Very common letter.',
        tips: 'T is the second most common consonant. Master it well.',
        focusKeys: ['t', 'f', 'r'],
        focusFingers: ['LI'],
        text: 'ftf ftf tft tft t t t t the the that that this this take take',
        targetWPM: 20,
        minAccuracy: 88,
        xpReward: 150,
        unlockAt: 16
    },
    {
        id: 18,
        lessonId: 'L18',
        title: 'The Center Reach: Y',
        difficulty: 'Beginner',
        stage: 'Top Row',
        instructions: 'Y is a RIGHT INDEX reach - it is next to U.',
        tips: 'Y acts as both a vowel and consonant. Very versatile.',
        focusKeys: ['y', 'j', 'u'],
        focusFingers: ['RI'],
        text: 'jyj jyj yjy yjy y y y y yes yes you you your your they they',
        targetWPM: 20,
        minAccuracy: 88,
        xpReward: 150,
        unlockAt: 17
    },
    {
        id: 19,
        lessonId: 'L19',
        title: 'Common Bigrams: TH & THE',
        difficulty: 'Intermediate',
        stage: 'Top Row',
        instructions: 'TH is the most common letter pair in English. THE is the most common word.',
        tips: 'Your fingers will learn to flow: T-H-E as one motion.',
        focusKeys: ['t', 'h', 'e'],
        focusFingers: ['LI', 'RI', 'LM'],
        text: 'the the the the that that they they their their there there',
        targetWPM: 26,
        minAccuracy: 90,
        xpReward: 200,
        unlockAt: 18
    },
    {
        id: 20,
        lessonId: 'L20',
        title: 'Top Row Checkpoint',
        difficulty: 'Intermediate',
        stage: 'Top Row',
        instructions: 'CHECKPOINT: Prove your mastery of top row reaches.',
        tips: 'Take a deep breath. You have learned a lot. Trust the process.',
        focusKeys: ['e', 'i', 'r', 'u', 't', 'y'],
        focusFingers: ['All'],
        text: 'the red fire rises like a flare as the sky turns the darkest hue',
        targetWPM: 28,
        minAccuracy: 92,
        xpReward: 350,
        unlockAt: 19
    }
];

// Export the legacy format for backwards compatibility
export const CURRICULUM_V2 = ENHANCED_CURRICULUM.map(lesson => ({
    id: lesson.lessonId,
    title: lesson.title,
    description: lesson.instructions,
    text: lesson.text,
    targetWPM: lesson.targetWPM,
    focusFingers: lesson.focusFingers,
    stage: lesson.stage
}));
