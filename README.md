# vue3 基于网易云 api 实现网页播放器

### 项目介绍

**Electro Player**

> 一款基于网易云 api 构建的在线音乐播放器，具有音乐播放、排行榜、歌曲搜索、我的歌单、历史歌单、查看评论、通过 uid 简单登录等功能，适用于网页端和移动端（简单适配）

**技术栈**

- vue3
- vite 脚手架
- vue-router 路由
- pinia 状态管理
- ES6 js
- less（css 预处理器）
- axios（网络请求）

### 页面结构

首先弄懂页面的结构，整体页面如下
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f3c7652127748c0b4b5acc7c179466b~tplv-k3u1fbpfcp-watermark.image?)
再看完源码中的路由结构后整理如下：

路由结构

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6de2f61b8183432a9d887059df247b81~tplv-k3u1fbpfcp-watermark.image?)

一级路由：

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c311432a63a4e1fbb7c8739e649bd2e~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="50%" />

二级路由：

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d22d676021a444cb03a2308b430910d~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="50%" />

组件结构

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08a9eaac5fb9414298ef8af274c04d9d~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="50%" />

### 实现过程

#### 基础配置

1. 配置路径别名

   参考文章[路径别名--Vue 项目初始配置 alias - 掘金 (juejin.cn)](https://juejin.cn/spost/7240765897769304123)

2. 配置基础样式

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27bbfb2c83254bf18bcf44e5365acd17~tplv-k3u1fbpfcp-watermark.image?)
reset.less: 将默认样式清除
var.less: 定义本项目采用的字体大小、颜色等变量
mixin.less: 定义混合样式，如 flex 布局居中等
index.less: 主样式文件
采用了 less 替代 css，相对来说，功能更加丰富，方便了许多，具体表现在可以定义变量、样式嵌套、混合等。

如下面的例子：

```less
// 显示省略号
.no-wrap() {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.flex-center(@direction: row) {
  display: flex;
  flex-direction: @direction;
  justify-content: center;
  align-items: center;
}
```

定义了两个 mixins，不带参数和带参数都可，这样就可以将常见的样式方便应用在其他定义上。

接着， 在 vite 中配置 less 的全局变量，即 var.less 和 mixin.less 中的变量（这样我们在其他文件中使用时不需要手动导入）

