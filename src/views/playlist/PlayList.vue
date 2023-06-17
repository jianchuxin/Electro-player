<script setup>
import MusicList from "components/musiclist/MusicList.vue";
import { usePlayListStore } from "@/stores/playlist";
import { storeToRefs } from "pinia";
const playListStore = usePlayListStore();
const { setPlaying, setCurrentIndex } = playListStore;
const { currentMusic, playList } = storeToRefs(playListStore);
// 选择播放
const selectItem = (item, index) => {
  console.log("收到信号select");
  if (item.id !== currentMusic.value.id) {
    setCurrentIndex(index);
    setPlaying(true);
  }
};

const deleteItem = () => {
  //
};

const showDialog = () => {
  //
};
</script>

<template>
  <div class="playlist">
    <MusicList
      :list="playList"
      list-type="duration"
      @select="selectItem"
      @del="deleteItem"
    >
      <template #listBtn>
        <div class="list-btn">
          <span @click="showDialog">清空列表</span>
        </div>
      </template>
    </MusicList>

    <!-- mm-dialog -->
  </div>
</template>

<style scoped lang="less">
.list-btn {
  .flex-center;
  height: 50px;
  span {
    padding: 5px 20px;
    cursor: pointer;
    user-select: none;
    &:hover {
      color: @text_color_active;
    }
  }
}
</style>
