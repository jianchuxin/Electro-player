import { ref } from "vue";
import { defineStore } from "pinia";

// 正在播放列表
export const usePlayListStore = defineStore("playList", () => {
  const audioEle = ref(null); // 引用audio元素
  const mode = ref(1); // 播放模式，默认顺序播放
  const playList = ref([]); // 正在播放列表
  const orderList = ref([]); // 顺序播放列表

  const isPlaying = ref(false); // 是否正在播放
  const currentIndex = ref(-1); // 当前音乐索引
  const currentMusic = ref([]); // 当前播放音乐对象

  // 设置正在播放列表
  const setPlayList = (list) => {
    playList.value = list;
  };

  // 设置Audio元素
  const setAudioEle = (audio) => {
    audioEle.value = audio;
    // console.log(audioEle.value);
    // console.log("设置audio元素成功!");
  };

  // 设置播放状态
  const setPlaying = (state) => {
    isPlaying.value = state;
  };

  // 设置当前播放索引
  const setCurrentIndex = (index) => {
    currentIndex.value = index;
    currentMusic.value = playList.value[index] || {};
  };

  // 设置播放模式
  const setMode = (newMode) => {
    mode.value = newMode;
  };

  return {
    audioEle,
    setAudioEle,
    mode,
    setMode,
    playList,
    setPlayList,
    orderList,
    currentIndex,
    setCurrentIndex,
    currentMusic,
    isPlaying,
    setPlaying,
  };
});
