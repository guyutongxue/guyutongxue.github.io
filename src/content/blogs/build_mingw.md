---
title: 搭建你自己的 MinGW
---

## 前言

目前的 MinGW 发行版要么没有更新（官方 MinGW-w64）、要么没有免安装版本（TDM-GCC）、要么缺少 GDB 的 Pretty-Printing（WinLibs）。所以我萌生了手动搭建 MinGW 的想法。

经过长达十多天的探索，终于成功搭建出了完整的 MinGW。现将过程陈述于下。

## 过程

<p style="color:red">我不保证所有人都能按照此说明搭建成功。我只编译了带 GCC 10.2.0 的 MinGW；对于更高版本的 GCC 兼容性未知。</p>

### 基本配置

64 位的 Windows 系统，以及至少 30 GB 空间（这个我不确定，但是越大越好）。（显然，电脑性能越高越好。）

### 获取 MSYS2

因为你需要一个在 Windows 环境下的 Bash 兼容 Shell，所以这里用到的是 MSYS2。

前往[官网](https://www.msys2.org/)下载并安装 MSYS2。将安装位置选择在拥有足够空间的磁盘上。然后，按照官方的说明，在 msys2.exe 中执行软件包更新：

> 使用清华镜像源以获得更快的速度。参考[此处](https://mirrors.tuna.tsinghua.edu.cn/help/msys2/)。

```sh
pacman -Syu # 执行后窗口将退出，此时重新启动 msys2.exe
pacman -Su
```

### 获取依赖包

通过 `pacman` 安装以下软件包：
```sh
pacman -S lndir git subversion tar zip p7zip make patch automake autoconf libtool flex bison gettext gettext-devel wget sshpass texinfo autogen dejagnu
```

### 获取构建脚本

定位到家目录，并下载主角 `mingw-builds` [脚本](https://github.com/niXman/mingw-builds)。这个是 MinGW-w64 官方维护者 niXman 所写的：
```sh
cd
git clone https://github.com/niXman/mingw-builds.git -b develop
```
注意选用 `develop` 分支而非 `master`。

<p style="color:red">我使用的版本为 <code>0f20ed4</code>，不保证将来更新的版本完全符合下面的流程。</p>

你可以前往 `mingw-builds/library/config.sh`，将变量 `MINGW_W64_PKG_STRING` 改成你的名字——这样编译出来的 GCC 版本中将会留下你的名字！

### 开整！

回到 `mingw-builds` 目录，然后开整：
```sh
cd ~/mingw-builds
# 64 位
./build --mode=gcc-10.2.0 --arch=x86_64 --exceptions=seh --threads=posix --enable-languages=c,c++ --jobs=6 --cflags='-Wno-format'
# 32 位
./build --mode=gcc-10.2.0 --arch=i686 --exceptions=dwarf --threads=win32 --enable-languages=c,c++ --jobs=6 --cflags='-Wno-format'
```
其中它们的含义是：

| 参数                         | 说明                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| `--mode=gcc-<version>`       | 版本：搭建哪个版本的 GCC                                                                |
| `--arch=<arch>`              | 目标架构：`x86_64` （64 位）或 `i686` （32 位）。                                       |
| `--exceptions=<except>`      | 异常处理模型：`seh` 或 `dwarf` 或 `sjlj`。通行的做法是 64 位用 `seh`，32 位用 `dwarf`。 |
| `--threads=<thread>`         | 多线程模型：`posix` 或 `win32`。通行的做法是用 `posix`。                                |
| `--enable-languages=<langs>` | 生成哪些语言的编译器：从 `ada,c,c++,fortran,objc,obj-c++` 中选择若干。                  |
| `--jobs=<n>`                 | 设置 make 时多核并行数。                                                                |
| `--cflags=<flags>`           | 设置编译 C 时的参数：我在这里害惨了，如果不加 `-Wno-format` 会在编译 GCC 时出现错误。   |

还有这些常用参数：

| 参数                 | 说明                                |
| -------------------- | ----------------------------------- |
| `--buildroot=<path>` | 设置构建路径。默认是在 `~`。        |
| `--bootstrap`        | 编译 GCC 时自举。                   |
| `--fetch-only`       | 只下载解压源代码，不构建。          |
| `--bin-compress`     | 将编译完成的 MinGW 自动打成压缩包。 |
| `--help`             | 查看全部参数的含义。                |

这个脚本甚至还提供了自动上传至 SourceForge 的功能，这里没有需求不再提及。

整个编译流程（不包括下载）大约需要数个小时的时间，取决于你的计算机性能。

> 如果下载出现问题，尝试切换网络环境。若手动下载，则在 `MARKERS` 文件夹内添加标记。  
> 如果编译出现问题，我没有办法。尝试重新编译时，需要先重新配置。删除所有 `config.cache` 和 `_configure.marker`。

### 完成

编译完成后，`$HOME/mingw-gcc-10.2.0/` 下面的 `mingw32` 和 `mingw64` 可供你享用了。
