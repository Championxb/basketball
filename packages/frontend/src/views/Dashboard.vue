<script setup>
import { ref } from 'vue';
import Topbar from '../components/Topbar.vue';
import Tabs from '../components/Tabs.vue';
import OverviewPanel from '../components/panels/OverviewPanel.vue';
import DevicesPanel from '../components/panels/DevicesPanel.vue';
import SchedulePanel from '../components/panels/SchedulePanel.vue';
import AlertsPanel from '../components/panels/AlertsPanel.vue';
import EnergyPanel from '../components/panels/EnergyPanel.vue';
import EnvironmentPanel from '../components/panels/EnvironmentPanel.vue';
import VisitorsPanel from '../components/panels/VisitorsPanel.vue';
import SettingsPanel from '../components/panels/SettingsPanel.vue';
import { useBasketballStore } from '../composables/useBasketballStore';

const tabs = ['overview','devices','schedule','alerts','energy','environment','visitors','settings'];
const currentTab = ref('overview');
const store = useBasketballStore();
</script>

<template>
  <header class="topbar" role="banner">
    <Topbar :now-time="store.state.app.nowTime"
            :is-simulating="store.state.app.isSimulating"
            :dark-mode="store.state.app.darkMode"
            @toggle-sim="store.toggleSimulation"
            @toggle-dark="store.toggleDark" />
  </header>

  <nav class="tabs" role="navigation" aria-label="主导航">
    <Tabs :current="currentTab" :store="store" @change="t => currentTab.value = t" />
  </nav>

  <main class="container">
    <OverviewPanel v-show="currentTab==='overview'" :store="store" />
    <DevicesPanel v-show="currentTab==='devices'" :devices="store.state.devices" />
    <SchedulePanel v-show="currentTab==='schedule'" :list="store.state.schedule" @add="store.addSchedule" />
    <AlertsPanel v-show="currentTab==='alerts'" :history="store.state.alerts.history" @clear="store.clearAlerts" />
    <EnergyPanel v-show="currentTab==='energy'" :energy="store.state.energy" />
    <EnvironmentPanel v-show="currentTab==='environment'" :env="store.state.env" />
    <VisitorsPanel v-show="currentTab==='visitors'" :visitors="store.state.visitors" />
    <SettingsPanel v-show="currentTab==='settings'" :dark="store.state.app.darkMode" @toggle-dark="store.toggleDark" @reset="store.resetData" />
  </main>

  <footer class="footer" role="contentinfo">
    <span>© 场馆智能监控</span>
    <span class="muted">演示数据 · 非真实监控</span>
  </footer>
</template>