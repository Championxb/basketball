<script setup>
const props = defineProps({ nowTime: String, isSimulating: Boolean, darkMode: Boolean });
const emit = defineEmits(['toggle-sim','toggle-dark']);
</script>
<template>
  <div class="brand">
    <span class="brand-mark" aria-hidden="true">🏀</span>
    <span class="brand-name">篮球场馆智能监控</span>
  </div>
  <div class="topbar-actions">
    <button class="btn" :aria-pressed="props.isSimulating" @click="emit('toggle-sim')">{{ props.isSimulating ? '暂停模拟' : '继续模拟' }}</button>
    <button class="btn" :aria-pressed="props.darkMode" @click="emit('toggle-dark')">{{ props.darkMode ? '亮色模式' : '暗色模式' }}</button>
    <span class="muted" style="margin-left:12px">{{ props.nowTime }}</span>
  </div>
</template>