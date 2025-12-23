import { TOP_200_WORDS } from '../../../constants/dictionaries';
import { PracticeMode, Lesson, ModeConfig } from '../../../types';

export class PracticeEngine {
    /**
     * Generates content based on the provided mode configuration.
     */
    static generateContent(config: ModeConfig, lessons: Lesson[]): string {
        switch (config.mode) {
            case 'curriculum':
                // For curriculum, we find the lesson and use its content
                // This is a fallback; usually TypingPage handles currentLesson
                return "";

            case 'words':
                return this.generateRandomWords(config.wordCount || 50);

            case 'time':
                // Generate a large pool for time mode, typically enough for any speed
                return this.generateRandomWords(200);

            case 'custom':
                return this.cleanText(config.customText || "");

            case 'smart':
                // Placeholder for Keybr-style logic (will be implemented in Phase 2)
                return this.generateRandomWords(30);

            default:
                return "Type to start your journey.";
        }
    }

    private static generateRandomWords(count: number): string {
        const result: string[] = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * TOP_200_WORDS.length);
            result.push(TOP_200_WORDS[randomIndex]);
        }
        return result.join(' ');
    }

    /**
     * Cleans user-pasted text by removing extra whitespace and newlines.
     */
    private static cleanText(text: string): string {
        return text
            .replace(/\r?\n|\r/g, ' ') // Replace newlines with spaces
            .replace(/\s\s+/g, ' ')    // Replace multiple spaces with single space
            .trim();
    }
}
