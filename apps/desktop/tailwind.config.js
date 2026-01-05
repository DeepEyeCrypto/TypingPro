/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "../../src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                'neon-cyan': '#00f3ff',
                'neon-red': '#ff003c',
                'midnight': '#050505',
                'glass-bg': 'rgba(255, 255, 255, 0.03)',
                'glass-border': 'rgba(255, 255, 255, 0.08)',
                // Emerald Design System
                'emerald': {
                    primary: '#224A47',
                    secondary: '#1a3a38',
                    accent: '#2e615e',
                    highlight: '#3a7873',
                    dark: '#0f2625',
                    light: '#4a8f89',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backdropBlur: {
                'emerald': '20px',
            }
        },
    },

    plugins: [],
}
