<template>
  <div id="particles-container">
    <vue-particles
        id="tsparticles"
        :options="particlesOptions"
        @particles-loaded="particlesLoaded"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const particlesOptions = {
  fullScreen: false, // 禁用全屏模式，这是关键
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 950,
      },
    },
    color: {
      value: "#1194b8",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
      random: false,
    },
    size: {
      value: 3,
      random: true,
    },
    links: {
      enable: true,
      distance: 150,
      color: "#0a4c5e",
      opacity: 1,
      width: 1,
    },
    move: {
      enable: true,
      speed: 3,
      direction: "none",
      random: false,
      straight: false,
      outMode: "out",
      bounce: false,
    },
  },
  interactivity: {
    detectOn: "canvas",
    events: {
      onHover: {
        enable: true,
        mode: "grab",
      },
      onClick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
  },
  retina_detect: true,
};

const particlesLoaded = (container) => {
  console.log("Particles loaded!", container);
};

onMounted(() => {
  // 只在需要时执行一次，不要使用循环或间隔
  // setTimeout(() => {
  //   const container = document.getElementById('particles-container');
  //   if (container) {
  //     // 调整容器样式，而不是直接修改canvas
  //     container.style.position = 'relative';
  //     container.style.width = '100%';
  //     container.style.height = '100%';
  //     container.style.top = '100%';
  //     container.style.left = '0';
  //     container.style.zIndex = '0';
  //   }
  // }, 100);
});
</script>

<style lang="scss">
#particles-container {
  position: relative;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  background: transparent;
  overflow: hidden; /* 确保粒子不会溢出容器 */
  pointer-events: none;
  //pointer-events: initial;
}

#tsparticles {
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
