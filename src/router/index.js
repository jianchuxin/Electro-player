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
          meta: {
            title: "我的歌单",
          },
        },
        {
          path: "/music/toplist", //排行榜列表
          component: () => import("views/toplist/TopList.vue"),
          meta: {
            title: "排行榜",
          },
        },
        {
          path: "/music/details/:id", // 音乐详情列表
          component: () => import("views/details/Details.vue"),
        },
        {
          path: "/music/historylist", //我听过的列表
          component: () => import("views/historylist/HistoryList.vue"),
          meta: {
            title: "我听过的",
          },
        },
        {
          path: "/music/search", //歌曲搜索
          component: () => import("views/search/Search.vue"),
          meta: {
            title: "搜索",
          },
        },
        {
          path: "/music/comment/:id", //音乐评论
          component: () => import("views/comment/Comment.vue"),
          meta: {
            title: "评论详情",
          },
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + " - Electro 在线音乐播放器";
  }
  next();
});

export default router;
