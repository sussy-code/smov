const themer = require("tailwindcss-themer");

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
        "denim-700": "#7A758F",
        "ash-600": "#817998",
        "ash-500": "#9C93B5",
        "ash-400": "#3D394D",
        "ash-300": "#2C293A",
        "ash-200": "#2B2836",
        "ash-100": "#1E1C26"
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
  plugins: [
    require("tailwind-scrollbar"),
    themer({
      defaultTheme: {
        extend: {
          colors: {
            // Branding
            pill: {
              background: "#1C1C36"
            },

            // meta data for the theme itself
            global: {
              accentA: "#505DBD",
              accentB: "#3440A1"
            },

            // light bar
            lightBar: {
              light: "#2A2A71"
            },

            // Buttons
            buttons: {
              toggle: "#8D44D6",
              toggleDisabled: "#202836"
            },

            // only used for body colors/textures
            background: {
              main: "#0A0A10",
              accentA: "#6E3B80",
              accentB: "#1F1F50"
            },

            // typography
            type: {
              emphasis: "#FFFFFF",
              text: "#73739D",
              dimmed: "#926CAD",
              divider: "#262632",
              secondary: "#64647B"
            },

            // search bar
            search: {
              background: "#1E1E33",
              focused: "#24243C",
              placeholder: "#4A4A71",
              icon: "#545476",
              text: "#FFFFFF"
            },

            // media cards
            mediaCard: {
              hoverBackground: "#161622",
              hoverAccent: "#4D79A8",
              hoverShadow: "#0A0A10",
              shadow: "#161622",
              barColor: "#4B4B63",
              barFillColor: "#BA7FD6",
              badge: "#151522",
              badgeText: "#5F5F7A"
            },

            settings: {
              sidebar: {
                type: {
                  secondary: "#4B395F",
                  inactive: "#8D68A9",
                  icon: "#926CAD",
                  activated: "#CBA1E8"
                }
              }
            },

            utils: {
              divider: "#353549"
            },

            // Error page
            errors: {
              card: "#12121B",
              border: "#252534",

              type: {
                secondary: "#62627D"
              }
            },

            // About page
            about: {
              circle: "#262632",
              circleText: "#9A9AC3"
            },

            progress: {
              background: "#8787A8",
              preloaded: "#8787A8",
              filled: "#A75FC9"
            },

            // video player
            video: {
              buttonBackground: "#444B5C",

              scraping: {
                card: "#161620",
                error: "#E44F4F",
                success: "#40B44B",
                loading: "#B759D8",
                noresult: "#64647B"
              },

              audio: {
                set: "#A75FC9"
              },

              buttons: {
                secondary: "#161F25",
                secondaryText: "#8EA3B0",
                secondaryHover: "#1B262E",
                primary: "#fff",
                primaryText: "#000",
                primaryHover: "#dedede",
                purple: "#6b298a",
                purpleHover: "#7f35a1",
                cancel: "#252533",
                cancelHover: "#3C3C4A"
              },

              context: {
                background: "#0C1216",
                light: "#4D79A8",
                border: "#1d252b",
                hoverColor: "#1E2A32",
                buttonFocus: "#202836",
                flagBg: "#202836",
                inputBg: "#202836",
                buttonOverInputHover: "#283040",
                inputPlaceholder: "#374A56",
                cardBorder: "#1B262E",
                slider: "#8787A8",
                sliderFilled: "#A75FC9",
                error: "#E44F4F",

                buttons: {
                  list: "#161C26",
                  active: "#0D1317"
                },

                type: {
                  main: "#617A8A",
                  secondary: "#374A56",
                  accent: "#A570FA"
                }
              }
            }
          }
        }
      }
    })
  ]
};
