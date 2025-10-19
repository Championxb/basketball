# 篮球场馆智能监控（前端）

概述
- 本包为前端项目，基于 Vue 3 + Vite。
- 已将根目录的 篮球.html 页面迁移为 Vue 单文件组件结构，并按前端分层架构完成组件化与功能解耦。
- 视图层（views/components）、业务层（composables）、数据层（services/api）清晰分离，保留原页面的功能与展示效果。

目录结构（关键路径）
- src/
  - App.vue：应用入口视图
  - main.js：应用启动与全局样式导入
  - style.css：全局样式（包含浅/深色主题），从篮球.html 迁移适配
  - router/index.js：路由配置（首页为 Dashboard）
  - views/Dashboard.vue：主仪表盘视图，聚合各面板
  - components/
    - Topbar.vue：顶部栏（时间、模拟开关、暗黑模式）
    - Tabs.vue：标签导航（总览/设备/日程/报警/能耗/环境/访客/设置）
    - panels/*：各功能面板（Overview/Devices/Schedule/Alerts/Energy/Environment/Visitors/Settings）
  - composables/useBasketballStore.js：组合式状态仓库与业务逻辑
  - services/simulator.js：模拟数据源（定时更新、图表数据、告警等）
  - api/index.js：Axios 实例与示例接口封装（可接入真实后端）

主要依赖
- vue、vue-router、axios（基础框架与请求库）
- chart.js（图表展示）
- dayjs（时间格式化）

安装与运行
- 在仓库根目录（推荐）：
  - pnpm dev:frontend
- 或进入前端包（packages/frontend）：
  - 使用 pnpm：
    - pnpm i
    - pnpm dev
  - 使用 npm：
    - npm install
    - npm run dev
- 启动成功后将在本地启动 Vite 开发服务器（默认端口 5173），浏览器访问对应地址预览页面。

功能概览
- 总览：实时状态卡片（人数/占用/温度/AQI）、占用趋势折线图、场地利用率柱状图、实时画面、场地详情与灯光切换、即时告警
- 设备：在线率统计与状态提示
- 日程：日程列表与新增条目
- 报警：历史告警展示与清空操作
- 能耗：照明功率估算与累计电量
- 环境：平均温度、湿度与空气质量
- 访客：当前与日累计访客
- 设置：暗黑模式切换、数据重置

实现要点与注意事项
- 图表由 Chart.js 驱动，数据来源于 services/simulator.js；折线数据采用不可变更新以确保视图响应性。
- 暗黑模式通过在 body 上切换 .dark 类实现（见 style.css）。
- Tabs 通过事件切换当前面板，Dashboard.vue 中以 ref 维护当前标签。
- 如需接入真实后端：
  - 在 src/api/index.js 中配置后端地址与接口；
  - 替换 services/simulator.js 数据来源或关闭模拟开关；
  - 在 useBasketballStore.js 中根据业务逻辑触发真实请求并更新状态。

主题与样式定制
- 修改 src/style.css 即可完成主题色、卡片与栅格布局的调整。
- 已包含 .muted 等辅助样式与深浅色主题变量。
