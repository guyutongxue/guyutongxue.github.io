<!-- @import "../css/noto-serif-font.css" -->

# 安装 Ubuntu 记录

我的 Win10 在崩溃后整整一个月又无法启动了。这次重装系统我决定在前些日子腾空的新硬盘上安装 Ubuntu ，以备不测之需。
由于 Win10 提供了 WSL ，所以我对实体机 Linux 需求并不很高。而且上次在安装 Ubuntu 时发生了许多意外情况，导致安装失败，这次将成功的方法记录下来以便参考。

## 制作启动U盘

用 UltraISO 程序将下载好的 Ubuntu 18.04 Bionic Beaver ISO 文件烧录到一个空的U盘上。

## 从U盘启动

重启按 <kbd>F2</kbd> 进入 UEFI BIOS 。

-----

### 关闭 Secure Boot 安全启动

以下选项为英文，中文操作方法相同。

1. 将 Boot 菜单下的 OS Type 设为 Windows UEFI 。
2. 进入 Key Management 。
3. 选中 Clear Secure Boot keys 。
4. 此时 Secure Boot 会被自动禁用。然后再将 OS Type 调回 Other OS 。

-----

关闭安全启动后，选择 UEFI 模式的 Ubuntu 安装介质启动。

## 安装流程

大部分流程按照正常步骤即可。

- 如果无法联网，不要勾选“第三方软件”。
- 不要选择“与其它系统共存”，选择“其它选项（创建自己的分区）”。

-----

### 分区说明

此处主要参考

选择未分配的空硬盘，点击 + 来挂载分区。

1. 新建**swap交换空间**，选**主分区**和**空间起始位置**，大小设置 1~2 倍物理内存大小（我选择了1倍，即 16GB ）。

2. 新建**efi系统分区**，选**逻辑分区**和**空间起始位置**，大小不小于 256MB （我选择了 512MB ）。

3. 新建**EXT4日志文件系统**，挂载 **/home** ，选**逻辑分区**和**空间起始位置**，大小自定（我选择了剩余空间的 1/3 ，即 100GB ）。

4. 新建**EXT4日志文件系统**，挂载 **/usr** ，选**逻辑分区**和**空间起始位置**，大小自定（我选择了剩余空间的 3/4 ，即 150GB ）。

5. 新建**EXT4日志文件系统**，挂载 **/** ,选**逻辑分区**和**空间起始位置**，填满剩余空间。

将“安装引导启动器的设备”设为 **efi系统分区** 的分区。

-----

分区后继续安装即可。提示安装完成后拔掉U盘，然后按提示重启。

## 安装显卡驱动

再重启后还是要先进BIOS，开启安全启动。

-----
### 开启 Secure Boot 安全启动

以下选项为英文，中文操作方法相同。

1. 进入 Boot 菜单中的 Key Management 。
2. 选中 Install default Secure Boot Keys 。
3. 此时 Secure Boot 会被自动启用。

-----

随后重启。

进入 GRUB 界面后，务必不要贸然进入系统，先禁用自带的 Nouveau 驱动。

在 GRUB 中选中 Ubuntu ，按 <kbd>E</kbd> 键编辑启动设置。
在倒数第二行 `quiet slash` 后加入 `acpi_osi=linux nomodeset` ，然后按 <kbd>Ctrl</kbd>+<kbd>X</kbd>启动。

进入系统后，检测硬件驱动：

```shell
$ ubuntu-drivers devices
```

然后自动安装推荐的 NVIDIA 驱动：

```shell
$ sudo ubuntu-drivers autoinstall
```

习惯先安装文本编辑器 Vim，然后更改 GRUB 设置：

```shell
$ sudo vim /etc/modprobe.d/blacklist.conf
$ sudo vim /etc/modprobe.d/blacklist-nouveau.conf 
```

每一个文件最后添加一行：

```
blacklist nouveau
```

最后更新 GRUB 设置：

```shell
$ sudo update-intramfs -u
```

重启后基本就完成了，可以尽情玩耍了。

## 附录

### 同步 Windows 和 Ubuntu 时间

```shell
$ timedatectl set-local-rtc 1 --adjust-system-clock
```

### 如何修改 grub 启动项

```shell
$ sudo vim /etc/default/grub
$ sudo update-grub
```

### 如何安装 NTFS 配置工具

```shell
$ sudo apt install ntfs-config
$ sudo ntfs-config
```

### How to change user folders to en_US

```shell
$ export LANG=en_US
$ xdg-user-dirs-gtk-update
```
