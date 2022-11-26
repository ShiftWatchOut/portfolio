---
title: 横屏 H5 遨游记
date: 2022/11/11
tag: diary, 前端
description: 张小龙库克你罪大恶极
author: ShiftWatchOut
---

# 横屏 H5 遨游记

我又来开发 H5 了，我天天都开发 H5 的 ᕕ( ᐛ )ᕗ。

之前适配移动端尺寸的时候使用的是 `postcss-px-to-viewport` 插件，手机浏览器横屏之后，vw 宽度自然就变成长的一边，插件可以设置单位为 `vmin`，始终保持根据短边设置尺寸，这样便于适配横屏的设计图。

### 1. 强制横屏

通过把竖屏 UI 转换为横屏样式，来提醒用户旋转手机，旋转手机后就无需更多的操作。 [^1]

```css
@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {
  html {
    transform: rotate(-90deg);
    transform-origin: left top;
    width: 100vh;
    overflow-x: hidden;
    position: absolute;
    top: 100%;
    left: 0;
  }
}
```

### 2. Safari 部分不渲染问题

九次 H5 开发十次都有你，而且还都是奇奇怪怪的渲染问题。预期目标是渲染如下的第一个图片那样的页面，结果却有可能出现第二张照片那样部分元素离奇消失的情况。猜得没错，在安卓系统上绝不会出现这种问题，但是偏偏在 iOS 的 webview 里，它就出现了。这波苹果完全没有责任，我是不信的。

![correct](/images/iphone_render_correct.png)

👆好的 ------- 坏的👇

![error](/images/iphone_render_error.jpg)

不过问题既然出现了，还是不能放着不管。通过反复的尝试，这个 bug 的复现方式是需要在远程请求得到的列表页中往下滑动，点进一项，然后返回列表，此时屏幕上半部分会呈现出部分内容没有渲染的状态，背景色都和下半部分一致，滑动和点击都会让这个列表页面恢复正常（这就是排屏幕的原因，别急着召唤饶老师🥲）。

复现方式和恢复正常的方式都找到了，改起来也不会太难，既然手动滑动可以让错误渲染恢复正常，那我就在返回到列表的时候用代码进行滑动。

### 3. Safari 不安全操作问题

iPhone 就是个垃圾。

经过测试同事的测试之后，项目已经上线，但测试同事的手机 iOS 版本都比较新，公司内其他同事想用的时候，爆出一个 bug 。由于没有拿到实机，没有办法查看报错，但经过其他方式排查，包括查看所引用的第三方库的 issue [^2]，猜测可能是旧版本 Safari 的内容安全策略（CSP）限制导致无法生成顺利图片。

于是在模拟器中，打开 iOS 13 的系统，在 Safari 中尝试复现，确实得到了如下的错误提示。

![secure_error](/images/secure_error.png)

是很经典的 `toDataURL` 会抛出的错误，通常是对应 canvas 上绘制的图片跨域导致的，但我的代码在开发之前就已经为图片加载设置了 `crossOrigin` 为 `'Anonymous'`。在其他设备里都正常，偏偏在 iOS 13 的浏览器里报错，甚是不解。当然我记录下这个东西肯定是找到上面那个错误的解决方法了，踏麻麻滴，设置跨域没问题，但是对于 Safari 需要把**设置跨域的代码放到设置 `src` 之前**[^3]。试问谁能想到，在其他浏览器里不重要的代码执行前后顺序，在老版本 Safari 里竟然会有不一样的效果，说他是新时代 IE 真不是盖的。

然而就在我满心欢喜想找那个同事用他手机测试一下的时候，却得知他升级了一下，就没有问题了。我心想：升级了 iOS ？那确实应该可以，但总不能让用户都升级吧，可惜现在少了一个可以测试的珍稀样本。结果一问他升级了一下 App 的版本，这就更让人疑惑了，iOS 开发同事跟我说，他们没有打包独立的 webview 进去，Safari 的版本应该是跟着系统走的，而且也没更改什么权限。以我根据上面 issue [^2]的理解，问题应该出在浏览器上，这个 bug 就这样消失得不明不白的，宝贵的下午时光又被苹果手机给浪费了。别人浪费时间在手机上都是自我感觉快乐的，我怎么感觉这么扯蛋呢。

再继续进行 H5 开发，我怀疑这个环节就要变成我的“苹果专属吐槽区”了

[^1]: [CSS Trick](https://css-tricks.com/snippets/css/orientation-lock/)

[^2]: [QRCode issue](https://github.com/soldair/node-qrcode/issues/195)

[^3]: [iPhone 辣鸡](https://chrunlee.cn/article/web-canvas-ios-safari-error.html)