import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import Icon from "base/mmicon/MmIcon.vue";
import router from "./router";
import "@/styles/index.less";

const app = createApp(App);

app.component(Icon.name, Icon);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(router);

app.mount("#app");
