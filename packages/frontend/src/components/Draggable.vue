<template>
  <div
    ref="draggable"
    class="draggable"
    :style="style"
    @mousedown="startDrag"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from 'vue';

// 接收父组件的参数
const props = defineProps({
  // 是否限制在父容器内
  containerBoundary: {
    type: Boolean,
    default: true
  },
  // 自定义边界（如果不限制在父容器内）
  boundary: {
    type: Object,
    default: () => null
  }
});

// 记录拖拽状态
const isDragging = ref(false);
const mouseOffsetX = ref(0);
const mouseOffsetY = ref(0);
const startLeft = ref(0);
const startTop = ref(0);

// 获取元素的引用
const draggable = ref(null);

// 获取父容器的尺寸（如果限制在父容器内）
const containerWidth = ref(0);
const containerHeight = ref(0);

// 样式绑定
const style = ref({
  position: 'absolute',
  cursor: 'grab',
});

// 在组件挂载后获取父容器的尺寸（如果需要）
onMounted(() => {
  if (props.containerBoundary && draggable.value) {
    const containerRect = draggable.value.parentElement.getBoundingClientRect();
    containerWidth.value = containerRect.width;
    containerHeight.value = containerRect.height;
  }
});

// 启动拖拽
const startDrag = (e) => {
  isDragging.value = true;
  mouseOffsetX.value = e.clientX;
  mouseOffsetY.value = e.clientY;

  const rect = draggable.value.getBoundingClientRect();
  startLeft.value = rect.left;
  startTop.value = rect.top;

  // 监听鼠标移动和松开
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

// 拖拽过程中更新位置
const onDrag = (e) => {
  if (!isDragging.value) return;

  const deltaX = e.clientX - mouseOffsetX.value;
  const deltaY = e.clientY - mouseOffsetY.value;

  // 根据父容器或自定义边界进行限制
  let newLeft = startLeft.value + deltaX;
  let newTop = startTop.value + deltaY;

  if (props.containerBoundary) {
    // 限制在父容器内
    newLeft = Math.max(newLeft, 0);
    newLeft = Math.min(newLeft, containerWidth.value - draggable.value.offsetWidth);

    newTop = Math.max(newTop, 0);
    newTop = Math.min(newTop, containerHeight.value - draggable.value.offsetHeight);
  } else if (props.boundary) {
    // 限制在自定义边界内
    newLeft = Math.max(newLeft, props.boundary.left || 0);
    newLeft = Math.min(newLeft, props.boundary.right - draggable.value.offsetWidth);

    newTop = Math.max(newTop, props.boundary.top || 0);
    newTop = Math.min(newTop, props.boundary.bottom - draggable.value.offsetHeight);
  }

  style.value.left = `${newLeft}px`;
  style.value.top = `${newTop}px`;
};

// 停止拖拽
const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};
</script>

<style scoped>
.draggable {
  cursor: grab;
}
</style>
