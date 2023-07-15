<script setup>
import MusicList from "@/components/musiclist/MusicList.vue";
import ElectroLoading from "@/base/electroLoading/ElectroLoading.vue";
import { ref, onMounted } from "vue";
import { usePlayListStore } from "@/stores/playlist";
import { getSongDetail, getSearchHot, getSearchList } from "apis/musiclist";
import { formatSongs } from "@/utils/song";
import { useLoading } from "@/composables/loading"; // 使用组合式函数代替mixins
import { showToast } from "base/electroToast/index";
import { toHttps } from "@/utils/util";
const playListStore = usePlayListStore();
const { selectAddPlay } = playListStore;

const searchValue = ref("");
const searchHotWords = ref([]);
const searchList = ref([]);
const page = ref(0);

const { isLoading, hideLoad } = useLoading();

// 获取热搜词语
const InitSearchHotWords = async () => {
  const res = await getSearchHot();
  searchHotWords.value = res.result.hots.slice(0, 5);
};

onMounted(() => {
  InitSearchHotWords();
  isLoading.value = false;
});

// 点击热搜词语
const clickHot = (keywords) => {
  searchValue.value = keywords;
  onSearch();
};

// 引用子组件实例，使用{scrollToTop}方法
const musicList = ref(null);

const onSearch = async () => {
  searchValue.value = searchValue.value.trim();
  // console.log(searchValue.value);
  if (searchValue.value === "clickHot") {
    showToast({ message: "搜索内容不能为空~" });
    return;
  }
  // loading....
  page.value = 0;
  isLoading.value = true;
  if (searchList.value.length > 0) {
    musicList.value.scrollToTop();
  }
  const res = await getSearchList(searchValue.value);
  const result = res.result;
  searchList.value = formatSongs(result.songs); //得到的数据中没有封面图，后面需要调用getSongDetail
  // loading end
  // 调用组合式函数--> @/composables/load.js
  hideLoad();
};

// 滚动加载-添加新的数据
const pullUpLoad = async () => {
  page.value++;
  const res = await getSearchList(searchValue.value, page.value);
  const result = res.result;
  if (!result.songs) {
    showToast({ message: "没有更多歌曲啦!" });
    return;
  }
  searchList.value = [...searchList.value, ...formatSongs(result.songs)];
};

const selectItem = async (music) => {
  try {
    const res = await getSongDetail(music.id);
    // console.log(res);
    const picUrl = res.songs[0].al.picUrl;
    music.image = toHttps(picUrl);
    selectAddPlay(music);
  } catch (error) {
    showToast({ message: "哎呀，出错了~" });
  }
};
</script>

<template>
  <div class="search flex-col">
    <ElectroLoading :show="isLoading" />
    <div class="search-head">
      <span
        v-for="(item, index) in searchHotWords"
        :key="index"
        @click="clickHot(item.first)"
        >{{ item.first }}</span
      >
      <input
        v-model.trim="searchValue"
        class="search-input"
        type="text"
        placeholder="音乐/歌手"
        autofocus
        @keyup.enter="onSearch"
      />
    </div>
    <MusicList
      ref="musicList"
      :list="searchList"
      list-type="pullUp"
      @select="selectItem"
      @pullUpLoad="pullUpLoad"
    />
  </div>
</template>

<style lang="less" scoped>
.search {
  overflow: hidden;
  height: 100%;
  .search-head {
    display: flex;
    height: 40px;
    padding: 10px 15px;
    background-color: @search_bg_color;
    span {
      line-height: 40px;
      margin-right: 15px;
      cursor: pointer;
      &:hover {
        color: @text_color_active;
      }
      @media (max-width: 640px) {
        & {
          display: none;
        }
      }
    }
  }
  .search-input {
    flex: 1;
    height: 40px;
    box-sizing: border-box;
    padding: 0 15px;
    border: 1px solid @btn_color;
    outline: 0;
    background: transparent;
    color: @text_color_active;
    font-size: @font_size_medium;
    box-shadow: 0 0 1px 0px #fff inset;
    &::placeholder {
      color: @text_color;
    }
  }
}
</style>
