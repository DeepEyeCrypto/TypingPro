/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255, 255, 255, 0.1)", // Base glass color
        glassBorder: "rgba(255, 255, 255, 0.2)",
        accentOrange: "#FF8C42",
        accentGreen: "#8CD867",
        accentPink: "#FF5C8D",
        darkText: "#1F2937",
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
