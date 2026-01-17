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
    },
    // ─────────────────────────────────────────
    // PHASE 3: SPEED BUILDING (l31-l38)
    // ─────────────────────────────────────────
    {
        id: 'l31',
        title: 'Common Words I',
        description: 'Top 50 most frequent English words.',
        text: 'the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us',
        targetWPM: 45,
        focusFingers: ['All'],
        stage: 'Speed'
    },
    {
        id: 'l32',
        title: 'Common Words II',
        description: 'Top 100 words mixed practice.',
        text: 'find give day more made may part after back little only round man year came show every good me give our under name very just form great think say help low line before turn cause same mean differ move right boy old too does tell sentence set three want air well also play small end put home read hand port large spell add even land here must big high such follow act why ask men change went light kind off need house picture try us again animal point mother world near build self earth father',
        targetWPM: 48,
        focusFingers: ['All'],
        stage: 'Speed'
    },
    {
        id: 'l33',
        title: 'Short Sentences I',
        description: 'Simple declarative sentences.',
        text: 'The sun rises in the east. Birds fly south for winter. Water flows downhill naturally. Time waits for no one. Practice makes perfect daily. Books open new worlds. Music soothes the soul. Friends make life better. Dreams fuel our ambitions. Learning never stops growing.',
        targetWPM: 50,
        focusFingers: ['All'],
        stage: 'Speed'
    },
    {
        id: 'l34',
        title: 'Short Sentences II',
        description: 'Sentences with punctuation practice.',
        text: 'Can you help me? Yes, I can! Where are you going? I am going home. When will you return? I will return soon. What do you need? I need your support. How did it happen? It happened suddenly, without warning.',
        targetWPM: 50,
        focusFingers: ['All'],
        stage: 'Speed'
    },
    {
        id: 'l35',
        title: 'Speed Burst: 15 Seconds',
        description: 'Quick burst typing for accuracy.',
        text: 'quick brown fox jumps over lazy dog pack my box with five dozen liquor jugs how vexingly quick daft zebras jump',
        targetWPM: 55,
        focusFingers: ['All'],
        stage: 'Speed'
    },
    {
        id: 'l36',
        title: 'Speed Burst: 30 Seconds',
        description: 'Extended burst for rhythm.',
        text: 'the five boxing wizards jump quickly sphinx of black quartz judge my vow how quickly daft jumping zebras vex pack my red box with five dozen quality jugs watch jeopardy alex trebek is a great quiz show host',
        targetWPM: 55,
        focusFingers: ['All'],
        stage: 'Speed'
    },
    {
        id: 'l37',
        title: 'Rhythm Building',
        description: 'Consistent pace development.',
        text: 'type type type flow flow flow speed speed speed fast fast fast quick quick quick smooth smooth smooth steady steady steady rhythm rhythm rhythm practice practice practice',
        targetWPM: 55,
        focusFingers: ['All'],
        stage: 'Speed'
    },
    {
        id: 'l38',
        title: 'Speed Gate Exam',
        description: 'Prove 55+ WPM to unlock Fluency.',
        text: 'Speed is nothing without accuracy. The key to typing fast is to type correctly first and then gradually increase your pace. Your fingers will remember the patterns, and soon you will fly across the keyboard without thinking.',
        targetWPM: 55,
        focusFingers: ['All'],
        stage: 'Speed'
    },
    // ─────────────────────────────────────────
    // PHASE 4: FLUENCY (l39-l45)
    // ─────────────────────────────────────────
    {
        id: 'l39',
        title: 'Paragraph: Technology',
        description: 'Sustained typing with tech content.',
        text: 'Technology has transformed the way we live and work. From smartphones to artificial intelligence, innovations continue to reshape our daily experiences. The digital age has brought unprecedented connectivity, allowing people across the globe to communicate instantly and share ideas freely.',
        targetWPM: 55,
        focusFingers: ['All'],
        stage: 'Fluency'
    },
    {
        id: 'l40',
        title: 'Paragraph: Nature',
        description: 'Flowing prose about the natural world.',
        text: 'The forest awakens at dawn with a symphony of birdsong. Dewdrops glisten on spider webs like tiny diamonds catching the first rays of sunlight. A gentle breeze rustles through the leaves, carrying the fresh scent of pine and earth. Nature reminds us to slow down and appreciate the simple beauty around us.',
        targetWPM: 58,
        focusFingers: ['All'],
        stage: 'Fluency'
    },
    {
        id: 'l41',
        title: 'Numbers in Context',
        description: 'Typing numbers within sentences.',
        text: 'The meeting is scheduled for 10:30 AM on December 15, 2026. Please bring 3 copies of the 25-page report. The budget is $45,000 with a 12% contingency. Our team of 8 developers completed 147 tasks in just 90 days.',
        targetWPM: 50,
        focusFingers: ['All'],
        stage: 'Fluency'
    },
    {
        id: 'l42',
        title: 'Symbols & Special Characters',
        description: 'Email, URLs, and common symbols.',
        text: 'Contact us at support@typingpro.app or visit https://typingpro.app for more info. Use code SAVE20 for 20% off! Price: $99.99 (was $149.99). Terms & conditions apply. Copyright © 2026 TypingPro. All rights reserved.',
        targetWPM: 45,
        focusFingers: ['All'],
        stage: 'Fluency'
    },
    {
        id: 'l43',
        title: 'Mixed Content: Email',
        description: 'Professional email typing practice.',
        text: 'Dear Mr. Johnson, Thank you for your inquiry regarding our services. I am pleased to inform you that we can accommodate your request for the project starting on March 1st. Please find attached the proposal with detailed pricing and timeline. Best regards, Sarah Thompson, Senior Account Manager',
        targetWPM: 55,
        focusFingers: ['All'],
        stage: 'Fluency'
    },
    {
        id: 'l44',
        title: 'Mixed Content: Report',
        description: 'Business report excerpt.',
        text: 'Q3 2026 Performance Summary: Revenue increased by 23% year-over-year, reaching $4.5 million. Customer acquisition cost decreased from $85 to $62, a 27% improvement. Net Promoter Score improved to 72, up from 65 in Q2. Key initiatives for Q4 include expanding to 3 new markets and launching version 2.0 of our flagship product.',
        targetWPM: 55,
        focusFingers: ['All'],
        stage: 'Fluency'
    },
    {
        id: 'l45',
        title: 'Fluency Gate Exam',
        description: 'Prove 60+ WPM to unlock Mastery.',
        text: 'Fluency in typing is like fluency in a language. It requires consistent practice, patience, and the willingness to push beyond your comfort zone. As you develop muscle memory, your fingers will dance across the keys effortlessly. The goal is not just speed, but the seamless flow of thought to text.',
        targetWPM: 60,
        focusFingers: ['All'],
        stage: 'Fluency'
    },
    // ─────────────────────────────────────────
    // PHASE 5: MASTERY (l46-l48)
    // ─────────────────────────────────────────
    {
        id: 'l46',
        title: 'Professional: Legal Text',
        description: 'Formal legal document typing.',
        text: 'WHEREAS, the parties hereto desire to enter into this Agreement for the purposes set forth herein; NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:',
        targetWPM: 55,
        focusFingers: ['All'],
        stage: 'Mastery'
    },
    {
        id: 'l47',
        title: 'Technical: Code Comments',
        description: 'Programming documentation style.',
        text: '// Initialize the application state with default values const initState = { user: null, isLoading: true, error: null }; // Handle async data fetching with proper error boundaries async function fetchData(url) { try { const response = await fetch(url); return response.json(); } catch (err) { console.error(err); } }',
        targetWPM: 50,
        focusFingers: ['All'],
        stage: 'Mastery'
    },
    {
        id: 'l48',
        title: 'Mastery Gate Exam',
        description: 'Prove 70+ WPM to unlock Professional.',
        text: 'Mastery is the result of deliberate practice over time. Every keystroke builds upon the last, creating neural pathways that transform conscious effort into automatic execution. The journey from novice to expert requires dedication, but the rewards—both in productivity and confidence—are immeasurable. You are now ready for the professional tier.',
        targetWPM: 70,
        focusFingers: ['All'],
        stage: 'Mastery'
    },
    // ─────────────────────────────────────────
    // PHASE 6: PROFESSIONAL (l49-l50)
    // ─────────────────────────────────────────
    {
        id: 'l49',
        title: 'Competitive Ready',
        description: 'Race-level speed and accuracy.',
        text: 'The quick brown fox jumps over the lazy dog near the riverbank where wildflowers bloom in vibrant colors during the warm summer months. Pack my box with five dozen liquor jugs before the guests arrive for the evening celebration. How vexingly quick daft zebras jump through the golden savanna at twilight.',
        targetWPM: 80,
        focusFingers: ['All'],
        stage: 'Pro'
    },
    {
        id: 'l50',
        title: 'Certification Test',
        description: 'Official TypingPro proficiency exam.',
        text: 'This is your final certification test. Type with precision and confidence. Every word matters. Every keystroke counts. You have trained for this moment. Trust your fingers. Flow with the rhythm. Let the words pour from your mind to the screen without hesitation. You are a professional typist. Prove it now.',
        targetWPM: 90,
        focusFingers: ['All'],
        stage: 'Pro'
    }
]