```js
export default defineConfig({
  ...,
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/styles/var.less";
                         @import "@/styles/mixin.less";`,
      },
    },
  },
});
```

#### api 接口实现

首先使用 axios 封装网易云 api 接口，设置 baseURL 和 timeout，其中 baseURL 为 api 的 node 服务器地址，本地开发采用 http://localhost:3000, 在项目部署到网上后可以替换为部署的网址。

接着，新建一个 apis 文件夹，用于定义获取各类信息的接口函数，我将本项目的接口函数分为了三类。  
第一类为 musiclist，包括获取歌单列表、歌曲详情、音乐播放地址、音乐是否可用、歌词、评论、搜索结果等。  
第二类为 toplist，包括获取排行榜歌单、推荐歌单等。  
第三类为 userinfo，包括获取用户歌单信息（包括用户头像）等。

例如获取歌曲详情接口函数

```js
// 获取歌曲详情
export const getSongDetail = (ids) => {
  return request.get("/song/detail", {
    params: {
      ids,
    },
  });
};
```

#### stores 实现

对于歌曲的播放、加入、删除等，毫无疑问我们需要在 store 中完成，我使用 pinia 设置了两个 store。

第一个为 playlist  
保存播放列表的歌曲数据，并用于增删减改歌曲

```js
export const usePlayListStore = defineStore("playList", () => {
  const audioEle = ref(null); // 引用audio元素
  const mode = ref(1); // 播放模式，默认顺序播放
  const playList = ref([]); // 正在播放列表
  const orderList = ref([]); // 顺序播放列表

  const isPlaying = ref(false); // 是否正在播放
  const currentIndex = ref(-1); // 当前音乐索引

  const currentMusic = computed(() => {
    return playList.value[currentIndex.value] || {};
  });
```

第二个为 user  
用于保存用户的 uid、偏好音量、历史播放歌单等，并借助 pinia 持久化存储插件`pinia-plugin-persistedstate`，将数据持久保存在 loaclStorage 中。

```js
// 正在播放列表
export const useUserStore = defineStore(
  "user",
  () => {
    const uid = ref("");
    const historyList = ref([]);
    const volume = ref(ELECTROPLAYER_CONFIG.VOLUME);
    const HISTORYLIST_MAX_LENGTH = 200;
```

#### 全局指令

除了 Vue 内置的一系列指令 (比如  `v-model`  或  `v-show`) 之外，Vue 还允许你注册自定义的指令 (Custom Directives)。由于本项目中歌单的封面图片较多，所以我顶一个了一个全局指令，用于图片的懒加载，这也是一个比较常用的指令。

先在 directives 文件夹中定义一个插件，内容为懒加载指令，再到 main.js 中使用该插件，自动注册全局指令。

```js
// 定义图片懒加载插件
import { useIntersectionObserver } from "@vueuse/core";

export const lazyPlugin = {
  install(app) {
    // 定义全局指令
    app.directive("img-lazy", {
      mounted(el, binding) {
        const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
          if (isIntersecting) {
            // 图片进入视口区域
            el.src = binding.value;
            stop();
          }
        });
      },
    });
  },
};
```

```js
import { lazyPlugin } from "./directives";
app.use(lazyPlugin);
```

当然，也可以直接再 main.js 中直接注册全局指令，例如我注册一个指令，使目标元素自动聚焦，

```js
app.directive("focus", {
  mounted: (el) => {
    el.focus();
  },
});
```

#### 组合式函数

vue3 中可以使用组合式函数替代 vue2 中的 mixins 选项，实现代码的复用功能。
参考：[组合式函数 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/reusability/composables.html#comparisons-with-other-techniques)

比如本项目中，经常需要等待加载和关闭加载（加载动画），那这个操作就可以提出为一个组合式函数。实现代码如下：

```js
// loading 状态
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
```

在其他地方调用该函数

```js
import { useLoading } from "@/composables/loading"; // 使用组合式函数代替mixins
const { isLoading, hideLoad } = useLoading();
```

#### 工具函数

我在文件夹 utils 中，定义了一些工具函数，避免在组件中代码过多，这些函数也分为两类。

第一类是 song 歌曲的处理函数，我们通过 api 获取的歌单数据较为复杂，需要处理抽取有用信息，我定义了一个 Song 类，属性为一首歌的 id、名称、歌手等。工具函数需要将 api 获取的原始歌单 result 转换为 Song 数组。formatSongs、createSong 等等。

第二类是比较杂的工具函数，  
有时间格式化函数 formatSecond，将歌曲的秒数转化为分钟加秒数；

有将 http 链接转换为 https 链接的函数 toHttps；

有随机洗牌函数 randomSortArray 将歌曲列表顺序随机打乱，实现随机播放功能；

有歌词解析函数 praseLyric 将获取的歌词数组 转换为 时间 + 歌词 的对象数组；

有 silencePromise，修复点击播放后快速点击暂停导致的错误：  
“Uncaught (in promise) DOMException: The play() request was interrupted by a call to pause().”；

#### 页面实现

页面实现的过程较为复杂，因为组件实在太多了，我是从大到小实现的。从主要页面着手，阅读源码，遇到其中一些子组件例如基础图标组件、基础 toast 组件，我一般会先跳过或者用简单功能代替，例如用 alert 代替 toast 组件。但是总结起来，如果按照这个顺序，会显得没有条理，所以我将页面的实现、次要组件的实现、基础组件的实现分开叙述。

##### header 组件

实现效果，包括标题和登录后的用户头像及名称等信息。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93d8257674344540b9407869489ea434~tplv-k3u1fbpfcp-watermark.image?)

用户的头像设置为一个 router-link
渲染到页面上时是 a 元素，但是可以让其渲染为其他元素如 dt，具体做法如下：
参考：[从 Vue2 迁移 | Vue Router (vuejs.org)](https://router.vuejs.org/zh/guide/migration/#%E5%88%A0%E9%99%A4-router-link-%E4%B8%AD%E7%9A%84-event-%E5%92%8C-tag-%E5%B1%9E%E6%80%A7)

```html
<!-- 用户信息--头像和登录 -->
<dl class="user">
  <template v-if="isLoggedin">
    <RouterLink to="/music/userlist" custom v-slot="{ navigate }">
      <dt @click="navigate" class="user-info" role="link">
        <img :src="avatarUrl" class="avatar" alt="img" />
        <span class="user-name">{{ userInfo.nickname }}</span>
      </dt>
    </RouterLink>
    <dd class="user-btn" @click="opendialog('logout')">退出</dd>
  </template>
  <dd v-else class="user-btn" @click="opendialog('login')">登录</dd>
</dl>
```

第二个是创建一个“炫酷”的标题，文字上的背景会不断移动。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f470b110add54399b2995ccca096911d~tplv-k3u1fbpfcp-watermark.image?)
首先将标题 h 文字颜色设置为透明，通过 background 设置背景图片，并将 background-clip 设置为 text，背景只出现在文字后。  
接着，设置一个背景移动动画，通过 background-position 改变背景的位置。

##### music 组件（一级路由）

为一级路由的页面，也是播放器的主体部分。
包含了导航栏、播放列表、歌词组件，以及下方的播放栏，功能较多。
我的实现顺序是：  
实现导航栏 music-btn...  
实现播放列表 playlist...  
实现播放栏和播放功能...  
实现歌词组件...

该组件关键实现了歌曲的播放功能和播放栏的功能，具体实现在后面介绍。

##### views 组件的实现（二级路由）

1. playList

作为二级路由的页面，并且为首页的重定向页面，需要在初始化时读取 store 中的 playList 数据。
借助通用的 music-list 组件，listType 指定为 duration，显示歌曲的时长。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9f6978637e245d490d02a89015960f0~tplv-k3u1fbpfcp-watermark.image?)

2. search

热搜单词 + 搜索框 + 搜索结果列表

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71c558c6bb80470ea526f293953e8e0a~tplv-k3u1fbpfcp-watermark.image?)

根据官方提供的 api 接口，根据输入的单词，获取搜索结果，再经过处理函数得到歌曲列表。

此处的 api 描述如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f072ca723784239831d91ae49387573~tplv-k3u1fbpfcp-watermark.image?)

limit 指定返回的数量，默认为 30；offset 为偏移数量，设置为 page \* limit，page 为页数。

当 music-list 触发 **滚动加载**信号 pullUpLoad（下文 musiclist 会讲）时，page 数目加 1，获取下一页（30 首）歌曲。

3. historyList

类似于 playList，不过用于保存用户听过的歌曲，这里不再展开。注意歌曲是可以播放的（vip 会员专属无法播放），刷新网页后依然存在。

4. comment

歌曲的评论页面，评论分为两类，一类是热门评论，另一类是最新评论。

热门评论

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/691127854f6842f99b1d4dee79982981~tplv-k3u1fbpfcp-watermark.image?)

最新评论

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/660ccc6d573e45588c134a17d4d039b1~tplv-k3u1fbpfcp-watermark.image?)

评论标题采用 sticky**粘性导航**，

评论项的实现：
显示用户的头像、名称，发送时间和 ip 属地，评论内容，获得赞数，他人回复的评论（最多一条），
界面参考了 qq 音乐网页版底下的评论界面。

5. topList

这里的界面与歌曲显示列表的界面大有不同，因为内容是歌单的排行榜，以及一些热门歌单推荐。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3162e566e02f456a95756003bca8b16f~tplv-k3u1fbpfcp-watermark.image?)

用户鼠标移入每个歌单图片后，点击后跳转到歌单详情 detail 页面。

hover 后突变稍微放大，mask，出现一个播放图标（采用背景图片导入），

固定大小的图片在高分辨率的屏幕上会显示模糊，所以我准备了两个图片，一个 x70，一个 140，使用以下 css 让浏览器自己选择合适大小的图片。

```css
background-image: -webkit-image-set(
  url("assets/img/icon_play.png") 1x,
  url("assets/img/icon_play100.png") 2x
);
```

显示效果如下
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/298628f90d7740aebf34c3140f057767~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="30%" />

每个歌单都有其唯一的 id，根据 id 调用接口获取对应的歌曲列表。

6. detail

显然，这个页面用于显示选中歌单中的歌曲，我们需要根据歌单的 id 获取数据，那么该从何获得 id 呢？  
可以从路由的 params 参数中获取，看下列路由：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8105aa39fac41f0beff3fa8c6608c12~tplv-k3u1fbpfcp-watermark.image?)
后面的数字串即为歌单的 id。

调用 vue 中的 useRoute，获取当前路由参数中的 id 即可。

之后调用获取歌单详情接口获取歌曲列表显示。

7. userList

这个页面的内容是显示用户创建的歌单卡片，包括自建和收藏的歌单。原本打算和 topList 一样呈现，但是后面看到一个 3d 的轮播图，觉得挺好的，就用上去了。经常看到各种网站上好看的效果，收藏起来用起来。

在 vue2 中，可以使用直接引入 vue carousel 3d 这个包 [Vue Carousel 3D - 3D Carousel for Vue.js (wlada.github.io)](https://wlada.github.io/vue-carousel-3d/)

里面有现成的组件：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8377624045943629d2781312a254485~tplv-k3u1fbpfcp-watermark.image?)

但是这个包没有更新到 vue3，我找到了一个别人更新的，地址在：[vue3-carousel-3d - npm (npmjs.com)](https://www.npmjs.com/package/vue3-carousel-3d)

组件的使用方法：
[vue.js - 3D 轮播插件 vue-carousel-3d 非官方最全文档 - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000039120226)

实现效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b22284c29634e37802eb33fc9b0ba0c~tplv-k3u1fbpfcp-watermark.image?)

##### 次要组件实现

1. musicbtn 导航栏

   实现较为简单，就是一排按钮，导航到不同的二级路由，主要后面需要考虑页面响应式，借助@media 媒体查询，调整按钮的宽度，手机上则显示两排按钮。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4f13a584f02434da71bfcb63a0ab0f9~tplv-k3u1fbpfcp-watermark.image?)

2. musiclist 通用歌曲列表

   ❗ 重点来了：要实现一个歌曲播放列表组件，需要将该组件重复利用，因为路由中的正在播放页面、搜索页面、歌单详情页面等都需要用到该组件。因此，先要实现一个 music-list 组件，作为一个通用的组件，根据获取的歌曲列表显示在屏幕上

   这个组件可以接受一个处理好的歌单 playList，并使用 v-for 将歌曲显示为一个列表，

   同时希望列表的种类有多种可选，有的显示歌曲时长，有点显示歌曲所在专辑，还有的列表下拉可以继续加载内容，如搜索歌曲列表。

   因此组件通过 props 接受两个参数 list 和 listType，

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a1652b766974c5c844434cd592e7cc0~tplv-k3u1fbpfcp-watermark.image?)

既然谈到了 props，那就不得不提 emit 了，当用户点击歌曲项的播放或删除按钮时，组件应该发出对应 emit 信号到父组件，父组件再进行相应的操作。所以，我定义了三个信号，select、del、pullUpLoad，分别用于选择歌曲播放、删除歌曲、加载内容。pullUpLoad 的触发涉及到滚动加载，一个很常用的功能，具体可以看我这篇文章：[vue3 实现滚动加载 - 掘金 (juejin.cn)](https://juejin.cn/post/7244809939838500920)

最后，注意到部分列表的底部（例如正在播放列表）有一个清空列表的按钮，我选择用 slot 来实现，如果需要这个按钮，则将 button 元素传入到默认 slot 中。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e844b2c7d05412b8a53f71e81e4d1d8~tplv-k3u1fbpfcp-watermark.image?)
注意好 props 和 emit，那组件的功能就差不多清楚了，主要是 css 方面比较折磨 😂

3. volume

   音量调节条，建立在基础组件 progress 进度条之上，只不过前面再添加一个音量图标，有点击静音的功能。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d700c9a9d614cf494f948d1c676f804~tplv-k3u1fbpfcp-watermark.image?)

4. lyric

   刚开始看到歌词滚动组件的时候，觉得挺复杂的，但是后面着手做的时候，看懂之后就觉得还行，不是很复杂。道理和滑动列表差不多。
   简单来讲，外面有一个固定高度的盒子，内部为一个歌词构成的列表，高度超出了外盒子

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63f7fbb5b78e4a54a5f9b5b8692a94c8~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="50%" />

刚开始时或者用户缩放界面时，需要先将内部盒子下移到外部盒子的中央，使第一句歌词居中。此后，每播放一句歌词，即 lyricIndex 加一，内部盒子上移一句歌词的高度，使得新的歌词居中。

那么如何上移和下移呢？使用 translateY 就行了。

外部盒子在上下一部分区域添加蒙版层图像，使用 mask-image 属性，添加 linear-gradient 渐变。

##### 基础组件实现

1. icon  
    以前做项目的时候都是直接使用阿里矢量库 iconfont 的图标，这样做有一个不好的地方就是要为图标设置样式时比较麻烦，例如设置大小的时候需要添加一个类，然后再写 css。假如我实现了一个 icon 组件，通过 props 传入图标名称和大小不就方便多了吗。

   引用 vue 文档中的一句话：在绝大多数情况下，Vue 推荐使用模板语法来创建应用。然而在某些使用场景下，我们真的需要用到 JavaScript 完全的编程能力。这时**渲染函数**就派上用场了。
   在组合式 api 中的使用方法如下：

   ```js
   import { ref, h } from "vue";
   export default {
     props: {
       /* ... */
     },
     setup(props) {
       const count = ref(1);
       // 返回渲染函数
       return () => h("div", props.msg + count.value);
     },
   };
   ```

   所以，我这里采用了 vue3 的渲染函数，简写为 h（）的函数。  
   组件接受两个 props：type 图标类型和 size 图标大小  
   使用 h 函数渲染一个 i 标签，class 包含 iconfont 和 icon-type，同时设置 style 中的 font-size 为 size。

   icon 组件在其他组件中的使用：

   ```html
   <ElectroIcon type="github" :size="14" />
   ```

2. loading  
   加载组件，在获取数据时显示，优化用户的体验感，特别是在网络较慢时。不同于本地，服务器部署在云端后慢的一批。  
   首先，去找一个转圈圈的样式，可以直接在 codepen 中找，如下所示：  
   得到的是一个 svg 图片，添加一个 wrapper 标签，用于控制图片出现位置
   <p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ce267f9d4a7448baa1c7d9a92adc041~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

   实现效果如下
   <p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc14655e1e774bc0bb408d6b304bbeca~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

3. progress  
   进度条组件，模仿 qq 音乐网页版的播放进度条，先看它是如何实现的。  
   ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6429b62cc1045d3941c4ac4a702a552~tplv-k3u1fbpfcp-watermark.image?)

   可以看到，播放进度条有一个移动点，最浅色的不同条，偏浅色的缓冲条，亮色的播放条，结构非常清晰。使用检查查看其结构如下：

   ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e64697500934975aaf4ce0e64f7a91e~tplv-k3u1fbpfcp-watermark.image?)

   因此具体实现就是这样，不过小圆点可以直接用 css 实现，不需要用图标。

   脚本则比较复杂，涉及到了进度条的跳转和拖拽，还要解决进度条与歌曲播放进度对应的问题。这就涉及到歌曲的播放，audio 元素有一个 event 为 ontimeupdate，即歌曲的时间发生变化。这个事件非常关键。随歌曲播放时间变化，当前的播放进度条需要改变，歌词也要进行移动。具体在下文的播放功能中介绍。

   这里说明一下进度条的跳转与拖拽问题，下面分别进行实现。

a. 进度条的跳转

即当用户点击进度条的某个位置时，进度条就移动到这个位置。  
 给进度条最外层的元素添加一个 click 的回调函数 barClick

```html
<div ref="electroProgress" class="electroProgress" @click="barClick">···</div>
```

实现 barClick 函数

```js
// 鼠标点击事件
const barClick = (e) => {
  const rect = electroProgressPlay.value.getBoundingClientRect();
  const offsetWidth = Math.min(
    electroProgress.value.clientWidth - dotWidth,
    Math.max(0, e.clientX - rect.left)
  );
  moveSlide(offsetWidth);
  commitPercent(true);
};
```

b. 实现进度条的拖拽

用户首先按住小圆点（mousedown），在屏幕上拖动（mousemove，手机上为 touchmove），最后在某个位置松开（mouseup）。由于用户不只是在进度条上拖动，而是在整个屏幕上拖动，所以不能简单的在进度条上添加事件回调函数，而要在整个文档上使用 document.addEventListener 添加回调函数。

在小圆点上添加 mousedown，实现回调函数 bardown

```html
<template>
  <div ref="electroProgress" class="electroProgress" @click="barClick">
    <div class="electroProgress-inner">
      <div ref="electroProgressLoad" class="electroProgress-load"></div>
      <div ref="electroProgressPlay" class="electroProgress-play">
        <div class="electroProgress-dot" @mousedown="barDown"></div>
      </div>
    </div>
  </div>
</template>
```

bardown 记录此时的坐标

```js
// 鼠标按下圆圈，记录下此时的坐标
const barDown = (e) => {
  move.value.isDragging = true;
  move.value.startX = e.clientX || e.touches[0].pageX;
  move.value.left = electroProgressPlay.value.clientWidth;
};
```

组件 onMounted 时，绑定 mousemove 和 mouseup 等事件，实现 barMove 和 barUp 函数。  
onUnmounted 时解绑

```js
// 添加绑定事件
const bindEvents = () => {
  document.addEventListener("mousemove", barMove);
  document.addEventListener("mouseup", barUp);

  document.addEventListener("touchmove", barMove);
  document.addEventListener("touchend", barUp);
};
```

barMove 鼠标拖动时，改变进度条（注意拖动过程中歌曲还在正常播放）

```js
// 鼠标处于拖动中，
const barMove = (e) => {
  if (!move.value.isDragging) {
    return;
  }
  e.preventDefault();
  let endX = e.clientX || e.touches[0].pageX;
  let dist = endX - move.value.startX;
  let offsetWidth = Math.min(
    electroProgress.value.clientWidth - dotWidth,
    Math.max(0, move.value.left + dist)
  );
  moveSlide(offsetWidth);
  commitPercent();
};
```

barUp 鼠标拖动完成，改变歌曲的播放进度

```js
// 鼠标拖动完成，
const barUp = () => {
  if (move.value.isDragging) {
    commitPercent(true);
    move.value.isDragging = false;
  }
};
```

有造轮子那味了 😶‍🌫️

4. toast

造造造！
之前用过 elmentPlus 组件库中的 Elmessage 组件，感觉看上去很舒服，比弹出的 alert 舒服一万倍。  
那么我们如何造出这样的轮子呢？
我们需要实现类似 Elmessage 的效果，像这样调用 ElMessage('this is a message.')，屏幕中上会生成一个简洁的提示：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9620d57fc6104ca6bc047feb23561b05~tplv-k3u1fbpfcp-watermark.image?)

这里同样需要用到 vue3 中的渲染函数 h（），渲染函数既可以使用 div 等标签，也可以直接使用导入的 vue 组件。同时也要用到 render 函数。h（）用于生成虚拟 dom，最终展示到页面需要调用 render，之前在创建自定义 icon 组件的时候不用 render，是因为可以在 setup（）函数中返回 h（）函数。而这里，我们需要在 js 中手动渲染，所以需要用到 render 函数。

首先，新建一个 toast 组件，接受两个 props：message 文本内容和 position 出现位置。
之后再新建一个 index.js 用于渲染该组件，
在 index.js 中，  
定义一个 ToastCreator 类，  
定义一个构建函数，初始化 toast 的 message 和 position；

```js
export class ToastCreator {
  options;
  container;
  constructor(options) {
    this.options = options;
    this.container = document.createElement("div");
  }
```

定义一个显示 toast 方法，如下：  
利用 h（）函数创建虚拟 dom 节点 VNode，同时传入 props，  
使用 render 函数（大概是 vue2 中的函数，不太懂 😶‍🌫️），传入 VNode 和外层容器 container  
将新增 toast 插入为 body 第一个子元素  
自设一个 duration，到时间后调用消除

```js
  present() {
    const electroToast = h(Toast, this.options);
    render(electroToast, this.container);
    document.body.insertBefore(this.container, document.body.firstChild);
    // 到时间消失
    if (defaultOptions.duration) {
      setTimeout(() => {
        this.dismiss(); // 注意回调函数this的问题
      }, defaultOptions.duration);
    }
  }
```

定义一个消除 toast 方法，如下：

```js
  dismiss() {
    document.body.removeChild(this.container);
  }
```

最后，定义一个创建 toast 的函数 showToast，并导出：

```js
export const showToast = ({ message, position }) => {
  const toast = new ToastCreator({
    message,
    position,
  });
  toast.present();
};
```

在其他地方使用 showToast：

```js
import { showToast } from "base/electroToast/index";
....
// 删除事件
const deleteItem = (index) => {
  deleteHistoryMusic(index);
  showToast({ message: "删除成功!" });
};
```

这样一个自定义 toast 组件就做好了，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/606edf79a63f4ee4ac04c420fdc4a371~tplv-k3u1fbpfcp-watermark.image?)

我参考了这篇文章：[Vue3 实现一个自定义 toast（小弹窗） - 掘金 (juejin.cn)](https://juejin.cn/post/7141697183597723679)

5. dialog

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a7d727e0e7544b9ae8a6c2aa0f15534~tplv-k3u1fbpfcp-watermark.image?)

弹窗也是十分常用的基本组件，主要包括基本的信息、确认和关闭按钮。  
增加两个 slot 插槽，一个默认插槽，可以加入输入框等元素；另一个为具名插槽，用于加入额外的按钮。

父组件通过 props 传入需要显示的文本，通过 slot 传入需要显示的元素。

另外，可以在 dialog 组件中定义 show 和 hide 方法，并将两个方法通过 defineExpose 暴露给父组件，父组件可以轻松控制 dialog 的显示与隐藏。

6. noresult

内容为空时显示，

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bec0cc6292344fb9ff4df23e7182541~tplv-k3u1fbpfcp-watermark.image?)

##### 播放功能和工具栏

实现 music.vue 中的播放功能和工具栏中的功能

1. 初始化 audio 元素

音乐播放的核心元素 audio，audio.play() 表示播放， audio.pause()表示暂停

播放时我们需要对其进行一定的监听，定义一个 initAudio 函数。

比如 onplay，当音乐开始播放时，将播放工具栏激活

onprogress，音乐缓冲，使用 audioEle.buffered.end(0) 获取已缓冲时长，其与歌曲总时长 duration 的比值，即为当前的播放进度，可用于控制 progress 组件中的缓冲进度条显示。

ontimeupdate，随音乐播放，歌词和进度条也自动增长

oncanplay，将能播放的音乐加入到历史列表中

onend，音乐播放结束时，根据播放模式，选择重播还是播放下一首  
...

在 music.vue 中 onMounted 中调用 initAudio 以初始化 audio 元素。

2. 工具栏功能实现

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c01177c7df546b09e47dce812cabbb3~tplv-k3u1fbpfcp-watermark.image?)

- 上一首 prev 下一首 next 播放 play/暂停 pause

- 切换播放模式 modeChange，共有四种模式

```js
// 获取播放模式icon
const getModeType = computed(() => {
  return {
    [PLAY_MODE.LIST_LOOP]: "listloop", // 列表循环
    [PLAY_MODE.ORDER]: "order", // 顺序播放
    [PLAY_MODE.RANDOM]: "random", // 随机播放
    [PLAY_MODE.ONE_LOOP]: "oneloop", // 单曲循环
  }[mode.value];
});
```

这里说明一下随机播放， 这里的处理方法是利用洗牌函数将原列表随机打乱顺序，并替换掉原列表。

随机函数如下：循环 n 轮，每次从剩下的全部数中选一个数放在最后的位置，直到放完全部的数。

```js
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
```

- 点击评论图标，打开当前音乐的 comment 页面

- 切换纯净模式 openPure，将歌词组件的 width 调整为 100%，纯享听歌

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a95490a019614b3d8c5f1775295d7d6d~tplv-k3u1fbpfcp-watermark.image?)

- 调节音量大小 volumeChange，点击图标静音等。

最后为了方便用户操作，可以绑定键盘按键，为 document 添加一个 onkeydown 监听，通过 switch(e.key)来执行相应函数。e.key 与键盘的对应关系可以直接查表确定。  
这里采用 ctrl + key 的组合键，即用户在按下 ctrl 键之后，再按某个键才有用，可以通过 e.ctrlKey 判断。

> ctrl + < / > ： 上一首/下一首  
> ctrl + ↑ / ↓ ： 加大音量/减小音量  
> ctrl + space ： 播放 or 暂停

### 项目部署

将网易云 node api 服务器 和 播放器应用都部署在 vercel 上面。

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
