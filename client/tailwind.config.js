// client/tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gamja: ['"Gamja Flower"', 'cursive'],
         cute: ['"Hi Melody"', 'cursive'],
      },
    },
  },
  plugins: [],
}