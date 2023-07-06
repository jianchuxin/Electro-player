<script setup>
import ElectroProgress from "base/electroProgress/ElectroProgress.vue";
import { ref, computed } from "vue";

const props = defineProps({
  volume: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["volumeChange"]);
// 记录静音前的音量，取消静音后恢复
const lastVolume = ref(props.volume);

const volumeProgress = computed(() => {
  return props.volume;
});

const volumeType = computed(() => {
  return volumeProgress.value ? "turnon" : "turnoff";
});

const toggleType = () => {
  let volume;
  if (volumeProgress.value) {
    volume = 0;
    lastVolume.value = volumeProgress.value;
  } else {
    volume = lastVolume.value;
  }
  handleVolumeChange(volume);
};

const handleVolumeChange = (percent) => {
  emit("volumeChange", percent);
};
</script>

<template>
  <div class="volume">
    <ElectroIcon
      class="pointer volume-icon"
      :type="volumeType"
      :size="30"
      @click="toggleType"
    />
    <div class="volume-progress-wrapper">
      <ElectroProgress
        :percent="volumeProgress"
        @percentChangeEnd="handleVolumeChange"
        @percentChange="handleVolumeChange"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.volume {
  display: flex;
  align-items: center;
  width: 150px;
  &-icon {
    margin-right: 5px;
    color: #fff;
  }
  &-progress-wrapper {
    flex: 1;
  }
  @media (max-width: 768px) {
    width: 36px;
    .volume-progress-wrapper {
      display: none;
    }
  }
}
</style>
