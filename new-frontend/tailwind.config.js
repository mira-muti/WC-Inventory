/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      screens: {
      'xs': {'max': '360px'},
      'h-sm': { 'raw': '(max-height: 840px)' },
      'h-lg': { 'raw': '(min-height: 890px)' },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
