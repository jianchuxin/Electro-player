import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import Icon from "base/electroIcon/ElectroIcon.vue";
import router from "./router";
import "@/styles/index.less";
import { lazyPlugin } from "./directives";

const app = createApp(App);

app.component(Icon.name, Icon);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.directive("focus", {
  mounted: (el) => {
    el.focus();
  },
});

app.use(pinia);

app.use(router);

app.use(lazyPlugin);

app.mount("#app");
