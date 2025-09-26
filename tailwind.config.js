/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Quicksand", "sans-serif"],
        heading: ["Playfair Display", "serif"],
        accent: ["Poppins", "sans-serif"],
      },
      colors: {
        "brand-green": {
          DEFAULT: "#00969b",
          light: "#00a8ae",
          dark: "#007a7e",
        },
        "brand-purple": {
          DEFAULT: "#5f42e5",
          light: "#6b4ef0",
          dark: "#4a2dd1",
        },
      },
    },
  },
  plugins: [],
};
