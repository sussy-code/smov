import { createTheme } from "../types";

const tokens = {
  purple: {
    c50: "#feabac",
    c100: "#fe8385",
    c200: "#ea5b5e",
    c300: "#d34648",
    c400: "#bd3436",
    c500: "#852a2b",
    c600: "#632021",
    c700: "#49191a",
    c800: "#331112",
    c900: "#220c0c"
  },
  shade: {
    c50: "#9c605c",
    c100: "#834d49",
    c200: "#673b38",
    c300: "#542f2c",
    c400: "#452422",
    c500: "#361c1a",
    c600: "#2b1614",
    c700: "#241210",
    c800: "#1c0e0d",
    c900: "#130909"
  },
  ash: {
    c50: "#ac6e6f",
    c100: "#8b4b4c",
    c200: "#703739",
    c300: "#572225",
    c400: "#49191a",
    c500: "#421617",
    c600: "#371212",
    c700: "#2e0e0f",
    c800: "#230c0d",
    c900: "#19090b"
  },
  blue: {
    c50: "#f5adb4",
    c100: "#cc7981",
    c200: "#ae5d65",
    c300: "#8c3b43",
    c400: "#712a31",
    c500: "#501f24",
    c600: "#411b1f",
    c700: "#36171b",
    c800: "#201011",
    c900: "#130b0c"
  }
};

export default createTheme({
  name: "red",
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
