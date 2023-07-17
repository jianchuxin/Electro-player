<script setup>
import { Carousel3d, Slide } from "vue3-carousel-3d";
import "vue3-carousel-3d/dist/index.css";
import ElectroLoading from "@/base/electroLoading/ElectroLoading.vue";
import ElectroNoResult from "base/electroNoResult/ElectroNoResult.vue";
import { ref, onMounted, watch } from "vue";
import { getUserPlayList } from "@/apis/userinfo";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useLoading } from "@/composables/loading";
import { toHttps } from "@/utils/util";

const userStore = useUserStore();
const { uid } = storeToRefs(userStore);

const router = useRouter();
const myList = ref([]); // 我创建的歌单
const starList = ref([]); // 我收藏的歌单

const carousel = ref(null);
const carouselStar = ref(null);

const { isLoading, hideLoad } = useLoading();

onMounted(() => {
  if (uid.value) {
    isLoading.value = true;
    initialData();
  } else {
    hideLoad();
  }
});

watch(uid, (newUid) => {
  if (newUid) {
    isLoading.value = true;
    initialData();
  } else {
    myList.value = [];
    starList.value = [];
  }
});

const initialData = async () => {
  const res = await getUserPlayList(uid.value);
  const list = res.playlist;
  list.forEach((item) => {
    item.coverImgUrl = toHttps(item.coverImgUrl);
    if (item.creator.userId === Number(uid.value)) {
      myList.value.push(item);
    } else {
      starList.value.push(item);
    }
  });
  hideLoad();
};

const gotoDetail = (opt) => {
  let currentIndex;
  let id;
  if (opt === 0) {
    currentIndex = carousel.value.currentIndex;
    id = myList.value[currentIndex].id;
  } else {
    currentIndex = carouselStar.value.currentIndex;
    id = starList.value[currentIndex].id;
  }
  router.push(`/music/details/${id}`);
};
</script>

<template>
  <div class="userlist">
    <ElectroLoading :show="isLoading" />
    <template v-if="!isLoading && uid">
      <div class="user-create" v-if="myList.length > 0">
        <div class="userlist-title">我创建的歌单</div>
        <carousel-3d
          ref="carousel"
          :count="myList.length"
          :width="120"
          :height="120"
          :display="5"
          controlsVisible="true"
          :space="100"
          :clickable="true"
          :onMainSlideClick="() => gotoDetail(0)"
        >
          <slide v-for="(item, index) in myList" :key="index" :index="index">
            <img v-img-lazy="item.coverImgUrl" alt="image" />
            <p class="desc">《{{ item.name }}》</p>
            <div class="mask"></div>
          </slide>
        </carousel-3d>
      </div>

      <div class="user-star" v-if="starList.length > 0">
        <div class="userlist-title">我收藏的歌单</div>
        <carousel-3d
          ref="carouselStar"
          :count="starList.length"
          :width="120"
          :height="120"
          :display="5"
          controlsVisible="true"
          :space="100"
          :clickable="true"
          :onMainSlideClick="() => gotoDetail(1)"
        >
          <slide v-for="(item, index) in starList" :key="index" :index="index">
            <img v-img-lazy="item.coverImgUrl" alt="image" />
            <p class="desc">《{{ item.name }}》</p>
            <div class="mask"></div>
          </slide>
        </carousel-3d>
      </div>
    </template>
    <ElectroNoResult
      v-else-if="!isLoading && !uid"
      title="空空如也，快去登录看看吧~"
    />
  </div>
</template>

<style lang="less" scoped>
.userlist {
  display: flex;
  flex-direction: column;
}
.userlist-title {
  margin-bottom: 20px;
  width: 100%;
  height: 34px;
  // text-align: center;
  line-height: 34px;
  font-size: @font_size_large;
  color: @text_color;
}

// 修改轮播图子组件的样式，使用/deep/穿透
:deep(.carousel-3d-container) {
  flex-shrink: 0;
  overflow: visible;
  margin: 0 0 40px 0;
  .carousel-3d-slide {
    border-radius: 10px;
    border: none;
    overflow: visible;
    cursor: pointer;
    img {
      border-radius: 10px;
      display: block;
      width: 100%;
      height: 100%;
    }
    .desc {
      position: absolute;
      // bottom: -48px;
      margin-top: 10px;
      z-index: 1996;
      width: 100%;
      text-align: center;
      cursor: default;
      font-size: 12px;
      line-height: 14px;
    }

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.3);
    }

    &.current {
      img {
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
      }
      .mask {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    &:not(.current) {
      .desc {
        display: none;
      }
    }
  }

  .carousel-3d-controls {
    .prev,
    .next {
      color: @text_color;
      &:hover {
        color: @text_color_active;
      }
    }
    .prev {
      left: 20%;
    }
    .next {
      right: 20%;
    }
  }

  @media (max-width: 640px) {
    .carousel-3d-controls {
      display: none;
    }
  }
}
</style>
