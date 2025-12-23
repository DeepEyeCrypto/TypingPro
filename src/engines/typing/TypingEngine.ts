import { KeystrokeEvent, PracticeMode } from '../../../types';
import { StatsCalculator, TypingStats } from './StatsCalculator';

export interface EngineState {
    cursorIndex: number;
    errors: number[];
    combo: number;
    startTime: number | null;
    keystrokeLog: KeystrokeEvent[];
    wpmTimeline: { timestamp: number; wpm: number }[];
    isComplete: boolean;
    timeLeft: number;
    extraChars: Record<number, string[]>;
    stats: TypingStats | null;
    words: { word: string, chars: { char: string, idx: number }[], spaceIdx: number, wordIdx: number }[];
}

export class TypingEngine {
    private state: EngineState;
    private content: string;
    private words: { word: string, chars: { char: string, idx: number }[], spaceIdx: number, wordIdx: number }[];
    private stopOnError: boolean;
    private mode: PracticeMode;
    private duration: number;

    constructor(content: string, options: { stopOnError: boolean, mode: PracticeMode, duration: number }) {
        this.content = content.trim(); // Ensure no trailing/leading junk
        this.stopOnError = options.stopOnError;
        this.mode = options.mode;
        this.duration = options.duration;
        this.words = this.parseWords(this.content);
        this.state = this.getInitialState();
    }

    private parseWords(content: string) {
        let currentIdx = 0;
        return content.split(' ').map((word, wordIdx, array) => {
            const chars = word.split('').map(char => ({ char, idx: currentIdx++ }));
            const isLast = wordIdx === array.length - 1;
            const spaceIdx = isLast ? -1 : currentIdx++;
            return { word, chars, spaceIdx, wordIdx };
        });
    }

    private getInitialState(): EngineState {
        return {
            cursorIndex: 0,
            errors: [],
            combo: 0,
            startTime: null,
            keystrokeLog: [],
            wpmTimeline: [],
            isComplete: false,
            timeLeft: this.duration,
            extraChars: {},
            stats: null,
            words: this.words
        };
    }

    public handleKeyDown(key: string, timestamp: number = Date.now()): { isCorrect: boolean, state: EngineState } {
        if (this.state.isComplete) return { isCorrect: false, state: this.state };

        const currentIndex = this.state.cursorIndex;
        const activeWord = this.words.find(w => currentIndex >= w.chars[0].idx && (w.spaceIdx === -1 || currentIndex <= w.spaceIdx));

        // 1. Handle Backspace for extra characters
        if (key === 'Backspace' && activeWord) {
            const extras = this.state.extraChars[activeWord.wordIdx] || [];
            if (extras.length > 0) {
                this.state.extraChars[activeWord.wordIdx] = extras.slice(0, -1);
                return { isCorrect: true, state: this.state };
            }
        }

        if (key === 'Backspace') {
            if (this.state.cursorIndex > 0) {
                this.state.cursorIndex -= 1;
                this.state.errors = this.state.errors.filter(e => e !== this.state.cursorIndex);
            }
            return { isCorrect: true, state: this.state };
        }

        // 2. Ignore non-printable keys
        if (key.length > 1 && !['Enter', 'Escape', 'Tab'].includes(key)) {
            return { isCorrect: true, state: this.state };
        }

        // 3. Start timer on first key
        if (!this.state.startTime) {
            this.state.startTime = timestamp;
        }

        // 4. Handle Extra Characters (if at end of word)
        if (activeWord) {
            const isAtWordEnd = currentIndex === (activeWord.spaceIdx === -1 ? activeWord.chars[activeWord.chars.length - 1].idx + 1 : activeWord.spaceIdx);
            if (isAtWordEnd && key !== ' ') {
                if (!this.state.extraChars[activeWord.wordIdx]) this.state.extraChars[activeWord.wordIdx] = [];
                this.state.extraChars[activeWord.wordIdx].push(key);
                return { isCorrect: false, state: this.state };
            }
        }

        // 5. Normal character handling
        const targetChar = this.content[this.state.cursorIndex];
        const isCorrect = key === targetChar;

        const lastEvent = this.state.keystrokeLog[this.state.keystrokeLog.length - 1];
        const prevTimestamp = lastEvent ? lastEvent.timestamp : this.state.startTime;

        const event: KeystrokeEvent = {
            char: key,
            code: '',
            timestamp,
            latency: timestamp - prevTimestamp,
            isError: !isCorrect,
            expectedChar: targetChar
        };
        this.state.keystrokeLog.push(event);

        if (isCorrect) {
            this.state.cursorIndex += 1;
            this.state.combo += 1;
        } else {
            this.state.combo = 0;
            if (!this.state.errors.includes(this.state.cursorIndex)) {
                this.state.errors.push(this.state.cursorIndex);
            }
            if (!this.stopOnError) {
                this.state.cursorIndex += 1;
            }
        }

        this.checkCompletion();
        this.recalculateStats(timestamp);

        return { isCorrect, state: this.state };
    }

    private checkCompletion() {
        if (this.mode !== 'time' && this.state.cursorIndex >= this.content.length) {
            this.state.isComplete = true;
        }
    }

    private recalculateStats(now: number) {
        if (!this.state.startTime) return;

        const timeSeconds = (now - this.state.startTime) / 1000;
        const correctChars = this.state.cursorIndex - this.state.errors.length;

        this.state.stats = StatsCalculator.getSnapshot(
            correctChars,
            this.state.errors.length,
            this.state.keystrokeLog.length,
            timeSeconds
        );

        // Update timeline every few characters for charts
        if (this.state.cursorIndex > 0 && this.state.cursorIndex % 5 === 0) {
            this.state.wpmTimeline.push({ timestamp: now, wpm: this.state.stats.wpm });
        }
    }

    public updateTimeLeft(now: number): number {
        if (this.mode === 'time' && this.state.startTime && !this.state.isComplete) {
            const elapsed = Math.floor((now - this.state.startTime) / 1000);
            this.state.timeLeft = Math.max(0, this.duration - elapsed);
            if (this.state.timeLeft === 0) {
                this.state.isComplete = true;
                this.recalculateStats(now);
            }
        }
        return this.state.timeLeft;
    }

    public handleKeyUp(key: string, now: number) {
        for (let i = this.state.keystrokeLog.length - 1; i >= 0; i--) {
            const entry = this.state.keystrokeLog[i];
            if (entry.char === key && entry.holdTime === undefined) {
                entry.holdTime = now - entry.timestamp;
                break;
            }
        }
    }

    public reset() {
        this.state = this.getInitialState();
    }

    public getState(): EngineState {
        return { ...this.state };
    }
}

