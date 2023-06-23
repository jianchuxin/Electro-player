// 时间格式化函数
// 秒数 --> mm:ss
export function formatSecond(seconds) {
  const minute = Math.floor(seconds / 60);
  const minuteStr = minute < 10 ? "0" + minute : minute + "";
  const second = Math.floor(seconds % 60);
  const secondStr = second < 10 ? "0" + second : second + "";
  return minuteStr + ":" + secondStr;
}

/**
 * https://github.com/videojs/video.js/blob/master/src/js/utils/promise.js
 * Silence a Promise-like object.
 *
 * This is useful for avoiding non-harmful, but potentially confusing "uncaught
 * play promise" rejection error messages.
 *
 * @param  {Object} value
 *         An object that may or may not be `Promise`-like.
 */
export function isPromise(v) {
  return v !== undefined && v !== null && typeof v.then === "function";
}

export function silencePromise(value) {
  if (isPromise(value)) {
    value.then(null, () => {});
  }
}
