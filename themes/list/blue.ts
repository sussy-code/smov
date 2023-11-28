import { createTheme } from "../types";

export default createTheme({
  name: "blue",
  extend: {
    colors: {
      themePreview: {
        primary: "#3A4FAA",
        secondary: "#303487",
        ghost: "white",
      },

      // light bar
      lightBar: {
        light: "#3A4FAA",
      },
    }
  }
})
