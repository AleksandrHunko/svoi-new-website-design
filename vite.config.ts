import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import nunjucks from "./vite-plugin-nunjucks.js";

export default defineConfig({
  plugins: [
    tailwindcss(),
    nunjucks(),
    {
      name: "fix-font-paths",
      generateBundle(_, bundle) {
        for (const file of Object.values(bundle)) {
          if (file.type === "asset" && file.fileName.endsWith(".css")) {
            file.source = file.source.replace(/url\(\/fonts\//g, "url(./fonts/");
          }
        }
      },
    },
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "src/input.css",
      output: {
        assetFileNames: "style.css",
      },
    },
  },
});
