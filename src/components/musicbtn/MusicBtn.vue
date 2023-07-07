<template>
  <div class="music-btn">
    <RouterLink to="/music/playlist">正在播放</RouterLink>
    <RouterLink to="/music/toplist">推荐</RouterLink>
    <RouterLink to="/music/search">搜索</RouterLink>
    <RouterLink to="/music/userlist">我的歌单</RouterLink>
    <span class="show-960" @click="$emit('onClickLyric')">歌词</span>
    <RouterLink to="/music/historylist">我听过的</RouterLink>
  </div>
</template>

<script setup>
defineEmits(["onClickLyric"]);
</script>

<style lang="less" scoped>
.music-btn {
  width: 100%;
  height: 60px;
  display: flex;
  gap: 8px;
  a,
  span {
    display: inline-block;
    height: 40px;
    box-sizing: border-box;
    padding: 0 23px;
    border: 1px solid @btn_color;
    color: @btn_color;
    border-radius: @btn_border_radius;
    font-size: 14px;
    line-height: 40px;
    overflow: hidden;
    cursor: pointer;
    &:hover,
    &:active {
      border-color: @btn_color_active;
      color: @btn_color_active;
    }
  }

  @media (min-width: 960px) {
    span.show-960 {
      display: none;
    }
  }

  @media (max-width: 960px) {
    span.show-960 {
      display: inline-block;
    }
  }

  @media (max-width: 768px) {
    height: 50px;
    a,
    span {
      height: 35px;
      padding: 0 10px;
      margin-right: 6px;
      line-height: 35px;
    }
  }
}
@media (max-width: 520px) {
  .music-btn {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    height: 80px;
    a,
    span {
      text-align: center;
    }
  }
}
</style>
