import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import loadVersion from "vite-plugin-package-version";
import path from "path";

export default defineConfig({
  plugins: [react(), loadVersion()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
