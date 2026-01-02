export interface Lesson {
    id: string,
    title: string,
    description: string,
    text: string,
    targetWPM: number,
    focusFingers: string[],
    stage: string
}

export const CURRICULUM: Lesson[] = [
    {
        id: 'l1',
        title: 'Focus: F & J',
        description: 'Master the index fingers on the home row.',
        text: 'f f f f j j j j fj fj fj fj ffff jjjj ffff jjjj',
        targetWPM: 28,
        focusFingers: ['LI', 'RI'],
        stage: 'Home Row'
    },
    {
        id: 'l2',
        title: 'Focus: D & K',
        description: 'Master the middle fingers on the home row.',
        text: 'd d d d k k k k dk dk dk dk dddd kkkk dddd kkkk',
        targetWPM: 28,
        focusFingers: ['LM', 'RM'],
        stage: 'Home Row'
    },
    {
        id: 'l3',
        title: 'Focus: S & L',
        description: 'Master the ring fingers on the home row.',
        text: 's s s s l l l l sl sl sl sl ssss llll ssss llll',
        targetWPM: 28,
        focusFingers: ['LR', 'RR'],
        stage: 'Home Row'
    },
    {
        id: 'l4',
        title: 'Focus: A & ;',
        description: 'Master the pinky fingers on the home row.',
        text: 'a a a a ; ; ; ; a; a; a; a; aaaa ;;;; aaaa ;;;;',
        targetWPM: 28,
        focusFingers: ['LP', 'RP'],
        stage: 'Home Row'
    },
    {
        id: 'l5',
        title: 'Home Row Mix',
        description: 'Combine all fingers on the home row.',
        text: 'asdf jkl; asdf jkl; sad dad lad flask falls fad asdf jkl;',
        targetWPM: 30,
        focusFingers: ['LP', 'LR', 'LM', 'LI', 'RI', 'RM', 'RR', 'RP'],
        stage: 'Home Row'
    },
    {
        id: 'l6',
        title: 'Focus: E & I',
        description: 'Reach up to the middle row.',
        text: 'e e e e i i i i ei ei ei ei eeee iiii eeee iiii',
        targetWPM: 30,
        focusFingers: ['LM', 'RM'],
        stage: 'Top Row'
    },
    {
        id: 'l7',
        title: 'Common Words: Stage 2',
        description: 'Words using home row + E and I.',
        text: 'side life like deal file idea lied kids desk self else',
        targetWPM: 32,
        focusFingers: ['LM', 'RM'],
        stage: 'Top Row'
    },
    {
        id: 'l8',
        title: 'Focus: R & U',
        description: 'Index finger vertical reaches.',
        text: 'r r r r u u u u ru ru ru ru rrrr uuuu rrrr uuuu',
        targetWPM: 30,
        focusFingers: ['LI', 'RI'],
        stage: 'Top Row'
    },
    {
        id: 'l9',
        title: 'Common Words: Stage 3',
        description: 'Words using R and U.',
        text: 'rule rude fire sure user user rise surf blue dear near',
        targetWPM: 32,
        focusFingers: ['LI', 'RI'],
        stage: 'Top Row'
    },
    {
        id: 'l10',
        title: 'Sentence Practice I',
        description: 'A mix of stage 1–3.',
        text: 'the red fire rose like a flare in the blue sky above',
        targetWPM: 35,
        focusFingers: ['All'],
        stage: 'Mixed'
    },
    {
        id: 'l11',
        title: 'Focus: T & Y',
        description: 'Inner index reaches.',
        text: 't t t t y y y y ty ty ty ty tttt yyyy tttt yyyy',
        targetWPM: 30,
        focusFingers: ['LI', 'RI'],
        stage: 'Top Row'
    },
    {
        id: 'l12',
        title: 'Focus: G & H',
        description: 'Home row inner reaches.',
        text: 'g g g g h h h h gh gh gh gh gggg hhhh gggg hhhh',
        targetWPM: 30,
        focusFingers: ['LI', 'RI'],
        stage: 'Home Row'
    },
    {
        id: 'l13',
        title: 'Focus: V & N',
        description: 'Bottom row index reaches.',
        text: 'v v v v n n n n vn vn vn vn vvvv nnnn vvvv nnnn',
        targetWPM: 30,
        focusFingers: ['LI', 'RI'],
        stage: 'Bottom Row'
    },
    {
        id: 'l14',
        title: 'Word Mix: V & N',
        description: 'Practice bottom row reaches.',
        text: 'van end line even fine hand mind sand nave dive give',
        targetWPM: 32,
        focusFingers: ['LI', 'RI'],
        stage: 'Bottom Row'
    },
    {
        id: 'l15',
        title: 'Focus: B & M',
        description: 'More bottom row reaches.',
        text: 'b b b b m m m m bm bm bm bm bbbb mmmm bbbb mmmm',
        targetWPM: 30,
        focusFingers: ['LI', 'RI'],
        stage: 'Bottom Row'
    },
    {
        id: 'l16',
        title: 'Word Mix: B & M',
        description: 'Practice more bottom row words.',
        text: 'bank bomb barn bird back mark many mean farm harm',
        targetWPM: 32,
        focusFingers: ['LI', 'RI'],
        stage: 'Bottom Row'
    },
    {
        id: 'l17',
        title: 'Sentence Practice II',
        description: 'Full sentence with bottom row.',
        text: 'many birds flew back to the barn before the dark rain',
        targetWPM: 35,
        focusFingers: ['All'],
        stage: 'Mixed'
    },
    {
        id: 'l18',
        title: 'Focus: W & O',
        description: 'Top row ring finger reaches.',
        text: 'w w w w o o o o wo wo wo wo wwww oooo wwww oooo',
        targetWPM: 30,
        focusFingers: ['LR', 'RR'],
        stage: 'Top Row'
    },
    {
        id: 'l19',
        title: 'Focus: Q & P',
        description: 'Top row pinky reaches.',
        text: 'q q q q p p p p qp qp qp qp qqqq pppp qqqq pppp',
        targetWPM: 30,
        focusFingers: ['LP', 'RP'],
        stage: 'Top Row'
    },
    {
        id: 'l20',
        title: 'Focus: C & ,',
        description: 'Bottom row middle finger reaches.',
        text: 'c c c c , , , , c, c, c, c, cccc ,,,, cccc ,,,,',
        targetWPM: 30,
        focusFingers: ['LM', 'RM'],
        stage: 'Bottom Row'
    },
    {
        id: 'l21',
        title: 'Focus: X & .',
        description: 'Bottom row ring finger reaches.',
        text: 'x x x x . . . . x. x. x. x. xxxx .... xxxx ....',
        targetWPM: 30,
        focusFingers: ['LR', 'RR'],
        stage: 'Bottom Row'
    },
    {
        id: 'l22',
        title: 'Focus: Z & /',
        description: 'Bottom row pinky reaches.',
        text: 'z z z z / / / / z/ z/ z/ z/ zzzz //// zzzz ////',
        targetWPM: 30,
        focusFingers: ['LP', 'RP'],
        stage: 'Bottom Row'
    },
    {
        id: 'l23',
        title: 'Punctuation Mix',
        description: 'Common symbols practice.',
        text: 'did you see it? no, i did not. or maybe/perhaps i did.',
        targetWPM: 32,
        focusFingers: ['All'],
        stage: 'Punctuation'
    },
    {
        id: 'l24',
        title: 'Focus: 1 & 2',
        description: 'Left pinky number reaches.',
        text: '1 1 1 1 2 2 2 2 12 12 12 12 1111 2222 1111 2222',
        targetWPM: 25,
        focusFingers: ['LP'],
        stage: 'Numbers'
    },
    {
        id: 'l25',
        title: 'Focus: 3 & 4',
        description: 'Top row number reaches.',
        text: '3 3 3 3 4 4 4 4 34 34 34 34 3333 4444 3333 4444',
        targetWPM: 25,
        focusFingers: ['LR', 'LM'],
        stage: 'Numbers'
    },
    {
        id: 'l26',
        title: 'Focus: 5 & 6',
        description: 'Left index number reaches.',
        text: '5 5 5 5 6 6 6 6 56 56 56 56 5555 6666 5555 6666',
        targetWPM: 25,
        focusFingers: ['LI'],
        stage: 'Numbers'
    },
    {
        id: 'l27',
        title: 'Focus: 7 & 8',
        description: 'Right index number reaches.',
        text: '7 7 7 7 8 8 8 8 78 78 78 78 7777 8888 7777 8888',
        targetWPM: 25,
        focusFingers: ['RI'],
        stage: 'Numbers'
    },
    {
        id: 'l28',
        title: 'Focus: 9 & 0',
        description: 'Top row right side reaches.',
        text: '9 9 9 9 0 0 0 0 90 90 90 90 9999 0000 9999 0000',
        targetWPM: 25,
        focusFingers: ['RM', 'RR'],
        stage: 'Numbers'
    },
    {
        id: 'l29',
        title: 'Numbers Mix',
        description: 'Combine all number row reaches.',
        text: '1 2 3 4 5 6 7 8 9 0 10 20 30 40 50 60 70 80 90 100',
        targetWPM: 28,
        focusFingers: ['All'],
        stage: 'Numbers'
    },
    {
        id: 'l30',
        title: 'Final Proficiency Test',
        description: 'Prove your 60% mastery.',
        text: 'the cosmos is within us we are made of star-stuff we are a way for the universe to know itself',
        targetWPM: 40,
        focusFingers: ['All'],
        stage: 'Mixed'
    }
]
