# 干他娘的命令行参数

命令行参数这个东西看上去很简单，但它实际上恶心得很。我随便举一个例子：请向一个程序原样传递如下命令行参数：

- `a`
- `b c`
- <code></code>
- `"`
- `\"`
- `\\"`
- `\\d`
- <code>"e"&nbsp;</code>
- <code>&nbsp;"\f \"</code>

首先明确一点，就是命令行参数的传递方法主要是两种：

1. 通过系统调用（操作系统 API），例如 `CreateProcessW` `exec` 等；
2. 通过壳层程序（Shell），例如 `cmd.exe` `bash` 等。

然后，世界上主流的操作系统分为两类，\*nix 和 Windows。前者我就用 POSIX 标准代替。那么整个问题就划分为这样四个象限：

|          | POSIX       | Windows          |
| -------- | ----------- | ---------------- |
| 系统调用 | `exec`      | `CreateProcessW` |
| 壳层     | POSIX Shell | `cmd.exe`        |

具体而言：

- `exec` 系统调用是最简单的：直接向它传入“组织好的” `char**` 类型变量即可。
- POSIX Shell 的命令行转义方式需要参考 POSIX 标准。
- `CreateProcessW` 的转义方式需要参考微软文档。
- `cmd.exe` 的转义方式也需要参考微软文档（然而根本没有）。

本文的后续算法描述使用 JavaScript/TypeScript。

## POSIX Shell

