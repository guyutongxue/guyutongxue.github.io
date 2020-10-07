版本控制系统

![meme.jpg](https://s1.ax1x.com/2020/10/07/0ateIS.jpg)

功能

仓库 (Repository)：需要构建版本管理体系的文件夹。

提交 (Commit)：创建一个新版本的动作。

分布式系统 (Distributed System): 简单说，就是一个仓库可以在不同电脑上各自存储的完整的历史版本，它们之间可以通过网络进行版本同步和回溯。

本地仓库 (Local Repository): 存放在自己电脑上的仓库。

远程仓库 (Remote Repository): 存放在别人家电脑上的仓库。

GitHub: 免费提供远程仓库存储服务的网站。

秘钥 (Key): 用于验证身份的工具。

1. 安装软件，一路默认。

2. “在文件资源管理器左上角”打开 PowerShell/CMD，配置秘钥
```
ssh-keygen -t rsa -C "<email>"
```
一路回车。
```
cat ~/.ssh/id_rsa.pub
```
拷贝内容到 https://github.com/settings/keys

3. 测试连接
```
ssh -T git@github.com
```
询问输入 yes！

4. 设置 git 信息
```
git config --global user.name "<Username>"
git config --global user.email "<email>"
```

克隆 (Clone): 仓库的复制。可以从任意的远程或本地仓库克隆过来。

5. 克隆仓库
```
git clone git@github.com:Guyutongxue/Mahjong_Assignment.git
```
6. 用 VS Code 打开

7. 讲解 add\commit\push\pull

工作区 (Working Directory): 简单说，是还没有被记录为一个版本的文件。

Git 记录版本的变化。

暂存区 (Staging Area): 简单说，就是打算要提交到下一个版本的那些文件（变化）。

暂存 (Stage): 将文件添加到暂存区。即，选择打算要提交的文件。

```
git add .
git commit -m "commit message"
```

推送 (Push): 将本地仓库的变化传给远程仓库，使得两者同步。

拉取 (Pull): 将本地仓库与远程仓库同步，取得远程仓库的版本变化并更新本地。

分支 (Branch): 从同一个版本衍生出来的不同后继版本，各自形成一个分支。

合并 (Merge): 系统自动将不同分支合并为一个新的提交（版本）。

冲突 (Conflict): 无法自动合并的分支差异。

