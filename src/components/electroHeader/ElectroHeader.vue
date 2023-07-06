<script setup>
import ElectroDialog from "base/electroDialog/ElectroDialog.vue";
import { useUserStore } from "@/stores/user";
import { getUserPlayList } from "apis/userinfo";
import { storeToRefs } from "pinia";
import { ref, computed, onMounted } from "vue";
import { showToast } from "base/electroToast/index";

const userStore = useUserStore();
const { uid } = storeToRefs(userStore);
const { setUid } = userStore;

const uidValue = ref("");
const userInfo = ref({});
// 弹窗模板引用
const loginDialog = ref(null);
const helpDialog = ref(null);
const logoutDialog = ref(null);

const isLoggedin = computed(() => {
  return uid.value !== "";
});

onMounted(() => {
  uid.value && getUserInfo(uid.value);
});

const avatarUrl = computed(() => {
  return userInfo.value?.avatarUrl + "?param=50y50";
});

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
    showToast({ message: "UID 不能为空", position: "top" });
    opendialog("login");
    return;
  }
  getUserInfo(uidValue.value);
  uidValue.value = "";
};

const logout = () => {
  setUid("");
  uidValue.value = "";
  showToast({ message: "退出成功!", position: "top" });
};

const getUserInfo = async (uid) => {
  const res = await getUserPlayList(uid);
  const { playlist } = res;
  if (playlist.length === 0 || !playlist[0].creator) {
    showToast({ message: `未找到 UID 为 ${uid} 的用户信息`, position: "top" });
    return;
  }
  userInfo.value = playlist[0].creator;
  setUid(uid);
  setTimeout(() => {
    showToast({
      message: `${userInfo.value.nickname} 欢迎使用 mmPlayer`,
      position: "top",
    });
  }, 200);
};
</script>

<template>
  <header class="electro-header">
    <h1 class="header">
      <a href="#" target="_blank">Electro 在线音乐播放器</a>
      <!-- 页面累计访问数 -->
      <!-- <img src="" alt=""> -->
    </h1>
    <!-- 用户信息--头像和登录 -->
    <dl class="user">
      <template v-if="isLoggedin">
        <RouterLink to="/music/userlist" custom v-slot="{ navigate }">
          <dt @click="navigate" class="user-info" role="link">
            <img :src="avatarUrl" class="avatar" alt="img" />
            <span class="user-name">{{ userInfo.nickname }}</span>
          </dt>
        </RouterLink>
        <dd class="user-btn" @click="opendialog('logout')">退出</dd>
      </template>
      <dd v-else class="user-btn" @click="opendialog('login')">登录</dd>
    </dl>

    <!-- 登录弹窗 -->
    <ElectroDialog
      ref="loginDialog"
      head-text="登录"
      confirm-btn-text="登录"
      cancel-btn-text="关闭"
      @confirm="login"
    >
      <div class="electro-dialog-text">
        <input
          type="number"
          v-model.trim="uidValue"
          class="electro-dialog-input"
          placeholder="请输入您的网易云 UID"
          v-focus
          @keyup.enter="login"
        />
      </div>
      <template #btn>
        <div @click="opendialog('help')">帮助</div>
      </template>
    </ElectroDialog>
    <!-- 帮助弹窗 -->
    <ElectroDialog
      ref="helpDialog"
      head-text="登录帮助"
      confirm-btn-text="去登录"
      cancel-btn-text="关闭"
      @confirm="opendialog('login')"
    >
      <div class="electro-dialog-text">
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
    </ElectroDialog>
    <!-- 退出弹窗 -->
    <ElectroDialog
      ref="logoutDialog"
      body-text="确定退出当前用户吗？"
      @confirm="logout"
    ></ElectroDialog>
  </header>
</template>

<style lang="less" scoped>
.electro-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  @media (max-width: 768px) {
    background-color: @header_bg_color;
  }

  .header {
    .flex-center;
    font-style: italic;
    line-height: 60px;
    font-size: 18px;
    font-weight: 800;
    // color: @text_color_active;
    color: transparent;
    background: url("assets/slideImg/universe.jpg");
    background-position: 100% 100%;
    text-align: cneter;
    background-clip: text;
    -webkit-background-clip: text;
    animation: slideImg 50s linear infinite alternate-reverse forwards;

    // media
    @media (max-width: 768px) {
      padding-left: 15px;
      justify-content: flex-start;
    }
    @media (max-width: 414px) {
      font-size: @font_size_medium;
    }
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

    @media (max-width: 768px) {
      &-info {
        margin-right: 10px;
        span {
          display: none;
        }
      }
    }
  }
}

.electro-dialog-text {
  text-align: left;
  .electro-dialog-input {
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

@keyframes slideImg {
  0% {
    background-position: 0 50%;
  }
  100% {
    background-position: 70% 75%;
  }
}
</style>
