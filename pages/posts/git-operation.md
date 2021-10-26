---
title: git 操作
date: 2020/4/12
description: 个人常用 git 操作备忘，反正 Linux 和 git 都来自 Linus 放在同一个 tag 下也合情合理.
tag: Ubuntu
author: ShiftWatchOut
---
# git 操作

## 初始化
直接使用 `git init`，一路 yes 下来，把当前文件夹变成一个新的代码仓库，无需联网也可以完成版本控制的功能。

## git 配置
为了在互联网上被唯一地识别，我们需要设置 git 的用户名和邮箱，终端输入：

```
$ git config --global user.name "名字"
$ git config --global user.email example@example.com
```
设置好后可以通过 `git config --list` 查看信息。

## ssh key 生成
```
$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

新的 ssh 公密钥会生成到用户根目录的 .ssh/ 文件夹下，默认文件名会是id_rsa、id_rsa.pub，查看并复制 *.pub 文件的内容。

ssh-add ~/.ssh/id_rsa 将 ssh 密钥添加到 ssh-agent

## Github 远端设置
```
Settings > SSH and GPG keys > New SSH key
```

在 Key 的输入框中粘贴 *.pub 文件里的所有内容，然后保存。可以在多个设备上生成多个独立的 ssh key 再到 GitHub New 多个远端 ssh key。

新建仓库，复制仓库页的 git ssh 链接，返回到终端，设置 本地仓库的远端源：

```
$ git remote add origin git@github.com:githubusername/repo-name.git   #上面复制的 git 链接
$ git push -u origin master
$ git pull origin master
```

## git 拉取方式

git 默认 pull 方式为 merge，拉取时会产生分支合并，可以加上 `-r` 参数使用 rebase 的方式拉取更新

```
$ git pull -r
```

## 设置 git

通过编辑器打开 git 设置，文件位置通常是 ~/.gitconfig。如果在安装时没有指定编辑器，默认打开配置/进行rebase时的编辑器会是 vim，可以通过设置 core.editor 属性指定其他编辑器

```
$ git config --global -e
```

vscode 是一个很方便的编辑器，编辑器本身再加上里面丰富强大的插件，进行版本管理很舒服。但 Windows 上的 VSC 似乎有些问题，修改了配置并保存后，会有报错，如果要进行保存的修改，还是用 vim 吧