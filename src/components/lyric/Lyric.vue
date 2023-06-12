<template>
  <div>
    <!-- 歌曲封面 -->
    <dl class="music-info">
      <dt>
        <img
          src="https://p2.music.126.net/TmOHxaGnFNlwNX8aPz66oA==/109951168638913915.jpg?param=300y300"
          alt="img"
        />
      </dt>
      <template v-if="true">
        <dd>歌曲名：向云端</dd>
        <dd>歌手名：小霞/海洋Bo</dd>
        <dd>专辑名：向云端</dd>
      </template>
      <template v-else>
        <dd>mmPlayer在线播放器</dd>
        <dd>
          <a href="#"> 项目主页 </a>
        </dd>
      </template>
    </dl>
    <!-- 歌词滚动 -->
    <div class="music-lyric">
      <div class="music-lyric-items" :style="lyricTop">
        <p v-if="true">还没有播放音乐哦</p>
        <p v-else-if="nolyric">暂无歌词</p>
        <template v-else-if="lyric">
          <p>111</p>
        </template>
        <p v-else>歌词加载失败!</p>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.music-info {
  padding-bottom: 20px;
  text-align: center;
  font-size: @font_size_medium;
  dt {
    position: relative;
    width: 186px;
    height: 186px;
    margin: 0 auto 15px;
    &::after {
      content: "";
      position: absolute;
      left: 9px;
      top: 0;
      width: 201px;
      height: 180px;
      background: url("assets/img/album_cover_player.png") 0 0 no-repeat;
    }
    img {
      vertical-align: middle;
      width: 186px;
      height: 186px;
    }
  }
  dd {
    height: 30px;
    line-height: 30px;
    .no-wrap();
  }
}
</style>
