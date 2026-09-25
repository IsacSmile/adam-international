/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#0B1F3A',
          dark: '#071426',
          hover: '#132A4A',
        },
        gold: {
          accent: '#C9A84C',
          light: '#DFBE7A',
          hover: '#B5943B',
        },
        brandText: '#1A1A2E',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'scroll-header': '0 4px 20px rgba(11, 31, 58, 0.08)',
        'dropdown': '0 10px 30px rgba(11, 31, 58, 0.12)',
        'drawer': '-4px 0 25px rgba(11, 31, 58, 0.15)',
      }
    },
  },
  plugins: [],
}
