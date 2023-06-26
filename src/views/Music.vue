<script setup>
import Lyric from "components/lyric/Lyric.vue";
import MusicBtn from "components/musicbtn/MusicBtn.vue";
import MmProgress from "base/mmprogress/MmProgress.vue";
import Volume from "components/volume/Volume.vue";
import { ref, watch, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { usePlayListStore } from "@/stores/playlist";
import { useUserStore } from "@/stores/user";
import { useMmPlayer } from "@/composables/player";
import { formatSecond, silencePromise } from "@/utils/util";
import { MMPLAYER_CONFIG, PLAY_MODE } from "@/config";

// 引入store中的变量与函数
const playListStore = usePlayListStore();
const { setCurrentIndex, setPlaying, setMode } = playListStore;
const { currentMusic, currentIndex, isPlaying, audioEle, playList, mode } =
  storeToRefs(playListStore);
const userStore = useUserStore();
const { setVolume } = userStore;
const { volume } = storeToRefs(userStore); // 音量大小
const isMute = ref(false); // 是否静音

// 与播放器进度相关变量和函数
const { musicReady, currentTime, currentProgress, initAudio } = useMmPlayer();
// 歌词显示变量**********

onMounted(() => {
  initAudio();
  initKeyDown();
  console.log(picUrl.value);
});

// 歌曲封面图片300X300
const picUrl = computed(() => {
  return currentMusic.value.id && currentMusic.value.image
    ? `url(${currentMusic.value.image}?param=300y300)`
    : `url(${MMPLAYER_CONFIG.BACKGROUND})`;
});
// 播放进度百分比
const percentMusic = computed(() => {
  const duration = currentMusic.value.duration;
  return currentTime.value && duration ? currentTime.value / duration : 0;
});

// 获取播放模式icon
const getModeType = computed(() => {
  console.log(mode.value);
  return {
    [PLAY_MODE.LIST_LOOP]: "listloop",
    [PLAY_MODE.ORDER]: "orderloop",
    [PLAY_MODE.RANDOM]: "random",
    [PLAY_MODE.LOOP]: "oneloop",
  }[mode.value];
});
// 获取播放模式title
const getModeTitle = computed(() => {
  const key = "Ctrl + O";
  return (
    {
      [PLAY_MODE.LIST_LOOP]: "列表循环",
      [PLAY_MODE.ORDER]: "顺序播放",
      [PLAY_MODE.RANDOM]: "随机播放",
      [PLAY_MODE.LOOP]: "单曲循环",
    }[mode.value] +
    " " +
    key
  );
});

// 切换歌曲
watch(currentMusic, (newMusic, oldMusic) => {
  console.log("歌曲切换");
  console.log(picUrl.value);
  if (!newMusic.id) {
    return;
  }
  if (newMusic.id === oldMusic.id) {
    return;
  }
  audioEle.value.src = newMusic.url;
  silencePromise(audioEle.value.play());
});
// 播放 or 暂停
watch(isPlaying, (newPlaying) => {
  console.log(newPlaying);
  if (newPlaying) {
    silencePromise(audioEle.value.play());
  } else {
    audioEle.value.pause();
  }
  musicReady.value = true;
  console.log(musicReady.value);
});

// 歌词滚动

// 音量调节
const volumeChange = (percent) => {
  isMute.value = percent === 0;
  audioEle.value.volume = percent;
  setVolume(percent);
  // console.log(volume.value);
};

// 音乐播放时长显示
const progressMusic = (percent) => {
  currentTime.value = currentMusic.value.duration * percent;
};
// 音乐播放进度
const progressMusicEnd = (percent) => {
  audioEle.value.currentTime = currentMusic.value.duration * percent;
};

// 切换播放顺序 *********@@@@@@@@@
const modeChange = () => {
  const newMode = (mode.value + 1) % 4;
  console.log(newMode);
  setMode(newMode);
};

// 上一首
const prev = () => {
  if (!musicReady.value) {
    return;
  }
  if (playList.value.length === 1) {
    loop();
  } else {
    let index = currentIndex.value - 1;
    if (index < 0) {
      index = playList.value.length - 1;
    }
    setCurrentIndex(index);
    if (!isPlaying.value && musicReady.value) {
      setPlaying(true);
    }
    musicReady.value = false;
  }
};

// 播放 or 暂停
const play = () => {
  if (!musicReady.value) {
    return;
  }
  setPlaying(!isPlaying.value);
};
// 下一首
// 当 flag 为 true 时，表示上一曲播放失败
const next = (flag = false) => {
  if (!musicReady.value) {
    return;
  }
  const length = playList.value.length;
  console.log(length);
  // **********
  if (
    (length - 1 === currentIndex.value && mode.value === PLAY_MODE.ORDER) ||
    (length === 1 && flag)
  ) {
    console.log(1);
    setCurrentIndex(-1);
    setPlaying(false);
    return;
  }
  if (length === 1) {
    loop();
    console.log(2);
  } else {
    console.log(3);
    let index = currentIndex.value + 1;
    if (index === length) {
      index = 0;
    }
    if (!isPlaying.value && musicReady.value) {
      setPlaying(true);
    }
    setCurrentIndex(index);
    musicReady.value = false;
  }
};
// 循环
const loop = () => {
  audioEle.value.currentTime = 0;
  silencePromise(audioEle.value.play());
  setPlaying(true);
  // 歌词循环 ********@@@@@@@@
};
// 键盘快捷键
const initKeyDown = () => {
  document.onkeydown = (e) => {
    if (!e.ctrlKey) {
      return;
    }
    switch (e.key) {
      case " ":
        play();
        break;
      case "ArrowLeft":
        prev();
        break;
      case "ArrowRight":
        next();
        break;
      case "ArrowUp": {
        let newVolume = volume.value + 0.1;
        if (newVolume > 1) {
          newVolume = 1;
        }
        volumeChange(newVolume);
        break;
      }
      case "ArrowDown": {
        let newVolume = volume.value - 0.1;
        if (newVolume < 0) {
          newVolume = 0;
        }
        volumeChange(newVolume);
        break;
      }
      default:
        break;
    }
  };
};
</script>

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
          type="prev"
          :size="24"
          class="pointer"
          title="上一曲 Ctrl + Left"
          @click="prev"
        ></MmIcon>
        <div class="control-play pointer" title="播放暂停 Ctrl + Space">
          <MmIcon
            :type="isPlaying ? 'pause-bold' : 'play-bold'"
            :size="20"
            @click="play"
          ></MmIcon>
        </div>
        <MmIcon
          type="next"
          :size="24"
          class="pointer"
          title="下一曲 Ctrl + Right"
          @click="next"
        ></MmIcon>
      </div>
      <div class="music-music">
        <div class="music-bar-info">
          <template v-if="currentMusic && currentMusic.id">
            {{ currentMusic.name }}
            <span>-{{ currentMusic.singer }}</span>
          </template>
          <template v-else>欢迎使用mmPlayer在线音乐播放器</template>
        </div>
        <div v-if="currentMusic.id" class="music-bar-time">
          {{ formatSecond(currentTime) }}/{{
            formatSecond(currentMusic.duration % 3600)
          }}
        </div>
        <!-- 播放进度条 -->
        <MmProgress
          class="music-progress"
          :percent="percentMusic"
          :percent-load="currentProgress"
          @percentChange="progressMusic"
          @percentChangeEnd="progressMusicEnd"
        />
      </div>

      <div class="options">
        <!-- 播放模式 -->
        <MmIcon
          class="pointer"
          :type="getModeType"
          :title="getModeTitle"
          :size="24"
          @click="modeChange"
        ></MmIcon>

        <!-- 评论 -->
        <MmIcon class="pointer" type="comment" title="评论" :size="24"></MmIcon>

        <!-- 音量控制 -->
        <div class="music-bar-volume" title="音量加减 [Ctrl + Up / Down]">
          <Volume :volume="volume" @volume-change="volumeChange"></Volume>
        </div>
      </div>
    </div>

    <!-- 遮罩-背景滤镜 -->
    <div class="mmPlayer-bg"></div>
    <div class="mmPlayer-mask"></div>
  </div>
</template>

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
    display: flex;
    gap: 40px;
    align-items: center;
    width: 100%;
    padding: 15px 0;
    color: #fff;
    &.disabled {
      pointer-events: none;
      opacity: 0.6;
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
      // padding-left: 40px;
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
