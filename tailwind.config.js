/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wine-darker': '#2C0D0D',
        'wine-dark': '#3B1111',
        'wine-light': '#8C1C1C',
        'burgundy': {
          100: '#FFF1F1',
          200: '#FFE4E4',
          300: '#FFC7C7',
          400: '#FF9999',
          500: '#8C1C1C',
          600: '#701616',
          700: '#561111',
          800: '#3B0D0D',
          900: '#2C0A0A',
        },
        'cork': {
          100: '#F9E4D4',
          200: '#F2D0B4',
          300: '#E8BA8F',
          400: '#D4A06D',
          500: '#B88449',
        }
      },
      backgroundImage: {
        'wine-texture': 'linear-gradient(to right bottom, rgba(44, 13, 13, 0.8), rgba(59, 17, 17, 0.9)), url("/wine-bg.jpg")'
      }
    },
  },
  plugins: [],
} 