/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.tsx"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
};
