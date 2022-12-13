import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, "./src/components"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      state: path.resolve(__dirname, "./src/state"),
      providers: path.resolve(__dirname, "./src/providers"),
      views: path.resolve(__dirname, "./src/views"),
      utils: path.resolve(__dirname, "./src/utils"),
      mw_constants: path.resolve(__dirname, "./src/mw_constants"),
    },
  },
});
