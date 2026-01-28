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

// import { defineConfig } from "vite";

// export default defineConfig({
//   base: "/zat.am/",
//   build: {
//     outDir: "dist",
//     emptyOutDir: true,
//     rollupOptions: {
//       input: {
//         main: "index24.html",
//         login: "auth/login.html",
//         signup: "auth/signup.html",
//         profile: "auth/profile.html",
//         privacy: "legal/privacy.html",
//       },
//     },
//   },
// });
