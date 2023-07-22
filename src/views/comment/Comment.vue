<script setup>
import ElectroLoading from "@/base/electroLoading/ElectroLoading.vue";
import { getComent } from "@/apis/musiclist";
import { useLoading } from "@/composables/loading";
import { ref, onMounted } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { watch } from "vue";
import { toHttps } from "@/utils/util";

const route = useRoute();
const { isLoading, hideLoad } = useLoading();

const hotComments = ref([]);
const commentList = ref([]);

const page = ref(0); // 评论分页
const total = ref(null); // 评论总数
const lockUp = ref(true); // 是否锁定滚动加载事件，默认锁定

const list = ref(null);

// 初始化 or 滚动加载完成后解除锁定
watch(commentList, (newList, oldList) => {
  if (newList.length !== oldList.length) {
    lockUp.value = false;
  }
});

onMounted(() => {
  initialData(route.params.id);
});

// 路由守卫
onBeforeRouteUpdate((to) => {
  isLoading.value = true;
  page.value = 0;
  list.value.scrollTop = 0;
  initialData(to.params.id);
});

const initialData = async (id) => {
  const res = await getComent(id, page.value);
  hotComments.value = res.hotComments;
  commentList.value = res.comments;
  // console.log(hotComments.value);
  total.value = res.total;
  hideLoad();
};

// 用户头像
const getAvatarUrl = (item) => {
  return `${toHttps(item.user.avatarUrl)}?param=50y50`;
};

// 跳转用户链接地址
const getUserLink = (item) => {
  return `https://music.163.com/#/user/home?id=${item.user.userId}`;
};

const getCommentDate = (item) => {
  if (item.ipLocation.location != "") {
    return `${item.timeStr}  来自${item.ipLocation.location}`;
  } else {
    return item.timeStr;
  }
};

// 列表滚动事件
const listScroll = (e) => {
  if (lockUp.value) {
    return;
  }
  const { scrollTop, scrollHeight, offsetHeight } = e.target;
  if (scrollTop + offsetHeight >= scrollHeight - 100) {
    lockUp.value = true;
    pullUpLoad(); // 触发滚动加载事件
  }
};

// 滚动加载事件
const pullUpLoad = async () => {
  page.value++;
  const res = await getComent(route.params.id, page.value);
  commentList.value = [...commentList.value, ...res.comments];
};
</script>

<template>
  <div class="comment" @scroll="listScroll" ref="list">
    <ElectroLoading :show="isLoading" />
    <dl v-if="hotComments.length > 0" class="comment-list">
      <!-- 精彩评论 -->
      <dt class="comment-title">精彩评论</dt>
      <dd
        v-for="item in hotComments"
        :key="item.commentId"
        class="comment-item"
      >
        <a :href="getUserLink(item)" target="_blank">
          <img
            v-img-lazy="getAvatarUrl(item)"
            class="comment-item-pic"
            alt="userImg"
          />
        </a>
        <h4 class="comment-item-title">
          <a :href="getUserLink(item)" target="_blank">{{
            item.user.nickname
          }}</a>
        </h4>
        <div class="comment-item-date">
          {{ getCommentDate(item) }}
        </div>
        <p class="comment-item-disc">
          {{ item.content }}
        </p>
        <div class="comment-item-opt">
          <div class="comment-opt-liked">
            <ElectroIcon class="like-icon" type="like" />
            {{ item.likedCount }}
          </div>
        </div>
        <div
          v-for="beReplied in item.beReplied"
          :key="beReplied.user.userId"
          class="comment-item-replied"
        >
          <a :href="getUserLink(beReplied)" target="_blank">{{
            beReplied.user.nickname
          }}</a>
          ：{{ beReplied.content }}
        </div>
      </dd>
    </dl>

    <dl v-if="commentList.length > 0" class="comment-list">
      <!-- 最新评论 -->
      <dt class="comment-title">最新评论（{{ total }}）</dt>
      <dd
        v-for="item in commentList"
        :key="item.commentId"
        class="comment-item"
      >
        <a :href="getUserLink(item)" target="_blank">
          <img
            v-img-lazy="getAvatarUrl(item)"
            class="comment-item-pic"
            alt="userImg"
          />
        </a>
        <h4 class="comment-item-title">
          <a :href="getUserLink(item)" target="_blank">{{
            item.user.nickname
          }}</a>
        </h4>
        <div class="comment-item-date">
          {{ getCommentDate(item) }}
        </div>
        <p class="comment-item-disc">
          {{ item.content }}
        </p>
        <div class="comment-item-opt">
          <div class="comment-opt-liked">
            <ElectroIcon class="like-icon" type="like" />
            {{ item.likedCount }}
          </div>
        </div>
        <div
          v-for="beReplied in item.beReplied"
          :key="beReplied.user.userId"
          class="comment-item-replied"
        >
          <a :href="getUserLink(item)" target="_blank">{{
            beReplied.user.nickname
          }}</a>
          ：{{ beReplied.content }}
        </div>
      </dd>
    </dl>
  </div>
</template>

<style lang="less" scoped>
.comment {
  .comment-list {
    padding: 0 10px;
    .comment-title {
      position: sticky;
      top: 0;
      z-index: 1;
      margin: 0 -10px;
      padding: 10px;
      height: 34px;
      line-height: 34px;
      color: @text_color_active;
      background: @header_bg_color;
      backdrop-filter: @backdrop_filter;
    }

    .comment-item {
      & + .comment-item {
        border-top: 1px solid @comment_item_line_color;
      }
      position: relative;
      padding: 15px 0 15px 55px;
      &-pic {
        display: block;
        position: absolute;
        left: 0;
        top: 20px;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        overflow: hidden;
      }

      &-title {
        height: 26px;
        line-height: 26px;
        font-weight: 400;
        .no-wrap();
        color: @text_color_active;
      }

      &-date {
        height: 20px;
        line-height: 20px;
        margin-bottom: 10px;
      }

      &-disc {
        overflow: hidden;
        word-break: break-all;
        word-wrap: break-word;
        padding-right: 19px;
        line-height: 25px;
        text-align: justify;
        color: @text_color;
      }

      &-opt {
        line-height: 24px;
        overflow: hidden;
        margin-top: 8px;
        .like-icon {
          display: inline-block;
          margin-right: 2px;
        }
      }

      &-replied {
        padding: 8px 19px;
        margin-top: 10px;
        line-height: 24px;
        border: 1px solid @comment_replied_line_color;
        border-radius: 2px;
        a {
          color: @text_color_active;
        }
      }
    }
  }
}
</style>
