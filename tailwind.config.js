/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
            },
            colors: {
                // Using CSS variables with fallback handling for opacity
                bg: {
                    primary: 'rgb(var(--bg-primary) / <alpha-value>)',
                    secondary: 'rgb(var(--bg-secondary) / <alpha-value>)',
                    surface: 'rgb(var(--bg-surface) / <alpha-value>)',
                    elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
                },
                text: {
                    primary: 'rgb(var(--text-primary) / <alpha-value>)',
                    secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
                    muted: 'rgb(var(--text-muted) / <alpha-value>)',
                    inverted: 'rgb(var(--text-inverted) / <alpha-value>)',
                },
                brand: {
                    DEFAULT: 'rgb(var(--color-brand) / <alpha-value>)',
                    hover: 'rgb(var(--color-brand-hover) / <alpha-value>)',
                },
                status: {
                    success: 'rgb(var(--color-success) / <alpha-value>)',
                    error: 'rgb(var(--color-error) / <alpha-value>)',
                    warning: 'rgb(var(--color-warning) / <alpha-value>)',
                },
                border: {
                    DEFAULT: 'rgb(var(--border-color) / <alpha-value>)',
                    hover: 'rgb(var(--border-hover) / <alpha-value>)',
                }
            },
            animation: {
                'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shake': 'shake 0.3s cubic-bezier(.36,.07,.19,.97) both',
            },
            keyframes: {
                shake: {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
                }
            }
        },
    },
    plugins: [],
}
