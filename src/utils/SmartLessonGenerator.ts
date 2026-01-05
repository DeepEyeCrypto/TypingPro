import { CURRICULUM } from '../data/lessons'
import { WeaknessProfile, WeaknessAnalyzer } from '@src/services/weaknessAnalyzer'
import { TOP_BIGRAMS, TOP_100_WORDS, generateBigramDrill } from '@src/data/wordLists'

const COMMON_WORDS = [
    'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'I', 'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one', 'would', 'all', 'will', 'there', 'say', 'who', 'make', 'when', 'can', 'more', 'if', 'no', 'man', 'out', 'other', 'so', 'what', 'time', 'up', 'go', 'about', 'than', 'into', 'could', 'state', 'only', 'new', 'year', 'some', 'take', 'come', 'these', 'know', 'see', 'use', 'get', 'like', 'then', 'first', 'any', 'work', 'now', 'may', 'such', 'give', 'over', 'think', 'most', 'even', 'find', 'day', 'also', 'after', 'way', 'many', 'must', 'look', 'before', 'great', 'back', 'through', 'long', 'where', 'much', 'should', 'well', 'people', 'down', 'own', 'just', 'because', 'good', 'each', 'those', 'feel', 'seem', 'how', 'high', 'too', 'place', 'little', 'world', 'very', 'still', 'nation', 'hand', 'old', 'life', 'tell', 'write', 'become', 'here', 'show', 'house', 'both', 'between', 'need', 'mean', 'call', 'develop', 'under', 'last', 'right', 'move', 'thing', 'general', 'school', 'never', 'same', 'another', 'begin', 'while', 'number', 'part', 'turn', 'real', 'leave', 'might', 'want', 'point', 'form', 'off', 'child', 'few', 'small', 'since', 'against', 'ask', 'late', 'home', 'interest', 'large', 'person', 'end', 'open', 'public', 'follow', 'during', 'present', 'without', 'again', 'hold', 'govern', 'around', 'possible', 'head', 'consider', 'word', 'program', 'problem', 'however', 'lead', 'system', 'set', 'order', 'eye', 'plan', 'run', 'keep', 'face', 'fact', 'group', 'play', 'stand', 'increase', 'early', 'course', 'change', 'help', 'line'
]

/**
 * Generates a smart lesson based on weak keys.
 * 
 * Logic:
 * 1. Filter dictionary for words containing weak keys.
 * 2. Fill 70% of the text with these "weak words".
 * 3. Fill 30% with common words for flow.
 * 4. Ensure logical spacing.
 */
export const SmartLessonGenerator = {
    generate: (weakKeys: string[], lengthWords: number = 30): string => {
        if (!weakKeys || weakKeys.length === 0) {
            // Fallback: Random words
            return Array.from({ length: lengthWords }, () => COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]).join(' ')
        }

        const weakSet = new Set(weakKeys.map(k => k.toLowerCase()))

        // Find words containing at least one weak key
        const weakWords = COMMON_WORDS.filter(word => {
            return word.split('').some(char => weakSet.has(char))
        })

        // If no weak words found (unlikely), fallback
        if (weakWords.length === 0) {
            return Array.from({ length: lengthWords }, () => COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]).join(' ')
        }

        const lessonWords: string[] = []

        for (let i = 0; i < lengthWords; i++) {
            // 70% chance to pick a word with a weak key
            if (Math.random() < 0.7) {
                lessonWords.push(weakWords[Math.floor(Math.random() * weakWords.length)])
            } else {
                lessonWords.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)])
            }
        }

        return lessonWords.join(' ')
    },

    getWeakKeys: (errors: Record<string, number>): string[] => {
        // Sort keys by error count descending and take top 5
        return Object.entries(errors)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([key]) => key)
    },

    /**
     * INTELLIGENT DRILL GENERATOR
     * Uses weakness profile to create targeted practice text
     * 
     * Algorithm:
     * 1. Identify critical keys (slow >200ms OR error-prone >10%)
     * 2. Generate text with:
     *    - 60% words containing critical keys
     *    - 20% bigrams using those keys
     *    - 20% common words for natural flow
     * 3. Minimum 50 words for meaningful practice
     */
    generateIntelligentDrill: async (lengthWords: number = 50): Promise<string> => {
        // Load weakness profile
        const profile = await WeaknessAnalyzer.loadProfile()

        if (!profile || profile.totalKeysTracked === 0) {
            // No data yet, return random common words
            return Array.from({ length: lengthWords }, () =>
                COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]
            ).join(' ')
        }

        // Get critical keys
        const criticalKeys = WeaknessAnalyzer.getCriticalKeys(profile)

        if (criticalKeys.length === 0) {
            // No weaknesses, use TOP_100_WORDS for general practice
            return Array.from({ length: lengthWords }, () =>
                TOP_100_WORDS[Math.floor(Math.random() * TOP_100_WORDS.length)]
            ).join(' ')
        }

        const criticalSet = new Set(criticalKeys.map(k => k.toLowerCase()))

        // Find words containing critical keys
        const weakWords = [...COMMON_WORDS, ...TOP_100_WORDS].filter(word =>
            word.split('').some(char => criticalSet.has(char))
        )

        // Find bigrams containing critical keys
        const relevantBigrams = TOP_BIGRAMS.filter(bigram =>
            bigram.split('').some(char => criticalSet.has(char))
        )

        const lessonWords: string[] = []

        for (let i = 0; i < lengthWords; i++) {
            const rand = Math.random()

            if (rand < 0.6 && weakWords.length > 0) {
                // 60% words with critical keys
                lessonWords.push(weakWords[Math.floor(Math.random() * weakWords.length)])
            } else if (rand < 0.8 && relevantBigrams.length > 0) {
                // 20% bigrams
                lessonWords.push(relevantBigrams[Math.floor(Math.random() * relevantBigrams.length)])
            } else {
                // 20% common words for flow
                lessonWords.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)])
            }
        }

        return lessonWords.join(' ')
    },

    /**
     * Get a descriptive title for the intelligent drill
     */
    getIntelligentDrillTitle: async (): Promise<string> => {
        const profile = await WeaknessAnalyzer.loadProfile()

        if (!profile || profile.totalKeysTracked === 0) {
            return 'General Practice'
        }

        const criticalKeys = WeaknessAnalyzer.getCriticalKeys(profile)

        if (criticalKeys.length === 0) {
            return 'Maintenance Practice'
        }

        const keyList = criticalKeys.slice(0, 5).join(', ').toUpperCase()
        return `Focus: ${keyList}`
    }
}
