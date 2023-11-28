import { createTheme } from "../types";

export default createTheme({
  name: "red",
  extend: {
    colors: {
      themePreview: {
        primary: "#A8335E",
        secondary: "#6A2441",
        ghost: "white",
      },

      // light bar
      lightBar: {
        light: "#A8335E"
      },
    }
  }
})
