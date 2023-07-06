<script setup>
import MusicList from "components/musiclist/MusicList.vue";
import ElectroDialog from "base/electroDialog/ElectroDialog.vue";
import { usePlayListStore } from "@/stores/playlist";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { showToast } from "base/electroToast/index";
const playListStore = usePlayListStore();
const { currentMusic, playList } = storeToRefs(playListStore);
const { setPlaying, setCurrentIndex, clearPlayList, deletePlayListMusic } =
  playListStore;

const clearDialog = ref(null);
const showDialog = () => {
  clearDialog.value?.show();
};
// 清除列表
const clearList = () => {
  clearPlayList();
  showToast({ message: "列表清除成功!" });
};
// 选择播放
const selectItem = (item, index) => {
  if (item.id !== currentMusic.value.id) {
    setCurrentIndex(index);
    setPlaying(true);
  }
};
// 删除事件
const deleteItem = (index) => {
  deletePlayListMusic(index);
  showToast({ message: "删除成功!" });
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
    <ElectroDialog
      ref="clearDialog"
      body-text="是否清空播放历史列表"
      confirm-btn-text="清空"
      @confirm="clearList"
    />
  </div>
</template>

<style lang="less" scoped>
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
