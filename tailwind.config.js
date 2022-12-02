/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      white: '#FFFFFF',
      richBlack: '#000027',
      seaGreen: '#00FFBD',
      brightTurquoise: '#00E7DB',
      lightSilver: '#D9D9D9',
    },
    fontFamily: {
      'Raleway': ['Raleway', 'sans-serif'],
      'Jakarta': ['Plus Jakarta Sans', 'sans-serif'],
    },
  },
  plugins: [],
}
