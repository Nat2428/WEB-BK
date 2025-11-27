/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "bk-blue": "#0f3d91",
        "bk-gold": "#f5b301",
      },
    },
  },
  plugins: [],
};

