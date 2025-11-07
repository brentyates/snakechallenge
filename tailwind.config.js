/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        snake: {
          primary: '#10b981',
          secondary: '#059669',
          food: '#ef4444',
          bg: '#0f172a',
          board: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
