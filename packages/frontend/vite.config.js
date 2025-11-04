import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [vue()],
  server: {
    host: true, // 0.0.0.0, 允许局域网访问
    port: 5173,
    strictPort: false,
    cors: true,
  },
  css: {
    preprocessorOptions: {
      // scss: {
      //   additionalData: `@import "@/styles/variables.scss";`
      // }
    }
  }
});
