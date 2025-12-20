import { Lesson } from '../types';

export const HERO_CURRICULUM: Lesson[] = [
    // --- PHASE 1: FOUNDATION (First Touch Strategy) ---
    {
        id: 1,
        title: "The Anchor Points",
        phase: 1,
        description: "Meet your home row anchors: F and J.",
        keys: ['f', 'j'],
        content: "f j f j ff jj fjf jfj",
        tips: ["Feel the bumps on F and J – your index fingers live here!", "Keep your fingers curved like you're holding a tennis ball."],
        passingCriteria: { accuracy: 100, wpm: 5 },
        difficulty: 1,
        target_wpm: 10
    },
    {
        id: 2,
        title: "Inner Home Row",
        phase: 1,
        description: "Adding D and K to your anchors.",
        keys: ['d', 'k'],
        content: "fd jk df kj fdd jkk dkf jdf",
        tips: ["D is for your left middle finger.", "K is for your right middle finger."],
        passingCriteria: { accuracy: 100, wpm: 8 },
        difficulty: 1,
        target_wpm: 12
    },
    {
        id: 3,
        title: "The Ring Reach",
        phase: 1,
        description: "Introducing S and L.",
        keys: ['s', 'l'],
        content: "fs dj kl sl sk dl sss lll sls dld",
        tips: ["Use your ring fingers for S and L.", "Don't look at the keyboard – trust the bumps!"],
        passingCriteria: { accuracy: 98, wpm: 10 },
        difficulty: 2,
        target_wpm: 15
    },
    {
        id: 4,
        title: "Pinky Power",
        phase: 1,
        description: "The home row is complete with A and ;.",
        keys: ['a', ';'],
        content: "asdf jkl; a; a; ds; fl a;s l;d fjk",
        tips: ["Your pinkies are small but mighty!", "Rest your palms lightly or keep them slightly elevated."],
        passingCriteria: { accuracy: 98, wpm: 12 },
        difficulty: 2,
        target_wpm: 18
    },
    {
        id: 5,
        title: "Home Row Mastery I",
        phase: 1,
        description: "Combining everything you've learned on the home row.",
        keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        content: "asdf jkl; fdsa ;lkj dads lads asks fall",
        tips: ["Focus on rhythm, not speed.", "Accuracy first, speed will follow naturally."],
        passingCriteria: { accuracy: 98, wpm: 15 },
        difficulty: 2,
        target_wpm: 20
    },
    {
        id: 6,
        title: "Home Row Mastery II",
        phase: 1,
        description: "Short common words found only on the home row.",
        keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        content: "sad dad lad add flask salad alfalfa",
        tips: ["Try to maintain a steady beat.", "Your fingers should always return to the anchor points."],
        passingCriteria: { accuracy: 99, wpm: 18 },
        difficulty: 3,
        target_wpm: 22
    },
    {
        id: 7,
        title: "The Thumb Jump",
        phase: 1,
        description: "Mastering the Spacebar with your thumbs.",
        keys: [' '],
        content: "f j d k s l a ; f j d k s l a ;",
        tips: ["Use either thumb for the spacebar.", "Don't pause too long between words."],
        passingCriteria: { accuracy: 100, wpm: 20 },
        difficulty: 3,
        target_wpm: 25
    },

    // --- PHASE 2: REACH & MECHANICS (Navigating the Board) ---
    {
        id: 11,
        title: "The Upper Reach: E and I",
        phase: 2,
        description: "Moving up to the top row with your middle fingers.",
        keys: ['e', 'i'],
        content: "de ki ed ik died eke side lake",
        tips: ["Left middle finger reaches up for E.", "Right middle finger reaches up for I."],
        passingCriteria: { accuracy: 98, wpm: 20 },
        difficulty: 3,
        target_wpm: 28
    },
    {
        id: 12,
        title: "The Upper Reach: R and U",
        phase: 2,
        description: "Index fingers reaching up for R and U.",
        keys: ['r', 'u'],
        content: "fr ju rf uj fur rude red user sure",
        tips: ["Keep your index fingers flexible.", "Return to F and J immediately after the reach."],
        passingCriteria: { accuracy: 98, wpm: 22 },
        difficulty: 3,
        target_wpm: 30
    },
    {
        id: 13,
        title: "The Upper Reach: T and Y",
        phase: 2,
        description: "Stretching the index fingers for T and Y.",
        keys: ['t', 'y'],
        content: "ft jy tf yj try toy that they stayed",
        tips: ["T and Y involve a slight diagonal stretch.", "Don't move your whole hand, just the finger."],
        passingCriteria: { accuracy: 98, wpm: 25 },
        difficulty: 4,
        target_wpm: 32
    },
    {
        id: 14,
        title: "The Tricky Bottom: C and M",
        phase: 2,
        description: "Reaching down with middle fingers.",
        keys: ['c', 'm'],
        content: "dc km cd mk come mica came mice make",
        tips: ["Curl your fingers more to reach the bottom row.", "C is left middle, M is right middle."],
        passingCriteria: { accuracy: 97, wpm: 25 },
        difficulty: 4,
        target_wpm: 35
    },
    {
        id: 15,
        title: "Bottom Row Precision: V and N",
        phase: 2,
        description: "Index fingers reaching down for V and N.",
        keys: ['v', 'n'],
        content: "fv jn vf nj van vine never view vein",
        tips: ["V and N are right below F and J.", "Feel the distance – it's shorter than the top row reach."],
        passingCriteria: { accuracy: 97, wpm: 28 },
        difficulty: 4,
        target_wpm: 38
    },
    {
        id: 16,
        title: "The Shift Mechanic",
        phase: 2,
        description: "Learning the pinky dance of the Shift key.",
        keys: ['Shift'],
        content: "Alan Jack Fred Sara Kite Lion Moon",
        tips: ["Use the opposite pinky for the Shift key.", "Hold Shift, press key, release both."],
        passingCriteria: { accuracy: 95, wpm: 25 },
        difficulty: 5,
        target_wpm: 35
    },
    {
        id: 17,
        title: "Punctuation Basics",
        phase: 2,
        description: "Introduction to Period and Comma.",
        keys: ['.', ','],
        content: "I. We, They. Run, fast. Stop. Wait,",
        tips: ["Comma is under K, Period is under L.", "Always follow a period with a space."],
        passingCriteria: { accuracy: 95, wpm: 25 },
        difficulty: 5,
        target_wpm: 35
    },

    // --- PHASE 3: SPEED EXPLOSION (Road to 100 WPM) ---
    {
        id: 31,
        title: "The Common 'THE'",
        phase: 3,
        description: "Training the most common word in English.",
        keys: ['t', 'h', 'e'],
        content: "the the the then they there their",
        tips: ["'the' should become one continuous motion.", "Notice how your fingers flow naturally."],
        passingCriteria: { accuracy: 98, wpm: 40 },
        difficulty: 5,
        target_wpm: 45
    },
    {
        id: 32,
        title: "N-Gram: -ING Cluster",
        phase: 3,
        description: "Mastering the high-speed suffix.",
        keys: ['i', 'n', 'g'],
        content: "ing ing sing song thing long king wing",
        tips: ["Think of 'ing' as a single musical chord.", "Your right hand does most of the work here."],
        passingCriteria: { accuracy: 98, wpm: 45 },
        difficulty: 6,
        target_wpm: 50
    },
    {
        id: 33,
        title: "Top 10 High-Frequency Words",
        phase: 3,
        description: "The building blocks of English text.",
        keys: [],
        content: "the be of and a to in he have it",
        tips: ["These 10 words make up 25% of all English text.", "Type them until they feel automatic."],
        passingCriteria: { accuracy: 99, wpm: 50 },
        difficulty: 6,
        target_wpm: 55
    },
    {
        id: 34,
        title: "N-Gram: -TION / -MENT",
        phase: 3,
        description: "Complex clusters for rhythmic consistency.",
        keys: ['t', 'i', 'o', 'n', 'm', 'e', 'n', 't'],
        content: "nation mention action element comment moment",
        tips: ["Keep your rhythm steady through the long suffixes.", "Use the 'ment' rhythm like a heartbeat."],
        passingCriteria: { accuracy: 98, wpm: 55 },
        difficulty: 7,
        target_wpm: 60
    },

    // --- PHASE 4: ELITE MASTERY (150+ WPM Targets) ---
    {
        id: 76,
        title: "Burst Sprint: Top Row",
        phase: 4,
        type: 'burst',
        description: "15-second high-speed burst on the upper bank.",
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        content: "power tower quite write out our your their point",
        tips: ["A burst drill focuses on raw twitch speed.", "Don't worry about rhythm, just be fast."],
        passingCriteria: { accuracy: 90, wpm: 100 },
        difficulty: 8,
        target_wpm: 120
    },
    {
        id: 77,
        title: "Master Mode: Precision I",
        phase: 4,
        isMasterMode: true,
        description: "One mistake resets the lesson. Focus on perfection.",
        keys: [],
        content: "The quality of your muscle memory is the limit of your speed.",
        tips: ["One error will restart the clock.", "Precision creates speed, not the other way around."],
        passingCriteria: { accuracy: 100, wpm: 80 },
        difficulty: 9,
        target_wpm: 90
    },
    {
        id: 78,
        title: "Difficult Combos: Pinky & Ring",
        phase: 4,
        description: "Strengthening the weakest fingers.",
        keys: ['a', 'q', 'z', 'p', 'l', 'o'],
        content: "aquarium puzzling puzzling puzzling puzzles puzzling puzzles puzzle puzzles puzzle puzzle puzzles puzzle puzzling puzzling puzzling",
        tips: ["Focus on 'qu' and 'zz' – they require strong pinky control.", "Keep your ring finger from tensing up."],
        passingCriteria: { accuracy: 98, wpm: 70 },
        difficulty: 9,
        target_wpm: 80
    },
    {
        id: 100,
        title: "The 150+ WPM Hero Finale",
        phase: 4,
        description: "The ultimate test of speed and endurance.",
        keys: [],
        content: "To reach the speed of thought, one must stop thinking about the keys and start thinking in ideas. You are the hero of your own digital world.",
        tips: ["Visualize the words as whole shapes, not individual letters.", "You have reached the elite level. Keep pushing!"],
        passingCriteria: { accuracy: 99, wpm: 150 },
        difficulty: 10,
        target_wpm: 160
    }
];
