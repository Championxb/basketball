// src/composables/useSSE.js
import { ref } from "vue";
import { get } from "@/api/request.js";
/**
 * useSSE - 用于与后端建立 SSE 连接的 Composable
 * @param {string | number} clientId - 客户端 ID，会拼接到 SSE 接口地址中
 * @returns {Object} 包含 sseData 和 connectSSE 方法等
 */
export function useSSE(clientId = 9) {
  const sseData = ref(null); // 用于存储从 SSE 接收到的数据
  const eventSource = ref(null); // 保存 EventSource 实例
  const lastMessageTime = ref(Date.now()); // 上次收到消息的时间
  const heartbeatTimer = ref(null); // 心跳检测定时器
  const heartbeatIntervalMs = 60000; // 每隔 10 秒检测一次
  const heartbeatTimeoutMs = 30000; // 超过 30 秒没有消息就认为连接失效

  // 心跳检测函数
  const checkHeartbeat = () => {
    const now = Date.now();
    if (now - lastMessageTime.value > heartbeatTimeoutMs) {
      console.warn(
        "⚠️ SSE 心跳超时，连接可能已断开，lastMessageTime:",
        lastMessageTime.value
      );
      // 自动重连
      disconnectSSE();
      setTimeout(() => connectSSE(clientId), 3000); // 延迟 3 秒重连
    }
  };
  // 启动心跳检测定时器
  const startHeartbeatCheck = () => {
    // 先清除旧定时器
    if (heartbeatTimer.value) {
      clearInterval(heartbeatTimer.value);
    }

    // 每隔 heartbeatIntervalMs 执行一次检测
    heartbeatTimer.value = setInterval(checkHeartbeat, heartbeatIntervalMs);
  };
  // 停止心跳检测
  const stopHeartbeatCheck = () => {
    if (heartbeatTimer.value) {
      clearInterval(heartbeatTimer.value);
      heartbeatTimer.value = null;
    }
  };

  /**
   * 连接 SSE
   */
  function connectSSE(clientId) {
    // 如果已有连接，先关闭
    if (eventSource.value) {
      eventSource.value.close();
    }

    const url = `/sse/connect/${clientId}`; // 后端 SSE 接口地址
    eventSource.value = new EventSource(url);

    eventSource.value.onopen = (event) => {
      console.log("✅ SSE 连接已打开", event);
      lastMessageTime.value = Date.now(); // 连接成功也认为是一次有效消息
      // startHeartbeatCheck(); // 启动心跳检测
    };

    eventSource.value.onmessage = (event) => {
      console.log("🟢 收到 SSE 数据:", event.data);
      lastMessageTime.value = Date.now(); // 收到消息，更新时间
      try {
        // 尝试解析为 JSON（通常后端推送的是 JSON 字符串）
        const data = JSON.parse(event.data);
        console.log("🟢 收到 SSE 数据:", event.data);

        sseData.value = data;
      } catch (e) {
        // 如果不是 JSON，直接使用原始字符串
        console.log("SSE 原始数据（非 JSON）:", event.data);
        sseData.value = event.data;
      }
    };
    eventSource.value.addEventListener("highLight", (event) => {
      //   console.log("📡 收到 highLight 事件:", event.data);
      lastMessageTime.value = Date.now();
      try {
        const dataArray = JSON.parse(event.data); // 解析 JSON 数组字符串
        sseData.value = dataArray; // 假设你要存整个数组

        // 遍历处理每个高光
        dataArray.forEach((item) => {
          //   const { highlight, playerName } = item;
          console.log(`球员 ${item.playerId} 的高光 ID: ${item.id}`);
        });
      } catch (e) {
        console.error("解析 broadcast 数据失败:", e);
        sseData.value = event.data;
      }
    });

    eventSource.value.addEventListener("chat", (event) => {
      lastMessageTime.value = Date.now();
      try {
        const dataArray = JSON.parse(event.data); // 解析 JSON 数组字符串
        sseData.value = dataArray; // 假设你要存整个数组
        console.log("收到 chat 消息:", dataArray);
      } catch (e) {
        console.error("解析 broadcast 数据失败:", e);
        sseData.value = event.data;
      }
    });
    eventSource.value.onerror = (event) => {
      console.error("❌ SSE 连接发生错误:", event);
      // 可在此处加入重连逻辑
      stopHeartbeatCheck();
    };
    eventSource.value.onclose = () => {
      console.log("🔌 SSE 连接已关闭（浏览器端）");
      stopHeartbeatCheck();
    };
  }

  /**
   * 手动关闭 SSE 连接
   */
  async function disconnectSSE() {
    if (eventSource.value) {
      eventSource.value.close();
      eventSource.value = null;
      console.log("🔌 SSE 连接已手动关闭");
      //api通知后端断开连接
      try {
        await get(`/sse/disconnect/${clientId}`);
      } catch (error) {
        console.error("通知后端断开连接失败:", error);
      }
    }
  }

  return {
    sseData, // 响应式数据，接收 SSE 推送内容
    connectSSE, // 方法：传入 clientId 连接
    disconnectSSE, // 方法：手动断开连接
    eventSource, // （可选）如果你需要访问底层 EventSource 实例
  };
}
