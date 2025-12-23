export interface TypingStats {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    correctChars: number;
    errorChars: number;
    totalChars: number;
    timeSeconds: number;
}

export class StatsCalculator {
    /**
     * Calculates WPM using the standard formula: ((correctChars) / 5) / (timeMinutes)
     * Note: Monkeytype uses ((correctChars + correctSpaces) / 5) / (timeMinutes)
     */
    static calculateWpm(correctChars: number, timeSeconds: number): number {
        if (timeSeconds <= 0) return 0;
        const words = correctChars / 5;
        const minutes = timeSeconds / 60;
        return Math.round(words / minutes);
    }

    /**
     * Calculates raw WPM (all keystrokes / 5) / (timeMinutes)
     */
    static calculateRawWpm(totalKeystrokes: number, timeSeconds: number): number {
        if (timeSeconds <= 0) return 0;
        const words = totalKeystrokes / 5;
        const minutes = timeSeconds / 60;
        return Math.round(words / minutes);
    }

    /**
     * Calculates accuracy: (correctInputs / totalInputs) * 100
     */
    static calculateAccuracy(correctInputs: number, totalInputs: number): number {
        if (totalInputs <= 0) return 100;
        return Math.round((correctInputs / totalInputs) * 100);
    }

    /**
     * Generates a full stats snapshot
     */
    static getSnapshot(
        correctChars: number,
        errorChars: number,
        totalKeystrokes: number,
        timeSeconds: number
    ): TypingStats {
        return {
            wpm: this.calculateWpm(correctChars, timeSeconds),
            rawWpm: this.calculateRawWpm(totalKeystrokes, timeSeconds),
            accuracy: this.calculateAccuracy(correctChars, totalKeystrokes),
            correctChars,
            errorChars,
            totalChars: totalKeystrokes,
            timeSeconds
        };
    }
}
