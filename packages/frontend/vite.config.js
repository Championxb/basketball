import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
      "@api": "/src/api",
      "@assets": "/src/assets",
      "@views": "/src/views",
      "@styles": "/src/styles",
      "@components": "/src/components",
      "@utils": "/src/utils",
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    host: true, // 0.0.0.0, 允许局域网访问
    port: 8888,
    strictPort: false,
    cors: true,
  },
  build: {
    modulePreload: false, // 禁用 modulePreload 防止Referer丢失
  },
  assetsInclude: ["**/*.glb", "**/*.zip"], // 支持导入glb模型文件和zip压缩包文件
  css: {
    preprocessorOptions: {
      scss: {
        // 使用 @use 替代已弃用的 @import；使用 `as *` 保持原有全局变量/混入可用性
        additionalData: `@use "/src/style/util" as *;`,
      },
      api: "modern", // 使用新版API
      silenceDeprecations: ["legacy-js-api"], // 临时消除警告
      sassOptions: {
        outputStyle: "compressed", // 压缩输出
      },
    },
  },
});
