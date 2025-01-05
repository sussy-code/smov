const tokens = {
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
  white: "#FFFFFF", // General white color
  semantic: {
    red: {
      c100: "#F46E6E", // Error text
      c200: "#E44F4F", // Video player scraping error
      c300: "#D74747", // Danger button
      c400: "#B43434", // Not currently used
    },
    green: {
      c100: "#60D26A", // Success text
      c200: "#40B44B", // Video player scraping success
      c300: "#31A33C", // Not currently used
      c400: "#237A2B", // Not currently used
    },
    silver: {
      c100: "#DEDEDE", // Primary button hover
      c200: "#B6CAD7", // Not currently used
      c300: "#8EA3B0", // Secondary button text
      c400: "#617A8A", // Main text in video player context
    },
    yellow: {
      c100: "#FFF599", // Best onboarding highlight
      c200: "#FCEC61", // Dropdown highlight hover
      c300: "#D8C947", // Not currently used
      c400: "#AFA349", // Dropdown highlight
    },
    rose: {
      c100: "#DB3D61", // Authentication error text
      c200: "#8A293B", // Danger button hover
      c300: "#812435", // Danger button
      c400: "#701B2B", // Not currently used
    },
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
    c800: "#111334", // Lightbar
    c900: "#0b0d22"
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
  shade: {
    c25: "#939393", // Media card hover accent
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
};

export const defaultTheme = {
  extend: {
    colors: {
      themePreview: {
        primary: tokens.black.c80,
        secondary: tokens.black.c100,
        ghost: tokens.white,
      },

      // Branding
      pill: {
        background: tokens.black.c100,
        backgroundHover: tokens.black.c125,
        highlight: tokens.blue.c200,
        activeBackground: tokens.shade.c700,
      },

      // meta data for the theme itself
      global: {
        accentA: tokens.blue.c200,
        accentB: tokens.blue.c300,
      },

      // light bar
      lightBar: {
        light: tokens.purple.c800,
      },

      // Buttons
      buttons: {
        toggle: tokens.purple.c300,
        toggleDisabled: tokens.black.c200,
        danger: tokens.semantic.rose.c300,
        dangerHover: tokens.semantic.rose.c200,

        secondary: tokens.black.c100,
        secondaryText: tokens.semantic.silver.c300,
        secondaryHover: tokens.black.c150,
        primary: tokens.white,
        primaryText: tokens.black.c50,
        primaryHover: tokens.semantic.silver.c100,
        purple: tokens.purple.c600,
        purpleHover: tokens.purple.c400,
        cancel: tokens.black.c100,
        cancelHover: tokens.black.c150
      },

      // only used for body colors/textures
      background: {
        main: tokens.black.c75,
        secondary: tokens.black.c75,
        secondaryHover: tokens.black.c75,
        accentA: tokens.purple.c600,
        accentB: tokens.black.c100
      },

      // Modals
      modal: {
        background: tokens.shade.c800,
      },

      // typography
      type: {
        logo: tokens.purple.c100,
        emphasis: tokens.white,
        text: tokens.shade.c50,
        dimmed: tokens.shade.c50,
        divider: tokens.ash.c500,
        secondary: tokens.ash.c100,
        danger: tokens.semantic.red.c100,
        success: tokens.semantic.green.c100,
        link: tokens.purple.c100,
        linkHover: tokens.purple.c50
      },

      // search bar
      search: {
        background: tokens.black.c100,
        hoverBackground: tokens.shade.c900,
        focused: tokens.black.c125,
        placeholder: tokens.shade.c200,
        icon: tokens.shade.c500,
        text: tokens.white,
      },

      // media cards
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

      // Large card
      largeCard: {
        background: tokens.black.c100,
        icon: tokens.purple.c400,
      },

      // Dropdown
      dropdown: {
        background: tokens.black.c100,
        altBackground: tokens.black.c80,
        hoverBackground: tokens.black.c150,
        highlight: tokens.semantic.yellow.c400,
        highlightHover: tokens.semantic.yellow.c200,
        text: tokens.shade.c50,
        secondary: tokens.shade.c100,
        border: tokens.shade.c400,
        contentBackground: tokens.black.c50
      },

      // Passphrase
      authentication: {
        border: tokens.shade.c300,
        inputBg: tokens.black.c100,
        inputBgHover: tokens.black.c150,
        wordBackground: tokens.shade.c500,
        copyText: tokens.shade.c100,
        copyTextHover: tokens.ash.c50,
        errorText: tokens.semantic.rose.c100,
      },

      // Settings page
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
          },
        },

        card: {
          border: tokens.shade.c700,
          background: tokens.black.c100,
          altBackground: tokens.black.c100
        },

        saveBar: {
          background: tokens.black.c50
        },
      },

      // Utilities
      utils: {
        divider: tokens.ash.c300
      },

      // Onboarding
      onboarding: {
        bar: tokens.shade.c400,
        barFilled: tokens.purple.c300,
        divider: tokens.shade.c200,
        card: tokens.shade.c800,
        cardHover: tokens.shade.c700,
        border: tokens.shade.c600,
        good: tokens.purple.c100,
        best: tokens.semantic.yellow.c100,
        link: tokens.purple.c100,
      },

      // Error page
      errors: {
        card: tokens.black.c75,
        border: tokens.ash.c500,

        type: {
          secondary: tokens.ash.c100,
        },
      },

      // About page
      about: {
        circle: tokens.black.c100,
        circleText: tokens.ash.c50
      },

      // About page
      editBadge: {
        bg: tokens.ash.c500,
        bgHover: tokens.ash.c400,
        text: tokens.ash.c50
      },

      progress: {
        background: tokens.ash.c50,
        preloaded: tokens.ash.c50,
        filled: tokens.purple.c200,
      },

      // video player
      video: {
        buttonBackground: tokens.ash.c600,

        autoPlay: {
          background: tokens.ash.c800,
          hover: tokens.ash.c600,
        },

        scraping: {
          card: tokens.black.c50,
          error: tokens.semantic.red.c200,
          success: tokens.semantic.green.c200,
          loading: tokens.purple.c200,
          noresult: tokens.black.c200
        },

        audio: {
          set: tokens.purple.c200,
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
          error: tokens.semantic.red.c200,

          buttons: {
            list: tokens.ash.c700,
            active: tokens.ash.c900,
          },

          closeHover: tokens.ash.c800,

          type: {
            main: tokens.semantic.silver.c300,
            secondary: tokens.ash.c200,
            accent: tokens.purple.c200,
          },
        },
      },
    },
  },
};
