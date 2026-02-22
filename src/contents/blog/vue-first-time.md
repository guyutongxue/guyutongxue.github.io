---
title: Vue 初次使用
---

## TLDR
1. 下载安装 Node.js https://nodejs.org/ 
1. 下载安装 pnpm `iwr https://get.pnpm.io/install.ps1 -useb | iex` （PowerShell 运行）
1. 执行命令 `pnpm create vite <应用名> --template vue` 创建应用程序模板
1. 执行命令 `cd <应用名> && pnpm i` 安装依赖
1. 建议使用 [Visual Studio Code](https://code.visualstudio.com) 开发，安装扩展 `Vue Language Features` 和 `TypeScript Vue Plugin`
1. 执行命令 `pnpm dev` 运行开发服务器和应用预览
1. 使用命令 `pnpm build` 编译出最终结果

以下是解释：

## Node.js

现在的 JavaScript 开发是分为两种运行环境的：一是在浏览器中运行的 JavaScript，二是在原生操作系统上运行的 JavaScript。后者类似于本世纪初微软的 JScript Host（VBS 解释器等），可以与本地文件系统交互，基本上和 Python 的生态位类似。

Vue 作为一个框架，使用它自己的一套语言“Vue SFC”，Vue SFC 需要经过“编译”才能生成在浏览器内直接运行的 JavaScript 代码。而这个编译器本身也是 JavaScript 写的。因此，为了让 Vue 框架工作，还需要一个在原生操作系统上运行的 JavaScript 运行时，在这个环境下运行 Vue SFC 的编译器，而编译器将“Vue SFC”编译为“浏览器内的 JavaScript 代码”。

Node.js 是最传统的一套原生操作系统上的 JavaScript 运行时。[下载安装链接](https://nodejs.org/)。Vue 编译器需要在这上面运行。

## 包管理器（Package Manager）

现在的 JavaScript 生态依赖于包管理器，比如在代码中使用

```js
import moment from "moment";
```

就可以将 [moment](https://npm.im/moment) 包的代码导入到自己的项目中。至于“moment”包从哪里获取，对于 Node.js 这类本地 JavaScript 运行时来说，可以在项目的 `node_modules` 文件夹中找到。而包管理器可以将远程包仓库（通常是 `npmjs.org`）上的包下载到 `node_modules`。**比如**（这是一个例子，并非真正要执行的代码）：

```sh
npm install moment
```

执行这样的命令之后，工作目录下就会出现一个 `node_modules` 文件夹，其内部就会有下载好的 `moment`。当 Node.js 运行时运行代码 `import ... from "moment"` 的时候，就可以找到这个包的代码并导入。

Node.js 自带的包管理器叫做 npm，但是它不是特别好用。我推荐安装另一个包管理器叫 pnpm，Windows 在 PowerShell 下执行

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

即可安装。

## 打包器（Bundler）

但是浏览器遇到 `import` 时，浏览器不能访问本地文件系统，不知道怎么找到 `import` 的包名对应的代码。因此如果一个目标是在浏览器上运行的 JavaScript 项目，在使用了第三方包之后，通常还需要一个打包器，将所有的 `import` “内联”到一份代码中，然后浏览器就可以直接运行了。大部分打包器也是用 JavaScript 编写的，这些打包器肯定是运行在 Node.js 环境中的。

> 但是浏览器支持 `import` 语法，如果不使用打包器，可以将 `import ... from "moment"` 改成来自某个公共 CDN 提供的 URL 路径，比如 `import ... from "https://esm.run/moment"`。

这里推荐使用的是 Vite；Vite 不仅包含了打包器的功能，而且提供了很多便利的常用插件，以及开发时的热加载等。执行下面的命令可以生成一份使用 Vite 的模板代码（也同时包括 Vue 编译器和 Hello World 代码等）：

```sh
pnpm create vite <应用名> --template vue
```

应用名通常是英文字母、数字、`-` 和 `_` 的组合。此条命令会创建一个名为 `<应用名>` 的文件夹，内含配置和模板代码。

## 编辑器（IDE）

前端开发主流有两种 IDE 选择，一是微软的 [Visual Studio Code](https://code.visualstudio.com)，二是 JetBrain 的 [WebStorm](https://www.jetbrains.com/webstorm/)。前者免费，通过由开源社区维护扩展的方式运作，后者是付费软件。这里就选择 Visual Studio Code（简称 vscode）。

下载安装后，在主页面菜单栏 - 文件 - 打开文件夹，选择上一步创建的 `<应用名>` 文件夹。然后就可以自由编辑其中的代码了。vscode 只是一个编辑器，目前通常还是需要在终端中输入相关的命令来预览应用或构建（编译）应用。按 Ctrl + `` ` `` 可唤出终端以执行稍后提及的命令。

注意到 `src/App.vue` 就是之前提到的 Vue SFC 源代码。你需要安装 [Vue Language Features](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 扩展来让 vscode 提供相关的智能提示。点击上述链接或者直接在左侧“扩展”标签页搜索扩展名字来安装。

此外，也建议安装 [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) 扩展，它加强了智能提示类型部分的功能。

## 开发命令

### 安装依赖命令

```sh
pnpm install # 或 pnpm i
```

使用 `pnpm` 包管理器，将所有开发过程需要的 JavaScript 依赖包安装到 `node_modules`。这些依赖包括：
- 开发时依赖，这些包中的 JavaScript 代码运行在 Node.js 上：
  - Vite（打包器）
  - Vite Vue 插件（让 Vite 识别并编译 Vue SFC 的插件）
- 运行时依赖，这些包中的 JavaScript 代码会被打包并运行在浏览器上：
  - Vue 运行时

### 运行开发服务器

```sh
pnpm dev
```

该命令会启动 Vite 的开发时服务器功能，用于预览当前的应用程序。`pnpm dev` 命令就绪后，可在 `http://localhost:5173` 观察并试用当前的应用程序。每当源码更新（编辑并保存后），浏览器页面会自动刷新以反映源码最新变化。

### 编译构建

```sh
pnpm build
```

该命令会启动 Vite 的编译和打包功能，将 Vue SFC 转换为 JavaScript，并与所有运行时依赖打包成单个（通常是）JS 文件。打包的产出结果会在 `dist` 文件夹中。随后，可使用任意后端服务器“静态服务”这些文件，即完成部署工作。

## 接下来的步骤…

- 通过 Vue 的[互动式教程](https://cn.vuejs.org/tutorial/) 了解 Vue 的功能及 Vue SFC 的基本写法；
- 全面学习 Vue 的[文档](https://cn.vuejs.org/guide/essentials/application.html)

## 关于模板代码中的文件

- `.vscode/extensions.json` 列出让 vscode 建议安装的扩展（不重要）
- `public/` Vite 会将此路径下的文件直接静态服务（复制到输出 `dist` 文件夹），参见[文档](https://cn.vitejs.dev/guide/assets.html#the-public-directory)
- `src/` 所有 JS 和 Vue 源码：
  - `main.js` 应用程序入口点（在 `index.html` 中引入，且引入了 `App.vue` 根组件）
  - `App.vue` 应用程序根组件
  - `style.css` 全局样式表（在 `main.js` 中 `import` CSS 时，Vite 会识别并自动打包）
  - `src/assets/` 需要引入源码的图片等；
  - `src/components/` 建议存放 Vue 单文件组件（SFC），这里存放了 `HelloWorld.vue`
- `.gitignore` 需要 [Git 版本管理器](https://git-scm.com/) 忽略的文件列表
- `index.html` 前端页面总入口点（引入了 `main.js`）
- `package.json` 指定这个项目的元信息：
  - `name` 应用名
  - `private` 指示是否会发布到 `npmjs.org`
  - `version` 应用版本
  - `type` 指示此应用使用标准模块语法（`import` 和 `export`）
  - `scripts` 可指定开发时常用的命令。`pnpm` 在使用 `pnpm xxx` 时会在此处查找 `xxx` 对应的命令
  - `dependencies` 运行时依赖
  - `devDependencies` 开发时依赖（此项列出的包只会在 Node.js 下运行）
- `README.md` 通常存放项目说明，目前存放的是 Vite 提供的简要开发步骤说明
- `vite.config.js` 配置 Vite 的行为。这份代码只会在 Node.js 下启动 Vite 时执行。

