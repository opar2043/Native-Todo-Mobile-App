/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#EFEFEF',
        primaryText: '#010101',
        secondaryText: '#6B6B6B',
        accent: '#FF6B35',
        success: '#4CAF82',
        card: '#FFFFFF',
      },
      borderRadius: {
        'card': '20px',
        'btn': '14px',
      }
    },
  },
  plugins: [],
  darkMode: "class", 
};