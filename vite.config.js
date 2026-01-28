import { defineConfig } from "vite";

export default defineConfig({
  base: "/zat.am/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "index24.html",
    },
  },
  server: {
    open: "/index24.html",
  },
});
