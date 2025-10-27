<script setup>
import { onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";
const props = defineProps({ store: Object });
const occCanvas = ref(null);
const utilCanvas = ref(null);
let occChart, utilChart;

onMounted(() => {
  occChart = new Chart(occCanvas.value, {
    type: "line",
    data: {
      labels: [],
      datasets: [{ label: "占用率(%)", data: [], borderColor: "#36d1ff" }],
    },
    options: { responsive: true, scales: { y: { min: 0, max: 100 } } },
  });
  utilChart = new Chart(utilCanvas.value, {
    type: "bar",
    data: {
      labels: ["A", "B", "C", "D"],
      datasets: [
        { label: "利用率(%)", data: [0, 0, 0, 0], backgroundColor: "#7b61ff" },
      ],
    },
    options: { responsive: true, scales: { y: { min: 0, max: 100 } } },
  });
});

watch(
  () => props.store.state.charts.occupancyHistory.length,
  () => {
    if (!occChart) return;
    const arr = props.store.state.charts.occupancyHistory;
    occChart.data.labels = arr.map((x) => x.t);
    occChart.data.datasets[0].data = arr.map((x) => x.v);
    occChart.update();
  }
);

watch(
  () => props.store.state.charts.utilRates,
  (rates) => {
    if (!utilChart) return;
    utilChart.data.datasets[0].data = rates;
    utilChart.update();
  }
);
</script>

<template>
  <section id="tab-overview" class="tab-panel active" aria-label="总览">
    <div class="grid">
      <div class="card span-2">
        <div class="card-header">
          <h2>实时状态</h2>
          <span class="muted">{{ props.store.state.app.nowTime }}</span>
        </div>
        <div class="stats">
          <div class="stat">
            <div class="stat-label">在场人数</div>
            <div class="stat-value">
              {{ props.store.state.stats.totalPeople }}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">场地占用</div>
            <div class="stat-value">{{ props.store.courtUsageLabel }}</div>
          </div>
          <div class="stat">
            <div class="stat-label">平均温度</div>
            <div class="stat-value">
              {{
                props.store.state.stats.avgTemp
                  ? props.store.state.stats.avgTemp + "°C"
                  : "--°C"
              }}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">空气质量</div>
            <div class="stat-value">{{ props.store.state.stats.aqi }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h2>占用趋势</h2></div>
        <canvas ref="occCanvas" aria-label="占用趋势图" role="img"></canvas>
      </div>

      <div class="card">
        <div class="card-header"><h2>场地利用率</h2></div>
        <canvas ref="utilCanvas" aria-label="利用率柱状图" role="img"></canvas>
      </div>

      <div class="card span-2">
        <div class="card-header">
          <h2>实时画面</h2>
          <div class="feeds-actions">
            <button class="btn ghost" @click="props.store.refreshFeeds">
              刷新画面
            </button>
          </div>
        </div>
        <div class="feeds">
          <figure class="feed">
            <img
              src="https://images.unsplash.com/photo-1519866663826-7e1967cbada1?q=80&w=1080&auto=format&fit=crop"
              alt="场地A摄像头实时画面"
            />
            <figcaption>场地 A</figcaption>
          </figure>
          <figure class="feed">
            <img
              src="https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1080&auto=format&fit=crop"
              alt="场地B摄像头实时画面"
            />
            <figcaption>场地 B</figcaption>
          </figure>
          <figure class="feed">
            <img
              src="https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1080&auto=format&fit=crop"
              alt="入口通道摄像头"
            />
            <figcaption>入口通道</figcaption>
          </figure>
          <figure class="feed">
            <img
              src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1080&auto=format&fit=crop"
              alt="看台摄像头"
            />
            <figcaption>看台</figcaption>
          </figure>
        </div>
      </div>

      <div class="card span-2">
        <div class="card-header"><h2>场地详情</h2></div>
        <div class="courts">
          <div
            class="court"
            v-for="c in props.store.state.courts"
            :key="c.id"
            :id="`court-${c.id}`"
          >
            <div class="court-head">
              <span class="court-name">{{ c.id }}场</span>
              <span class="badge" :data-status="c.status">{{
                c.status === "busy"
                  ? "使用中"
                  : c.status === "idle"
                  ? "空闲"
                  : "维护中"
              }}</span>
            </div>
            <div class="court-body">
              <div>
                人数：<span class="value people">{{ c.people }}</span>
              </div>
              <div>
                温度：<span class="value temp">{{
                  c.temp ? c.temp.toFixed(1) + "°C" : "--°C"
                }}</span>
              </div>
              <div>
                湿度：<span class="value humid">{{
                  c.humid ? c.humid.toFixed(0) + "%" : "--%"
                }}</span>
              </div>
              <div>
                灯光：<span class="value light">{{ c.light }}</span>
              </div>
            </div>
            <div class="court-actions">
              <button
                class="btn small"
                @click="props.store.toggleCourtLight(c.id)"
              >
                切换灯光
              </button>
              <button
                class="btn small ghost"
                :disabled="c.status === 'maintain'"
              >
                预约
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h2>报警</h2></div>
        <ul class="list" id="alertList">
          <li v-for="a in props.store.state.alerts.live" :key="a.id">
            <span>{{ a.msg }}</span>
            <span class="tag danger">严重</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
