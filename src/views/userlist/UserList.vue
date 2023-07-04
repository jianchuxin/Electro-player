<script setup>
import { Carousel3d, Slide } from "vue3-carousel-3d";
import "vue3-carousel-3d/dist/index.css";
import { ref, onMounted } from "vue";
import { getUserPlayList } from "@/apis/userinfo";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const { uid } = storeToRefs(userStore);

const router = useRouter();
const myList = ref([]); // 我创建的歌单
const starList = ref([]); // 我收藏的歌单

const carousel = ref(null);
const carouselStar = ref(null);

onMounted(() => {
  initialData();
});

const initialData = async () => {
  const res = await getUserPlayList(uid.value);
  const list = res.playlist;
  list.forEach((item) => {
    if (item.creator.userId === Number(uid.value)) {
      myList.value.push(item);
    } else {
      starList.value.push(item);
    }
  });
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
    <div class="userlist-title">我创建的歌单</div>
    <carousel-3d
      v-if="myList.length > 0"
      ref="carousel"
      :count="myList.length"
      :width="120"
      :height="120"
      :display="5"
      controlsVisible="true"
      :space="120"
      :clickable="true"
      :onMainSlideClick="() => gotoDetail(0)"
    >
      <slide v-for="(item, index) in myList" :key="index" :index="index">
        <img v-img-lazy="item.coverImgUrl" alt="image" />
        <p class="desc">《{{ item.name }}》</p>
        <div class="mask"></div>
      </slide>
    </carousel-3d>

    <div class="userlist-title">我收藏的歌单</div>
    <carousel-3d
      v-if="starList.length > 0"
      ref="carouselStar"
      :count="starList.length"
      :width="120"
      :height="120"
      :display="5"
      controlsVisible="true"
      :space="120"
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

<style lang="less" scoped>
.userlist {
  display: flex;
  flex-direction: column;
}
.userlist-title {
  margin: 20px 0;
  width: 100%;
  height: 34px;
  // text-align: center;
  line-height: 34px;
  font-size: @font_size_large;
  color: @text_color;
}
.carousel-3d-container {
  // min-height: 0;
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
      bottom: -30px;
      z-index: 1996;
      width: 100%;
      text-align: center;
      cursor: default;
      font-size: 10px;
      height: 20px;
      line-height: 12px;
    }

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.5);
    }

    &.current {
      img {
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
      }
      .mask {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }

    &:not(.current) {
      filter: blur(5px);
      .desc {
        display: none;
      }
    }
  }

  .carousel-3d-controls {
    .prev,
    .next {
      color: @text_color_active;
    }
  }
}
</style>
