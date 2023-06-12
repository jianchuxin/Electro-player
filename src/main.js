import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import Icon from "base/mmicon/MmIcon.vue";
import router from "./router";

import "@/styles/index.less";

const app = createApp(App);
app.component(Icon.name, Icon);
app.use(createPinia());
app.use(router);

app.mount("#app");
