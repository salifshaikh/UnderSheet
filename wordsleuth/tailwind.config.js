/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'] },
      colors: { night: '#15112b', surf: '#231c45', line: '#3a2f6b', amber: '#ffc43d', mint: '#46e0b4', rose: '#ff6b8b' },
    },
  },
  plugins: [],
}
