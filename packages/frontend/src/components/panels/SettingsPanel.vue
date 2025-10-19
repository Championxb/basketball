<script setup>
const props = defineProps({ dark: Boolean });
const emit = defineEmits(['toggle-dark','reset']);
</script>
<template>
  <section id="tab-settings" class="tab-panel" aria-label="设置">
    <div class="card">
      <div class="card-header"><h2>系统设置</h2></div>
      <ul class="list">
        <li><span>暗色模式</span><button class="btn small" @click="emit('toggle-dark')">切换</button></li>
        <li><span>清空数据</span><button class="btn small ghost" @click="emit('reset')">重置</button></li>
      </ul>
    </div>
  </section>
</template>