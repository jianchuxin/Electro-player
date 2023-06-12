<script setup>
import { RouterView } from "vue-router";
import MmHeader from "components/mmheader/MmHeader.vue";
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
