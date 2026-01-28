import { defineConfig } from "vite";

export default defineConfig({
  root: "./",
  base: "/deployment-testing/", // Add this
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "./index24.html",
      },
    },
  },
  server: {
    open: "/index24.html",
  },
});
