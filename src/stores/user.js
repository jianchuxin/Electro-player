import { ref } from "vue";
import { defineStore } from "pinia";
import { MMPLAYER_CONFIG } from "@/config";

// 正在播放列表
export const useUserStore = defineStore(
  "user",
  () => {
    const uid = ref("");
    const historyList = ref([]);
    const volume = ref(MMPLAYER_CONFIG.VOLUME);

    const setUid = (u) => {
      uid.value = u;
    };

    const setHistoryList = (list) => {
      historyList.value = list;
    };

    const setVolume = (vol) => {
      volume.value = vol;
    };
    return { uid, setUid, historyList, setHistoryList, volume, setVolume };
  },
  {
    persist: {
      // paths:['historyList','useId']
    },
  }
);
