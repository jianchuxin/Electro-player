<script setup>
import ElectroLoading from "base/electroLoading/ElectroLoading.vue";
import MusicList from "components/musiclist/MusicList.vue";
import { useLoading } from "@/composables/loading";
import { getPlayListById } from "@/apis/musiclist";
import { usePlayListStore } from "@/stores/playlist";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const { isLoading, hideLoad } = useLoading();

const playListStore = usePlayListStore();
const { selectPlay } = playListStore;

const list = ref([]);

onMounted(() => {
  initializeList();
});

const initializeList = async () => {
  try {
    const id = route.params.id;
    const res = await getPlayListById(id);
    document.title = `${res.name} - Electro 在线音乐播放器`;
    list.value = res.tracks;
    hideLoad();
  } catch (err) {
    console.log(err);
    hideLoad();
  }
};

// 播放暂停事件
const selectItem = (item, index) => {
  selectPlay({ list: list.value, index });
};
</script>

<template>
  <!-- 歌单详情 -->
  <div class="details">
    <ElectroLoading :show="isLoading" />
    <MusicList v-if="!isLoading" :list="list" @select="selectItem" />
  </div>
</template>

<style lang="less" scoped>
.details {
  .music-list {
    height: 100%;
  }
}
</style>
