<script setup>
import { ref } from "vue";
const emit = defineEmits(["cancel", "confirm"]);
defineProps({
  // confirm/alert
  type: {
    type: String,
    default: "confirm",
  },
  headText: {
    type: String,
    default: "提示",
  },
  bodyText: {
    type: String,
    default: "",
  },
  cancelBtnText: {
    type: String,
    default: "取消",
  },
  confirmBtnText: {
    type: String,
    default: "确定",
  },
});

const dialogShow = ref(false);

// 显示组件
const show = () => {
  dialogShow.value = true;
};

// 隐藏组件
const hide = () => {
  dialogShow.value = false;
};

// 将方法暴露给父组件
defineExpose({ show, hide });

const confirm = () => {
  hide();
  emit("confirm");
};

const cancel = () => {
  hide();
  emit("cancel");
};
</script>

<template>
  <Teleport to="body">
    <div v-if="dialogShow" class="mm-dialog-box">
      <div class="mm-dialog-wrapper">
        <div class="mm-dialog-content">
          <div class="mm-dialog-head" v-text="headText"></div>
          <slot>
            <div class="mm-dialog-text" v-html="bodyText"></div>
          </slot>
          <div class="mm-dialog-btns">
            <div
              v-if="type.toLowerCase() !== 'alert'"
              class="mm-btn-cancel"
              v-text="cancelBtnText"
              @click="cancel"
            ></div>
            <slot name="btn"></slot>
            <div
              class="mm-btn-confirm"
              v-text="confirmBtnText"
              @click="confirm"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="less">

@dialog-prefix-cls: mm-dialog;

.@{dialog-prefix-cls}-box{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1996;
    background-color: @dialog_bg_color;
    user-select: none;
    backdrop-filter: @backdrop_filter;
    // 动画
    animation:mm-dialog-fadein 0.3s;
    .@{dialog-prefix-cls}-wrapper{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 1996;
        .@{dialog-prefix-cls}-content{
            width: 420px;
            border-radius: @dialog_border_radius;
            background:@dialog_content_bg_color;
            animation: mm-dialog-zoom 0.3s;
            // @media
            .@{dialog-prefix-cls}-head{
                padding: 15px;
                padding-bottom: 0;
                font-size: @font_size_large;
                color: @text_color_active;
            }
            .@{dialog-prefix-cls}-text{
                padding: 20px 15px;
                line-height: 22px;
                font-size: @font_size_medium;
                color: @dialog_text_color;
            }
            .@{dialog-prefix-cls}-btns{
                display: flex;
                justify-content: flex-end;
                align-items: center;
                padding: 0 15px 10px;
                color: @dialog_text_color;
                div {
                    display: block;
                    padding: 8px  15px;
                    border-radius: @border_radius_base;
                    border: 1px solid @btn_color;
                    font-size: @font_size_medium;
                    cursor: pointer;
                    &:not(:nth-of-type(1)){
                        margin-left: 10px;
                    }
                    &:hover{
                        color: @text_color_active;
                        border: 1px solid @btn_color_active;
                    }
                }
                // @media
                // @meida
            }
        }
    }
}

@keyframes mm-dialog-fadein{
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}

@keyframes mm-dialog-zoom{
    0%{
        transform: scale(0);
    }
    50%{
        transform: scale(1.1);
    }
    100%{
        transform:scale(1);
    }
}
</style>
