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
        title: 'Home Row: Left Pinky (A)',
        description: 'Press "A" with your left pinky. Type real words containing A.',
        targetWPM: 20,
        text: 'a a a a aa aa aa aaa aaa a a',
        fingersInvolved: ['LeftPinky'],
        techniques: ['Finger Placement', 'Muscle Memory'],
        estimatedDurationMinutes: 5,
        difficulty: 'beginner',
    },
    {
        id: 'stage1-lesson2',
        stage: 1,
        lessonNumber: 2,
        title: 'Home Row: Left Ring (S)',
        description: 'Press "S" with your left ring finger. Say each word aloud.',
        targetWPM: 20,
        text: 's s s s ss ss ss sss sss s s',
        fingersInvolved: ['LeftRing'],
        techniques: ['Finger Placement', 'Auditory Feedback'],
        estimatedDurationMinutes: 5,
        difficulty: 'beginner',
    },
    {
        id: 'stage1-lesson3',
        stage: 1,
        lessonNumber: 3,
        title: 'Home Row: A + S (Real Words)',
        description: 'Type simple 2-letter words: "as", "aa", "sa"',
        targetWPM: 22,
        text: 'as as as sa sa aa as sa aa as',
        fingersInvolved: ['LeftPinky', 'LeftRing'],
        techniques: ['Finger Alternation'],
        estimatedDurationMinutes: 7,
        difficulty: 'beginner',
    },
    {
        id: 'stage1-lesson4',
        stage: 1,
        lessonNumber: 4,
        title: 'Home Row: Left Middle (D)',
        description: 'Press "D" with your left middle finger.',
        targetWPM: 20,
        text: 'd d d d dd dd dd ddd ddd d d',
        fingersInvolved: ['LeftMiddle'],
        techniques: ['Finger Placement'],
        estimatedDurationMinutes: 5,
        difficulty: 'beginner',
    },
    {
        id: 'stage1-lesson5',
        stage: 1,
        lessonNumber: 5,
        title: 'Home Row: A + S + D (Real Words)',
        description: 'Type 3-letter words: "ads", "sad", "add", "dad"',
        targetWPM: 24,
        text: 'ads sad add dad ads sad add ads',
        fingersInvolved: ['LeftPinky', 'LeftRing', 'LeftMiddle'],
        techniques: ['Finger Coordination'],
        estimatedDurationMinutes: 8,
        difficulty: 'beginner',
    },
    {
        id: 'stage1-lesson6',
        stage: 1,
        lessonNumber: 6,
        title: 'Home Row: Left Index (F)',
        description: 'Press "F" with your left index finger.',
        targetWPM: 20,
        text: 'f f f f ff ff ff fff fff f f',
        fingersInvolved: ['LeftIndex'],
        techniques: ['Finger Placement'],
        estimatedDurationMinutes: 5,
        difficulty: 'beginner',
    },
    {
        id: 'stage1-lesson7',
        stage: 1,
        lessonNumber: 7,
        title: 'Home Row: A + S + D + F (Real Words)',
        description: 'Type words with left hand: "fads", "sad", "add", "lass", "fall"',
        targetWPM: 26,
        text: 'sad fads add lass fall fads sad',
        fingersInvolved: ['LeftPinky', 'LeftRing', 'LeftMiddle', 'LeftIndex'],
        techniques: ['Left Hand Fluency'],
        estimatedDurationMinutes: 10,
        difficulty: 'beginner',
    },
    {
        id: 'stage1-lesson8',
        stage: 1,
        lessonNumber: 8,
        title: 'Home Row: Right Index (J)',
        description: 'Press "J" with your right index finger. This is your home position.',
        targetWPM: 20,
        text: 'j j j j jj jj jj jjj jjj j j',
        fingersInvolved: ['RightIndex'],
        techniques: ['Home Row Anchor'],
        estimatedDurationMinutes: 5,
        difficulty: 'beginner',
    },
    {
        id: 'stage1-lesson9',
        stage: 1,
        lessonNumber: 9,
        title: 'Home Row: Right Hand (J + K + L + ;)',
        description: 'Mirror your left hand on the right side.',
        targetWPM: 22,
        text: 'j j jj k k kk l l ll ; ; ;;',
        fingersInvolved: ['RightIndex', 'RightMiddle', 'RightRing', 'RightPinky'],
        techniques: ['Right Hand Placement'],
        estimatedDurationMinutes: 10,
        difficulty: 'beginner',
    },
    {
        id: 'stage1-lesson10',
        stage: 1,
        lessonNumber: 10,
        title: 'Full Home Row: Real Words',
        description: 'Type real home-row words: "sad", "adds", "lads", "fall", "lass", "alls"',
        targetWPM: 25,
        text: 'sad adds lads fall lass alls fads dads adds lads',
        fingersInvolved: ['All'],
        techniques: ['Hand Coordination', 'Word Recognition'],
        estimatedDurationMinutes: 12,
        difficulty: 'beginner',
    },

    // ===== STAGE 2: ALPHA EXPANSION (25-40 WPM) =====

    {
        id: 'stage2-lesson1',
        stage: 2,
        lessonNumber: 1,
        title: 'Top Row: Q (Left Pinky)',
        description: 'Extend left pinky up to Q. Reach without moving your hand.',
        targetWPM: 28,
        text: 'q q q q qq qq qqq qa aq',
        fingersInvolved: ['LeftPinky'],
        techniques: ['Hand Extension', 'Reach'],
        estimatedDurationMinutes: 6,
        difficulty: 'intermediate',
    },
    {
        id: 'stage2-lesson30',
        stage: 2,
        lessonNumber: 30,
        title: 'Full Alphabet Mastery',
        description: 'Type the famous pangram: the quick brown fox jumps over the lazy dog',
        targetWPM: 40,
        text: 'the quick brown fox jumps over the lazy dog',
        fingersInvolved: ['All'],
        techniques: ['Full Alphabet', 'Real Sentences'],
        estimatedDurationMinutes: 15,
        difficulty: 'intermediate',
    },
];

export const getLessonsByStage = (stage: number) => {
    return CURRICULUM.filter(lesson => lesson.stage === stage);
};

export const getTotalLessonsCount = () => CURRICULUM.length;
