/* 版本号 */
import { version } from "../package.json";
import dayjs from "dayjs";
export const VERSION = version; //当前版本
export const UPDATE_TIME = dayjs().locale("zh-cn").format("YYYY-MM-DD"); //版本更新时间
/**
 * 访客统计 id
 * 具体使用文档 https://github.com/jwenjian/visitor-badge
 */
export const VISITOR_BADGE_ID = import.meta.env.VUE_APP_VISITOR_BADGE_ID;

// /* 背景图（可引入网络图或本地静态图） *********  */
// const modules = import.meta.globEager("assets/background/*.*");
// export const BACKGROUNDS = [];
// for (const path in modules) {
//   BACKGROUNDS.push(path);
// }

// 获取assets静态资源
// const getAssetsFile = function (url) {
//   // console.log('url===============', url);
//   // 获取文件夹下所有图片名称
//   let files = import.meta.globEager("../assets/mdcImgs/*.png");
//   let AllPics = Object.values(files).map((v) => v.default);
//   // console.log('AllPics===============', AllPics);
//   let isExist = 0;
//   let imgSrc = "";
//   // 遍历所有图片，判断是否存在该url图片
//   AllPics.forEach((val) => {
//     let url2 = url.substring(0, url.indexOf("."));
//     // console.log('url2===============', url2);
//     if (val.indexOf(url2) !== -1) {
//       isExist += 1;
//     }
//   });
//   // console.log('isExist===============', isExist);
//   if (isExist !== 0) {
//     // 头像存在
//     imgSrc = url;
//   } else {
//     imgSrc = "test.png";
//   }
//   // console.log('imgSrc===============', imgSrc);
//   return new URL(`./mdcImgs/${imgSrc}`, import.meta.url).href;
// };
// export default getAssetsFile;

/**
 * 播放模式
 * LIST_LOOP: 列表循环
 * ORDER: 顺序播放
 * RANDOM: 随机播放
 * ONE_LOOP: 单曲循环
 */
export const PLAY_MODE = {
  LIST_LOOP: 0,
  ORDER: 1,
  RANDOM: 2,
  ONE_LOOP: 3,
};

/**
 * 播放器默认配置
 */
export const ELECTROPLAYER_CONFIG = {
  /**
   * 默认歌单ID （正在播放列表）
   * 默认为云音乐热歌榜 https://music.163.com/#/discover/toplist?id=3778678
   */
  PLAYLIST_ID: 3778678,
  /* 默认播放模式 */
  PLAY_MODE: PLAY_MODE.LIST_LOOP,
  /* 默认音量 */
  VOLUME: 0.8,
};

/* 默认分页数量 */
export const DEFAULT_LIMIT = 30;
