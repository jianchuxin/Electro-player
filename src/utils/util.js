// 随机洗牌函数
export const randomSortArray = (arr) => {
  const result = arr.slice();
  let n = result.length;
  let random;
  while (0 != n) {
    // random = (Math.random() * n--) >>> 0;
    random = Math.floor(Math.random() * n--);
    [result[n], result[random]] = [result[random], result[n]];
  }
  return result;
};

// 歌词解析函数
/**[mm:ss.SSS] xxxxx\n
 * 转换为 s:xxxxx
 */
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;
export const parseLyric = (lrc) => {
  const lines = lrc.split("\n");
  const lyric = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const timeGroup = timeExp.exec(line);
    // console.log(timeGroup);
    if (!timeGroup) {
      continue;
    }
    const text = line.replace(timeExp, "").trim();
    if (text) {
      lyric.push({
        time:
          (timeGroup[1] * 6e4 + timeGroup[2] * 1e3 + (timeGroup[3] || 0) * 1) /
          1e3,
        text,
      });
    }
  }
  return lyric;
};

// 时间格式化函数
// 秒数 --> mm:ss
export const formatSecond = (seconds) => {
  const minute = Math.floor(seconds / 60);
  const minuteStr = minute < 10 ? "0" + minute : minute + "";
  const second = Math.floor(seconds % 60);
  const secondStr = second < 10 ? "0" + second : second + "";
  return minuteStr + ":" + secondStr;
};

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

export const toHttps = (url) => {
  if (typeof url !== "string") {
    return url;
  }
  return url.replace("http://", "https://");
};
