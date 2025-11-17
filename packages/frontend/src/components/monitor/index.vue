<template>
  <div class="image-grid">
    <div
      class="grid-item"
      v-for="(image, index) in images"
      :key="index"
      @click="showPop(index + 1)"
      :class="{ disabled: isDeviceDisabled(index) }"
    >
      <img :src="image" :alt="`图片 ${index + 1}`" />
      <!-- 监控状态信息 -->
      <div class="status-overlay">
        <div class="status-indicator">
          <span class="status-dot" :class="getStatusClass(index)"></span>
          <span class="status-text">{{ getStatusText(index) }}</span>
        </div>
        <div class="device-info">
          <div class="device-name">{{ deviceInfo[index].name }}</div>
          <div class="device-time">{{ deviceInfo[index].time }}</div>
        </div>
      </div>
    </div>
  </div>
  <pop
    ref="popRef"
    :pop-width="'1000px'"
    :pop-height="'600px'"
    :title="popTitle"
  >
    <div class="video-container">
      <video ref="videoPlayer" autoplay muted loop controls>
        <source :src="videoSrc" type="video/mp4" />
        您的浏览器不支持 video 标签。
      </video>
    </div>
  </pop>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
// import { ElMessage } from 'element-plus';
import img1 from "./assets/1.jpg";
import img2 from "./assets/2.jpg";
import img3 from "./assets/3.jpg";
import img4 from "./assets/4.jpg";
import pop from "./pop/pop.vue";
import videoMp4 from "./assets/video.mp4";

// const images = [img1, img2, img3, img4, img1, img2, img3, img4];
const images = [img1];

const popRef = ref(null);
const videoPlayer = ref(null);
const popTitle = ref("");

// 设备状态数据
const deviceStatus = ref([
  { status: "normal", name: "监控点1", time: "" },
  // { status: "fault", name: "监控点2", time: "" },
  // { status: "offline", name: "监控点3", time: "" },
  // { status: "normal", name: "监控点4", time: "" },
  // { status: "normal", name: "监控点5", time: "" },
  // { status: "fault", name: "监控点6", time: "" },
  // { status: "offline", name: "监控点7", time: "" },
  // { status: "normal", name: "监控点8", time: "" },
]);

// 设备信息
const deviceInfo = computed(() => {
  return deviceStatus.value.map((device) => ({
    name: device.name,
    time: device.time,
  }));
});

const videoSrc = computed(() => videoMp4);

// 检查设备是否禁用（故障或离线）
const isDeviceDisabled = (index) => {
  const status = deviceStatus.value[index].status;
  return status === "fault" || status === "offline";
};

// 获取状态样式类
const getStatusClass = (index) => {
  const status = deviceStatus.value[index].status;
  return `status-${status}`;
};

// 获取状态文本
const getStatusText = (index) => {
  const status = deviceStatus.value[index].status;
  const statusMap = {
    normal: "正常",
    fault: "故障",
    offline: "离线",
  };
  return statusMap[status] || "未知";
};

// 更新时间
const updateTime = () => {
  const now = new Date();
  const timeString = now.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  deviceStatus.value.forEach((device) => {
    device.time = timeString;
  });
};

// 定时器
let timeInterval = null;

const showPop = (index) => {
  const deviceIndex = index - 1;
  const device = deviceStatus.value[deviceIndex];

  // 检查设备状态，如果是故障或离线则不显示弹出框
  if (isDeviceDisabled(deviceIndex)) {
    const statusText = getStatusText(deviceIndex);
    ElMessage.warning(`${device.name}当前状态为${statusText}，无法查看视频`);
    return;
  }

  popTitle.value = `${device.name}`;
  popRef.value.getShow();
  setTimeout(() => {
    if (videoPlayer.value) {
      videoPlayer.value.play();
    }
  }, 0);
};

onMounted(() => {
  updateTime();
  // 每秒更新时间
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.pause();
  }
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style lang="scss" scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  aspect-ratio: 1 / 1;
  margin-top: 10px;
  margin-left: 10px;
  position: relative;
}

.grid-item {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  // 禁用状态样式（故障或离线）
  &.disabled {
    cursor: not-allowed;

    img {
      filter: grayscale(100%);
      opacity: 0.5;

      &:hover {
        transform: none;
      }
    }
  }

  // 状态信息覆盖层
  .status-overlay {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.2;
    backdrop-filter: blur(3px);
    z-index: 10;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .status-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-block;
    animation: pulse 2s infinite;
    margin-right: 5px;
  }

  .status-normal {
    background-color: #52c41a;
    box-shadow: 0 0 6px #52c41a;
  }

  .status-fault {
    background-color: #ff4d4f;
    box-shadow: 0 0 6px #ff4d4f;
  }

  .status-offline {
    background-color: #8c8c8c;
    box-shadow: 0 0 6px #8c8c8c;
  }

  .status-text {
    font-weight: 500;
    font-size: 18px;
    margin-right: 10px;
  }

  .device-info {
    position: absolute;
    right: 10px;
    display: flex;
    align-items: center;
    gap: 10px;

    .device-name {
      font-weight: 500;
      font-size: 15px;
    }

    .device-time {
      font-size: 15px;
      color: #ccc;
      font-family: monospace;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.video-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  video {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>
