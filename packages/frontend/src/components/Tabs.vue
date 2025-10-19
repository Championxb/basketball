<script setup>
const props = defineProps({ current: Object, store: Object });
const emit = defineEmits(['change']);
const tabs = [
  { key:'overview', label:'总览' },
  { key:'devices', label:'设备', badge: () => `${props.store.state.devices.reduce((t,d)=>t+d.online,0)}/${props.store.state.devices.reduce((t,d)=>t+d.total,0)}` },
  { key:'schedule', label:'日程', badge: () => props.store.state.schedule.length },
  { key:'alerts', label:'报警', badge: () => props.store.state.alerts.history.length },
  { key:'energy', label:'能耗', badge: () => props.store.state.energy.powerKW || 0 },
  { key:'environment', label:'环境', badge: () => props.store.state.env.aqi || '--' },
  { key:'visitors', label:'访客', badge: () => props.store.state.visitors.now },
  { key:'settings', label:'设置' },
];
</script>
<template>
  <template v-for="t in tabs" :key="t.key">
    <button class="tab" :class="{active: props.current.value===t.key}" @click="emit('change', t.key)">
      <span class="tab-label">{{ t.label }}</span>
      <span v-if="t.badge" class="tab-badge">{{ t.badge() }}</span>
    </button>
  </template>
</template>