import { createTheme } from "../types";

export default createTheme({
  name: "gray",
  extend: {
    colors: {
      themePreview: {
        primary: "#343441",
        secondary: "#0C0C16",
        ghost: "white",
      },

      // light bar
      lightBar: {
        light: "#343441"
      },
    }
  }
})
