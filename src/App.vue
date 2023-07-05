<script setup>
import { RouterView } from "vue-router";
import MmHeader from "components/mmheader/MmHeader.vue";
import { ref, onMounted, nextTick } from "vue";
import { getPlayListById } from "./apis/musiclist";
import { usePlayListStore } from "./stores/playlist";
import { MMPLAYER_CONFIG, VERSION, UPDATE_TIME } from "./config";

const usePlayList = usePlayListStore();

const initPlayList = async () => {
  const playList = await getPlayListById(MMPLAYER_CONFIG.PLAYLIST_ID);
  const list = playList.tracks.slice(0, 100);
  usePlayList.setPlayList(list);
};

const mmPlayer = ref(null);
onMounted(() => {
  console.log("当前版本：", VERSION);
  console.log("更新时间：", UPDATE_TIME);
  // 初始化播放列表
  initPlayList();

  // 设置audio元素
  nextTick(() => {
    // console.log(mmPlayer);
    usePlayList.setAudioEle(mmPlayer.value);
  });
});

// 首次加载动画后移除动画
let loadDom = document.querySelector("#appLoading");
if (loadDom) {
  const animationendFunc = () => {
    loadDom.removeEventListener("animationend", animationendFunc);
    loadDom.removeEventListener("webkitAnimationEnd", animationendFunc);
    document.body.removeChild(loadDom);
    loadDom = null;
  };
  loadDom.addEventListener("animationend", animationendFunc);
  loadDom.addEventListener("webkitAnimationEnd", animationendFunc);
  loadDom.classList.add("removeAnimate");
}
</script>

<template>
  <MmHeader />
  <RouterView />
  <!-- 播放器 -->
  <audio ref="mmPlayer"></audio>
</template>

<style lang="less">
#app {
  position: relative;
  width: 100%;
  height: 100%;
  color: @text_color;
  font-size: @font_size_medium;
  audio {
    position: fixed;
  }
}
</style>
