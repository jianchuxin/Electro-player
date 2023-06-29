import { h, render } from "vue";
import Toast from "./MmToast.vue";

const defaultOptions = {
  duration: 1500,
};

export class ToastCreator {
  options;
  container;
  constructor(options) {
    this.options = options;
    this.container = document.createElement("div");
  }

  present() {
    const mmToast = h(h(Toast), this.options);
    render(mmToast, this.container);
    document.body.insertBefore(this.container, document.body.firstChild);

    // 到时间消失
    if (defaultOptions.duration) {
      setTimeout(() => {
        this.dismissA(); // 注意回调函数this的问题
      }, defaultOptions.duration);
    }
  }

  dismissA() {
    document.body.removeChild(this.container);
  }
}

export const showToast = ({ message, position }) => {
  const toast = new ToastCreator({
    message,
    position,
  });
  toast.present();
};
