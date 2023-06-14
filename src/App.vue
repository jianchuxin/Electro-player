<script setup>
import { RouterView } from "vue-router";
import MmHeader from "components/mmheader/MmHeader.vue";
import { onMounted } from "vue";
import { getPlayListById } from "./apis/musiclist";
import { usePlayListStore } from "./stores/playlist";

const usePlayList = usePlayListStore();

const initPlayList = async (id = 3778678) => {
  const playList = await getPlayListById(id);
  const list = playList.tracks.slice(0, 100);
  usePlayList.setPlayList(list);
};

onMounted(() => {
  initPlayList();
});
</script>

<template>
  <MmHeader />
  <RouterView />
  <!-- 播放器 -->
  <audio src=""></audio>
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
