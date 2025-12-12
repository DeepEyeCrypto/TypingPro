import { KeyStats, Lesson } from "../types";

/**
 * Generates a focused drill lesson based on problem keys.
 * If no problem keys are found, defaults to a general mix.
 */
export const generateDrill = (keyStats: Record<string, KeyStats>): Lesson => {
    // 1. Identify weakest keys (lowest accuracy)
    const weakKeys = Object.values(keyStats)
        .filter(k => k.totalPresses > 10 && k.accuracy < 90) // Thresholds
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 5) // Focus on top 5 worst keys
        .map(k => k.char);

    // If no specific weak keys, pick random common letters
    const targetKeys = weakKeys.length > 0 ? weakKeys : ['a', 'e', 'r', 's', 't', 'l', 'n'];

    // 2. Generate content
    // Simple algorithm: Generate random "words" or patterns using these keys
    // Enhancements: Dictionary lookup for real words containing these keys.
    // For now, we will use a pattern generator.

    const content = generatePatterns(targetKeys, 30); // 30 words

    return {
        id: -1, // Special ID for generated lessons
        title: weakKeys.length > 0 ? `Practice: ${weakKeys.join(', ').toUpperCase()}` : "Speed Drill",
        description: "Personalized drill based on your accuracy.",
        keys: targetKeys,
        content: content,
        isAiGenerated: true
    };
};

const generatePatterns = (keys: string[], count: number): string => {
    const patterns: string[] = [];
    for (let i = 0; i < count; i++) {
        const len = Math.floor(Math.random() * 4) + 3; // 3-6 chars
        let word = "";
        for (let j = 0; j < len; j++) {
            word += keys[Math.floor(Math.random() * keys.length)];
        }
        patterns.push(word);
    }
    return patterns.join(' ');
};

/**
 * Analytics helper to find commonly mistyped keys
 */
export const getWeakestKeys = (keyStats: Record<string, KeyStats>): KeyStats[] => {
    return Object.values(keyStats)
        .filter(k => k.errorCount > 0)
        .sort((a, b) => a.accuracy - b.accuracy);
};
