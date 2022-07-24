---
title: adb fastboot 命令备忘
date: 2022/7/24
tag: Ubuntu
description: 安卓刷机命令记录
author: ShiftWatchOut
---

# adb fastboot 命令备忘

坏起来了，家人们，今天我忘了自己刷入了 TWRP 和 Root 权限之后的 Redmi 9A 不能升级系统，下完之后我就点了重启，再开机就进不了系统。经过这件事，我们可以知道，只能在中午刷机，因为早晚会变砖。今天就记一下命令，免得下次变砖又要百度半天。

### 1. adb 命令

可以自行下载 [platform-tools](https://developer.android.google.cn/studio/releases/platform-tools) ，里面同时包含了 fastboot 和 adb，进入到 exe 的对应文件夹执行以下命令如果也可，只是需要指明路径。你已经安装了 Android Studio 可以直接在任意位置使用以下命令。

adb 可以在设备正常开机和 recovery 模式下使用，所以，即使系统内没有授权调试，不开机，也直接可以用它来搞点事情。

| **命令**                | **描述**                                |
| ----------------------- | --------------------------------------- |
| `adb version`           | 查看所使用的 adb 版本                   |
| `adb devices`           | 查看所有已连接的可调试设备              |
| `adb reboot bootloader` | 重启到 fastboot 模式                    |
| `adb reboot recovery`   | 重启到 recovery 模式                    |
| `adb shell`             | 进入所连接的安卓设备的 Linux shell 环境 |
| `adb shell reboot -p`   | 通过 adb 强行关机（感觉用处不大         |
| `adb help`              | 查看上述命令详细说明                    |

### 2. fastboot 命令

fastboot 只能在 fastboot 模式下使用，嗯，毫不意外。

| **命令**                           | **描述**                               |
| ---------------------------------- | -------------------------------------- |
| `fastboot version`                 | 查看所使用的 fastboot 版本             |
| `fastboot devices`                 | 查看所有已连接的在 fastboot 模式的设备 |
| `fastboot reboot`                  | 正常重启开机                           |
| `fastboot reboot bootloader`       | 依然重启到 fastboot 模式               |
| `fastboot flash boot recovery.img` | 刷入指定镜像                           |
| `fastboot help`                    | 查看上述命令详细说明                   |

可惜的是，通过 MiFlash 刷回原版 MIUI 后 Root 权限没有了，虽然之前刷上之后，并没有体会到现在 Root 后的低配手机有多少适合我这种小白的玩法，但这个东西，可以不用，但不能没有啊。毕竟 MIUI，啊，也是一个我自己用习惯了的系统，只能希望工程师们能做得更好吧。
