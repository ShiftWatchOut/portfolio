---
title: 横屏H5遨游记
date: 2022/10/11
tag: diary, 前端
description: 张小龙雷军你罪大恶极
author: ShiftWatchOut
---

# 横屏H5遨游记

之前适配移动端尺寸的时候使用的是 `postcss-px-to-viewport` 插件，手机浏览器横屏之后，vw 宽度自然就变成长的一边，插件可以设置单位为 `vmin`，始终保持根据短边设置尺寸，这样便于适配设计图。

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

[^1]: [CSS Trick](https://css-tricks.com/snippets/css/orientation-lock/)