<script setup>
const props = defineProps({ visitors: Object });
</script>
<template>
  <section id="tab-visitors" class="tab-panel" aria-label="访客">
    <div class="card">
      <div class="card-header"><h2>访客统计</h2></div>
      <ul class="list" id="visitorsList">
        <li><span>当前在馆</span><span class="tag" id="visitorsNow">{{ props.visitors.now }}</span></li>
        <li><span>今日累计</span><span class="tag" id="visitorsToday">{{ props.visitors.today }}</span></li>
      </ul>
    </div>
  </section>
</template>