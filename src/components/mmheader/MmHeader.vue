<template>
  <header class="mm-header">
    <h1 class="header">
      <a href="#" target="_blank">mmPlayer 在线音乐播放器</a>
      <!-- 页面累计访问数 -->
      <!-- <img src="" alt=""> -->
    </h1>

    <!-- 用户信息--头像和登录 -->
    <dl class="user">
      <template v-if="true">
        <RouterLink to="/music/userlist" custom v-slot="{ navigate }">
          <dt @click="navigate" class="user-info" role="link">
            <img src="" class="avatar" alt="img" />
            <span class="user-name">你的名字</span>
          </dt>
        </RouterLink>
        <dd class="user-btn">退出</dd>
      </template>
      <dd v-else class="user-btn">登录</dd>
    </dl>

    <!-- 登录弹窗 -->

    <!-- 退出弹窗 -->
  </header>
</template>

<script setup></script>

<style lang="less" scoped>
.mm-header {
  background-color: #333;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  // media

  .header {
    .flex-center;
    line-height: 60px;
    color: @text_color_active;
    font-size: @font_size_large;
    // media

    // vistor
  }

  .user {
    position: absolute;
    top: 50%;
    right: 15px;
    line-height: 30px;
    text-align: right;
    transform: translateY(-50%);
    display: flex;
    gap: 15px;
    &-info {
      cursor: pointer;
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        vertical-align: middle;
      }
      .user-name {
        display: inline-block;
        margin-left: 10px;
        color: @text_color_active;
      }
    }
    &-btn {
      cursor: pointer;
      &:hover {
        color: @text_color_active;
      }
    }
    // @media

    // dialog
  }
}
</style>
