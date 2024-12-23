/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#1a1b1e',
          50: '#2C2D31',
          100: '#252629',
          200: '#1F2023',
          300: '#1a1b1e',
          400: '#16171a',
          500: '#121316',
        }
      }
    },
  },
  plugins: [],
}