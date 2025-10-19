<script setup>
const props = defineProps({ energy: Object });
</script>
<template>
  <section id="tab-energy" class="tab-panel" aria-label="能耗">
    <div class="card">
      <div class="card-header"><h2>今日能耗估算</h2></div>
      <ul class="list" id="energyList">
        <li><span>照明功率（估）</span><span class="tag">{{ props.energy.powerKW ?? '--' }} kW</span></li>
        <li><span>累计用电（估）</span><span class="tag">{{ props.energy.totalKWh ?? '--' }} kWh</span></li>
      </ul>
    </div>
  </section>
</template>