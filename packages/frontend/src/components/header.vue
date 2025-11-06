<template>
  <div class="header" :class="{ enter: isVisible }">
    <div class="wrapper">
      <img src="@assets/header.svg" alt="" />
      <div class="title">篮球场馆监控分析系统</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

const isVisible = ref(false);

onMounted(() => {
  // 使用下一帧触发进入状态，确保有过渡效果
  requestAnimationFrame(() => {
    isVisible.value = true;
  });
});
</script>
<style lang="scss" scoped>
.header {
  --back-color: rgba(6, 55, 107, 0.5);
  width: 100vw;
  // 初始在视口上方并透明
  transform: translateY(-100%);
  opacity: 0;
  transition: transform 1000ms cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 100ms ease;
  will-change: transform, opacity;
  position: relative;
  background-color: #2762a5;

  &.enter {
    transform: translateY(0);
    opacity: 1;
  }
  .wrapper {
    background: linear-gradient(
      to right,
      var(--back-color) 0%,
      var(--back-color) 30%,
      transparent 35%,
      transparent 65%,
      var(--back-color) 70%,
      var(--back-color) 100%
    );
    img {
      width: 100%;
      height: 100%;
      // height: 100%;
      position: relative;
    }
    .title {
      background: linear-gradient(to right, #0059ff, #00ffff);
      color: transparent;
      background-clip: text;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -60%);
      font-size: font(35);
      font-weight: 600;
    }
  }
}
</style>
