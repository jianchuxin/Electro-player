<script setup>
import MusicList from "@/components/musiclist/MusicList.vue";
import MmLoading from "@/base/mmloading/MmLoading.vue";
import { ref, onMounted } from "vue";
import { getSearchHot, getSearchList } from "apis/musiclist";
import { formatSongs } from "@/utils/song";
import { useLoading } from "@/composables/loading"; // 使用组合式函数代替mixins
const searchValue = ref("");
const searchHotWords = ref([]);
const searchList = ref([]);

const { isLoading, hideLoad } = useLoading();

// 获取热搜词语
const InitSearchHotWords = async () => {
  const res = await getSearchHot();
  searchHotWords.value = res.result.hots.slice(0, 5);
};

onMounted(() => {
  InitSearchHotWords();
});

// 点击热搜词语
const clickHot = () => {
  //
};

const onSearch = async () => {
  searchValue.value = searchValue.value.trim();
  if (searchValue.value === "clickHot") {
    alert("搜索内容不能为空~");
  }
  // loading....
  isLoading.value = true;
  const res = await getSearchList(searchValue.value);
  searchList.value = formatSongs(res.result.songs);
  // console.log(searchList.value);
  // 调用组合式函数--> @/composables/load.js
  hideLoad();
};

const selectItem = () => {
  //
};

const pullUpLoad = () => {
  //
};
</script>

<template>
  <div class="search flex-col">
    <MmLoading :show="isLoading" />
    <div class="search-head">
      <span
        v-for="(item, index) in searchHotWords"
        :key="index"
        @click="clickHot"
        >{{ item.first }}</span
      >
      <input
        v-model.trim="searchValue"
        class="search-input"
        type="text"
        placeholder="音乐/歌手"
        @keyup.enter="onSearch"
      />
    </div>
    <MusicList
      :list="searchList"
      list-type="pullup"
      @select="selectItem"
      @pullUp="pullUpLoad"
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
      // @media
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
