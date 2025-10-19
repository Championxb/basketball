<script setup>
const props = defineProps({ history: Array });
const emit = defineEmits(['clear']);
</script>
<template>
  <section id="tab-alerts" class="tab-panel" aria-label="报警">
    <div class="card">
      <div class="card-header">
        <h2>报警记录</h2>
        <button class="btn ghost" @click="emit('clear')">清空</button>
      </div>
      <ul class="list" id="alertHistory">
        <li v-for="(a,i) in props.history" :key="i"><span>{{ a.time }}</span><span class="tag danger">{{ a.msg }}</span></li>
        <li v-if="!props.history.length" class="muted">暂无报警记录</li>
      </ul>
    </div>
  </section>
</template>