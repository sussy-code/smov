import { createTheme } from "../types";

const tokens = {
  white: "#FFFFFF",
  black: {
    c50: "#000000",
    c75: "#030303",
    c80: "#080808",
    c100: "#0d0d0d",
    c125: "#141414",
    c150: "#1a1a1a",
    c200: "#262626",
    c250: "#333333"
  },
  semantic: {
    silver: {
      c100: "#DEDEDE",
      c200: "#B6CAD7",
      c300: "#8EA3B0",
      c400: "#617A8A",
    },
  },
  purple: {
    c50: "#aaafff",
    c100: "#8288fe",
    c200: "#5a62eb",
    c300: "#454cd4",
    c400: "#333abe",
    c500: "#292d86",
    c600: "#1f2363",
    c700: "#191b4a",
    c800: "#111334",
    c900: "#0b0d22"
  },
  shade: {
    c50: "#7c7c7c",
    c100: "#666666",
    c200: "#4f4f4f",
    c300: "#404040",
    c400: "#343434",
    c500: "#282828",
    c600: "#202020",
    c700: "#1a1a1a",
    c800: "#151515",
    c900: "#0e0e0e"
  },
  ash: {
    c50: "#8d8d8d",
    c100: "#6b6b6b",
    c200: "#545454",
    c300: "#3c3c3c",
    c400: "#313131",
    c500: "#2c2c2c",
    c600: "#252525",
    c700: "#1e1e1e",
    c800: "#181818",
    c900: "#111111"
  },
  blue: {
    c50: "#ccccd6",
    c100: "#a2a2a2",
    c200: "#868686",
    c300: "#646464",
    c400: "#4e4e4e",
    c500: "#383838",
    c600: "#2e2e2e",
    c700: "#272727",
    c800: "#181818",
    c900: "#0f0f0f"
  }
}

export default createTheme({
  name: "blck",
  extend: {
    colors: {
      themePreview: {
        primary: tokens.black.c80,
        secondary: tokens.black.c100
      },

      pill: {
        background: tokens.black.c100,
        backgroundHover: tokens.black.c125,
        highlight: tokens.blue.c200,
        activeBackground: tokens.shade.c700,
      },

      global: {
        accentA: tokens.blue.c200,
        accentB: tokens.blue.c300
      },

      lightBar: {
        light: tokens.shade.c900,
      },

      buttons: {
        toggle: tokens.purple.c300,
        toggleDisabled: tokens.black.c200,
        secondary: tokens.black.c100,
        secondaryHover: tokens.black.c150,
        purple: tokens.purple.c600,
        purpleHover: tokens.purple.c400,
        cancel: tokens.black.c100,
        cancelHover: tokens.black.c150
      },

      background: {
        main: tokens.black.c75,
        secondary: tokens.black.c75,
        secondaryHover: tokens.black.c75,
        accentA: tokens.purple.c600,
        accentB: tokens.black.c100
      },

      modal: {
        background: tokens.shade.c800,
      },

      type: {
        logo: tokens.purple.c100,
        text: tokens.shade.c50,
        dimmed: tokens.shade.c50,
        divider: tokens.ash.c500,
        secondary: tokens.ash.c100,
        link: tokens.purple.c100,
        linkHover: tokens.purple.c50
      },

      search: {
        background: tokens.black.c100,
        hoverBackground: tokens.shade.c900,
        focused: tokens.black.c125,
        placeholder: tokens.shade.c200,
        icon: tokens.shade.c500
      },

      mediaCard: {
        hoverBackground: tokens.shade.c900,
        hoverAccent: tokens.black.c250,
        hoverShadow: tokens.black.c50,
        shadow: tokens.shade.c800,
        barColor: tokens.ash.c200,
        barFillColor: tokens.purple.c100,
        badge: tokens.shade.c700,
        badgeText: tokens.ash.c100
      },

      largeCard: {
        background: tokens.black.c100,
        icon: tokens.purple.c400
      },

      dropdown: {
        background: tokens.black.c100,
        altBackground: tokens.black.c80,
        hoverBackground: tokens.black.c150,
        text: tokens.shade.c50,
        secondary: tokens.shade.c100,
        border: tokens.shade.c400,
        contentBackground: tokens.black.c50
      },

      authentication: {
        border: tokens.shade.c300,
        inputBg: tokens.black.c100,
        inputBgHover: tokens.black.c150,
        wordBackground: tokens.shade.c500,
        copyText: tokens.shade.c100,
        copyTextHover: tokens.ash.c50
      },

      settings: {
        sidebar: {
          activeLink: tokens.black.c100,
          badge: tokens.shade.c900,

          type: {
            secondary: tokens.shade.c200,
            inactive: tokens.shade.c50,
            icon: tokens.black.c200,
            iconActivated: tokens.purple.c200,
            activated: tokens.purple.c100
          }
        },

        card: {
          border: tokens.shade.c700,
          background: tokens.black.c100,
          altBackground: tokens.black.c100
        },

        saveBar: {
          background: tokens.black.c50
        }
      },

      utils: {
        divider: tokens.ash.c300
      },

      errors: {
        card: tokens.black.c75,
        border: tokens.ash.c500,

        type: {
          secondary: tokens.ash.c100
        }
      },

      about: {
        circle: tokens.black.c100,
        circleText: tokens.ash.c50
      },

      editBadge: {
        bg: tokens.ash.c500,
        bgHover: tokens.ash.c400,
        text: tokens.ash.c50
      },

      progress: {
        background: tokens.ash.c50,
        preloaded: tokens.ash.c50,
        filled: tokens.purple.c200
      },

      video: {
        buttonBackground: tokens.ash.c600,

        autoPlay: {
          background: tokens.ash.c800,
          hover: tokens.ash.c600 
        },

        scraping: {
          card: tokens.black.c50,
          loading: tokens.purple.c200,
          noresult: tokens.black.c200
        },

        audio: {
          set: tokens.purple.c200
        },

        context: {
          background: tokens.black.c50,
          light: tokens.shade.c50,
          border: tokens.ash.c600,
          hoverColor: tokens.ash.c600,
          buttonFocus: tokens.ash.c500,
          flagBg: tokens.ash.c500,
          inputBg: tokens.black.c100,
          buttonOverInputHover: tokens.ash.c500,
          inputPlaceholder: tokens.ash.c200,
          cardBorder: tokens.ash.c700,
          slider: tokens.black.c200,
          sliderFilled: tokens.purple.c200,

          buttons: {
            list: tokens.ash.c700,
            active: tokens.ash.c900
          },

          closeHover: tokens.ash.c800,

          type: {
            secondary: tokens.ash.c200,
            accent: tokens.purple.c200,
            main: tokens.semantic.silver.c300
          }
        }
      }
    }
  }
});
