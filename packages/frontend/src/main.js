import { createApp } from "vue";
import "./style/style.css";
import "./utils/flexible";

import "wow.js/css/libs/animate.css";

import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";
import { VueSeamlessScroll } from '@meruem117/vue-seamless-scroll'

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine);
  },
});
app.use(VueSeamlessScroll);
app.use(router);
app.mount("#app");
