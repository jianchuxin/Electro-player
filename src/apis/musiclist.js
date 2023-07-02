import { DEFAULT_LIMIT } from "@/config";
import request from "@/utils/axios";
import { formatSongs } from "@/utils/song";

// 更根据歌单id获取歌单列表
export const getPlayListById = async (id) => {
  try {
    const res = await request.get("/playlist/detail", {
      params: { id },
    });
    const playList = res.playlist || {};
    const { trackIds, tracks } = playList;
    // 过滤完整歌单
    if (trackIds.length === tracks.length) {
      playList.tracks = formatSongs(playList.tracks);
      // console.log(playList);
    } else {
      // 限制歌单详情最大 500
      const ids = trackIds
        .slice(0, 500)
        .map((v) => v.id)
        .toString();
      const resSongs = await getSongDetail(ids);
      playList.tracks = formatSongs(resSongs.songs);
    }
    return playList;
  } catch (error) {
    throw error(error);
  }
};

// 获取歌曲详情
export const getSongDetail = (ids) => {
  return request.get("/song/detail", {
    params: {
      ids,
    },
  });
};

// 获取音乐是否可用
export const getCheckMusic = (id) => {
  return request.get("/check/music", {
    params: { id },
  });
};

// 获取音乐地址
export const getMusicUrl = (id) => {
  return request.get("/song/url", {
    params: {
      id,
    },
  });
};

// 获取歌曲的歌词
export const getLyric = (id) => {
  return request.get("/lyric", {
    params: {
      id,
    },
  });
};

// 获取音乐评论
export const getComent = (id, page, limit = DEFAULT_LIMIT) => {
  return request.get("/comment/music", {
    params: {
      offset: page * limit,
      limit: limit,
      id,
    },
  });
};

// 热门搜索
export const getSearchHot = () => {
  return request.get("/search/hot");
};

// 搜索歌曲
export const getSearchList = (keywords, page = 0, limit = 30) => {
  return request.get("/search", {
    params: {
      offset: page * limit,
      limit: limit,
      keywords,
    },
  });
};
