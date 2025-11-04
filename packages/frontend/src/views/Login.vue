<template>
  <div
    class="container"
    style="
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <div
      class="card"
      style="
        width: 820px;
        max-width: 95%;
        display: flex;
        overflow: hidden;
        border-radius: 20px;
      "
    >
      <!-- 视觉侧栏 -->
      <div class="login-visual" aria-hidden>
        <div class="visual-inner">
          <div class="brand">
            <div class="brand-mark">🏀</div>
            <div>
              <div class="brand-name">球场看板</div>
              <div class="muted" style="font-size: 12px">
                管理与监控你的篮球场
              </div>
            </div>
          </div>

          <h3 style="margin-top: 18px; color: var(--text)">欢迎回来</h3>
          <p class="muted" style="max-width: 220px">
            使用账户登录以访问仪表盘、场地与设备数据。
          </p>
        </div>
      </div>

      <!-- 表单侧栏 -->
      <div class="login-form" style="padding: 28px; flex: 1">
        <h2 style="margin: 0 0 8px 0">登录</h2>
        <p class="muted" style="margin-top: 0; margin-bottom: 18px">
          请输入用户名和密码以继续
        </p>

        <form @submit.prevent="onSubmit">
          <div class="field">
            <label class="muted" style="font-size: 12px">用户名</label>
            <input v-model="username" placeholder="用户名" required class="" />
          </div>

          <div class="field" style="position: relative">
            <label class="muted" style="font-size: 12px">密码</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="密码"
              required
            />
            <button
              type="button"
              class="btn small ghost"
              @click="toggleShow"
              style="position: absolute; right: 6px; top: 30px"
            >
              {{ showPassword ? "隐藏" : "显示" }}
            </button>
          </div>

          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-top: 14px;
              gap: 12px;
            "
          >
            <label
              style="
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
              "
              class="muted"
            >
              <input type="checkbox" v-model="remember" />
              <span>记住我</span>
            </label>

            <div style="display: flex; gap: 8px">
              <button class="btn" :disabled="loading" type="submit">
                {{ loading ? "登录中..." : "登录" }}
              </button>
              <button type="button" class="btn ghost" @click="clear">
                清除
              </button>
            </div>
          </div>

          <p v-if="error" style="color: var(--danger); margin-top: 12px">
            {{ error }}
          </p>
        </form>

        <div style="margin-top: 20px" class="muted">
          还没有账号？联系<a style="color: aqua">管理员</a>创建。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { login } from "@/api";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const remember = ref(false);
const showPassword = ref(false);
const router = useRouter();

function clear() {
  username.value = "";
  password.value = "";
  error.value = "";
}

function toggleShow() {
  showPassword.value = !showPassword.value;
}

async function onSubmit() {
  error.value = "";
  if (!username.value || !password.value) {
    error.value = "请填写用户名和密码";
    return;
  }

  loading.value = true;
  try {
    // 使用 api.login 封装
    const res = await login({
      username: username.value,
      password: password.value,
    });
    console.log("登录响应:", res);
    const data = res && res.token ? res : res && res.data ? res.data : res;
    if (data && data.token) {
      // 存储 token（如果记住我，则长期存储）Todo bug
      localStorage.setItem("token", data.token);

      if (remember.value) {
        sessionStorage.setItem("token", data.token);
      }
      router.push("/home");
    } else {
      error.value =
        data && data.message ? data.message : "登录失败，请检查用户名与密码";
    }
  } catch (e) {
    error.value =
      e && e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : "网络或服务器错误";
    console.error("登录错误", e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container {
  /* 渐变背景  */
  background: linear-gradient(
    180deg,
    rgba(18, 12, 135, 0.1),
    rgba(46, 14, 205, 0.2)
  );
}
.login-visual {
  width: 280px;
  background: linear-gradient(
    180deg,
    rgba(54, 209, 255, 0.08),
    rgba(123, 97, 255, 0.06)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px;
}
.visual-inner {
  max-width: 220px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-mark {
  font-size: 28px;
}
.brand-name {
  font-weight: 700;
}

.login-form input:not([type="checkbox"]) {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  margin-top: 6px;
  background: transparent;
}
.login-form input[type="checkbox"] {
  width: auto;
  height: auto;
  margin: 0;
  align-self: center;
}
.field {
  margin-bottom: 12px;
}

/* 按钮微调 */
.btn {
  min-width: 86px;
}

@media (max-width: 700px) {
  .card {
    flex-direction: column;
  }
  .login-visual {
    width: 100%;
    padding: 16px;
  }
}
</style>
