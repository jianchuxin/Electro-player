import { ref } from "vue";
import { defineStore } from "pinia";

export const usePlayList = defineStore("playList", () => {
  const playList = ref([]);

  return { playList };
});
