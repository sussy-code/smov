import { createTheme } from "../types";

export default createTheme({
  name: "teal",
  extend: {
    colors: {
      themePreview: {
        primary: "#469c51",
        secondary: "#1a3d2b",
        ghost: "white",
      },

      // light bar
      lightBar: {
        light: "#469c51",
      },
    }
  }
})
