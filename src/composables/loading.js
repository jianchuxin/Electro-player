/**
 * loading 状态
 */
import { ref } from "vue";
export const useLoading = () => {
  let timer = null;
  const isLoading = ref(true);

  const hideLoad = () => {
    timer = setTimeout(() => {
      isLoading.value = false;
    }, 200);
  };
  clearTimeout(timer);

  return { isLoading, hideLoad };
};
