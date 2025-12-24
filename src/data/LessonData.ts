export interface Lesson {
    id: number;
    stage: number;
    title: string;
    text: string;
    target_wpm: number;
}

export const SCIENTIFIC_CURRICULUM: Lesson[] = [
    // STAGE 1: HOME ROW
    { id: 1, stage: 1, title: "Home Row 1", text: "asdf jkl; asdf jkl;", target_wpm: 20 },
    { id: 2, stage: 1, title: "Home Row 2", text: "fjdks l;as fjdks l;as", target_wpm: 25 },
    { id: 3, stage: 1, title: "Home Row 3", text: "gh gh t y ty ty", target_wpm: 30 },
    { id: 4, stage: 1, title: "Home Row Mastery", text: "asdfghjkl; asdfghjkl;", target_wpm: 35 },

    // STAGE 2: EXPANSION
    { id: 5, stage: 2, title: "Top Row 1", text: "qwer uiop qwer uiop", target_wpm: 30 },
    { id: 6, stage: 2, title: "Bottom Row 1", text: "zxcv m,. zxcv m,.", target_wpm: 30 },
    { id: 7, stage: 2, title: "Full Keyboard", text: "the quick brown fox jumps over the lazy dog", target_wpm: 45 },

    // More lessons can be added dynamically or during runtime from Rust
];
