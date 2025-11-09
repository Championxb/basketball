<template>
  <div class="container" ref="containerRef">
    <div
        v-for="flow in flows"
        :key="flow.id"
        class="flow-item"
        :style="getFlowStyle(flow)"
    >
      <NumericFlow />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NumericFlow from './NumericFlow.vue';

const flows = ref([]);
const containerRef = ref(null);
let animationId = null;
let containerWidth = 0;
let containerHeight = 0;
let flowCount = 0;

// 限制最大流数量
const MAX_FLOWS = 6;

function generateRandomFlow() {
  const scale = Math.random() * 0.5 + 0.7; // 减小范围避免性能问题
  const speed = Math.random() * 1.5 + 1;

  return {
    id: flowCount++,
    x: Math.random() * (containerWidth - 50),
    y: -50, // 从顶部开始
    scale: scale,
    speed: speed,
    opacity: Math.random() * 0.3 + 0.7,
  };
}

function getFlowStyle(flow) {
  return {
    position: 'absolute',
    left: flow.x + 'px',
    top: flow.y + 'px',
    transform: `scale(${flow.scale}) translateZ(0)`, // 添加硬件加速
    opacity: flow.opacity,
    willChange: 'transform', // 提示浏览器优化
  };
}

function updateContainerSize() {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect();
    containerWidth = rect.width;
    containerHeight = rect.height;
  }
}

// 优化动画循环
function animateFlows() {
  // 批量更新所有流的位置 - 改为向下移动
  flows.value = flows.value.filter(flow => {
    flow.y += flow.speed * 1.5; // 改为加法，向下移动
    return flow.y < containerHeight + 200; // 改为判断是否超出底部
  });

  // 控制流的数量，避免无限增长
  if (flows.value.length < MAX_FLOWS && Math.random() < 0.2) { // 降低生成概率
    flows.value.push(generateRandomFlow());
  }

  animationId = requestAnimationFrame(animateFlows);
}

function initializeFlows() {
  flows.value = [];
  // 初始流数量也要控制
  const initialCount = Math.min(6, MAX_FLOWS);
  for (let i = 0; i < initialCount; i++) {
    const flow = generateRandomFlow();
    flow.y = Math.random() * containerHeight; // 随机分布在容器内
    flows.value.push(flow);
  }
}

// 节流处理窗口大小变化
let resizeTimeout = null;
function handleResize() {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(() => {
    updateContainerSize();
    flows.value.forEach(flow => {
      if (flow.x > containerWidth - 50) {
        flow.x = Math.random() * (containerWidth - 50);
      }
    });
  }, 100);
}

onMounted(() => {
  updateContainerSize();
  initializeFlows();
  animateFlows();

  window.addEventListener('resize', handleResize, { passive: true });
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  /* 启用合成层 */
  transform: translateZ(0);
}

.flow-item {
  will-change: transform;
  /* 启用硬件加速 */
  transform: translateZ(0);
  backface-visibility: hidden;
}
</style>
