import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import loadVersion from "vite-plugin-package-version";
import checker from 'vite-plugin-checker'
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    loadVersion(),
    checker({
      typescript: true, // check typescript build errors in dev server
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
