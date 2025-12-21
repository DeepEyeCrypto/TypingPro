export interface Theme {
    name: string;
    background: string;
    main: string; // Used for UI and active word
    sub: string;  // Used for upcoming/faded text
    accent: string;
    caret: string;
    error: string;
    success: string;
}

export const THEMES: Record<string, Theme> = {
    midnight: {
        name: "Midnight",
        background: "#020617",
        main: "#e2e8f0",
        sub: "#475569",
        accent: "#38bdf8",
        caret: "#38bdf8",
        error: "#ef4444",
        success: "#10b981"
    },
    calm: {
        name: "Calm",
        background: "#1e1e2e",
        main: "#cdd6f4",
        sub: "#6c7086",
        accent: "#cba6f7",
        caret: "#cba6f7",
        error: "#f38ba8",
        success: "#a6e3a1"
    },
    solar: {
        name: "Solar",
        background: "#fdf6e3",
        main: "#657b83",
        sub: "#93a1a1",
        accent: "#b58900",
        caret: "#b58900",
        error: "#dc322f",
        success: "#859900"
    },
    neon: {
        name: "Neon",
        background: "#09090b",
        main: "#fafafa",
        sub: "#3f3f46",
        accent: "#22c55e",
        caret: "#22c55e",
        error: "#ef4444",
        success: "#22c55e"
    },
    paper: {
        name: "Paper",
        background: "#eeeeee",
        main: "#444444",
        sub: "#b2b2b2",
        accent: "#d45500",
        caret: "#d45500",
        error: "#fb4934",
        success: "#b8bb26"
    },
    nord: {
        name: "Nord",
        background: "#2e3440",
        main: "#eceff4",
        sub: "#4c566a",
        accent: "#88c0d0",
        caret: "#88c0d0",
        error: "#bf616a",
        success: "#a3be8c"
    },
    carbon: {
        name: "Carbon",
        background: "#313131",
        main: "#f5e6c8",
        sub: "#616161",
        accent: "#f5e6c8",
        caret: "#f5e6c8",
        error: "#df3e3e",
        success: "#bffa29"
    },
    serika: {
        name: "Serika",
        background: "#323437",
        main: "#d1d0c5",
        sub: "#646669",
        accent: "#e2b714",
        caret: "#e2b714",
        error: "#ca4754",
        success: "#e2b714"
    },
    lavender: {
        name: "Lavender",
        background: "#1e1e2e",
        main: "#cdd6f4",
        sub: "#6c7086",
        accent: "#b4befe",
        caret: "#b4befe",
        error: "#f38ba8",
        success: "#a6e3a1"
    }
};
