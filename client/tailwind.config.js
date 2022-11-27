/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: [
          "Mona Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Ubuntu",
          "avenir next",
          "avenir",
          "segoe ui",
          "helvetica neue",
          "helvetica",
          "Cantarell",
          "roboto",
          "noto",
          "arial",
          "sans-serif",
        ],
        fancy: [
          "Hubot Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Ubuntu",
          "avenir next",
          "avenir",
          "segoe ui",
          "helvetica neue",
          "helvetica",
          "Cantarell",
          "roboto",
          "noto",
          "arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
}
