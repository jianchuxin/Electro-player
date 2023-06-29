<script setup>
import { showToast } from "base/mmtoast/index";

import MusicList from "@/components/musiclist/MusicList.vue";
import MmDialog from "@/base/mmdialog/MmDialog.vue";
import { useUserStore } from "@/stores/user";
import { usePlayListStore } from "@/stores/playlist";
import { storeToRefs } from "pinia";
import { ref } from "vue";
// import { useRouter } from "vue-router";

const userStore = useUserStore();
const { historyList } = storeToRefs(userStore);
const { clearHistoryList, deleteHistoryMusic } = userStore;

const playListStore = usePlayListStore();
const { selectPlay } = playListStore;

const clearDialog = ref(null);
const showDialog = () => {
  clearDialog.value?.show();
};

// const router = useRouter();

// 清空列表
const clearList = () => {
  clearHistoryList();
  showToast();
  // alert("清除成功!");
};

// 选择播放，将播放列表改为历史列表
const selectItem = (item, index) => {
  selectPlay({ list: historyList.value, index });
  // router.push("/");
};

// 删除事件
const deleteItem = (index) => {
  deleteHistoryMusic(index);
  showToast({ message: "删除成功!", position: "center" });
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
    <MmDialog
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
