<template>
  <div class="music flex-col">
    <!-- 上方主体内容 -->
    <div class="music-content">
      <!-- 左方歌曲列表显示 -->
      <div class="music-left flex-col">
        <MusicBtn />
        <keep-alive>
          <RouterView class="router-view" />
        </keep-alive>
      </div>
      <!-- 右方歌词显示 -->
      <div class="music-right">
        <div class="close-lyric">关闭歌词</div>
        <Lyric></Lyric>
      </div>
    </div>

    <!-- 下方播放器 -->
    <div class="music-bar" :class="{ disabled: true }">
      <div class="music-bar-btns">
        <!-- icon -->
        <MmIcon type="bofang" :size="24"></MmIcon>
        <i class="icon-font icon-bofang"></i>
      </div>
    </div>

    <!-- 遮罩-背景滤镜 -->
    <div class="mmPlayer-bg"></div>
    <div class="mmPlayer-mask"></div>
  </div>
</template>

<script setup>
import Lyric from "components/lyric/Lyric.vue";
import MusicBtn from "components/musicbtn/MusicBtn.vue";
</script>

<style lang="less" scoped>
.music {
  background-color: #333;
  padding: 75px 25px 25px 25px;
  width: 100%;
  max-width: 1750px;
  margin: 0 auto;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .music-content {
    display: flex;
    flex: 1;
    overflow: hidden;
    width: 100%;
    .music-left {
      flex: 1;
      width: 100%;
      overflow: hidden;
    }
    .music-right {
      position: relative;
      width: 310px;
      margin: left 10px;
      .close-lyric {
        position: absolute;
        top: 0;
        z-index: 1;
        cursor: pointer;
      }
    }
  }

  // 底部mmPlayer-bar
  .music-bar {
    background-color: pink;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 15px 0;
    color: #fff;
    &.disabled {
      pointer-events: none;
      opacity: 0.6;
    }
    .icon-color {
      color: #fff;
    }
    .music-bar-btns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 180px;
      .control-play {
        .flex-center;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        color: #fff;
        background-color: rgba(255, 255, 255, 0.3);
      }
    }

    // 详细配置
  }

  // 背景滤镜配置
}
</style>
