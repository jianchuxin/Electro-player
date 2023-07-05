<script setup>
import Lyric from "components/lyric/Lyric.vue";
import MusicBtn from "components/musicbtn/MusicBtn.vue";
import MmProgress from "base/mmprogress/MmProgress.vue";
import Volume from "components/volume/Volume.vue";
import { ref, watch, computed, onMounted, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { usePlayListStore } from "@/stores/playlist";
import { useUserStore } from "@/stores/user";
import { useMmPlayer } from "@/composables/player";
import { useRouter } from "vue-router";
import {
  formatSecond,
  silencePromise,
  randomSortArray,
  parseLyric,
} from "@/utils/util";
import { MMPLAYER_CONFIG, PLAY_MODE } from "@/config";
import { showToast } from "base/mmtoast/index";
import { getLyric } from "apis/musiclist";

// 引入store中的变量与函数
const playListStore = usePlayListStore();
const { setCurrentIndex, setPlaying, setMode } = playListStore;
const {
  currentMusic,
  currentIndex,
  isPlaying,
  audioEle,
  playList,
  orderList,
  mode,
} = storeToRefs(playListStore);
const userStore = useUserStore();
const { setVolume } = userStore;

// 与播放器进度相关变量和函数
const { volume } = storeToRefs(userStore); // 音量大小
const isMute = ref(false); // 是否静音
const { musicReady, currentTime, currentProgress, initAudio } = useMmPlayer();
// 歌词显示变量
const lyric = ref([]);
const lyricVisible = ref(false);
const nolyric = ref(false);
const lyricIndex = ref(0);

const mmLyric = ref(null);

// 纯净模式相关
const isPure = ref(false);
const openPure = () => {
  isPure.value = !isPure.value;
  nextTick(() => {
    mmLyric.value.calcTop();
  });
};
const getPureModeType = computed(() => {
  return isPure.value ? "pureopen" : "pureclose";
});

// router
const router = useRouter();
onMounted(() => {
  // instance.
  initAudio();
  // 播放结束
  audioEle.value.onended = () => {
    if (mode.value === PLAY_MODE.ONE_LOOP) {
      loop();
    } else {
      next();
    }
  };
  // 音乐播放出错
  audioEle.value.onerror = () => {
    let alertMsg = "当前音乐不可播放，已自动播放下一首";
    if (playList.value.length === 1) {
      alertMsg = "暂时没有可播放的音乐哦~";
    }
    showToast({ message: alertMsg });
    next();
  };
  initKeyDown();
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
  return {
    [PLAY_MODE.LIST_LOOP]: "listloop",
    [PLAY_MODE.ORDER]: "order",
    [PLAY_MODE.RANDOM]: "random",
    [PLAY_MODE.ONE_LOOP]: "oneloop",
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
      [PLAY_MODE.ONE_LOOP]: "单曲循环",
    }[mode.value] +
    " " +
    key
  );
});

// 切换歌曲
watch(currentMusic, (newMusic, oldMusic) => {
  if (!newMusic.id) {
    lyric.value = [];
    return;
  }
  if (newMusic.id === oldMusic.id) {
    return;
  }
  audioEle.value.src = newMusic.url;
  // 重置相关参数
  lyricIndex.value = currentTime.value = currentProgress.value = 0;
  silencePromise(audioEle.value.play());
  // nextTick??***********
  getMusicLyric(newMusic.id);
});
// 播放 or 暂停
watch(isPlaying, (newPlaying) => {
  const audio = audioEle.value;
  nextTick(() => {
    newPlaying ? silencePromise(audio.play()) : audio.pause();
    musicReady.value = true;
  });
});

// 歌词滚动
watch(currentTime, (newTime, oldTime) => {
  if (nolyric.value) {
    return;
  }
  let start = 0;
  let end = lyric.value.length - 1;
  let index = lyricIndex.value;
  if (newTime > oldTime) {
    start = index;
  } else {
    end = index;
  }
  for (let i = start; i <= end; i++) {
    if (lyric.value[i].time < newTime) {
      index = i;
    }
  }
  lyricIndex.value = index;
});
// 音量调节
const volumeChange = (percent) => {
  isMute.value = percent === 0;
  audioEle.value.volume = percent;
  setVolume(percent);
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
  setMode(newMode);
  console.log(newMode);
  if (newMode === PLAY_MODE.ONE_LOOP) {
    return;
  }
  let list = [];
  switch (newMode) {
    case PLAY_MODE.LIST_LOOP:
    case PLAY_MODE.ORDER:
      list = orderList.value;
      break;
    case PLAY_MODE.RANDOM:
      list = randomSortArray(orderList.value);
      break;
  }
  resetCurrentIndex(list);
  playList.value = list;
};

