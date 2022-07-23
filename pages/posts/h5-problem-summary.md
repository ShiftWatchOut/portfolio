---
title: H5 开发偶遇的部分问题总结
date: 2022/6/1
tag: 前端
description: 主要是来自iOS的一些问题
author: ShiftWatchOut
---

# H5 开发偶遇的部分问题总结

### 微信分享链接与实际链接不一致

问题描述：**iOS 端微信**从聊天框中任意链接（把它叫做“A”）点进一个 SPA 应用，如果在浏览过程中，这个 SPA 的路由**发生变化**（新链接叫做“B”），而且这个应用使用的还是 **History** 模式的话，那么通过微信提供的菜单，进行分享给朋友或复制链接，都会是点进去的链接（“A”）。

解决方案：由于我们这是 H5 页面，提供给技术体验不太多的用户浏览的，对于历史记录的需求不大，那么我们切换这个应用的路由时，可以使用 **replace** 而非 push 的方式，原生 JS 可以使用 `window.location.href` / `window.location.replace`，react-router 的 `navigate` 方法可以传参设置 `{ replace: true }`

参考链接：[ios 微信浏览器分享页面 url 一直为入口地址](https://developers.weixin.qq.com/community/develop/doc/000c86e36505a8967189843f151800?ivk_sa=1024320u)

### 微信浏览器强制调整字体大小

问题描述：H5 项目一般会考虑多种屏幕尺寸设备的兼容，为了在不同设备上大致还原设计图，我们的项目使用了 [postcss-px-to-viewport](https://www.npmjs.com/package/postcss-px-to-viewport)，对于字体大小，也是直接采用的设计图上的像素值，然后转化为占屏幕宽度一定比例大小，但是在一些小屏设备上，尤其是 **iOS 端微信** 的浏览器内，可能是经过转化后字体太小了，会打开文本溢出算法强行修改字体大小。

解决方案：在 body 的 CSS 里设置 `text-size-adjust: none;`

参考链接：[text-size-adjust 说明](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-size-adjust)

### Safari 浏览器 transform 元素错位

问题描述：5 月开发的项目在使用了类似下面结构的代码，在苹果 Safari 浏览器中会出现诡异的 Bug，但后续单独拎出来又没有了。这一项只能说给自己做个备忘。

```html
<style>
  .container {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 500px;
    background-color: aquamarine;
  }
  .box {
    height: 300px;
    width: 300px;
  }
  .front {
    background-color: beige;
    z-index: 2;
  }
  .back {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: blueviolet;
    display: none;
  }
  .rotate {
    display: block;
    animation: rotate 2s infinite linear;
  }
  @keyframes rotate {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
</style>
<script>
  window.onload = () => {
    const back = document.querySelector('.back')
    setTimeout(() => {
      back.classList.add('rotate')
    }, 1000)
  }
</script>
<body>
  <div class="container">
    <img
      class="box front"
      src="http://localhost:3000/_next/image?url=%2Fimages%2Fphoto2.jpg&w=1200&q=75"
    />
    <img
      class="box back"
      src="http://localhost:3000/_next/image?url=%2Fimages%2Fphoto.jpg&w=1200&q=75"
    />
  </div>
</body>
```

解决方案：不把 `translate` 和 `rotate` 放到同一个元素的 `transform` 上，在 `.rotate` 的元素外多加一层

### 微信点链接强制使用缓存问题

问题描述：开发完成部署到测试的时候，再从微信聊天框里直接点进去总是没有最新的改动，看起来张小龙的妈妈应该小心点张小龙，这么多问题都是来自微信，库克的妈妈也不遑多让。

解决方案：打开微信右上角菜单，手动刷新
