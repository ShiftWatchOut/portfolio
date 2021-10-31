---
title: Ubuntu 美化
date: 2020/6/25
description: 苹果风格
tag: Ubuntu
author: ShiftWatchOut
---

# ubuntu 美化

> 资源下载：
> 系统主题包下载：[McMojave ](https://www.pling.com/s/Gnome/p/1275087/)
> 果风图标下载：[McMojave-circle](https://www.opendesktop.org/p/1305429/)
> 火狐外观下载：[Firefox Mojave theme](https://github.com/vinceliuice/Mojave-gtk-theme/tree/master/src/firefox)

#### 准备工作

在上面的页面内选择需要的主题进行下载，将系统主题压缩包内主文件夹解压缩至`/usr/share/themes/`，图标压缩包内主文件解压缩至`/usr/share/icons/`内。

为了将解压缩的文件拷入系统目录，需要授予文件管理器root权限。终端输入`sudo nautilus`会打开root版文件管理器，终端键入`ctrl + c`停止。

#### 安装 tweak 工具

```
sudo apt-get update
sudo apt-get install gnome-tweak-tool
sudo apt-get install gnome-shell-extensions
```

打开 tweak ，中文名为“优化”。选择'扩展'-->打开'User themes'选项。选择'窗口'-->'放置'选为左。选择'外观'-->'应用程序'和'图标'选为上面想要安装的主题和图标，整体风格美化完成。

为了更像 Mac OS 一点，还需要把 ubuntu 的 dock 给美化一下。在应用商店搜索 shell 插件：Dash to dock、Hide to bar。在 tweak 的'拓展'里可以进入安装的插件的设置。将 ubuntu 系统的标题栏隐藏起来，将 dock 放到屏幕底部，有应用占满屏幕时隐藏。

#### Firefox 美化

先在火狐浏览器地址栏输入`about:support`，查看配置文件夹，进入目录，直接将主题中的`chrome`文件夹拷入刚刚进入的目录。又在火狐浏览器地址栏输入`about:config`，搜索`toolkit.legacyUserProfileCustomizations.stylesheets`，将其值改为`true`。重启火狐即可。

#### 终端美化

##### Zsh 安装

查看有哪些 shell：
```
cat /etc/shells
```
直接安装：
```
sudo apt-get install -y zsh
```

##### oh-my-zsh 安装

Zsh 是个复杂的工具，[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh) 是一个拓展合集，可以为我们省去许多配置的麻烦。参照 github 里的 oh-my-zsh 文档即可。需要注意的是，`agnoster`这个主题使用了特殊的 [Power Fonts](https://github.com/powerline/fonts)，本机内没有的话三角形会显示不了，需要额外安装并在**终端的设置内切换**