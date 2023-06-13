import { ref } from "vue";
import { defineStore } from "pinia";

export const usePlayListStore = defineStore("playList", () => {
  const playList = ref([]);

  const setPlayList = (list) => {
    playList.value = list;
  };

  return { playList, setPlayList };
});
