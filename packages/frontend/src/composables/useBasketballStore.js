import { reactive, computed } from 'vue';
import dayjs from 'dayjs';
import { createSimulator } from '../services/simulator';

const initialState = () => ({
  app: {
    nowTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    isSimulating: true,
    darkMode: false,
  },
  stats: {
    totalPeople: 0,
    occupiedCourts: 0,
    avgTemp: null,
    aqi: '优',
  },
  charts: {
    occupancyHistory: [],
    utilRates: [0,0,0,0],
  },
  feeds: { refreshTick: 0 },
  devices: [
    { name: '摄像头', total: 8, online: 7 },
    { name: '温湿度传感器', total: 12, online: 12 },
    { name: '灯控模块', total: 4, online: 3 },
  ],
  schedule: [],
  alerts: { live: [], history: [] },
  energy: { powerKW: null, totalKWh: null },
  env: { avgTemp: null, avgHumid: null, aqi: '--' },
  visitors: { now: 0, today: 0 },
  courts: [
    { id: 'A', status: 'idle', people: 0, temp: null, humid: null, light: '自动' },
    { id: 'B', status: 'busy', people: 0, temp: null, humid: null, light: '自动' },
    { id: 'C', status: 'idle', people: 0, temp: null, humid: null, light: '自动' },
    { id: 'D', status: 'maintain', people: 0, temp: null, humid: null, light: '关闭' },
  ],
});

const state = reactive(initialState());
let simulatorStop = null;

export function useBasketballStore() {
  const courtUsageLabel = computed(() => `${state.stats.occupiedCourts}/4`);

  function startSimulation() {
    if (simulatorStop) return; // already running
    const { stop } = createSimulator(state);
    simulatorStop = stop;
  }

  function stopSimulation() {
    if (simulatorStop) {
      simulatorStop();
      simulatorStop = null;
    }
  }

  function toggleSimulation() {
    state.app.isSimulating = !state.app.isSimulating;
    if (state.app.isSimulating) startSimulation(); else stopSimulation();
  }

  function toggleDark() {
    state.app.darkMode = !state.app.darkMode;
    document.body.classList.toggle('dark', state.app.darkMode);
  }

  function refreshFeeds() { state.feeds.refreshTick++; }

  function addSchedule(item) { state.schedule.push(item); }

  function clearAlerts() { state.alerts.history = []; }

  function toggleCourtLight(id) {
    const c = state.courts.find(x => x.id === id);
    if (!c) return;
    c.light = c.light === '关闭' ? '自动' : (c.light === '自动' ? '关闭' : '自动');
  }

  function resetData() {
    stopSimulation();
    const fresh = initialState();
    Object.keys(fresh).forEach(k => state[k] = fresh[k]);
    document.body.classList.toggle('dark', state.app.darkMode);
    if (state.app.isSimulating) startSimulation();
  }

  if (state.app.isSimulating) startSimulation();

  return { state, courtUsageLabel, toggleSimulation, toggleDark, refreshFeeds, addSchedule, clearAlerts, toggleCourtLight, resetData };
}