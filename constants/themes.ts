export interface Theme {
    name: string;
    bgColor: string;
    mainColor: string;
    subColor: string;
    accentColor: string;
}

export const THEMES: Theme[] = [
    {
        name: "Serika Dark",
        bgColor: "#323437",
        mainColor: "#e2b714",
        subColor: "#646669",
        accentColor: "#e2b714",
    },
    {
        name: "Carbon",
        bgColor: "#292a2d",
        mainColor: "#f5f5f5",
        subColor: "#666666",
        accentColor: "#f5f5f5",
    },
    {
        name: "Nord",
        bgColor: "#2e3440",
        mainColor: "#eceff4",
        subColor: "#4c566a",
        accentColor: "#88c0d0",
    },
    {
        name: "Dracula",
        bgColor: "#282a36",
        mainColor: "#f8f8f2",
        subColor: "#6272a4",
        accentColor: "#bd93f9",
    },
    {
        name: "Gruvbox Dark",
        bgColor: "#282828",
        mainColor: "#ebdbb2",
        subColor: "#928374",
        accentColor: "#fabd2f",
    },
    {
        name: "8008",
        bgColor: "#333a45",
        mainColor: "#e9ecf0",
        subColor: "#939eae",
        accentColor: "#f44c7c",
    },
    {
        name: "Bento",
        bgColor: "#2d394d",
        mainColor: "#fffaf4",
        subColor: "#4a5a73",
        accentColor: "#ff7a90",
    },
    {
        name: "Botanical",
        bgColor: "#7b9c98",
        mainColor: "#eaf1f3",
        subColor: "#495755",
        accentColor: "#e96479",
    },
    {
        name: "Iceberg",
        bgColor: "#161821",
        mainColor: "#c6c8d1",
        subColor: "#6b7089",
        accentColor: "#84a0c6",
    },
    {
        name: "Mizu",
        bgColor: "#afcbff",
        mainColor: "#1a2533",
        subColor: "#566a8a",
        accentColor: "#fc9e9e",
    },
    {
        name: "Laser",
        bgColor: "#221a2d",
        mainColor: "#ebdfef",
        subColor: "#7e6d8a",
        accentColor: "#ea225c",
    }
];
