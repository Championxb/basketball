<script setup>
import dayjs from 'dayjs';
const props = defineProps({ list: Array });
const emit = defineEmits(['add']);
function add() {
  emit('add', { time: dayjs().format('HH:mm'), title: '友谊赛', court: 'B场' });
}
</script>
<template>
  <section id="tab-schedule" class="tab-panel" aria-label="日程">
    <div class="card">
      <div class="card-header">
        <h2>今日安排</h2>
        <button class="btn ghost" @click="add">新建</button>
      </div>
      <ul class="list" id="scheduleList">
        <li v-for="(s,i) in props.list" :key="i">
          <span>{{ s.time }} · {{ s.title }}</span>
          <span class="tag">{{ s.court }}</span>
        </li>
        <li v-if="!props.list.length" class="muted">暂无安排</li>
      </ul>
    </div>
  </section>
</template>