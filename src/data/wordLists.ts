/**
 * ELITE CURRICULUM WORD LISTS
 * Scientifically curated word sets for 0-250 WPM progression
 */

// ============================================================================
// STAGE 1: HOME ROW MASTERY (0-40 WPM)
// ============================================================================

export const HOME_ROW_CHARS = {
    level1: ['f', 'j', ' '],
    level2: ['f', 'j', 'd', 'k', ' '],
    level3: ['f', 'j', 'd', 'k', 's', 'l', ' '],
    level4: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', ' ']
}

export const HOME_ROW_WORDS = [
    'sad', 'dad', 'lad', 'fad', 'add', 'all', 'fall', 'lass', 'lass', 'flask',
    'salad', 'falls', 'alls', 'ask', 'asks', 'lass', 'fads', 'lads', 'dads',
    'glad', 'gala', 'gals', 'saga', 'sagas', 'ala', 'alas', 'alfa'
]

// ============================================================================
// STAGE 2: COORDINATION (40-80 WPM) - BIGRAM DRILLS
// ============================================================================

// Top 50 most frequent English bigrams (letter pairs)
export const TOP_BIGRAMS = [
    'th', 'he', 'in', 'er', 'an', 're', 'on', 'at', 'en', 'nd',
    'ti', 'es', 'or', 'te', 'of', 'ed', 'is', 'it', 'al', 'ar',
    'st', 'to', 'nt', 'ng', 'se', 've', 'ha', 'as', 'ou', 'io',
    'le', 'wa', 'hi', 'ne', 'me', 'de', 'co', 'ra', 'ro', 'li',
    'ic', 'be', 'ma', 'si', 'om', 'ur', 'ca', 'el', 'ta', 'ec'
]

// Bigram practice sentences
export const BIGRAM_SENTENCES = [
    'the end is near',
    'there are many things to do',
    'enter the room and sit down',
    'they have time for this task',
    'another great idea comes forth',
    'these events are starting soon',
    'create better outcomes today',
    'people gather around the table'
]

// ============================================================================
// STAGE 3: RHYTHM & ACCURACY (80-120 WPM)
// ============================================================================

export const ACCURACY_SENTENCES = [
    'practice makes perfect every single time',
    'focus on accuracy before speed matters',
    'consistent typing builds muscle memory fast',
    'avoid errors by keeping steady rhythm',
    'quality over quantity wins the race',
    'smooth keystrokes create better results',
    'patience and precision lead to mastery',
    'zero mistakes mean total concentration'
]

export const PUNCTUATION_PRACTICE = [
    'hello, world! how are you today?',
    'yes, i can do this; it\'s not hard.',
    'wait! stop, think, and then proceed.',
    'she said, "practice makes perfect."',
    'the quick brown fox jumps over...',
    'really? that\'s amazing! tell me more.',
    'first, second, third; got it?',
    'why not? it\'s worth a try!'
]

// ============================================================================
// STAGE 4: WORD CHUNKING (120-180 WPM) - TOP 1000 COMMON WORDS
// ============================================================================

export const TOP_100_WORDS = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
]

export const TOP_1000_WORDS = [
    ...TOP_100_WORDS,
    'find', 'tell', 'ask', 'may', 'great', 'where', 'much', 'before', 'move', 'right',
    'too', 'any', 'same', 'hand', 'high', 'show', 'why', 'turn', 'here', 'must',
    // Additional 880 words would go here in production
    'place', 'made', 'live', 'where', 'after', 'back', 'little', 'only', 'round', 'man'
]

// 5-word burst training sentences
export const BURST_SENTENCES = [
    'the quick brown fox jumps',
    'she can run very fast',
    'time flies when having fun',
    'keep your eyes on prize',
    'work hard and stay focused',
    'never give up on dreams',
    'practice makes perfect every day',
    'always believe in your skills',
    'speed comes from good habits',
    'type fast but stay accurate',
    'push limits and break records',
    'master the art of typing',
    'focus brings success and growth',
    'every keystroke counts in life',
    'rhythm and flow create speed'
]

