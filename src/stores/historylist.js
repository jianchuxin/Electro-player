import { ref } from "vue";
import { defineStore } from "pinia";

// 正在播放列表
export const useHistoryListStore = defineStore("historyList", () => {
  const historyList = ref([]);

  const setHistoryList = (list) => {
    // playList.value = list;
    // historyList.
    console.log(list);
  };

  return { historyList, setHistoryList };
});
