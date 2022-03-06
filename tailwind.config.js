module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
        "denim-100": "#131119",
        "denim-200": "#1E1A29",
        "denim-300": "#282336",
        "denim-400": "#322D43",
        "denim-500": "#433D55",
        "denim-600": "#5A5370",
        "denim-700": "#817998",
      },

      /* fonts */
      fontFamily: {
        "open-sans": "'Open Sans'",
      },

      /* animations */
      keyframes: {
        "loading-pin": {
          "0%, 40%, 100%": { height: "0.5em", "background-color": "#282336" },
          "20%": { height: "1em", "background-color": "white" },
        },
      },
      animation: { "loading-pin": "loading-pin 1.8s ease-in-out infinite" },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
