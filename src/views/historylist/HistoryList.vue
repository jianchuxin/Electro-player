<script setup>
import MusicList from "@/components/musiclist/MusicList.vue";
import ElectroDialog from "@/base/electroDialog/ElectroDialog.vue";
import { useUserStore } from "@/stores/user";
import { usePlayListStore } from "@/stores/playlist";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { showToast } from "base/electroToast/index";

const userStore = useUserStore();
const { historyList } = storeToRefs(userStore);
const { clearHistoryList, deleteHistoryMusic } = userStore;

const playListStore = usePlayListStore();
const { selectPlay } = playListStore;

const clearDialog = ref(null);
const showDialog = () => {
  clearDialog.value?.show();
};

// 清空列表
const clearList = () => {
  clearHistoryList();
  showToast({ message: "清除成功!" });
};

// 选择播放，将播放列表改为历史列表
const selectItem = (item, index) => {
  selectPlay({ list: historyList.value, index });
};

// 删除事件
const deleteItem = (index) => {
  deleteHistoryMusic(index);
  showToast({ message: "删除成功!" });
};
</script>

<template>
  <div class="historyList">
    <MusicList
      :list="historyList"
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
