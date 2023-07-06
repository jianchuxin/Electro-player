import { usePlayListStore } from "@/stores/playlist";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const playlistStore = usePlayListStore();
const { setPlaying } = playlistStore;
const { audioEle, currentMusic } = storeToRefs(playlistStore);
const userStore = useUserStore();
const { addHistoryMusic } = userStore;

export const useMmPlayer = () => {
  // 与播放器相关
  const musicReady = ref(false);
  const currentTime = ref(0);
  const currentProgress = ref(0);
  const initAudio = () => {
    // 音频开始播放
    audioEle.value.onplay = () => {
      let timer;
      clearTimeout(timer);
      timer = setTimeout(() => {
        musicReady.value = true;
      }, 100);
    };

    // 音频缓冲
    audioEle.value.onprogress = () => {
      try {
        if (audioEle.value.buffered.length > 0) {
          const duration = currentMusic.value.duration;
          let buffered = 0; //记录已缓冲时长
          buffered =
            audioEle.value.buffered.end(0) > duration
              ? duration
              : audioEle.value.buffered.end(0);
          currentProgress.value = buffered / duration;
        }
      } catch (e) {
        console.log(e);
      }
    };

    // 当音频暂停时
    audioEle.onpause = () => {
      setPlaying(false);
    };

    // 播放时间递增
    audioEle.value.ontimeupdate = () => {
      currentTime.value = audioEle.value.currentTime;
    };

    // 将能播放的音乐加入到播放历史列表中
    audioEle.value.oncanplay = () => {
      addHistoryMusic(currentMusic.value);
    };

    // 音乐进度条拖动大于加载时重载音乐
    audioEle.onstalled = () => {
      audioEle.load();
      setPlaying(false);
      let timer;
      clearTimeout(timer);
      timer = setTimeout(() => {
        setPlaying(true);
      }, 10);
    };
  };

  return { musicReady, currentTime, currentMusic, currentProgress, initAudio };
};
