/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(250, 248, 245)", // Warm Cream
        secondary: "rgb(74, 63, 53)", // Deep Taupe
        accent: "rgb(201, 169, 97)",  // Gold
        muted: "rgb(184, 169, 154)",  // Soft Taupe/Border
        glow: "rgba(100, 149, 237, 0.15)", // Blue Glow
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "serif"],
        sans: ["Lato", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