// ============================================================================
// STAGE 5: ELITE REFLEXES (180-250 WPM) - N-GRAMS & CODE
// ============================================================================

// Top tri-grams (3-letter sequences)
export const TOP_TRIGRAMS = [
    'the', 'and', 'ing', 'her', 'hat', 'his', 'tha', 'ere', 'for', 'ent',
    'ion', 'ter', 'was', 'you', 'ith', 'ver', 'all', 'wit', 'thi', 'tio'
]

// Top quad-grams (4-letter sequences)
export const TOP_QUADGRAMS = [
    'that', 'ther', 'with', 'tion', 'here', 'ould', 'ight', 'have', 'hich', 'whic',
    'this', 'thin', 'they', 'atio', 'ever', 'from', 'ough', 'were', 'hing', 'ment'
]

// Technical typing - Code snippets
export const CODE_SNIPPETS = {
    rust: [
        'fn main() {',
        'let mut x = 0;',
        'println!("Hello, world!");',
        'impl Display for MyType {',
        'match result {',
        'Some(val) => val,',
        'None => return Err("error"),',
        'use std::collections::HashMap;',
        'pub struct Point { x: f64, y: f64 }',
        'async fn fetch_data() -> Result<(), Error> {'
    ],
    python: [
        'def calculate_sum(a, b):',
        'return a + b',
        'for i in range(10):',
        'print(f"Value: {i}")',
        'if x > 0 and y < 100:',
        'class DataProcessor:',
        '    def __init__(self):',
        'import numpy as np',
        'with open("file.txt") as f:',
        'lambda x: x ** 2'
    ],
    javascript: [
        'const arrow = () => {',
        'function getData() {',
        'return fetch(url)',
        '.then(res => res.json())',
        'let [a, b] = [1, 2];',
        'const { name, age } = obj;',
        'async function load() {',
        'try { await api.get() }',
        'catch (err) { console.log(err) }',
        'export default Component;'
    ],
    cpp: [
        'int main() {',
        'std::cout << "Output" << std::endl;',
        'std::vector<int> vec;',
        'for (auto& item : items) {',
        'template<typename T>',
        'class MyClass {',
        'public:',
        '    void method() const;',
        'std::unique_ptr<int> ptr;',
        'return EXIT_SUCCESS;'
    ]
}

// Advanced n-gram sentences
export const NGRAM_SENTENCES = [
    'the implementation of the algorithm was thorough',
    'their contribution to the project was significant',
    'within the context of the situation',
    'through the process of elimination',
    'without hesitation they continued forward',
    'the configuration required immediate attention',
    'throughout the entire duration of testing',
    'the information provided was comprehensive'
]

// ============================================================================
// GENERATOR FUNCTIONS
// ============================================================================

export function generateBigramDrill(bigrams: string[], length: number = 40): string {
    const words: string[] = []
    let charCount = 0

    while (charCount < length) {
        const bigram = bigrams[Math.floor(Math.random() * bigrams.length)]
        words.push(bigram)
        charCount += bigram.length + 1
    }

    return words.join(' ')
}

export function generateWordChunks(wordList: string[], count: number = 10): string {
    const shuffled = [...wordList].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count).join(' ')
}

export function generateCodeSnippet(language: keyof typeof CODE_SNIPPETS): string {
    const snippets = CODE_SNIPPETS[language]
    const randomSnippets = []
    for (let i = 0; i < 5; i++) {
        randomSnippets.push(snippets[Math.floor(Math.random() * snippets.length)])
    }
    return randomSnippets.join('\n')
}

export function generateHomeRowText(level: 1 | 2 | 3 | 4, length: number = 50): string {
    const chars = HOME_ROW_CHARS[`level${level}` as keyof typeof HOME_ROW_CHARS]
    let text = ''

    for (let i = 0; i < length; i++) {
        if (i > 0 && i % 10 === 0) {
            text += ' '
        } else {
            text += chars[Math.floor(Math.random() * chars.length)]
        }
    }

    return text.trim()
}
