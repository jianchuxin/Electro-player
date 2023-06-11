<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <header></header>
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
  font-size: 1.2rem;
  audio {
    position: fixed;
  }
}
</style>
