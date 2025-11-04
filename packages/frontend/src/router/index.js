import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import { verifyToken } from "@/api/auth.js";

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/home", name: "Home", component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 这是一个模拟后端令牌验证的占位符函数。
// 在实际应用中，您必须将其替换为对您服务器的真实API调用。
async function verifyTokenWithBackend(token) {
  console.warn("令牌验证中...");
  try {
    const response = await verifyToken(token);
    // console.log("令牌验证响应:", response);
    // 因为拦截器返回了 response.data，这里直接判断 code 即可
    return response.code === 0;
  } catch (error) {
    console.error("令牌验证失败:", error);
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");

  // 无论令牌状态如何，都允许访问登录页面
  if (to.name === "Login") {
    return next();
  }

  // 如果令牌不存在，则重定向到登录页
  if (!token) {
    return next({ name: "Login" });
  }

  // 如果是从登录页跳转过来的，说明刚登录成功，跳过验证
  if (from.name === "Login") {
    return next();
  }

  // 如果令牌存在，则通过后端进行验证
  const isTokenValid = await verifyTokenWithBackend(token);
  if (isTokenValid) {
    // 令牌有效，继续访问所请求的路由
    next();
  } else {
    // 令牌无效，从存储中删除并重定向到登录页
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    next({ name: "Login" });
  }
});

export default router;
