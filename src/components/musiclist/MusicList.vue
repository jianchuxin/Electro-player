<script setup>
import { ref, computed, watch } from "vue";
import { formatSecond } from "@/utils/util";
// 触发滚动加载的阈值
const THRESHOLD = 100;
const emit = defineEmits(["pullUpLoad"]);
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

// 是否正在播放
const isPlaying = computed(() => {
  return true;
});

// 根据播放 or 暂停状态 设定图标
const getStateType = computed(() => {
  return "bofang";
});

// 获取播放时间，格式为 mm:ss
const getFormatTime = (seconds) => {
  return formatSecond(seconds);
};

// 双击选择特定歌曲播放
const selectItem = () => {
  //
};

// 删除特定歌曲
const deleteItem = () => {
  //
};

watch(
  () => props.list,
  (newList, oldList) => {
    console.log("list change");
    console.log(oldList.length);
    console.log(newList.length);
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

// 滚动加载，pullup类型
const lockUp = ref(true); // 是否锁定滚动加载事件
const listScroll = (e) => {
  if (props.listType !== "pullUp" || lockUp.value) {
    return;
  }
  const scrollTop = e.target.scrollTop;
  const { scrollHeight, offsetHeight } = e.target;
  console.log(scrollHeight, scrollTop, offsetHeight);
  const heightLeft = scrollHeight - scrollTop - offsetHeight; // 剩余内容高度
  if (heightLeft <= THRESHOLD) {
    lockUp.value = true; // 锁定滚动加载事件
    emit("pullUpLoad"); // 触发滚动加载事件
  }
};
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
          :class="{ isPlaying: isPlaying }"
          @dblclick="selectItem"
        >
          <span class="list-num" v-text="index + 1"></span>
          <div class="list-name">
            <span>{{ item.name }}</span>
            <div class="list-menu">
              <MmIcon
                :type="getStateType"
                :size="24"
                class="hover"
                @click.stop="selectItem"
              />
            </div>
          </div>
          <span class="list-artist">{{ item.singer }}</span>
          <span v-if="isDuration" class="list-time">
            {{ getFormatTime(item.duration % 3600) }}
            <MmIcon
              type="shanchu"
              :size="24"
              class="hover list-menu-icon-del"
              @click.stop="deleteItem"
            />
          </span>
          <span v-else class="list-album">{{ item.album }}</span>
        </div>
        <slot name="listBtn"></slot>
      </div>
    </template>

    <template v-else>弄啥呢，空空如也~</template>
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

    & > span {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    // small {
    //   margin-left: 5px;
    //   font-size: 12px;
    //   color: rgba(2552, 255, 255, 0.5);
    // }

    .list-menu {
      //   display: none;
      position: absolute;
      top: 0;
      right: 10px;
      height: 50px;
      .flex-center;
    }
  }

  .list-artist,
  .list-album {
    display: block;
    width: 300px;
    .no-wrap();
    // @media
  }

  .list-time {
    display: block;
    width: 60px;
  }
}
</style>
