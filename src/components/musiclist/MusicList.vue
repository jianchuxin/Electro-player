<template>
  <div class="music-list flex-col">
    <template v-if="true">
      <div class="list-item list-header">
        <span class="list-name">歌曲</span>
        <span class="list-artist">歌手</span>
        <span v-if="false" class="list-time">时长</span>
        <span v-else class="list-album">专辑</span>
      </div>
      <div class="list-content">
        <div class="list-item">
          <span class="list-num" v-text="1"></span>
          <div class="list-name">
            <span>逆态度</span>
            <div class="list-menu">
              <!-- menuicon -->
              <MmIcon type="bofang" :size="24" class="hover" />
            </div>
          </div>
          <span class="list-artist">张杰</span>
          <span v-if="false" class="list-time">
            <!-- 时间 + 删除按钮 -->
          </span>
          <span class="list-album">逆战</span>
        </div>

        <div class="list-item">
          <span class="list-num" v-text="1"></span>
          <div class="list-name">
            <span>逆态度</span>
            <div class="list-menu">
              <!-- menuicon -->
              <MmIcon type="bofang" :size="24" class="hover" />
            </div>
          </div>
          <span class="list-artist">张杰</span>
          <span v-if="false" class="list-time">
            <!-- 时间 + 删除按钮 -->
          </span>
          <span class="list-album">逆战</span>
        </div>

        <div class="list-item">
          <span class="list-num" v-text="1"></span>
          <div class="list-name">
            <span>逆态度</span>
            <div class="list-menu">
              <!-- menuicon -->
              <MmIcon type="bofang" :size="24" class="hover" />
            </div>
          </div>
          <span class="list-artist">张杰</span>
          <span v-if="false" class="list-time">
            <!-- 时间 + 删除按钮 -->
          </span>
          <span class="list-album">逆战</span>
        </div>

        <div class="list-item">
          <span class="list-num" v-text="1"></span>
          <div class="list-name">
            <span>逆态度</span>
            <div class="list-menu">
              <!-- menuicon -->
              <MmIcon type="bofang" :size="24" class="hover" />
            </div>
          </div>
          <span class="list-artist">张杰</span>
          <span v-if="false" class="list-time">
            <!-- 时间 + 删除按钮 -->
          </span>
          <span class="list-album">逆战</span>
        </div>

        <div class="list-item">
          <span class="list-num" v-text="1"></span>
          <div class="list-name">
            <span>逆态度</span>
            <div class="list-menu">
              <!-- menuicon -->
              <MmIcon type="bofang" :size="24" class="hover" />
            </div>
          </div>
          <span class="list-artist">张杰</span>
          <span v-if="false" class="list-time">
            <!-- 时间 + 删除按钮 -->
          </span>
          <span class="list-album">逆战</span>
        </div>
      </div>
      <!-- @改用slot -->
      <div class="list-btn">清空</div>
    </template>

    <template v-else>弄啥呢，空空如也~</template>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.music-list {
  height: 100%;
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
