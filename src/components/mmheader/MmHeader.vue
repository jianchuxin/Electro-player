<template>
  <header class="mm-header">
    <h1 class="header">
      <a href="#" target="_blank">mmPlayer 在线音乐播放器</a>
      <!-- 页面累计访问数 -->
      <!-- <img src="" alt=""> -->
    </h1>

    <!-- 用户信息--头像和登录 -->
    <dl class="user">
      <template v-if="isLoggedin">
        <RouterLink to="/music/userlist" custom v-slot="{ navigate }">
          <dt @click="navigate" class="user-info" role="link">
            <img src="" class="avatar" alt="img" />
            <span class="user-name">你的名字</span>
          </dt>
        </RouterLink>
        <dd class="user-btn" @click="opendialog('logout')">退出</dd>
      </template>
      <dd v-else class="user-btn" @click="opendialog('login')">登录</dd>
    </dl>

    <!-- 登录弹窗 -->
    <MmDialog
      ref="loginDialog"
      head-text="登录"
      confirm-btn-text="登录"
      cancel-btn-text="关闭"
      @confirm="login"
    >
      <div class="mm-dialog-text">
        <input
          type="number"
          v-model.trim="uidValue"
          class="mm-dialog-input"
          placeholder="请输入您的网易云 UID"
          autofocus
          @keyup.enter="login"
        />
      </div>
      <template #btn>
        <div @click="opendialog('help')">帮助</div>
      </template>
    </MmDialog>
    <!-- 帮助弹窗 -->
    <MmDialog
      ref="helpDialog"
      head-text="登录帮助"
      confirm-btn-text="去登录"
      cancel-btn-text="关闭"
      @confirm="opendialog('login')"
    >
      <div class="mm-dialog-text">
        <p>
          1、
          <a target="_blank" href="https://music.163.com"
            >点我(https://music.163.com)</a
          >
          打开网易云音乐官网
        </p>
        <p>2、点击页面右上角的“登录”</p>
        <p>3、点击您的头像，进入我的主页</p>
        <p>4、复制浏览器地址栏 /user/home?id= 后面的数字（网易云 UID）</p>
      </div>
    </MmDialog>
    <!-- 退出弹窗 -->
    <MmDialog
      ref="logoutDialog"
      body-text="确定退出当前用户吗？"
      @confirm="logout"
    ></MmDialog>
  </header>
</template>

<script setup>
import MmDialog from "base/mmdialog/MmDialog.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref, computed } from "vue";

const userStore = useUserStore();
// const { uid } = storeToRefs(userStore);
const { setUid } = userStore;

const isLoggedin = ref(false);
const uidValue = ref("");

// 弹窗模板引用
const loginDialog = ref(null);
const helpDialog = ref(null);
const logoutDialog = ref(null);

const opendialog = (type) => {
  switch (type) {
    case "login":
      loginDialog.value.show();
      break;
    case "help":
      loginDialog.value.hide();
      helpDialog.value.show();
      break;
    case "logout":
      logoutDialog.value.show();
      break;
  }
};

const login = () => {
  if (uidValue.value === "") {
    alert("UID 不能为空");
    opendialog("login");
    return;
  }
  // isLoggedin.value = true;
  setUid(uidValue.value);
  isLoggedin.value = true;
  console.log("登录成功!");
};

const logout = () => {
  setUid("");
  uidValue.value = "";
  isLoggedin.value = false;
  console.log("退出成功!");
};
</script>

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
  }
}

// dialog
.mm-dialog-text {
  text-align: left;
  .mm-dialog-input {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 0 15px;
    border: 1px solid @btn_color;
    outline: 0;
    background: transparent;
    color: @text_color_active;
    font-size: @font_size_medium;
    box-shadow: 0 0 1px 0 #fff inset;
    &::placeholder {
      color: @text_color;
    }
  }
  a:hover {
    color: #d43c33;
  }
}
</style>
