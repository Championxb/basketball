import { createApp } from "vue";
import "./style/style.css";
import "./style/fonts.css";
import "./utils/flexible";

import "wow.js/css/libs/animate.css";

import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";
import { VueSeamlessScroll } from '@meruem117/vue-seamless-scroll'
import { createPinia } from 'pinia';

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine);
  },
});
app.use(pinia);
app.use(VueSeamlessScroll);
app.use(router);
app.mount("#app");
