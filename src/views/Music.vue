<template>
  <div class="music flex-col">
    <!-- 上方主体内容 -->
    <div class="music-content">
      <!-- 左方歌曲列表显示 -->
      <div class="music-left flex-col">
        <MusicBtn />
        <RouterView class="router-view" v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </RouterView>
      </div>
      <!-- 右方歌词显示 -->
      <div class="music-right">
        <div class="close-lyric">关闭歌词</div>
        <Lyric></Lyric>
      </div>
    </div>

    <!-- 下方播放器 -->
    <div
      class="music-bar"
      :class="{ disabled: !musicReady || !currentMusic.id }"
    >
      <div class="music-bar-btns">
        <!-- icon -->
        <MmIcon
          type="shangyishouge"
          :size="24"
          class="pointer"
          title="上一曲 Ctrl + Left"
        ></MmIcon>
        <div class="control-play pointer" title="播放暂停 Ctrl + Space">
          <MmIcon type="bofang" :size="24"></MmIcon>
        </div>
        <MmIcon
          type="xiayishou"
          :size="24"
          class="pointer"
          title="下一曲 Ctrl + Right"
        ></MmIcon>
      </div>
      <div class="music-music">
        <div class="music-bar-info">
          <template v-if="false">歌手/歌名</template>
          <template v-else>欢迎使用mmPlayer在线音乐播放器</template>
        </div>
        <!-- 时间显示 -->
        <div v-if="false">currentTime</div>
        <!-- 播放进度条 -->
        <MmProgress />
      </div>

      <div class="options">
        <!-- 播放模式 -->
        <MmIcon type="shunxubofang" title="顺序播放" :size="30"></MmIcon>
        <!-- 评论 -->
        <MmIcon type="pinglun" title="评论" :size="30"></MmIcon>

        <!-- 音量控制 -->
        <div class="music-bar-volume" title="音量加减 [Ctrl + Up / Down]">
          <Volume></Volume>
        </div>
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
import MmProgress from "base/mmprogress/MmProgress.vue";
import Volume from "components/volume/Volume.vue";
import { ref, computed, watch } from "vue";
import { usePlayListStore } from "@/stores/playlist";
import { storeToRefs } from "pinia";

const playListStore = usePlayListStore();
// const { currentMusic } = playListStore;
const { currentMusic, isPlaying, audioEle } = storeToRefs(playListStore);
const musicReady = ref(false);
// const currentTime = ref(0);
// const currentProgress = ref(0);
// 歌词显示
// const isMute = ref(false);
// const volume = ref(0.8);

// 歌曲封面图片300X300
// const picUrl = computed(() => {
//   return currentMusic.value.id && currentMusic.value.image
//     ? `url(${currentMusic.value.image})?param=300y300`
//     : "";
// });
// 播放进度百分比
// const percentMusic = computed(() => {
//   const duration = currentMusic.value.duration;
//   return currentTime.value && duration ? currentTime.value / duration : 0;
// });

watch(currentMusic, (newMusic, oldMusic) => {
  console.log("歌曲切换");
  if (!newMusic.id) {
    return;
  }
  if (newMusic.id === oldMusic.id) {
    return;
  }
  playListStore.audioEle.src = newMusic.url;
  playListStore.audioEle.play();
});

watch(isPlaying, (newPlaying) => {
  if (newPlaying) {
    audioEle.value.play();
  } else {
    audioEle.value.pause();
  }
  musicReady.value = true;
});
</script>

<style lang="less" scoped>
.router-view {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
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
    background-color: #111;
    display: flex;
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

    .music-music {
      position: relative;
      width: 100%;
      flex: 1;
      box-sizing: border-box;
      padding-left: 40px;
      font-size: @font_size_small;
      color: @text_color_active;
      .music-bar-info {
        height: 15px;
        padding-right: 80px;
        line-height: 15px;
        text-overflow: ellipsis;
        overflow: hidden;

        // display: -webkit-box;
        // -webkit-line-clamp: 1;
        // -webkit-box-orient: vertical;
      }
      .music-bar-time {
        position: absolute;
        top: 0;
        right: 5px;
      }
    }

    .options {
      .flex-center;
      gap: 20px;
    }

    // volume 音量条样式

    // 详细配置
  }

  // 背景滤镜配置
}
</style>
