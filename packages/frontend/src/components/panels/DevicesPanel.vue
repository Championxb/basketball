<script setup>
const props = defineProps({ devices: Array });
</script>
<template>
  <section id="tab-devices" class="tab-panel" aria-label="设备">
    <div class="card">
      <div class="card-header"><h2>设备在线率</h2></div>
      <div class="devices">
        <div class="device" v-for="d in props.devices" :key="d.name">
          <div class="device-name">{{ d.name }}（{{ d.total }}）</div>
          <div class="device-status" :class="d.online < d.total ? 'warn' : 'ok'">{{ d.online }} 在线</div>
        </div>
      </div>
    </div>
  </section>
</template>