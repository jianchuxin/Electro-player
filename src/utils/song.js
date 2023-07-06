import { toHttps } from "./util";
export class Song {
  constructor({ id, name, singer, album, image, duration, url }) {
    this.id = id;
    this.name = name;
    this.singer = singer;
    this.album = album;
    this.image = image;
    this.duration = duration;
    this.url = url;
  }
}

const getSingers = (singers) => {
  const nameList = singers.map((item) => item.name);
  return nameList.reduce((acc, item) => {
    return acc + "/" + item;
  });
};

const createSong = (music) => {
  const album = music.al || music.album || {};
  const duration = music.dt || music.duration;
  return new Song({
    id: music.id,
    name: music.name,
    singer: getSingers(music.ar || music.artists),
    album: album.name,
    image: toHttps(album.picUrl) || null,
    duration: duration / 1000,
    url: `https://music.163.com/song/media/outer/url?id=${music.id}.mp3 `,
  });
};

// 将获取的歌曲列表response提取关键信息，转化为songs对象数组
export const formatSongs = (list) => {
  const Songs = [];
  list.forEach((item) => {
    const musicData = item;
    if (musicData.id) {
      Songs.push(createSong(musicData));
    }
  });
  return Songs;
};
