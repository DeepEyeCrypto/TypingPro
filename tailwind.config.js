/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./apps/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                midnight: {
                    DEFAULT: '#0a0a0a',
                    surface: '#121212',
                    card: '#1a1a1a',
                },
                hacker: {
                    DEFAULT: '#00ff41',
                    dim: 'rgba(0, 255, 65, 0.5)',
                    glow: 'rgba(0, 255, 65, 0.2)',
                }
            },
            borderRadius: {
                'glass': '12px',
            },
            backdropBlur: {
                'glass': '16px',
            }
        },
    },
    plugins: [],
}