> 参考：[IEEE Std 1003.1-2017 Shell & Utilities 2.2](https://pubs.opengroup.org/onlinepubs/9699919799.2018edition/utilities/V3_chap02.html)

### 从命令行到参数

首先，POSIX Shell 的命令行是由空格分隔的若干参数。若参数带有空格，则需要用引号括起。

> 这些字符在 POSIX Shell 中具有特殊含义：`|` `&` `;` `<` `>` `(` `)` `$` <code>&grave;</code> `\` `"` `'` <code>&nbsp;</code> Tab 和换行符。所以若参数包含它们，则必须要括起。

其中，主要有两种括起方式：单引号和双引号。单引号是由天然缺陷的：单引号内部的参数不能再出现单引号，所以这里不提及它；双引号括起的命令行参数是完备的。

双引号内的所有字符都会原样作为参数，以下字符除外：

- 美元符号 `$`。美元符号会作为变量（如 `$PATH`）、命令展开（如 `$(date)`）或算术表达式（如 `$((1 + 1))` 的前缀。
- 反引号 <code>&grave;</code>。反引号同样是命令展开的前缀。
- 反斜杠 `\`。当反斜杠的尾随字符为 `$`、<code>&grave;</code>、`"`、`\` 或换行符时，两者整体视为单个字符。

### 从参数到命令行

根据上述规则，推算出反向算法为：

```ts
function argvToShell(argv: string[]) {
    let cmd = "";
    for (const arg of argv) {
        cmd += "\"";
        for (const c of arg) {
            if ("$`\"\\"].includes(c)) {
                cmd += "\\";
                cmd += c;
            } else {
                cmd += c;
            }
        }
        cmd += "\" ";
    }
    return cmd;
}
```

这个规则非常简洁；也可以直接用正则表达式：

```ts
function argvToShell(argv: string[]) {
  return argv
    .map((arg) => `"${arg.replace(/(\$|`|"|\\)/g, "\\$1")}"`)
    .join(" ");
}
```

## `CreateProcessW`

POSIX 简洁的设计让人感到欣慰，但 Windows 这边就痛苦起来了。最核心的问题就在于：Windows 的 `CreateProcessW`（或者 ANSI 版本的 `CreateProcessA`）是传递整条命令行的，而不是命令行参数！

```c
BOOL CreateProcessW(
  LPCWSTR               lpApplicationName,
  LPWSTR                lpCommandLine,       /* 这里，指向一整行命令行 */
  LPSECURITY_ATTRIBUTES lpProcessAttributes,
  LPSECURITY_ATTRIBUTES lpThreadAttributes,
  BOOL                  bInheritHandles,
  DWORD                 dwCreationFlags,
  LPVOID                lpEnvironment,
  LPCWSTR               lpCurrentDirectory,
  LPSTARTUPINFOW        lpStartupInfo,
  LPPROCESS_INFORMATION lpProcessInformation
);
```

不同于 `exec`，Windows 只能通过一整行命令行启动进程。而如何将命令行解释为若干参数，是被启动的进程自主解释的！不过，微软定义了一种及其别扭的解释方式，Visual C++ 和 .NET Framework 都遵循这个规则提供 `argc/argv/args` 的值。

下文内容均按照这种解释方式。

### 从命令行到参数

> 参考：
>
> - Visual C++: [`CommandLineToArgvW`](https://docs.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-commandlinetoargvw)
> - .NET Framework: [`Environment.GetCommandLineArgs`](https://docs.microsoft.com/en-us/dotnet/api/system.environment.getcommandlineargs?view=netframework-4.8#system-environment-getcommandlineargs)

微软定义的规则时这样说的：

- 解析命令行时，程序在两种状态切换：引号外状态和引号内状态。
- 初始的状态是引号外状态。
- 当处于引号外状态时遇到空白字符，视为当前参数的结束。下一个非空白字符视为下一参数的开始。
- 当处于引号内状态时，空白字符与普通字符同样对待。
- 当遇到 $n$ 个反斜杠 `\` 时（不论处于何种状态）：
  - 若 $n$ 个反斜杠后的字符不是 `"`，则仍然将这 $n$ 个反斜杠视为普通字符。
  - 若 $n$ 个反斜杠后的字符时 `"`，则：
    - 若 $n\equiv0\pmod2$，则首先将这 $n$ 个反斜杠视为 $\dfrac n2$ 个反斜杠普通字符。随后，丢弃尾随 `"` 并切换状态。（注意：此时不会将 `"` 字符视为任何参数的一部分。）
    - 若 $n\equiv1\pmod2$，则首先将这 $n$ 个反斜杠视为 $\dfrac {n-1}2$ 个反斜杠普通字符。随后，将剩余的 `\"` 视为单个双引号普通字符。不切换状态。
- 遇到 `"` 但没有前缀的 `\` 时，视为 $0$ 个 `\` 加一个 `"`，即“丢弃 `"` 并切换状态”。

> 此外，这个规则还包含一些例外，这里暂时先忽略。
>
> - 位于命令行最开头的连续个空白字符被视为一个额外的空参数。
> - 在引号内状态下，允许使用两个双引号作为单个双引号的转义。
>   - 在 `msvcr80.dll` （Microsoft Visual C++ 2008 Redistributable）及更早版本的运行时库中，在引号外状态下也会应用两个双引号的转义。
>
> ——感谢知友 @王扶之 提供的补充

### 从参数到命令行

根据上述规则，推算出反向算法为：

```ts
function argvToCommandLine(argv: string[]) {
  let cmd = "";
  for (const arg of argv) {
    cmd += '"';
    for (let i = 0; true; i++) {
      // 记录已经连续了多少个反斜杠
      let slashNum = 0;
      while (i !== arg.length && arg[i] === "\\") {
        i++;
        slashNum++;
      }
      if (i === arg.length) {
        cmd += "\\".repeat(slashNum * 2);
        break;
      } else if (arg[i] === '"') {
        cmd += "\\".repeat(slashNum * 2 + 1);
        cmd += '"';
      } else {
        cmd += "\\".repeat(slashNum);
        cmd += arg[i];
      }
    }
    cmd += '" ';
  }
  return cmd;
}
```

在 [libuv](https://github.com/libuv/libuv/blob/d54c92e3e68f0b8152617d8e97f704dd1e586bd6/src/win/process.c#L455) 中有另一种更简单的实现（感谢知友 @王扶之 提供的资料）：

```ts
function argvToCommandLine(argv: string[]) {
  return argv
    .map((arg) => {
      let rev = '"'; // 逆向构造
      let quoteHit = true; // 是否处于保留引号的区间
      for (let i = arg.length - 1; i >= 0; i--) {
        rev += arg[i];
        if (quoteHit && arg[i] === "\\") {
          // 若需要保留引号，则添加额外的反斜杠
          rev += "\\";
        } else if (arg[i] === '"') {
          quoteHit = true;
          rev += "\\";
        } else {
          quoteHit = false;
        }
      }
      rev += '"';
      // 反转为正向字符串
      return Array.from(rev).reverse().join("");
    })
    .join(" ");
}
```

不得不说，这个规则实在太古怪，比如 `\\"` 和 `\\d` 的正确括起写法分别是 `"\\\\\""` 和 `"\\d"`；反斜杠的数量有天壤之别。

## cmd.exe

还有更恶心的。Windows 的默认壳层程序 cmd.exe 用了更糟糕的解析规则，而且这个规则还没有官方的文档。

> 好在神通广大的网友们通过大量试验逆向出了这个规则。本节参考：[Stack Overflow](https://stackoverflow.com/a/4095133/14053503)

### 命令行到参数

cmd.exe 的任务是解析用户的输入，理解诸如控制语句、IO 重定向等信息。对我们而言，最重要的是运行外部程序时的两部分内容：目标程序和参数命令行。

- cmd.exe 的第一阶段工作是将输入按回车分成若干行。
- cmd.exe 的第二阶段工作是展开每一行中的变量。
  - 在这一步中，所有 `%` 开头的字符都会被特殊处理。处理后是否保留 `%` 字符是复杂的。
- cmd.exe 的第三阶段是：将一行输入分解为若干词法标记（Token）。这是重点。
- （先暂时跳过第三阶段的解释，）当分析完成后：
  - 将重定向子句（`<` `>`）移动到本行末尾；
  - 将管道运算符（`|`）、命令衔接符（`&` `&&` `||`）视为多行输入；
  - 将静默修饰符（`@`）移除；
  - 完成这些处理后的第一个词法标记就是目标程序（如果这个词法标记不含任何 `"`，则同时会考虑内置命令）。
  - 除重定向子句外的所有词法标记合起来就是参数命令行。
- 第三阶段的具体步骤是这样的：
  - 分析程序处于两个状态之一：引号内状态或引号外状态。
  - 初始的状态是引号外状态。
  - 任何状态下遇到字符 `^`，则取消接下来字符的特殊含义（即“被转义”）。带有特殊含义的字符包括 `^` `"` `(` `@` `&` `|` `<` `>` `;` `,` `=` <code>&nbsp;</code> Tab、回车和一些其它控制字符，但回车符不能被转义。
  - 任何状态下遇到字符 `"`，切换程序状态（已经被转义的除外）。
  - 处于引号外状态时：
    - 遇到 `;` `,` `=` <code>&nbsp;</code> Tab、回车和一些其它控制字符时，在此处分隔词法标记。
    - 处理特殊含义（已经被转义的除外）：
      - 遇到 `<` `>` `&` `|` 等字符时，处理它们的特殊含义；
      - （将重定向子句移动后）首个字符处遇到 `@` 时，处理其特殊含义。
      - 处理位于词法标记开头的 `:` 的特殊含义。
      - 若组成了记作 `IF` `FOR` 或 `REM` 的词法标记，进入特殊的语法处理。
      - 处理括号 `(`。
  - 处于引号内状态时：
    - 遇到回车时，立即切换到引号外状态。

总的来说，明确这些要点：

- 虽然 cmd.exe 也使用“引号内”“引号外”状态，但它绝不移除任何引号。所有的引号都会保留到最后一步。
- cmd.exe 不认为 `\` 字符有特殊含义。
- 对于大部分的特殊字符（包括 `"`），只需要用 `^` 转义掉即可。但例外是 `^` 处理之前的两个步骤：
  - 换行符、回车符总是会被忽略。（换而言之，你无法在 cmd.exe 中传入带有换行符的参数。）
  - `%` 的处理。通用的解决办法是，若 `%` 不在行尾，则添加一个 `^` 来取消变量展开。若 `%` 在行尾，则不用管它。
- cmd.exe 得到目标程序的名字后，会移除其中所有的 `"`（Windows 不允许文件名出现 `"`），在工作目录和 `%Path%` 中寻找并执行。
- cmd.exe 得到完整的命令行后，会将它传递给目标程序。如果目标程序用 C/C++/C# 编写，就会按照之前提到的规则解析为若干命令行参数。

可以看到，cmd.exe 是混乱邪恶的。**为此我强烈呼吁：永远不要用 cmd.exe 传递参数。**

### 参数到命令行

但是编程的时候总是会有意无意地碰到 cmd.exe 这块硬骨头。最简单的手段也是最极端的手段：在每个字符前都添加 `^`——幸好 `^` 只是取消特殊含义，`^` 作用于普通的字符上没有效果也不会报错。

```ts
function argvToCmdDotExe(argv: string[]) {
  if (argv.join('').includes("\n")) {
    throw new Error(`别想了，这事儿不能成`);
  }
  return argvToCommandLine(argv).replace(/(.)/g, "^$1");
}
```

## 附录：程序名

说完了参数解析，程序名的解析就相对简单了。

|          | POSIX                     | Windows                    |
| -------- | ------------------------- | -------------------------- |
| 系统调用 | `exec` 的首个参数原样传递 | 见下文                     |
| 壳层     | 规则和参数相同            | 首个词法标记，并删除双引号 |

`CreateProcessW` 虽然提供了用作程序名的首个参数，但一般习惯设置为空（`NULL` 或 `nullptr`）。要启动的程序名一般通过如下解析规则获取：

- 检查命令行的首个字符。若它不是 `"`：
  - 将命令行按照空白字符分割；
  - 以首段内容作为文件名查找程序。若查找到，则执行它。
  - 以首段内容 + 空白字符 + 下一段内容作为文件名查找程序。若查找到，则执行它。
  - 这样一直做下去；如果整段字符串作为文件名仍然找不到，则给出“文件不存在”错误（错误码 `2`）。
- 若首个字符是 `"`：
  - 截取第二个字符到下一个 `"` 字符（不含）为止的子字符串；若没有第二个 `"`，则截取到字符串结尾。
  - 将该子串作为文件名查找程序。若查找到，则执行它；否则给出“文件不存在”错误。

之所以不推荐通过 `CreateProcessW` 的首个参数传递程序名，是因为如果这样做的话，被启动的进程的命令行就会缺失“程序名”部分——换而言之，被启动的程序的 `argv[0]` 不再是程序名了！这与 POSIX 标准，以及用户习惯都不吻合。
