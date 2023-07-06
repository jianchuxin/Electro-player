<script setup>
import ElectroLoading from "base/electroLoading/ElectroLoading.vue";
import { ref, onMounted } from "vue";
import { getTopListDetail, getPersonalized } from "@/apis/toplist";
import { useLoading } from "@/composables/loading";

const { isLoading, hideLoad } = useLoading();
const list = ref([]);
const hotList = ref([]);

onMounted(() => {
  hideLoad();
  getTopList();
  getPersonalizedList();
});

const getTopList = async () => {
  const res = await getTopListDetail();
  list.value = res.list.filter((item) => item.ToplistType);
};

const getPersonalizedList = async () => {
  const res = await getPersonalized();
  hotList.value = res.result.slice();
};

const formatCount = (count) => {
  let countW = count / 1e4;
  if (countW < 1e4) {
    return `${countW.toFixed(1)}万`;
  } else {
    countW = countW / 1e4;
    return `${countW.toFixed(1)}亿`;
  }
};
</script>

<template>
  <div class="topList">
    <ElectroLoading :show="isLoading" />
    <template v-if="!isLoading">
      <div class="topList-head">云音乐特色榜</div>
      <ul class="topList-content">
        <li
          v-for="(item, index) in list"
          :key="index"
          class="list-item"
          :title="`${item.name}-${item.updateFrequency}`"
        >
          <div class="item-cover">
            <RouterLink :to="{ path: `/music/details/${item.id}` }">
              <img
                v-img-lazy="`${item.coverImgUrl}?param=300y300`"
                class="item-img"
                alt="image"
              />
              <i class="cover-mask"></i>
              <i class="cover-icon-play"></i>
            </RouterLink>
            <h3 class="name">{{ item.name }}</h3>
          </div>
        </li>
      </ul>
      <div class="topList-head">热门歌单</div>
      <ul class="topList-content">
        <li
          v-for="(item, index) in hotList"
          :key="index"
          class="list-item"
          :title="item.name"
        >
          <div class="item-cover">
            <RouterLink :to="{ path: `/music/details/${item.id}` }">
              <img
                v-img-lazy="`${item.picUrl}?param=300y300`"
                class="item-img"
                alt="image"
              />
              <i class="cover-mask"></i>
              <i class="cover-icon-play"></i>
            </RouterLink>
            <h3 class="name">{{ item.name }}</h3>
            <div class="play-count">
              播放量: <span>{{ formatCount(item.playCount) }}</span>
            </div>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>
<style lang="less" scoped>
.topList {
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &-head {
    width: 100%;
    height: 34px;
    line-height: 34px;
    padding: 20px 0;
    font-size: @font_size_large;
    color: @text_color_active;
  }
  &-content {
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    row-gap: 20px;
    @media (max-width: 1500px) {
      grid-template-columns: repeat(6, 1fr);
    }
    @media (max-width: 1400px), (max-width: 960px) {
      grid-template-columns: repeat(5, 1fr);
    }
    @media (max-width: 1280px), (max-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 540px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .list-item {
    min-width: 0;
    .item-cover {
      width: 130px;
      margin: 0 auto;
      @media (max-width: 1100px) {
        width: 80%;
      }
      a {
        display: inline-block;
        position: relative;
        width: 100%;
        height: 100%;
        margin-bottom: 10px;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
          transform: translate3d(0, 0, 0);
          transition: all 0.5s;
        }
        .cover-mask {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.3);
          opacity: 0;
          transition: opacity 0.5s;
        }
        .cover-icon-play {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 50px;
          height: 50px;
          margin: -25px;
          // transform: scale(0.9);
          // transform: translate(-50%, -50%);
          background-image: -webkit-image-set(
            url("assets/img/icon_play.png") 1x,
            url("assets/img/icon_play100.png") 2x
          );
          opacity: 0;
          transition: all 0.5s;
        }
        &:hover {
          img {
            transform: scale(1.1);
          }
          .cover-mask {
            opacity: 1;
          }
          .cover-icon-play {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      }

      .name {
        text-align: center;
        height: 22px;
        line-height: 22px;
        font-size: @font_size_small;
        .no-wrap();
      }
      .play-count {
        height: 22px;
        font-size: @font_size_small;
        span {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
