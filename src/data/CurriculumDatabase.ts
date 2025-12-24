export interface Lesson {
    id: string;
    stage: number;
    lessonNumber: number;
    title: string;
    description: string;
    targetWPM: number;
    text: string;
    fingersInvolved: string[];
    techniques: string[];
    estimatedDurationMinutes: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export const CURRICULUM: Lesson[] = [
    // ===== STAGE 1: HOME ROW MASTERY (0-25 WPM) =====
    {
        id: 'stage1-lesson1',
        stage: 1,
        lessonNumber: 1,
        title: 'Home Row: Intro to Left Pinky (A)',
        description: 'Learn to find and press the "A" key with your LEFT PINKY without looking at the keyboard.',
        targetWPM: 20,
        text: 'a a a aa aaa a aa a aaa aa a',
        fingersInvolved: ['LeftPinky'],
        techniques: ['Finger Placement', 'Muscle Memory', 'No Visual Feedback'],
        estimatedDurationMinutes: 5,
        difficulty: 'beginner',
    },
    {
        id: 'stage1-lesson2',
        stage: 1,
        lessonNumber: 2,
        title: 'Home Row: Left Ring (S)',
        description: 'Press "S" with your LEFT RING FINGER. Alternate between A and S.',
        targetWPM: 20,
        text: 's s s ss sss s ss s sss ss s',
        fingersInvolved: ['LeftRing'],
        techniques: ['Finger Independence', 'Alternating Motion'],
        estimatedDurationMinutes: 5,
        difficulty: 'beginner',
    },
    {
        id: 'stage1-lesson3',
        stage: 1,
        lessonNumber: 3,
        title: 'Combo: A + S',
        description: 'Combine A and S in different orders.',
        targetWPM: 22,
        text: 'as sa as a s sa as sa a s',
        fingersInvolved: ['LeftPinky', 'LeftRing'],
        techniques: ['Finger Alternation', 'Rhythm'],
        estimatedDurationMinutes: 7,
        difficulty: 'beginner',
    },
    // Full Home Row Fluency
    {
        id: 'stage1-lesson20',
        stage: 1,
        lessonNumber: 20,
        title: 'Full Home Row Fluency',
        description: 'Type real words using only home row keys.',
        targetWPM: 25,
        text: 'add ads all ask dads fall fall jails lass salad sad sad sells shall',
        fingersInvolved: ['LeftPinky', 'LeftRing', 'LeftMiddle', 'LeftIndex', 'RightIndex', 'RightMiddle', 'RightRing', 'RightPinky'],
        techniques: ['Full Hand Coordination', 'Word Recognition'],
        estimatedDurationMinutes: 10,
        difficulty: 'beginner',
    },

    // ===== STAGE 2: ALPHA EXPANSION (25-40 WPM) =====
    {
        id: 'stage2-lesson1',
        stage: 2,
        lessonNumber: 1,
        title: 'Top Row: Q, W, E, R, T (Left Hand)',
        description: 'Extend to the top row with your left hand.',
        targetWPM: 28,
        text: 'q w e r t qq ww ee rr tt qwert',
        fingersInvolved: ['LeftPinky', 'LeftRing', 'LeftMiddle', 'LeftIndex'],
        techniques: ['Hand Extension', 'Reach'],
        estimatedDurationMinutes: 8,
        difficulty: 'intermediate',
    },
    {
        id: 'stage2-lesson30',
        stage: 2,
        lessonNumber: 30,
        title: 'Full Alphabet Mastery',
        description: 'Type any English word without looking.',
        targetWPM: 40,
        text: 'the quick brown fox jumps over the lazy dog',
        fingersInvolved: ['All'],
        techniques: ['Subconscious Typing', 'Real Words'],
        estimatedDurationMinutes: 15,
        difficulty: 'intermediate',
    },

    // ===== STAGE 3: NUMBERS & PUNCTUATION (40-60 WPM) =====
    {
        id: 'stage3-lesson1',
        stage: 3,
        lessonNumber: 1,
        title: 'Numbers: 1-5',
        description: 'Learn the number row without disrupting rhythm.',
        targetWPM: 42,
        text: '1 2 3 4 5 11 22 33 44 55',
        fingersInvolved: ['LeftPinky', 'LeftRing', 'LeftMiddle'],
        techniques: ['Number Placement', 'Shift Key Practice'],
        estimatedDurationMinutes: 8,
        difficulty: 'intermediate',
    },
    {
        id: 'stage3-lesson15',
        stage: 3,
        lessonNumber: 15,
        title: 'Numbers + Punctuation Mix',
        description: 'Type sentences with numbers and punctuation.',
        targetWPM: 60,
        text: 'I have 3 apples. You have 5 oranges. We have 8 fruits!',
        fingersInvolved: ['All'],
        techniques: ['Mixed Typing'],
        estimatedDurationMinutes: 12,
        difficulty: 'intermediate',
    },

    // ===== STAGE 4: FLOW STATE (60-85 WPM) =====
    {
        id: 'stage4-lesson1',
        stage: 4,
        lessonNumber: 1,
        title: 'Bigram Mastery: "TH" Combinations',
        description: 'Master the most common English bigram: TH.',
        targetWPM: 65,
        text: 'the that this them then than think through that',
        fingersInvolved: ['All'],
        techniques: ['Bigram Recognition', 'Flow'],
        estimatedDurationMinutes: 10,
        difficulty: 'intermediate',
    },
    {
        id: 'stage4-lesson30',
        stage: 4,
        lessonNumber: 30,
        title: 'Advanced Bigram Chaining',
        description: 'Fast-paced sentences using common letter patterns.',
        targetWPM: 85,
        text: 'Whether the weather is good or not, I will go there anyway.',
        fingersInvolved: ['All'],
        techniques: ['Rhythm Maintenance', 'Speed'],
        estimatedDurationMinutes: 15,
        difficulty: 'advanced',
    },
];

export const getLessonsByStage = (stage: number) => {
    return CURRICULUM.filter(lesson => lesson.stage === stage);
};

export const getTotalLessonsCount = () => CURRICULUM.length;
