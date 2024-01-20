import { createTheme } from "../types";

const tokens = {
  purple: {
    c50: "#aad7ff",
    c100: "#82c4ff",
    c200: "#59a8ec",
    c300: "#4491d6",
    c400: "#317dbf",
    c500: "#285b87",
    c600: "#1f4464",
    c700: "#18334a",
    c800: "#112434",
    c900: "#0b1822"
  },
  shade: {
    c50: "#677c90",
    c100: "#52667a",
    c200: "#3f4f60",
    c300: "#32404f",
    c400: "#273441",
    c500: "#1e2832",
    c600: "#172028",
    c700: "#131a22",
    c800: "#0f151b",
    c900: "#0a0e12"
  },
  ash: {
    c50: "#7f9b9b",
    c100: "#5b7b7b",
    c200: "#446463",
    c300: "#2b4e4d",
    c400: "#204241",
    c500: "#1c3c3b",
    c600: "#173232",
    c700: "#132929",
    c800: "#102020",
    c900: "#0c1615"
  },
  blue: {
    c50: "#adf5d6",
    c100: "#79cca8",
    c200: "#5dae8b",
    c300: "#3b8c69",
    c400: "#2a7152",
    c500: "#1f503b",
    c600: "#1b4130",
    c700: "#173629",
    c800: "#102019",
    c900: "#0b1310"
  }
};

export default createTheme({
  name: "teal",
  extend: {
    colors: {
      themePreview: {
        primary: tokens.blue.c200,
        secondary: tokens.shade.c50
      },

      pill: {
        background: tokens.shade.c300,
        backgroundHover: tokens.shade.c200,
        highlight: tokens.blue.c200
      },

      global: {
        accentA: tokens.blue.c200,
        accentB: tokens.blue.c300
      },

      lightBar: {
        light: tokens.blue.c400
      },

      buttons: {
        toggle: tokens.purple.c300,
        toggleDisabled: tokens.ash.c500,

        secondary: tokens.ash.c700,
        secondaryHover: tokens.ash.c700,
        purple: tokens.purple.c500,
        purpleHover: tokens.purple.c400,
        cancel: tokens.ash.c500,
        cancelHover: tokens.ash.c300
      },

      background: {
        main: tokens.shade.c900,
        secondary: tokens.shade.c600,
        secondaryHover: tokens.shade.c400,
        accentA: tokens.purple.c500,
        accentB: tokens.blue.c500
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
        background: tokens.shade.c500,
        focused: tokens.shade.c400,
        placeholder: tokens.shade.c100,
        icon: tokens.shade.c100
      },

      mediaCard: {
        hoverBackground: tokens.shade.c600,
        hoverAccent: tokens.shade.c50,
        hoverShadow: tokens.shade.c900,
        shadow: tokens.shade.c700,
        barColor: tokens.ash.c200,
        barFillColor: tokens.purple.c100,
        badge: tokens.shade.c700,
        badgeText: tokens.ash.c100
      },

      largeCard: {
        background: tokens.shade.c600,
        icon: tokens.purple.c400
      },

      dropdown: {
        background: tokens.shade.c600,
        altBackground: tokens.shade.c700,
        hoverBackground: tokens.shade.c500,
        text: tokens.shade.c50,
        secondary: tokens.shade.c100,
        border: tokens.shade.c400,
        contentBackground: tokens.shade.c500
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
          activeLink: tokens.shade.c600,
          badge: tokens.shade.c900,

          type: {
            secondary: tokens.shade.c200,
            inactive: tokens.shade.c50,
            icon: tokens.shade.c50,
            iconActivated: tokens.purple.c200,
            activated: tokens.purple.c50
          }
        },

        card: {
          border: tokens.shade.c400,
          background: tokens.shade.c400,
          altBackground: tokens.shade.c400
        },

        saveBar: {
          background: tokens.shade.c800
        }
      },

      utils: {
        divider: tokens.ash.c300
      },

      errors: {
        card: tokens.shade.c800,
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
        background: tokens.ash.c50,
        preloaded: tokens.ash.c50,
        filled: tokens.purple.c200
      },

      video: {
        buttonBackground: tokens.ash.c200,

        autoPlay: {
          background: tokens.ash.c700,
          hover: tokens.ash.c500
        },

        scraping: {
          card: tokens.shade.c700,
          loading: tokens.purple.c200,
          noresult: tokens.ash.c100
        },

        audio: {
          set: tokens.purple.c200
        },

        context: {
          background: tokens.ash.c900,
          light: tokens.shade.c50,
          border: tokens.ash.c600,
          hoverColor: tokens.ash.c600,
          buttonFocus: tokens.ash.c500,
          flagBg: tokens.ash.c500,
          inputBg: tokens.ash.c600,
          buttonOverInputHover: tokens.ash.c500,
          inputPlaceholder: tokens.ash.c200,
          cardBorder: tokens.ash.c700,
          slider: tokens.ash.c50,
          sliderFilled: tokens.purple.c200,

          buttons: {
            list: tokens.ash.c700,
            active: tokens.ash.c900
          },

          closeHover: tokens.ash.c800,

          type: {
            secondary: tokens.ash.c200,
            accent: tokens.purple.c200
          }
        }
      }
    }
  }
});
