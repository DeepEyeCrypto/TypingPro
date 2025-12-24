export interface Lesson {
    id: number;
    stage: number;
    title: string;
    text: string;
    targetWpm: number;
}

export const CURRICULUM_V2: Lesson[] = [
    // STAGE 1: FOUNDATION
    { id: 1, stage: 1, title: "Home Row 1", text: "asdf jkl; asdf jkl;", targetWpm: 20 },
    { id: 2, stage: 1, title: "Home Row 2", text: "fjdks l;as fjdks l;as", targetWpm: 25 },
    // ... (Abbreviated for brevity, normally 100 lessons)

    // STAGE 5: SPEED BUILDING
    { id: 50, stage: 5, title: "Common Digraphs", text: "the then that there her he here in into ever very", targetWpm: 60 },

    // STAGE 10: ELITE MASTERY
    { id: 100, stage: 10, title: "The Sovereign Speed", text: "Antigravity is the ultimate synthesis of human intent and computational precision. To type at the speed of thought is to become one with the machine.", targetWpm: 150 },
];
