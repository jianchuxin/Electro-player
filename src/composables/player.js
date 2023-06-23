import { usePlayListStore } from "@/stores/playlist";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const playlistStore = usePlayListStore();
const { setPlaying } = playlistStore;
const { audioEle, currentMusic, playList } = storeToRefs(playlistStore);
const duration = currentMusic.value.duration;
let retry = 1; // 重试次数

export const useMmPlayer = () => {
  // 与播放器相关
  const musicReady = ref(false);
  const currentTime = ref(0);
  const currentProgress = ref(0);
  // 歌词显示
  //   const isMute = ref(false);
  //   const volume = ref(0.8);
  const initAudio = () => {
    // 音频缓冲
    audioEle.value.onProgress = () => {
      try {
        if (audioEle.value.buffered.length > 0) {
          let buffered = 0; //记录已缓冲时长
          buffered =
            audioEle.value.end(0) > duration
              ? duration
              : audioEle.buffered.end(0);
          currentProgress.value = buffered / duration;
        }
      } catch (e) {
        //
      }
    };
    // 音频开始播放
    audioEle.value.onplay = () => {
      let timer;
      clearTimeout(timer);
      timer = setTimeout(() => {
        musicReady.value = true;
      }, 100);
    };

    // 播放时间递增
    audioEle.value.ontimeupdate = () => {
      currentTime.value = audioEle.value.currentTime;
    };

    // 音乐播放完毕
    audioEle.value.onended = () => {
      //
    };

    // 音乐播放出错
    audioEle.value.onerror = () => {
      if (retry === 0) {
        alert("当前音乐不可播放，已自动播放下一首");
        if (playList.value.length === 1) {
          alert("暂时没有可播放的音乐哦~");
        }
        //next() 下一首
      } else {
        console.log("重试一次");
        retry -= 1;
        audioEle.value.src = currentMusic.url;
        audioEle.value.load();
      }
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

    // 当音频暂停时
    audioEle.onpause = () => {
      setPlaying(false);
    };
    // 将能播放的音乐加入播放历史 *****
  };

  return { musicReady, currentTime, currentProgress, initAudio };
};
