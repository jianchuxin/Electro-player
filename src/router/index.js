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
      component: () => import("views/Music.vue"),
      redirect: "/music/playlist",
      children: [
        {
          path: "/music/playlist", //正在播放列表
          component: () => import("views/playlist/PlayList.vue"),
        },
        {
          path: "/music/userlist", //我的歌单
          component: () => import("views/userlist/UserList.vue"),
        },
        {
          path: "/music/toplist", //排行榜列表
          component: () => import("views/toplist/TopList.vue"),
        },
        {
          path: "/music/details/:id", // 音乐详情列表
          component: () => import("views/details/Details.vue"),
        },
        {
          path: "/music/historylist", //我听过的列表
          component: () => import("views/historylist/HistoryList.vue"),
        },
        {
          path: "/music/search", //歌曲搜索
          component: () => import("views/search/Search.vue"),
        },
        {
          path: "/music/comment/:id", //音乐评论
          component: () => import("views/comment/Comment.vue"),
        },
      ],
    },
  ],
});

export default router;
