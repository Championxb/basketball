<template>
  <div class="pageTop">
    <sequence2></sequence2>
    <div class="left"></div>
    <div class="title">
      <span :data-text="name">{{ name }}</span>
    </div>
    <div class="right">
      <div class="datetime">
        {{ currentDateTime }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import sequence2 from "./sequence2/index.vue";
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
});

const currentDateTime = ref("");
let timer = null;
let weatherTimer = null;

// 更新时间显示
const updateDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const weekdays = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const weekday = weekdays[now.getDay()];

  currentDateTime.value = `${year}.${month}.${day} ${hours}:${minutes}:${seconds} ${weekday}`;
};

// 启动定时器
const startTimer = () => {
  updateDateTime();
  timer = setInterval(updateDateTime, 1000);
};
// 清除定时器
const clearTimers = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (weatherTimer) {
    clearInterval(weatherTimer);
    weatherTimer = null;
  }
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  clearTimers();
});
</script>

<style lang="scss" scoped>
.pageTop {
  width: 100%;
  background: url("@assets/header/topbg.png") center top no-repeat;
  background-size: 100% 100%;
  height: 300px;
  flex-shrink: 0;
  display: flex;
  top: 0;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  position: fixed;
  z-index: 12;
  pointer-events: none;

  .left {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: nowrap;
    flex-direction: column;
    height: auto;
    position: absolute;
    left: 20px;
    top: 5px;

    .weather-info {
      pointer-events: initial;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      align-content: flex-start;

      .weather-main {
        display: flex;
        align-items: center;

        .temperature {
          font-size: 14px;
          color: #ffffff;
          margin-right: 12px;
          font-family: "DingTalkJinBuTi";
        }

        .weather-desc {
          font-size: 14px;
          color: #ffffff;
        }
      }

      .weather-details {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        flex-direction: row;
        align-content: flex-start;

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-left: 10px;
          font-size: 14px;

          .label {
            color: rgba(255, 255, 255, 0.8);
            font-family: "DingTalkJinBuTi";
            margin-right: 5px;
          }

          .value {
            color: #ffffff;
            font-weight: 500;
            font-family: "DingTalkJinBuTi";
          }
        }
      }
    }

    .weather-loading {
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      padding: 10px;
      pointer-events: initial;
    }

    img {
      width: 17px;
      height: 17px;
      margin-left: -3px;
      margin-right: -3px;
      transition: opacity 0.3s ease;
    }

    .leftDot {
      margin-left: 10px;
      margin-top: 5px;
      z-index: 10;
      position: absolute;
    }

    .liziqiuMain {
      position: absolute;
      left: 60%;
      top: 5px;
    }
  }

  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;
    width: 300px;
    height: 24px;
    position: absolute;
    right: 0;
    top: 0px;

    .datetime {
      font-size: 16px;
      font-family: DIN, Arial, sans-serif;
      font-weight: 400;
      color: #ffffff;
      text-shadow: 0 0 8px #02d5fa;
      margin-right: 20px;
      margin-top: 70px;
      pointer-events: initial;
      white-space: nowrap;
      letter-spacing: 1px;
    }

    img {
      width: 17px;
      height: 17px;
      margin-left: -3px;
      margin-right: -3px;
      transition: opacity 0.3s ease;
    }

    .liziqiuMain {
      position: absolute;
      right: 60%;
      top: 5px;
    }

    .rightDot {
      margin-right: 10px;
      margin-top: 5px;
      z-index: 10;
      position: absolute;
    }
  }

  .title {
    position: relative;
    width: 60%;
    height: 100%;
    display: flex;
    flex-shrink: 0;
    z-index: 111;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;

    span {
      font-size: 40px;
      font-family: DingTalkJinBuTi;
      font-weight: 400;
      color: #ffffff;
      text-shadow: 0 0 18px #02b8fa;
      margin-top: 10px;
      pointer-events: initial;
    }
  }
}

.topBg {
  width: 100%;
  height: 80px;
  position: absolute;
  top: 0;
  z-index: -10;
}

.zhuangshi1 {
  position: absolute;
  left: 27%;
  top: 50px;
}

.zhuangshi2 {
  position: absolute;
  right: 27%;
  top: 50px;
  transform: scaleX(-1); // 水平镜像翻转
}
</style>
