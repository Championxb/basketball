<template>
  <div class="numeric-flow-container">
    <div
        v-for="(num, index) in numbers"
        :key="index"
        class="num"
        :style="getStyle(index)"
        ref="elRefs"
    >
      {{ num }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

const count = 10;
const numbers = ref(Array(count).fill(0));
const elRefs = ref([]);
let animationId = null;
let lastUpdateTime = 0;
const updateInterval = 120; // 增加更新间隔，减少频率

function getStyle(index) {
  const maxSize = 24;
  const minSize = 10;
  // 反转大小计算：第一个元素最小，最后一个元素最大
  const size = minSize + ((maxSize - minSize) / (count - 1)) * index;
  // 反转透明度：第一个元素最透明，最后一个元素最不透明
  const opacity = (index + 1) / count;

  return {
    fontSize: size + 'px',
    color: '#5cb8fa',
    opacity: opacity,
    filter: 'drop-shadow(0 0 10px #3ea7ef)',
    // 添加硬件加速
    transform: 'translateZ(0)',
    willChange: 'transform'
  };
}

// 随机生成数字 - 减少不必要的更新
function randomizeNumbers() {
  const newNumbers = [];
  for (let i = 0; i < count; i++) {
    newNumbers[i] = Math.floor(Math.random() * 10);
  }
  numbers.value = newNumbers;
}

// 使用 requestAnimationFrame 替代 setInterval
function animate(currentTime) {
  if (currentTime - lastUpdateTime >= updateInterval) {
    randomizeNumbers();
    lastUpdateTime = currentTime;
  }

  animationId = requestAnimationFrame(animate);
}

onMounted(() => {
  randomizeNumbers();

  // 启动主动画循环
  animationId = requestAnimationFrame(animate);

  // 简化 GSAP 动画，避免重复动画
  gsap.set(elRefs.value, {
    y: 0,
    opacity: 1
  });

  // 使用更简单的动画效果 - 反转动画方向
  gsap.to(elRefs.value, {
    y: 2, // 改为向下移动
    duration: 1,
    stagger: 0.1,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  // 清理 GSAP 动画
  gsap.killTweensOf(elRefs.value);
});
</script>

<style scoped>
.numeric-flow-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 40px;
}

.num {
  font-weight: bold;
  user-select: none;
  font-family: 'DingTalkJinBuTi';
  /* 启用硬件加速 */
  transform: translateZ(0);
  backface-visibility: hidden;
}
</style>
