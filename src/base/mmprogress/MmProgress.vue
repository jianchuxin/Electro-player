<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";

const emit = defineEmits(["percentChange", "percentChangeEnd"]);
const props = defineProps({
  // 播放条进度
  percent: {
    type: [Number],
    default: 0,
  },
  // 缓冲条进度
  percentLoad: {
    type: [Number],
    default: 0,
  },
});
const dotWidth = 10;
const move = ref({
  isDragging: false,
  startX: 0,
  left: 0,
});

const mmProgress = ref(null);
const mmProgressPlay = ref(null);
const mmProgressLoad = ref(null);

onMounted(() => {
  // 绑定事件，鼠标键盘事件
  bindEvents();
  const barWidth = mmProgress.value.clientWidth - dotWidth;
  const offsetWidth = props.percent * barWidth;
  moveSlide(offsetWidth);
});
onUnmounted(() => {
  unbindEvents();
});

// 添加绑定事件
const bindEvents = () => {
  document.addEventListener("mousemove", barMove);
  document.addEventListener("mouseup", barUp);

  document.addEventListener("touchmove", barMove);
  document.addEventListener("touchend", barUp);
};

const unbindEvents = () => {
  document.removeEventListener("mousemove", barMove);
  document.removeEventListener("mouseup", barUp);

  document.removeEventListener("touchmove", barMove);
  document.removeEventListener("touchend", barUp);
};

// 移动进度条圆点
const moveSlide = (offsetWidth) => {
  mmProgressPlay.value.style.width = offsetWidth + "px";
};

// 向父组件传递信息 1. 拖动或点击完成 2. 正在拖动中
const commitPercent = (isEnd = false) => {
  const lineWidth = mmProgress.value.clientWidth - dotWidth;
  const percent = mmProgressPlay.value.clientWidth / lineWidth;
  emit(isEnd ? "percentChangeEnd" : "percentChange", percent);
};

watch(
  () => props.percent,
  (newPercent) => {
    if (newPercent >= 0 && !move.value.isDragging) {
      const innerWidth = mmProgress.value.clientWidth - dotWidth;
      const offsetWidth = newPercent * innerWidth;
      moveSlide(offsetWidth);
    }
  }
);

// 进度条缓冲
watch(
  () => props.percentLoad,
  (newPercentLoad) => {
    const offsetWidth = mmProgress.value.clientWidth * newPercentLoad;
    mmProgressLoad.value.style.width = offsetWidth + "px";
  }
);

// 鼠标点击事件
const barClick = (e) => {
  const rect = mmProgressPlay.value.getBoundingClientRect();
  const offsetWidth = Math.min(
    mmProgress.value.clientWidth - dotWidth,
    Math.max(0, e.clientX - rect.left)
  );
  moveSlide(offsetWidth);
  commitPercent(true);
};

// 鼠标按下圆圈，记录下此时的坐标
const barDown = (e) => {
  move.value.isDragging = true;
  move.value.startX = e.clientX || e.touches[0].pageX;
  move.value.left = mmProgressPlay.value.clientWidth;
};

// 鼠标处于拖动中，
const barMove = (e) => {
  if (!move.value.isDragging) {
    return;
  }
  e.preventDefault();
  let endX = e.clientX || e.touches[0].pageX;
  let dist = endX - move.value.startX;
  let offsetWidth = Math.min(
    mmProgress.value.clientWidth - dotWidth,
    Math.max(0, move.value.left + dist)
  );
  moveSlide(offsetWidth);
  commitPercent();
};

// 鼠标拖动完成，
const barUp = () => {
  if (move.value.isDragging) {
    commitPercent(true);
    move.value.isDragging = false;
  }
};
</script>

<template>
  <div ref="mmProgress" class="mmProgress" @click="barClick">
    <div class="mmProgress-inner">
      <div ref="mmProgressLoad" class="mmProgress-load"></div>
      <div ref="mmProgressPlay" class="mmProgress-play">
        <div
          class="mmProgress-dot"
          @mousedown="barDown"
          @touchstart.prevent="barDown"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.mmProgress {
  position: relative;
  padding: 5px;
  user-select: none;
  cursor: pointer;
  overflow: hidden;
  .mmProgress-inner {
    height: 2px;
    width: 100%;
    background: @bar_color;
  }
  .mmProgress-load {
    position: absolute;
    top: 50%;
    left: 5px;
    display: inline-block;
    width: 0;
    height: 2px;
    margin-top: -1px;
    background: rgba(255, 255, 255, 0.2);
  }

  .mmProgress-play {
    position: absolute;
    top: 50%;
    left: 5px;
    display: inline-block;
    width: 0;
    height: 2px;
    margin-top: -1px;
    background: @line_color;
    .mmProgress-dot {
      position: absolute;
      top: 50%;
      right: -5px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: @dot_color;
      transform: translateY(-50%);
    }
  }
}
</style>
