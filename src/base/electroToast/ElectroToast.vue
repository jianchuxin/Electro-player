<template>
  <div class="electro-toast" :class="positionClass">
    {{ props.message }}
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: "center",
  },
});

const positionClass = computed(() => {
  return "electro-toast-" + props.position;
});
</script>

<style lang="less">
@prefix-cls: electro-toast;

.@{prefix-cls} {
  position: fixed;
  left: 50%;
  z-index: 1998;
  max-width: 80%;
  box-sizing: border-box;
  border-radius: @border_radius;
  padding: 10px 20px;
  overflow: hidden;
  text-align: center;
  min-height: 40px;
  line-height: 20px;
  font-size: 14px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  user-select: none;
  transform: translateX(-50%);
  animation: fadeIn 0.3s ease-in;
  &&-top {
    top: 10%;
  }
  &&-center {
    top: 50%;
    margin-top: -20px;
  }
  &&-bottom {
    bottom: 10%;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translate3d(-50%, -10px, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
  }
}
</style>
