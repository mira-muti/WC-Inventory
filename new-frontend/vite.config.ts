import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vite.dev/config/

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "hack4impact-mcgill",
      project: "wc-inv",
    }),
  ],

  server: {
    port: 3000,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
  },
});
