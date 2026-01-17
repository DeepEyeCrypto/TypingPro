/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./apps/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Deep Space Gradient
                space: {
                    dark: '#0a0a1a',
                    purple: '#1a0033',
                    DEFAULT: '#0d0d1f',
                },
                midnight: {
                    DEFAULT: '#0a0a0a',
                    surface: '#121212',
                    card: '#1a1a1a',
                },
                hacker: {
                    DEFAULT: 'rgba(255, 255, 255, 0.9)',
                    bright: 'rgba(255, 255, 255, 1)',
                    dim: 'rgba(255, 255, 255, 0.5)',
                    glow: 'rgba(255, 255, 255, 0.2)',
                },
                'neon-cyan': 'rgba(255, 255, 255, 0.9)',
                'glass-bg': 'rgba(255, 255, 255, 0.08)',
                'glass-border': 'rgba(255, 255, 255, 0.12)',
                'contrast-text': 'var(--contrast-text, #FFFFFF)',
            },
            borderRadius: {
                'glass': '12px',
                'glass-lg': '20px',
                'glass-xl': '24px',
            },
            backdropBlur: {
                'glass': '16px',
                'glass-heavy': '24px',
                'ultra': '80px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glass-glow': '0 0 40px rgba(255, 255, 255, 0.15)',
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
        },
    },
    plugins: [],
}
