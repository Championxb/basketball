import dayjs from 'dayjs';

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

export function createSimulator(state) {
  const interval = setInterval(() => {
    state.app.nowTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

    // Courts & people
    let occupied = 0; let peopleTotal = 0; let temps = []; let humids = [];
    state.courts.forEach((c, i) => {
      if (c.status !== 'maintain') {
        c.people = rand(0, c.status === 'busy' ? 12 : 8);
        c.temp = 20 + Math.random() * 10; // 20-30
        c.humid = 40 + Math.random() * 30; // 40-70
        temps.push(c.temp); humids.push(c.humid);
        if (c.people > 0) occupied++;
      } else { c.people = 0; c.temp = 22; c.humid = 50; }
    });
    state.stats.occupiedCourts = occupied;
    state.stats.totalPeople = peopleTotal = state.courts.reduce((s, c) => s + c.people, 0);
    state.stats.avgTemp = temps.length ? (temps.reduce((a,b)=>a+b,0)/temps.length).toFixed(1) : null;
    state.stats.aqi = ['优','良','轻度','中度'][rand(0,1)];

    // Env
    state.env.avgTemp = state.stats.avgTemp ? `${state.stats.avgTemp}°C` : '--°C';
    state.env.avgHumid = humids.length ? `${(humids.reduce((a,b)=>a+b,0)/humids.length).toFixed(0)}%` : '--%';
    state.env.aqi = state.stats.aqi;

    // Visitors
    state.visitors.now = clamp(peopleTotal - rand(0,5), 0, 200);
    state.visitors.today = clamp(state.visitors.today + rand(0,5), 0, 1000);

    // Energy
    const lightOnCourts = state.courts.filter(c => c.light !== '关闭').length;
    state.energy.powerKW = (lightOnCourts * 1.2).toFixed(1);
    state.energy.totalKWh = (Number(state.energy.totalKWh || 0) + Number(state.energy.powerKW) * 0.1).toFixed(1);

    // Charts
    const occ = clamp(Math.round((occupied/4)*100), 0, 100);
    const point = { t: dayjs().format('HH:mm:ss'), v: occ };
    let next = [...state.charts.occupancyHistory, point];
    if (next.length > 20) next = next.slice(next.length - 20);
    state.charts.occupancyHistory = next;
    state.charts.utilRates = state.courts.map(c => clamp(Math.round((c.people/12)*100),0,100));

    // Alerts
    if (rand(0, 20) === 1) {
      const msg = `设备异常：摄像头${rand(1,8)}离线`;
      state.alerts.live.push({ id: Date.now(), msg });
      state.alerts.history.unshift({ time: dayjs().format('HH:mm:ss'), msg });
      if (state.alerts.history.length > 20) state.alerts.history.pop();
      if (state.alerts.live.length > 5) state.alerts.live.shift();
    }
  }, 1200);

  return { stop() { clearInterval(interval); } };
}