// 查看歌词
const handleOpenLyric = () => {
  lyricVisible.value = true;
  nextTick(() => {
    mmLyric.value.calcTop();
  });
};

// 关闭歌词
const handleCloseLyric = () => {
  lyricVisible.value = false;
};

// 打开歌曲评论页面
const openComment = () => {
  if (!currentMusic.value.id) {
    showToast({ message: "还没有播放音乐哦", position: "bottom" });
    return;
  }
  router.push(`/music/comment/${currentMusic.value.id}`);
};

// 修改当前歌曲索引
const resetCurrentIndex = (list) => {
  const index = list.findIndex((item) => item.id === currentMusic.value.id);
  setCurrentIndex(index);
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
  // **********
  if (
    (length - 1 === currentIndex.value && mode.value === PLAY_MODE.ORDER) ||
    (length === 1 && flag)
  ) {
    setCurrentIndex(-1);
    setPlaying(false);
    return;
  }
  if (length === 1) {
    loop();
  } else {
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
  if (lyric.value.length > 0) {
    lyricIndex.value = 0;
  }
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

// 获取歌词
const getMusicLyric = async (id) => {
  const res = await getLyric(id);
  if (res.lrc && res.lrc.lyric) {
    nolyric.value = false;
    lyric.value = parseLyric(res.lrc.lyric);
  } else {
    nolyric.value = true;
  }
};
</script>

<template>
  <div class="music flex-col">
    <!-- 上方主体内容 -->
    <div class="music-content">
      <!-- 左方歌曲列表显示 -->
      <div class="music-left flex-col">
        <MusicBtn @onClickLyric="handleOpenLyric" />
        <RouterView class="router-view" v-slot="{ Component }">
          <keep-alive exclude="Details,HistoryList,Comment">
            <component :is="Component" />
          </keep-alive>
        </RouterView>
      </div>
      <!-- 右方歌词显示 -->
      <div class="music-right" :class="{ show: lyricVisible, pure: isPure }">
        <div class="close-lyric" @click="handleCloseLyric">关闭歌词</div>
        <Lyric
          ref="mmLyric"
          :lyric="lyric"
          :nolyric="nolyric"
          :lyric-index="lyricIndex"
        />
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
          class="pointer mode"
          :type="getModeType"
          :title="getModeTitle"
          :size="24"
          @click="modeChange"
        ></MmIcon>

        <!-- 评论 -->
        <MmIcon
          class="pointer comment"
          @click="openComment"
          type="comment"
          title="评论"
          :size="24"
        ></MmIcon>

        <!-- 切换纯净模式 -->
        <MmIcon
          class="pointer pure-mode"
          @click="openPure"
          :type="getPureModeType"
          title="纯净模式"
          :size="28"
        ></MmIcon>

        <!-- 音量控制 -->
        <div class="music-bar-volume" title="音量加减 [Ctrl + Up / Down]">
          <Volume :volume="volume" @volume-change="volumeChange"></Volume>
        </div>
      </div>
    </div>

    <!-- 遮罩-背景滤镜 -->
    <div class="mmPlayer-bg" :style="{ backgroundImage: picUrl }"></div>
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
  // background-color: #333;
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
  .mmPlayer-bg,
  .mmPlayer-mask {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .mmPlayer-mask {
    z-index: -1;
    background-color: @mask_color;
  }

  .mmPlayer-bg {
    z-index: -2;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    filter: blur(12px);
    opacity: 0.7;
    transition: all 0.8s;
    transform: scale(1.1);
  }

  @media (min-width: 960px) {
    .close-lyric {
      display: none;
    }
    .music-right {
      &.pure {
        display: block;
        width: 100%;
        margin-left: 0;
      }
    }
  }

  // 当屏幕小于960时，右侧歌词组件消失，纯净模式按钮消失
  @media (max-width: 960px) {
    .music-right {
      display: none;
      &.show {
        display: block;
        margin-left: 0;
        width: 100%;
      }
    }
    .pure-mode {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding: 75px 15px 5px 15px;
    .music-bar {
      padding-top: 10px;
      .music-bar-info span {
        display: none;
      }
    }
  }

  @media (max-width: 520px) {
    .music-bar {
      position: relative;
      flex-direction: column;
      gap: 0;
      .music-bar-btns {
        order: 2;
        width: 60%;
        margin-top: 10px;
      }

      .music-music {
        order: 1;
        padding-left: 0;
      }
      .mode,
      .comment {
        position: absolute;
        bottom: 23px;
        margin: 0;
      }
      .mode {
        left: 5px;
      }
      .comment {
        right: 5px;
      }
      .music-bar-volume {
        display: none;
      }
    }
  }
}
</style>
