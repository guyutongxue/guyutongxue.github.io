---
title: 个人网站搭建记录
---

当时看到陆子杰同学的[个人博客网站](https://halu.lu/)之后，便想要自己建一个网站。然而事实上我没有能力去租用云主机，抑或是租用域名。直到后来 iOS 10.2.1 的越狱工具 [Saïgon](https://iabem97.github.io/saigon_website) 发布，又联想到网易云音乐大佬[\@阿卡琳](http://music.163.com/#/user/home?id=45441555)的"[歌词滚动姬](https://lrc-maker.github.io/)"和之前在知乎看到的"[记忆转换](https://faded12.github.io/conversion/)"工具，想到 GitHub 或许可以帮助我。

四处搜罗教程后终于大致了解了 Git 是什么。恰好之前出于好奇心安装了 Windows 10 下的 Linux 子系统，方便我后续的操作。安装比较简单，在控制面板启用"适用于Linux的Windows子系统(beta)"功能后，在 cmd 里运行

    bash

并确认，便开始从 Windows 商店下载 Ubuntu。之前由于不可抗力因素导致一直无法下载（最后还是直接拦截网络请求发了一个假的本地包），但是后来就好了\...\...

等待 Linux 安装并设置好之后，安装 Git。

    # apt install git

我选择直接在 `~` 路径下新建文件夹 PersonalBlog ，并初始化成一个 Git 仓库。

    $ mkdir PersonalBlog
    $ cd PersonalBlog
    $ git init

顺便设置用户名、电子邮件和默认 pull 方式。

    $ git config --global user.name guyutongxue
    $ git config --global user.email guyutongxue@sina.com
    $ git config --global pull.default simple

接下来在 [GitHub](https://www.github.com/) 上注册账号 "Guyutongxue"。然后按照教程所说生成 SSH-RSA 密钥并添加到账号。其实我后来发现这没有必要，因为之后我都用 HTTPS 来传输了。

    # ssh-keygen -t RSA -C guyutongxue@sina.com
    # cat ~/.ssh/id_rsa.pub

在 GitHub 上新建一个 Repo ,直接命名为 `guyutongxue.github.io`，勾选初始化 `README.md` 。最后在设置页打开 GitHub Pages，就可以访问了，不过这时还是默认打开 `README.md` 的格式化页面。

这时候需要在本地关联远程库，把 GitHub 上的内容 `pull` 到本地。

    $ git remote add origin git@github.com:Guyutongxue/guyutongxue.github.io.git
    $ git pull origin master

最后我用记事本在 Windows 下写了个简单的 `index.html` ，`cp` 到 Git 仓库。最后在本地提交，`push` 到 GitHub 上即可。此时打开网页，便能自动加载 `index.html` 了。

    $ git commit -m "first commit"
    $ git push origin master

虽然只能使用静态页面，不过已经很知足了。

------------------------------------------------------------------------

谷雨同学 更新于 2017/11/04
