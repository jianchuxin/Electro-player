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
  return singers.reduce((acc, item) => {
    return acc + "/" + item.name;
  }, "");
};

const createSong = (music) => {
  const album = music.al || {};
  const duration = music.dt;
  return new Song({
    id: music.id,
    name: music.name,
    singer: getSingers(music.ar),
    album: album.name,
    image: album.picUrl,
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
