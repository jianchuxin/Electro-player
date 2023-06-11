import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import path from "path";
import { fileURLToPath } from "url";
const __filenameNew = fileURLToPath(import.meta.url);
const __dirnameNew = path.dirname(__filenameNew);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirnameNew, "src"),
      "assets": path.resolve(__dirnameNew, "src/assets"),
      "base": path.resolve(__dirnameNew, "src/base"),
      "components": path.resolve(__dirnameNew, "src/components"),
      "views": path.resolve(__dirnameNew, "src/views"),
    },
  },
});
