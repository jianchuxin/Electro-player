<script setup>
import ElectroNoResult from "base/electroNoResult/ElectroNoResult.vue";
import { ref, computed, watch } from "vue";
import { formatSecond } from "@/utils/util";
import { usePlayListStore } from "@/stores/playlist";
import { storeToRefs } from "pinia";
const playListStore = usePlayListStore();
const { setPlaying } = playListStore;
const { currentMusic, isPlaying } = storeToRefs(playListStore);
// 触发滚动加载的阈值
const THRESHOLD = 100;
const emit = defineEmits(["pullUpLoad", "select", "del"]);
const props = defineProps({
  // 歌曲数据
  list: {
    type: Array,
    default: () => [],
  },
  /**
   * 列表类型
   * album：显示专辑栏目（默认）
   * duration：显示时长栏目
   * pullUp：开启无限加载--往下滑到底加载新的歌曲
   **/
  listType: {
    type: String,
    default: "album",
  },
});

// 是否显示时间
const isDuration = computed(() => {
  return props.listType === "duration";
});

watch(
  () => props.list,
  (newList, oldList) => {
    if (props.listType !== "pullUp") {
      return;
    }
    if (newList.length !== oldList.length) {
      lockUp.value = false;
    } else if (newList[newList.length - 1].id !== oldList[oldList.length - 1]) {
      lockUp.value = false;
    }
  }
);

// 根据播放 or 暂停状态 设定图标
const getStateType = ({ id: itemId }) => {
  return isPlaying.value && currentMusic.value.id === itemId
    ? "pause-circle"
    : "play-circle";
};

// 获取播放时间，格式为 mm:ss
const getFormatTime = (seconds) => {
  return formatSecond(seconds);
};

// 双击选择特定歌曲播放
const selectItem = (item, index) => {
  // 双击当前播放歌曲，播放/暂停
  if (currentMusic.value.id && item.id === currentMusic.value.id) {
    setPlaying(!isPlaying.value);
    return;
  }
  // 切换当前播放音乐
  emit("select", item, index);
};

// 删除特定歌曲
const deleteItem = (index) => {
  emit("del", index);
};

// 滚动加载，pullup类型
const lockUp = ref(true); // 是否锁定滚动加载事件
const listScroll = (e) => {
  if (props.listType !== "pullUp" || lockUp.value) {
    return;
  }
  const scrollTop = e.target.scrollTop;
  const { scrollHeight, offsetHeight } = e.target;
  // console.log(scrollHeight, scrollTop, offsetHeight);
  const heightLeft = scrollHeight - scrollTop - offsetHeight; // 剩余内容高度
  if (heightLeft <= THRESHOLD) {
    lockUp.value = true; // 锁定滚动加载事件
    emit("pullUpLoad"); // 触发滚动加载事件
  }
};

// 切换搜索时，列表滑动到顶部，暴露给父组件
const listContent = ref(null);
const scrollToTop = () => {
  listContent.value.scrollTop = 0;
};

defineExpose({ scrollToTop });
</script>

<template>
  <div class="music-list flex-col">
    <template v-if="list.length > 0">
      <div class="list-item list-header">
        <span class="list-name">歌曲</span>
        <span class="list-artist">歌手</span>
        <span v-if="isDuration" class="list-time">时长</span>
        <span v-else class="list-album">专辑</span>
      </div>
      <div ref="listContent" class="list-content" @scroll="listScroll">
        <div
          v-for="(item, index) in list"
          :key="item.id"
          class="list-item"
          :class="{ on: isPlaying && currentMusic.id === item.id }"
          @dblclick="selectItem(item, index)"
        >
          <div class="list-num" v-text="index + 1"></div>
          <div class="list-name">
            <span class="list-name-text">{{ item.name }}</span>
            <ElectroIcon
              :type="getStateType(item)"
              :size="32"
              class="hover list-menu-icon"
              @click.stop="selectItem(item, index)"
            />
          </div>
          <div class="list-artist">{{ item.singer }}</div>
          <div v-if="isDuration" class="list-time">
            <span class="list-time-format">{{
              getFormatTime(item.duration % 3600)
            }}</span>
            <ElectroIcon
              type="delete"
              :size="32"
              class="hover list-menu-icon-del"
              @click.stop="deleteItem(index)"
              @dblclick.stop=""
            />
          </div>
          <span v-else class="list-album">{{ item.album }}</span>
        </div>
        <slot name="listBtn"></slot>
      </div>
    </template>
    <ElectroNoResult v-else title="弄啥呢，空空如也~" />
  </div>
</template>

<style lang="less" scoped>
.music-list {
  height: 100%;
  min-height: 0;
}

.list-header {
  border-bottom: 1px solid @list_head_line_color;
  color: @text_color_active;

  .list-name {
    padding-left: 40px;
    user-select: none;
  }
}

.list-content {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

.list-item {
  display: flex;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid @list_item_line_color;
  line-height: 50px;
  overflow: hidden;

  &.on {
    color: #fff;
    .list-num {
      font-size: 0;
      background: url("assets/img/wave.gif") no-repeat center center;
    }
  }
  .list-num {
    display: block;
    width: 30px;
    margin-right: 10px;
    text-align: center;
  }

  .list-name {
    position: relative;
    flex: 1;
    box-sizing: border-box;

    .list-name-text {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .list-menu-icon {
      display: none;
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
  }

  .list-artist,
  .list-album {
    display: block;
    width: 300px;
    .no-wrap();
    @media (max-width: 1440px) {
      width: 200px;
    }
    @media (max-width: 1200px) {
      width: 150px;
    }
  }
  .list-artist {
    width: 250px;
  }

  .list-time {
    display: block;
    width: 60px;
    position: relative;

    .list-menu-icon-del {
      display: none;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}

.list-item:hover {
  .list-name {
    padding-right: 80px;
    .list-menu-icon {
      display: block;
    }
  }

  .list-time {
    .list-time-format {
      font-size: 0;
    }
    .list-menu-icon-del {
      display: block;
    }
  }
}

@media (max-width: 960px) {
  .list-item .list-name {
    padding-right: 40px;
  }
}

@media (max-width: 768px) {
  .list-item {
    .list-name .list-menu {
      display: block;
    }
    .list-artist,
    .list-album {
      width: 30%;
    }
  }
}

@media (max-width: 640px) {
  .list-item {
    .list-artist {
      width: 40%;
    }
    .list-album,
    .list-time {
      display: none;
    }
  }
}
</style>
