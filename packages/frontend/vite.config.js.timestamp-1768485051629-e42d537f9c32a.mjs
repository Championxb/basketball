// vite.config.js
import { defineConfig, loadEnv } from "file:///D:/MicrosoftVSProjects/basketball/node_modules/.pnpm/vite@4.5.14_@types+node@24.10.0_sass@1.93.3/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/MicrosoftVSProjects/basketball/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vi_9823b8416a54983b3f070021c449d560/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///D:/MicrosoftVSProjects/basketball/node_modules/.pnpm/unplugin-auto-import@20.2.0_5a8dd1763120b9394671d0abd15f24be/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/MicrosoftVSProjects/basketball/node_modules/.pnpm/unplugin-vue-components@30._53ab3e948a01ced9312b5d996ef51bb7/node_modules/unplugin-vue-components/dist/vite.js";
import vueJsx from "file:///D:/MicrosoftVSProjects/basketball/node_modules/.pnpm/@vitejs+plugin-vue-jsx@5.1._acb072bb5e11ee32f1380a5fa6b5d5b8/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { ElementPlusResolver } from "file:///D:/MicrosoftVSProjects/basketball/node_modules/.pnpm/unplugin-vue-components@30._53ab3e948a01ced9312b5d996ef51bb7/node_modules/unplugin-vue-components/dist/resolvers.js";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const apiTarget = env.VITE_API_TARGET;
  const apiPort = env.VITE_API_PROXY_PORT;
  const target = apiTarget + `:${apiPort}`;
  const staticSource = env.VITE_STATIC_RESOURCE + `:${env.VITE_STATIC_PORT}`;
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
        "@utils": "/src/utils"
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    server: {
      host: true,
      // 0.0.0.0, 允许局域网访问
      port: 8888,
      strictPort: false,
      cors: true,
      proxy: {
        "/api/v1": {
          // forward any /api/v1/... requests to the API host; keep path so /api/v1/tts -> https://openspeech.bytedance.com/api/v1/tts
          target: "https://openspeech.bytedance.com",
          changeOrigin: true,
          secure: false
        },
        // 登录相关请求代理到 localhost:3000
        "/api/auth": {
          target: "http://localhost:3000",
          changeOrigin: true,
          secure: false
        },
        // 其他API请求代理到环境变量配置的目标
        "/api": {
          target,
          changeOrigin: true,
          secure: false
        },
        "/player": {
          target,
          changeOrigin: true,
          secure: false
        },
        "/project": {
          target: staticSource,
          changeOrigin: true,
          secure: false
        },
        "/sse": {
          target,
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      modulePreload: false
      // 禁用 modulePreload 防止Referer丢失
    },
    assetsInclude: ["**/*.glb", "**/*.zip"],
    // 支持导入glb模型文件和zip压缩包文件
    css: {
      preprocessorOptions: {
        scss: {
          // 使用 @use 替代已弃用的 @import；使用 `as *` 保持原有全局变量/混入可用性
          additionalData: `@use "/src/style/util" as *;`
        },
        api: "modern",
        // 使用新版API
        silenceDeprecations: ["legacy-js-api"],
        // 临时消除警告
        sassOptions: {
          outputStyle: "compressed"
          // 压缩输出
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxNaWNyb3NvZnRWU1Byb2plY3RzXFxcXGJhc2tldGJhbGxcXFxccGFja2FnZXNcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXE1pY3Jvc29mdFZTUHJvamVjdHNcXFxcYmFza2V0YmFsbFxcXFxwYWNrYWdlc1xcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovTWljcm9zb2Z0VlNQcm9qZWN0cy9iYXNrZXRiYWxsL3BhY2thZ2VzL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gXCJ1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlXCI7XHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XHJcbmltcG9ydCB2dWVKc3ggZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZS1qc3hcIjtcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcIjtcclxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksIFwiVklURV9cIik7XHJcblxyXG4gIC8vIFx1Njc4NFx1NUVGQVx1NTQwRVx1N0FFRlx1NEVFM1x1NzQwNlx1NzZFRVx1NjgwN1x1NTczMFx1NTc0MFx1RkYxQVx1NTk4Mlx1Njc5QyBWSVRFX0FQSV9UQVJHRVQgXHU0RTJEXHU2Q0ExXHU2NzA5XHU3QUVGXHU1M0UzXHU0RTE0XHU2M0QwXHU0RjlCXHU0RTg2IFZJVEVfQVBJX1BST1hZX1BPUlQgXHU1MjE5XHU4RkZEXHU1MkEwXHU3QUVGXHU1M0UzXHJcbiAgY29uc3QgYXBpVGFyZ2V0ID0gZW52LlZJVEVfQVBJX1RBUkdFVDtcclxuICBjb25zdCBhcGlQb3J0ID0gZW52LlZJVEVfQVBJX1BST1hZX1BPUlQ7XHJcbiAgY29uc3QgdGFyZ2V0ID0gYXBpVGFyZ2V0ICsgYDoke2FwaVBvcnR9YDtcclxuICBjb25zdCBzdGF0aWNTb3VyY2UgPSBlbnYuVklURV9TVEFUSUNfUkVTT1VSQ0UgKyBgOiR7ZW52LlZJVEVfU1RBVElDX1BPUlR9YDtcclxuICAvLyBjb25zb2xlLmxvZyhcIltWaXRlIENvbmZpZ10gYXBpVGFyZ2V0OlwiLCBhcGlUYXJnZXQsIFwiYXBpUG9ydDpcIiwgYXBpUG9ydCk7XHJcbiAgLy8gY29uc29sZS5sb2coXCJzdGF0aWNTb3VyY2U6XCIsIHN0YXRpY1NvdXJjZSk7XHJcbiAgcmV0dXJuIHtcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICBcIkBcIjogXCIvc3JjXCIsXHJcbiAgICAgICAgXCJAYXBpXCI6IFwiL3NyYy9hcGlcIixcclxuICAgICAgICBcIkBhc3NldHNcIjogXCIvc3JjL2Fzc2V0c1wiLFxyXG4gICAgICAgIFwiQHZpZXdzXCI6IFwiL3NyYy92aWV3c1wiLFxyXG4gICAgICAgIFwiQHN0eWxlc1wiOiBcIi9zcmMvc3R5bGVzXCIsXHJcbiAgICAgICAgXCJAY29tcG9uZW50c1wiOiBcIi9zcmMvY29tcG9uZW50c1wiLFxyXG4gICAgICAgIFwiQGNvbXBvc2FibGVzXCI6IFwiL3NyYy9jb21wb3NhYmxlc1wiLFxyXG4gICAgICAgIFwiQHV0aWxzXCI6IFwiL3NyYy91dGlsc1wiLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKCksXHJcbiAgICAgIHZ1ZUpzeCgpLFxyXG4gICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxyXG4gICAgICB9KSxcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcclxuICAgICAgfSksXHJcbiAgICBdLFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIGhvc3Q6IHRydWUsIC8vIDAuMC4wLjAsIFx1NTE0MVx1OEJCOFx1NUM0MFx1NTdERlx1N0Y1MVx1OEJCRlx1OTVFRVxyXG4gICAgICBwb3J0OiA4ODg4LFxyXG4gICAgICBzdHJpY3RQb3J0OiBmYWxzZSxcclxuICAgICAgY29yczogdHJ1ZSxcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICBcIi9hcGkvdjFcIjoge1xyXG4gICAgICAgICAgLy8gZm9yd2FyZCBhbnkgL2FwaS92MS8uLi4gcmVxdWVzdHMgdG8gdGhlIEFQSSBob3N0OyBrZWVwIHBhdGggc28gL2FwaS92MS90dHMgLT4gaHR0cHM6Ly9vcGVuc3BlZWNoLmJ5dGVkYW5jZS5jb20vYXBpL3YxL3R0c1xyXG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHBzOi8vb3BlbnNwZWVjaC5ieXRlZGFuY2UuY29tXCIsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gXHU3NjdCXHU1RjU1XHU3NkY4XHU1MTczXHU4QkY3XHU2QzQyXHU0RUUzXHU3NDA2XHU1MjMwIGxvY2FsaG9zdDozMDAwXHJcbiAgICAgICAgXCIvYXBpL2F1dGhcIjoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFx1NTE3Nlx1NEVENkFQSVx1OEJGN1x1NkM0Mlx1NEVFM1x1NzQwNlx1NTIzMFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1OTE0RFx1N0Y2RVx1NzY4NFx1NzZFRVx1NjgwN1xyXG4gICAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIi9wbGF5ZXJcIjoge1xyXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCIvcHJvamVjdFwiOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IHN0YXRpY1NvdXJjZSxcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIi9zc2VcIjoge1xyXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgbW9kdWxlUHJlbG9hZDogZmFsc2UsIC8vIFx1Nzk4MVx1NzUyOCBtb2R1bGVQcmVsb2FkIFx1OTYzMlx1NkI2MlJlZmVyZXJcdTRFMjJcdTU5MzFcclxuICAgIH0sXHJcbiAgICBhc3NldHNJbmNsdWRlOiBbXCIqKi8qLmdsYlwiLCBcIioqLyouemlwXCJdLCAvLyBcdTY1MkZcdTYzMDFcdTVCRkNcdTUxNjVnbGJcdTZBMjFcdTU3OEJcdTY1ODdcdTRFRjZcdTU0OEN6aXBcdTUzOEJcdTdGMjlcdTUzMDVcdTY1ODdcdTRFRjZcclxuICAgIGNzczoge1xyXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgLy8gXHU0RjdGXHU3NTI4IEB1c2UgXHU2NkZGXHU0RUUzXHU1REYyXHU1RjAzXHU3NTI4XHU3Njg0IEBpbXBvcnRcdUZGMUJcdTRGN0ZcdTc1MjggYGFzICpgIFx1NEZERFx1NjMwMVx1NTM5Rlx1NjcwOVx1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRi9cdTZERjdcdTUxNjVcdTUzRUZcdTc1MjhcdTYwMjdcclxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgQHVzZSBcIi9zcmMvc3R5bGUvdXRpbFwiIGFzICo7YCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFwaTogXCJtb2Rlcm5cIiwgLy8gXHU0RjdGXHU3NTI4XHU2NUIwXHU3MjQ4QVBJXHJcbiAgICAgICAgc2lsZW5jZURlcHJlY2F0aW9uczogW1wibGVnYWN5LWpzLWFwaVwiXSwgLy8gXHU0RTM0XHU2NUY2XHU2RDg4XHU5NjY0XHU4QjY2XHU1NDRBXHJcbiAgICAgICAgc2Fzc09wdGlvbnM6IHtcclxuICAgICAgICAgIG91dHB1dFN0eWxlOiBcImNvbXByZXNzZWRcIiwgLy8gXHU1MzhCXHU3RjI5XHU4RjkzXHU1MUZBXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfTtcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVYsU0FBUyxjQUFjLGVBQWU7QUFDM1gsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sWUFBWTtBQUNuQixTQUFTLDJCQUEyQjtBQUVwQyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFNBQVMsS0FBSyxNQUFNO0FBQ2pELFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsT0FBTztBQUdoRCxRQUFNLFlBQVksSUFBSTtBQUN0QixRQUFNLFVBQVUsSUFBSTtBQUNwQixRQUFNLFNBQVMsWUFBWSxJQUFJLE9BQU87QUFDdEMsUUFBTSxlQUFlLElBQUksdUJBQXVCLElBQUksSUFBSSxnQkFBZ0I7QUFHeEUsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSztBQUFBLFFBQ0wsUUFBUTtBQUFBLFFBQ1IsV0FBVztBQUFBLFFBQ1gsVUFBVTtBQUFBLFFBQ1YsV0FBVztBQUFBLFFBQ1gsZUFBZTtBQUFBLFFBQ2YsZ0JBQWdCO0FBQUEsUUFDaEIsVUFBVTtBQUFBLE1BQ1o7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixPQUFPO0FBQUEsTUFDUCxXQUFXO0FBQUEsUUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxNQUNuQyxDQUFDO0FBQUEsTUFDRCxXQUFXO0FBQUEsUUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxNQUNuQyxDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixZQUFZO0FBQUEsTUFDWixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxXQUFXO0FBQUE7QUFBQSxVQUVULFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLFFBQVE7QUFBQSxRQUNWO0FBQUE7QUFBQSxRQUVBLGFBQWE7QUFBQSxVQUNYLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLFFBQVE7QUFBQSxRQUNWO0FBQUE7QUFBQSxRQUVBLFFBQVE7QUFBQSxVQUNOO0FBQUEsVUFDQSxjQUFjO0FBQUEsVUFDZCxRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0EsV0FBVztBQUFBLFVBQ1Q7QUFBQSxVQUNBLGNBQWM7QUFBQSxVQUNkLFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQSxZQUFZO0FBQUEsVUFDVixRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0EsUUFBUTtBQUFBLFVBQ047QUFBQSxVQUNBLGNBQWM7QUFBQSxVQUNkLFFBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLGVBQWU7QUFBQTtBQUFBLElBQ2pCO0FBQUEsSUFDQSxlQUFlLENBQUMsWUFBWSxVQUFVO0FBQUE7QUFBQSxJQUN0QyxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUE7QUFBQSxVQUVKLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsUUFDQSxLQUFLO0FBQUE7QUFBQSxRQUNMLHFCQUFxQixDQUFDLGVBQWU7QUFBQTtBQUFBLFFBQ3JDLGFBQWE7QUFBQSxVQUNYLGFBQWE7QUFBQTtBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
