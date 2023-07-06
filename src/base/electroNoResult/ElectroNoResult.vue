<template>
  <!--暂无数据提示-->
  <div class="electro-no-result">
    <p class="electro-no-result-text">{{ title }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>

<style lang="less" scoped>
.electro-no-result {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  &-text {
    margin-top: 30px;
    font-size: @font_size_medium;
    color: @text_color;
  }
}
</style>
