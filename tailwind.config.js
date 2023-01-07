/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /* colors */
      colors: {
        "bink-100": "#432449",
        "bink-200": "#412B57",
        "bink-300": "#533670",
        "bink-400": "#714C97",
        "bink-500": "#8D66B5",
        "bink-600": "#A87FD1",
        "bink-700": "#CD97D6",
        "denim-100": "#120F1D",
        "denim-200": "#191526",
        "denim-300": "#211D30",
        "denim-400": "#2B263D",
        "denim-500": "#38334A",
        "denim-600": "#504B64",
        "denim-700": "#7A758F"
      },

      /* fonts */
      fontFamily: {
        "open-sans": "'Open Sans'"
      },

      /* animations */
      keyframes: {
        "loading-pin": {
          "0%, 40%, 100%": { height: "0.5em", "background-color": "#282336" },
          "20%": { height: "1em", "background-color": "white" }
        }
      },
      animation: { "loading-pin": "loading-pin 1.8s ease-in-out infinite" }
    }
  },
  plugins: [require("tailwind-scrollbar"), require("@tailwindcss/line-clamp")]
};
