import { Stats, WeaknessHeatmap, Lesson, LessonProgress, WeaknessData } from '../../types';

export class AdaptiveEngine {
    /**
     * Decides if the user should progress to the next lesson or review current weaknesses.
     */
    static decideNextStep(
        currentLessonId: number,
        sessionStats: Stats,
        progress: Record<number, LessonProgress>,
        heatmap: WeaknessHeatmap
    ): { type: 'next' | 'repeat' | 'drill'; target?: number; chars?: string[] } {

        const accuracy = sessionStats.accuracy;
        const wpm = sessionStats.wpm;

        // 1. Critical Failure: High errors
        if (accuracy < 90) {
            return { type: 'repeat' };
        }

        // 2. Weakness Detection: Significant hesitation/errors on specific keys
        const worstKeys = Object.entries(heatmap)
            .filter(([_, data]) => (data as WeaknessData).accuracy < 85 || (data as WeaknessData).avgLatency > 500)
            .sort((a, b) => (b[1] as WeaknessData).errorCount - (a[1] as WeaknessData).errorCount)
            .slice(0, 4);

        if (worstKeys.length >= 3) {
            return {
                type: 'drill',
                chars: worstKeys.map(k => k[0])
            };
        }

        // 3. Mastery: High accuracy and sufficient speed
        const passingAccuracy = 98;
        const targetWpm = 30; // Base target, can be dynamic

        if (accuracy >= passingAccuracy && wpm >= targetWpm) {
            return { type: 'next', target: currentLessonId + 1 };
        }

        // 4. Default: Suggest repeating for better speed/precision
        return { type: 'repeat' };
    }

    /**
     * Generates a custom drill string based on target characters.
     */
    static generateDrill(chars: string[]): string {
        const segments: string[] = [];
        const charPool = chars.length > 0 ? chars : ['f', 'j'];

        for (let i = 0; i < 20; i++) {
            let word = '';
            for (let j = 0; j < Math.ceil(Math.random() * 4) + 1; j++) {
                word += charPool[Math.floor(Math.random() * charPool.length)];
            }
            segments.push(word);
        }

        return segments.join(' ');
    }
}
