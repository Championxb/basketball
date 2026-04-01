import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  // 构建后端代理目标地址：如果 VITE_API_TARGET 中没有端口且提供了 VITE_API_PROXY_PORT 则追加端口
  const apiTarget = env.VITE_API_TARGET;
  const apiPort = env.VITE_API_PROXY_PORT;
  const target = apiTarget + `:${apiPort}`;
  const staticSource = env.VITE_STATIC_RESOURCE + `:${env.VITE_STATIC_PORT}`;
  // console.log("[Vite Config] apiTarget:", apiTarget, "apiPort:", apiPort);
  console.log("staticSource:", staticSource);
  return {
    resolve: {
      alias: {
        "@": "/src",
        "@api": "/src/api",
        "@assets": "/src/assets",
        "@views": "/src/views",
        "@styles": "/src/styles",
        "@components": "/src/components",
        "@composables": "/src/composables",
        "@utils": "/src/utils",
      },
    },
    plugins: [
      vue(),
      vueJsx(),
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
      proxy: {
        "/api/v1": {
          // forward any /api/v1/... requests to the API host; keep path so /api/v1/tts -> https://openspeech.bytedance.com/api/v1/tts
          target: "https://openspeech.bytedance.com",
          changeOrigin: true,
          secure: false,
        },
        // 登录相关请求代理到 localhost:3000
        "/api/auth": {
          target: "http://localhost:3000",
          changeOrigin: true,
          secure: false,
        },
        // 其他API请求代理到环境变量配置的目标
        "/api": {
          target: target,
          changeOrigin: true,
          secure: false,
        },
        "/player": {
          target: target,
          changeOrigin: true,
          secure: false,
        },
        "/project": {
          target: staticSource,
          changeOrigin: true,
          secure: false,
        },
        "/sse": {
          target: target,
          changeOrigin: true,
          secure: false,
        },
      },
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
  };
});
