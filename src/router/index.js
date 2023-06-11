import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/music",
    },
    {
      path: "/music",
      // component: () => import(),
    },
  ],
});

export default router;
