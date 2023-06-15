<script setup>
import MusicList from "components/musiclist/MusicList.vue";
import { usePlayListStore } from "@/stores/playlist";
const usePlayList = usePlayListStore();

const showDialog = () => {
  //
};
</script>

<template>
  <div class="playlist">
    <MusicList :list="usePlayList.playList" list-type="duration">
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
