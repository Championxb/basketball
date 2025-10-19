<script setup>
const props = defineProps({ env: Object });
</script>
<template>
  <section id="tab-environment" class="tab-panel" aria-label="环境">
    <div class="card">
      <div class="card-header"><h2>环境概览</h2></div>
      <ul class="list" id="envList">
        <li><span>平均温度</span><span class="tag" id="envAvgTemp">{{ props.env.avgTemp }}</span></li>
        <li><span>平均湿度</span><span class="tag" id="envAvgHumid">{{ props.env.avgHumid }}</span></li>
        <li><span>空气质量</span><span class="tag" id="envAQI">{{ props.env.aqi }}</span></li>
      </ul>
    </div>
  </section>
</template>