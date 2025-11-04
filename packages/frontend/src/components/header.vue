<template>
  <div class="header" :class="{ enter: isVisible }">
    <img src="@assets/header.svg" alt="" />
    <div class="title">篮球场馆监控分析系统</div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';

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
  position: relative;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;

  // 初始在视口上方并透明
  transform: translateY(-100%);
  opacity: 0;
  transition: transform 1000ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 100ms ease;
  will-change: transform, opacity;

  &.enter {
    transform: translateY(0);
    opacity: 1;
  }

  img {
    position: absolute;
    top: vh(10px);
  }
  .title {
    background: linear-gradient(to right, #0059ff, #00ffff);
    color: transparent;
    background-clip: text;

    font-size: font(35px);
    font-weight: 600;
    margin-top: vh(10px);
  }
}
</style>
