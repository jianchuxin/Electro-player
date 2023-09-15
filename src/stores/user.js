import { ref } from "vue";
import { defineStore } from "pinia";
import { ELECTROPLAYER_CONFIG } from "@/config";

// 正在播放列表
export const useUserStore = defineStore(
    "user",
    () => {
        const uid = ref("");
        const historyList = ref([]);
        const volume = ref(ELECTROPLAYER_CONFIG.VOLUME);
        const HISTORYLIST_MAX_LENGTH = 200;
        const avatarUrl = ref("");
        const nickname = ref("");
        // 设置登录用户uid
        const setUid = (u) => {
            uid.value = u;
        };
        // 设置音量
        const setVolume = (vol) => {
            volume.value = vol;
        };
        // 设置播放历史
        const setHistoryList = (list) => {
            historyList.value = list;
        };

        // 设置用户头像
        const setAvatarUrl = (newUrl) => {
            avatarUrl.value = newUrl;
        };

        // 设置网名
        const setNickname = (newName) => {
            nickname.value = newName;
        };

        // 添加音乐
        const addHistoryMusic = (music) => {
            const list = [...historyList.value];
            const index = list.findIndex((item) => item.id === music.id);
            if (index === 0) {
                return;
            }
            if (index > 0) {
                list.splice(index, 1);
            }
            list.unshift(music);
            if (list.length > HISTORYLIST_MAX_LENGTH) {
                list.pop();
            }
            setHistoryList(list);
        };

        // 清空播放历史
        const clearHistoryList = () => {
            setHistoryList([]);
        };

        // 删除播放历史
        const deleteHistoryMusic = (index) => {
            let list = historyList.value;
            list.splice(index, 1);
            setHistoryList(list);
        };

        return {
            uid,
            setUid,
            historyList,
            setHistoryList,
            addHistoryMusic,
            clearHistoryList,
            deleteHistoryMusic,
            volume,
            setVolume,
            avatarUrl,
            setAvatarUrl,
            nickname,
            setNickname,
        };
    },
    {
        persist: {
            paths: ["uid", "historyList", "volume", "avatarUrl", "nickname"],
        },
    }
);
