<script>
import { h } from "vue";
export default {
  name: "ElectroIcon",
  props: {
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 16,
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const getIconCls = () => {
      return "icon-" + props.type;
    };
    const getIconStyle = () => {
      return { fontSize: props.size + "px" };
    };
    const onClick = (e) => {
      emit("click", e);
    };
    return () =>
      h("i", {
        class: "iconfont " + getIconCls(),
        style: getIconStyle(),
        onClick: onClick,
      });
  },
};
</script>

<style lang="less" scoped>
.iconfont {
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  line-height: 1;
  vertical-align: baseline;
  text-transform: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
