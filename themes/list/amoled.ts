import { createTheme } from "../types";

const tokens = {
  black: "#000000",
  white: "#FFFFFF",
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
  name: "amoled",
  extend: {
    colors: {
      themePreview: {
        primary: tokens.blue.c500,
        secondary: tokens.shade.c700
      },

      pill: {
        background: tokens.black,
        backgroundHover: tokens.shade.c500,
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
        toggleDisabled: tokens.ash.c500,
        secondary: tokens.ash.c700,
        secondaryHover: tokens.ash.c700,
        purple: tokens.purple.c600,
        purpleHover: tokens.purple.c400,
        cancel: tokens.shade.c700,
        cancelHover: tokens.shade.c800
      },

      background: {
        main: tokens.black,
        secondary: tokens.black,
        secondaryHover: tokens.black,
        accentA: tokens.black,
        accentB: tokens.black
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
        background: tokens.shade.c800,
        hoverBackground: tokens.shade.c900,
        focused: tokens.shade.c700,
        placeholder: tokens.shade.c200,
        icon: tokens.shade.c500
      },

      mediaCard: {
        hoverBackground: tokens.shade.c900,
        hoverAccent: tokens.shade.c100,
        hoverShadow: tokens.black,
        shadow: tokens.shade.c800,
        barColor: tokens.ash.c800,
        barFillColor: tokens.ash.c600,
        badge: tokens.shade.c700,
        badgeText: tokens.ash.c100
      },

      largeCard: {
        background: tokens.shade.c600,
        icon: tokens.purple.c400
      },

      dropdown: {
        background: tokens.shade.c800,
        altBackground: tokens.black,
        hoverBackground: tokens.shade.c700,
        text: tokens.shade.c50,
        secondary: tokens.shade.c100,
        border: tokens.shade.c400,
        contentBackground: tokens.black
      },

      authentication: {
        border: tokens.shade.c300,
        inputBg: tokens.shade.c600,
        inputBgHover: tokens.shade.c500,
        wordBackground: tokens.shade.c500,
        copyText: tokens.shade.c100,
        copyTextHover: tokens.ash.c50
      },

      settings: {
        sidebar: {
          activeLink: tokens.shade.c800,
          badge: tokens.shade.c900,

          type: {
            secondary: tokens.shade.c200,
            inactive: tokens.shade.c50,
            icon: tokens.shade.c50,
            iconActivated: tokens.shade.c200,
            activated: tokens.blue.c300
          }
        },

        card: {
          border: tokens.shade.c700,
          background: tokens.shade.c700,
          altBackground: tokens.shade.c700
        },

        saveBar: {
          background: tokens.black
        }
      },

      utils: {
        divider: tokens.ash.c300
      },

      errors: {
        card: tokens.black,
        border: tokens.ash.c500,

        type: {
          secondary: tokens.ash.c100
        }
      },

      about: {
        circle: tokens.ash.c500,
        circleText: tokens.ash.c50
      },

      editBadge: {
        bg: tokens.ash.c500,
        bgHover: tokens.ash.c400,
        text: tokens.ash.c50
      },

      progress: {
        background: tokens.ash.c800,
        preloaded: tokens.ash.c800,
        filled: tokens.ash.c600
      },

      video: {
        buttonBackground: tokens.ash.c600,

        autoPlay: {
          background: tokens.ash.c800,
          hover: tokens.ash.c600 
        },

        scraping: {
          card: tokens.black,
          loading: tokens.purple.c200,
          noresult: tokens.ash.c100
        },

        audio: {
          set: tokens.ash.c600
        },

        context: {
          background: tokens.black,
          light: tokens.shade.c50,
          border: tokens.ash.c600,
          hoverColor: tokens.ash.c600,
          buttonFocus: tokens.ash.c500,
          flagBg: tokens.ash.c500,
          inputBg: tokens.ash.c600,
          buttonOverInputHover: tokens.ash.c500,
          inputPlaceholder: tokens.ash.c200,
          cardBorder: tokens.ash.c700,
          slider: tokens.ash.c800,
          sliderFilled: tokens.ash.c600,

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
