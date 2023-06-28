import { ref, computed } from "vue";
import { defineStore } from "pinia";

// 正在播放列表
export const usePlayListStore = defineStore("playList", () => {
  const audioEle = ref(null); // 引用audio元素
  const mode = ref(1); // 播放模式，默认顺序播放
  const playList = ref([]); // 正在播放列表
  const orderList = ref([]); // 顺序播放列表

  const isPlaying = ref(false); // 是否正在播放
  const currentIndex = ref(-1); // 当前音乐索引

  const currentMusic = computed(() => {
    return playList.value[currentIndex.value] || {};
  });
  // 当前播放音乐对象
  // 设置正在播放列表
  const setPlayList = (list) => {
    playList.value = list;
    orderList.value = list;
  };

  // 选择播放（设置列表 + 当前音乐）
  const selectPlay = ({ list, index }) => {
    setPlayList(list);
    setCurrentIndex(index);
    setPlaying(true);
  };

  // 选择播放（插入新的音乐到列表中）
  const selectAddPlay = (music) => {
    let list = [...playList.value];
    const index = list.findIndex((item) => item.id === music.id);
    if (index !== -1) {
      setCurrentIndex(index);
    } else {
      list.unshift(music);
      setPlayList(list);
      setCurrentIndex(0);
    }
    setPlaying(true);
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
  };

  // 设置播放模式
  const setMode = (newMode) => {
    mode.value = newMode;
  };

  // 清空播放列表
  const clearPlayList = () => {
    setPlaying(false);
    setCurrentIndex(-1);
    setPlayList([]);
  };

  // 删除列表歌曲
  const deletePlayListMusic = (index) => {
    let list = [...playList.value];
    list.splice(index, 1);
    let oldCurrentIndex = currentIndex.value;
    if (index < oldCurrentIndex || list.length === oldCurrentIndex) {
      oldCurrentIndex--;
      setCurrentIndex(oldCurrentIndex);
    }
    setPlayList(list);
    setPlaying(list.length ? true : false);
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
    selectPlay,
    selectAddPlay,
    clearPlayList,
    deletePlayListMusic,
  };
});
