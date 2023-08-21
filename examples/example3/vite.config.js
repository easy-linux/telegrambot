import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  base: './',
  build: {
    target: "es2017",
    outDir: "build",
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    hmr: true,
  },
  plugins: [legacy({
    targets: ['defaults', 'not IE 11']
  })],
});
