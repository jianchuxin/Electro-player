import { ref } from "vue";
import { defineStore } from "pinia";

// 正在播放列表
export const usePlayListStore = defineStore("playList", () => {
  const playList = ref([]);

  const setPlayList = (list) => {
    playList.value = list;
  };

  return { playList, setPlayList };
});
