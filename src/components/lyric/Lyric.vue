<template>
  <div>
    <!-- 歌曲封面 -->
    <dl class="music-info">
      <dt>
        <img :src="picUrl" alt="img" />
      </dt>
      <template v-if="true">
        <dd>歌曲名：向云端</dd>
        <dd>歌手名：小霞/海洋Bo</dd>
        <dd>专辑名：向云端</dd>
      </template>
      <template v-else>
        <dd>mmPlayer在线播放器</dd>
        <dd>
          <a href="#"> 项目主页 </a>
        </dd>
      </template>
    </dl>
    <!-- 歌词滚动 -->
    <div ref="musicLyric" class="music-lyric">
      <div class="music-lyric-items" :style="lyricTop">
        <p v-if="!currentMusic.id">还没有播放音乐哦</p>
        <p v-else-if="nolyric">暂无歌词</p>
        <template v-else-if="lyric.length > 0">
          <p
            v-for="(item, index) in lyric"
            :key="index"
            :class="{ on: lyricIndex === index }"
          >
            {{ item.text }}
          </p>
        </template>
        <p v-else>歌词加载失败!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayListStore } from "@/stores/playlist";
import { storeToRefs } from "pinia";
import { ref, computed, onMounted } from "vue";
import imageUrl from "assets/img/player_cover.png";
import { nextTick } from "vue";

const playListStore = usePlayListStore();
const { currentMusic } = storeToRefs(playListStore);

const props = defineProps({
  // 歌词数据
  lyric: {
    type: Array,
    default: () => [],
  },
  // 是否无歌词
  nolyric: {
    type: Boolean,
    default: false,
  },
  // 当前歌词下标
  lyricIndex: {
    type: Number,
    default: 0,
  },
});
const top = ref(0);

// 歌曲封面图片300X300
const picUrl = computed(() => {
  return currentMusic.value.id && currentMusic.value.image
    ? `${currentMusic.value.image}?param=300y300`
    : imageUrl;
  // : '@/asserts/img/player_cover.png'
});

const lyricTop = computed(() => {
  return `transform :translate3d(0,${
    -34 * (props.lyricIndex - top.value)
  }px,0)`;
});

const musicLyric = ref(null);
// 计算歌词居中的 top值
const calcTop = () => {
  const dom = musicLyric.value;
  const { display = "" } = window.getComputedStyle(dom);
  if (display === "none") {
    return;
  }
  const height = dom.offsetHeight;
  top.value = Math.floor(height / 34 / 2);
};

let resizeTimer;
onMounted(() => {
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => calcTop(), 60);
  });
  nextTick(() => calcTop());
});
</script>

<style lang="less" scoped>
.music-info {
  padding-bottom: 20px;
  text-align: center;
  font-size: @font_size_medium;
  dt {
    position: relative;
    width: 186px;
    height: 186px;
    margin: 0 auto 15px;
    &::after {
      content: "";
      position: absolute;
      left: 9px;
      top: 0;
      width: 201px;
      height: 180px;
      background: url("assets/img/album_cover_player.png") 0 0 no-repeat;
    }
    img {
      vertical-align: middle;
      width: 186px;
      height: 186px;
    }
  }
  dd {
    height: 30px;
    line-height: 30px;
    .no-wrap();
  }
}

// 歌词部分样式
.music-lyric {
  position: absolute;
  top: 315px;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  text-align: center;
  mask-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.6) 15%,
    rgba(255, 255, 255, 1) 25%,
    rgba(255, 255, 255, 1) 75%,
    rgba(255, 255, 255, 0.6) 85%,
    rgba(255, 255, 255, 0) 100%
  );
  -webkit-mask-image: linear-gradient(
    180deg,
    hsla(0, 0%, 100%, 0) 0,
    hsla(0, 0%, 100%, 0.6) 15%,
    #fff 25%,
    #fff 75%,
    hsla(0, 0%, 100%, 0.6) 85%,
    hsla(0, 0%, 100%, 0)
  );

  .music-lyric-items {
    text-align: center;
    line-height: 34px;
    font-size: @font_size_small;
    transform: translate3d(0, 0, 0);
    transition: transform 0.6s ease-out;
    .no-wrap();
    .on {
      color: @lyric_color_active;
    }
  }
}

// 当屏幕小于960px 时
@media (max-width: 960px) {
  .music-info {
    display: none;
  }
  .music-lyric {
    top: 0;
  }
}
</style>
