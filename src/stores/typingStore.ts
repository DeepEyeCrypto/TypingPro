import { create } from 'zustand';
import { EngineState } from '../engines/typing/TypingEngine';

interface TypingState {
    currentLessonId: number | null;
    currentText: string;
    isStarted: boolean;
    isComplete: boolean;
    wpm: number;
    accuracy: number;
    time: number;
    errors: number[];
    cursorIndex: number;

    // Actions
    setLesson: (id: number, text: string) => void;
    startTest: () => void;
    updateStats: (wpm: number, accuracy: number, time: number) => void;
    updateProgress: (cursorIndex: number, errors: number[]) => void;
    setComplete: (complete: boolean) => void;
    reset: () => void;
}

export const useTypingStore = create<TypingState>((set) => ({
    currentLessonId: null,
    currentText: '',
    isStarted: false,
    isComplete: false,
    wpm: 0,
    accuracy: 0,
    time: 0,
    errors: [],
    cursorIndex: 0,

    setLesson: (id, text) => set({
        currentLessonId: id,
        currentText: text,
        isStarted: false,
        isComplete: false,
        wpm: 0,
        accuracy: 0,
        time: 0,
        errors: [],
        cursorIndex: 0
    }),

    startTest: () => set({ isStarted: true }),

    updateStats: (wpm, accuracy, time) => set({ wpm, accuracy, time }),

    updateProgress: (cursorIndex, errors) => set({ cursorIndex, errors }),

    setComplete: (complete) => set({ isComplete: complete }),

    reset: () => set({
        isStarted: false,
        isComplete: false,
        wpm: 0,
        accuracy: 0,
        time: 0,
        errors: [],
        cursorIndex: 0
    }),
}));
