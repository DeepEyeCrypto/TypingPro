/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "../../src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                'space-dark': '#0a0a1a',
                'space-purple': '#1a0033',
                'space': '#0d0d1f',
                'midnight': '#0a0a0a',
                'midnight-surface': '#121212',
                'midnight-card': '#1a1a1a',
                'hacker': 'rgba(255, 255, 255, 0.9)',
                'hacker-bright': 'rgba(255, 255, 255, 1)',
                'hacker-dim': 'rgba(255, 255, 255, 0.5)',
                'hacker-glow': 'rgba(255, 255, 255, 0.2)',
                'neon-lime': '#ef4444',
                'neon-cyan': '#f87171',
                'glass-bg': 'rgba(255, 255, 255, 0.02)',
                'glass-border': 'rgba(255, 255, 255, 0.2)',
            },
            borderRadius: {
                'glass': '12px',
                'glass-lg': '20px',
                'glass-xl': '24px',
                '4xl': '32px',
            },
            backdropBlur: {
                'glass': '16px',
                'glass-heavy': '24px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glass-glow': '0 0 40px rgba(255, 255, 255, 0.15)',
                'neon-glow': '0 0 15px rgba(239, 68, 68, 0.4)',
                'neon-green': '0 0 20px rgba(255, 255, 255, 0.4)',
                'neon-cyan': '0 0 20px rgba(255, 255, 255, 0.4)',
                'inset-glass': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
            },
            animation: {
                'float-in': 'floatIn 0.6s ease-out forwards',
                'slide-in': 'slideIn 0.4s ease-out forwards',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'gradient-shift': 'gradientShift 8s ease infinite',
            },
            keyframes: {
                floatIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(255, 255, 255, 0.4)' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            backgroundImage: {
                'deep-space': 'linear-gradient(135deg, #0a0a1a 0%, #1a0033 50%, #0d0d1f 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },

    plugins: [],
}
