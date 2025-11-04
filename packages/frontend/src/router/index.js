import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import { verifyToken } from "@/api/auth.js";

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/home", name: "Home", component: Home },
  { path: "/:catchAll(.*)", redirect: { name: "Home" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

async function verifyTokenWithBackend(token) {
  console.warn("令牌验证中...");
  try {
    const response = await verifyToken(token);
    // console.log("令牌验证响应:", response);
    const isTokenValid = response.code === 0;
    if (!isTokenValid) {
      console.info("令牌验证失败");
    }else{
      console.info("令牌校验通过");
    }
    return isTokenValid;
  } catch (error) {
    console.error("令牌验证失败:", error);
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  // 支持 localStorage / sessionStorage 两处查找
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // 在登录页面：若令牌存在且有效，刷新时自动跳转到首页
  if (to.name === "Login") {
    if (!token) return next();
    const isTokenValid = await verifyTokenWithBackend(token);
    if (isTokenValid) return next({ name: "Home" });
    return next();
  }

  // 非登录页面：若令牌不存在，跳到登录页
  if (!token) return next({ name: "Login" });

  // 刚从登录页过来，直接放行（避免重复验证）
  if (from.name === "Login") return next();

  // 其他情况按令牌有效性决定
  const isTokenValid = await verifyTokenWithBackend(token);
  if (isTokenValid) {
    next();
  } else {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    next({ name: "Login" });
  }
});

export default router;
