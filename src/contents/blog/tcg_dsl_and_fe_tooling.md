---
title: 写游戏模拟器竟意外发现隐藏了10年的前端工具链bug
updated_at: 2026-06-06
---


> 声明：本文由 LLM AI 辅助写作

2023 年夏天，我开始写一个游戏模拟器。两年后，我意外地发现了一个藏在 Babel、esbuild、SWC、OXC、Terser、Bun 中长达十年的 bug——短短三天内我在 9 个顶级前端项目中提交了 bug report。这一切的起因，要从一个诡异的括号说起。

---

## 1. 七圣召唤模拟器

[genius-invokation](https://github.com/piovium/genius-invokation) 是一个用 TypeScript 编写的七圣召唤模拟器，目前 82 stars，近 2000 次提交。（以防你不知道，七圣召唤是原神的一个卡牌小游戏，目前已经接近凉凉了喵。）它实现了目前最接近官方结算规则的对局核心，支持全部卡牌定义、牌局可视化、历史回溯、跨语言绑定（C/C++、Python、C#），还有一个正在公测中的对战平台。

项目始于 2023 年 6 月，对于如何描述卡牌定义这个问题，经过早期使用装饰器、Options 等传统模式的尝试后，目前选用在 TypeScript 文件中用 Builder 模式手写：

> 为啥不设计成 Options 模式？你可以问问写 Vue2.x 的 Options 配置的 TypeScript 程序员掉了多少头发。

```ts
export const Barbara = character(1201)
  .tag("hydro", "catalyst", "mondstadt")
  .health(10)
  .energy(3)
  .skill(12011, "WhisperOfWater");
// ...
```

每张角色卡伴随 3-5 张衍生卡（技能、召唤物、状态），手写 Builder 虽然可行，但随着官方机制的复杂度上升，在保证开发效率和代码美观的同时还要维护 Builder 模式的类型安全性的负担越来越重。

---

## 2. 造个 DSL

为了让卡牌定义更优雅、让后续玩家自定义卡牌更方便，我在 2025 年底启动了 [GamingTS](https://github.com/piovium/gts)（简称 gts）——一个嵌入 TypeScript 的 DSL：

```ts
define character {
  id 1201 as Barbara;
  tags hydro, catalyst, mondstadt;
  health 10;
  energy 3;
  skills WhisperOfWater;
}

define skill {
  id 12011 as WhisperOfWater;
  cost hydro, 3;
  :damage(hydro, 1);
  :summon(MelodyLoop);
}
```

我写 Hobby 项目有一个原则：开发体验（DX）要优先于用户体验（UX）。在启动 gts 项目之时，我就在考虑我需要先编写一个 Language Server 来辅助编码才好。好在 Vue Language Tools 团队为我们开源了 Volar.js ——一个专门为 JS/TS 生态编写 Language Server 的框架，我们只需要搞一个 gts 的转译器将 `.gts` 文件解析为 TypeScript AST，进行语义变换后再序列化回 `.ts` 代码，就可以提供所有 Language Server 的功能了。这又需要两个核心组件：**解析器**和**AST 打印程序**（code generator / printer）。

我参考了类似的 DSL 项目，只找到了 [RippleTS](https://github.com/Ripple-TS) —— 呃现在叫做 [TSRX](https://tsrx.dev/) ——是怎么做的。解析器用了 `acorn` + `@sveltejs/acorn-typescript`，打印程序用 `esrap`；这些设施都有 SvelteJS 官方背书，很成熟（_真的吗？_）。

但问题接踵而至，主要在打印程序上。不管是 `esrap` 还是其他的打印程序 `@babel/generator`、`escodegen`、`astring`——都有一个问题：它们的主要目标是*生成*代码，而不是*保留原始源码到生成代码的映射*。在映射难以得到保留的情况下，为了支持 Language Client 所要求的自动提示、悬浮定义、代码操作等等就会非常困难。在经过又一番探索后我找到了 [`recast`](https://npm.im/recast)，得到了启发——只需要尽可能原样打印有源码位置的 AST 节点，就可以同时保持双向映射；只有被 DSL 变换的部分才需要重新生成。

但是很可惜，`recast` 生成的映射依然是点对点的 Mozilla SourceMap v3 格式，在 Volar.js 框架下还是需要搞很多的 hacking 才能接入。那为什么不自己写一个呢？

---

## 3. espolar：一个保留源码的 AST 打印程序

[espolar](https://github.com/piovium/espolar) 在 2026 年 5 月底立项。核心设计：

- **Source preservation**：对于未被修改的 AST 节点，直接从原始源码切片打印，保留空格、注释、换行
- **Volar.js mappings**：生成 source range → generated range 映射，支持语言服务功能
- **可扩展**：每个 AST 节点类型都有独立的 printer 函数，可覆盖

写一个 AST 打印程序最繁琐的部分是**括号判断**。JavaScript 的语法括号有时是语法的强制要求，有时只是改变运算符优先级。但即使只是"改变优先级"的括号，如果去掉也可能改变语义。比如最简单的，`(1 + 2) * 3` 肯定不是 `1 + 2 * 3`。括号在事实标准（ESTree） AST 中是不会保留的，你只会看到：

```
MultiplicativeExpression
  |- left:  AddictiveExpression
  |   |- left:  Literal 1
  |   \- right: Literal 2
  \- right: Literal 3
```

加括号与否需要自行判断 `MultiplicativeExpression` 和 `AddictiveExpression` 两种节点类型的优先级。

有人说，括号的问题直接看优先级表格不就好了。话是这么说但话又不是这么说，因为在编译原理的语法解析中（也就是 EBNF 范式中）是没有所谓的优先级的；优先级实质上是从 EBNF 的嵌套推导出来的。MDN 提供了一个非常权威的[表格](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence#table) ，大部分的打印程序都是参考这个来写的——但是随着 JavaScript 的语法的扩充，以及 TypeScript 的介入，很多打印程序出现了“靠巧合运行”的情况，比如 `escodegen`……然后 `astring` 很明显也参考了 `escodegen` 的实现，然后 `esrap` 又在参考 `astring` 的实现，然后屎山就这么一点点积累起来了。

我在用 AI 辅助编程的时候，跟它说，请参考 `esrap` 的实现来写 `espolar`，然后 AI 直接说我们的优先级表格不能照抄 `esrap`，因为抄完之后一些 TypeScript 表达式的打印会出现明显错误：

```ts
!(0 as number); // 打印之后变成了 !0 as number，也就是 (!0) as number
```

原来 `esrap` 把 `as` 表达式的优先级放在了初等表达式 `PrimaryExpression` 和后缀表达式 `UpdateExpression` 中间了——相当于是结合最紧密的一级，于是括号就没有打印出来。但事实是 `as` 表达式的优先级实质上是在比较运算符 `<` `>` 这一级的，比 `===` 强，比 `<<` `>>` 弱。于是我给 Svelte 它们提了个 issue [esrap#127](https://github.com/sveltejs/esrap/issues/127)，问题很快被修复。

但是，他们修错了。

他们修好之后立即发了一版，然后直接把整个 Svelte 生态搞炸了——当用户输入 `(a || b) && c` 的时候，修完之后的 `esrap` 直接打印成了

```js
a || (b && c); // 这玩意儿的意思是 a || (b && c)，我们小学都学过
```

嘿嘿。这下麻爪了，他们开始着手看整个加括号的逻辑。与此同时我也在抓紧对比我自己的 `espolar` 是否有同类问题。Svelte 维护者连续发布了三个 PR 来修一连串括号的问题：

- [esrap#132](https://github.com/sveltejs/esrap/pull/132)，先热修把 Svelte 整个搞炸的逻辑运算符优先级
- [esrap#134](https://github.com/sveltejs/esrap/pull/134)，修了 new 表达式、前缀表达式、可选链的括号必要性
- [esrap#136](https://github.com/sveltejs/esrap/pull/136)，修了装饰器、extends 子句、表达式语句的括号必要性

我一边对照着 ECMA-262 规范、MDN 文档和这些 PR 代码，一边看我自己的代码，然后加各种单测来验证……这时我突然发现了一个比较琐碎的细节，就是 `new` 表达式的操作数。

---

## 4. 那个隐藏了十年的Bug

最简单的情形就是下面这行代码：

```js
new (a.b())(); // 不是 new a.b()();
```

为什么这里的括号不能删？因为 `new a.b()()` 实质上是 `(new (a.b)())()`，也就是调用类 `a.b` 的构造函数，然后调用返回的对象的 `[[Call]]`。

换句话说，`new` 表达式的操作数**不能出现任何**调用形式，否则就会提前结束 `new` 的操作数。一个合法的无括号 new callee 必须是一条不经过 `CallExpression` 的成员访问链。例如：

```ts
// ✅ 不需要括号——new 的 callee 是一条纯净的成员链
new a.b.c();

// ❌ 需要括号——callee 链中出现了函数调用
new (a().b)();
```

那具体落在实现上，检查内层表达式是否存在调用形式只需要查 `MemberExpression` 同一优先级的表达式形式就可以了。根据 ESTree 事实标准一共有这些形式：

- `MetaProperty`: `impor.meta` 肯定不会引入括号
- `MemberExpression`: `obj.prop` 左侧操作数可能引入括号，需要继续查
- `TSNonNullExpression`: `expr!`被断言的表达式可能引入括号，需要继续查
- `NewExpression`: 自指了，这一层不用管
- `CallExpression`: `fn(...)` 引入括号了，咔嚓掉
- `ImportExpression` `import(...)` 也引入括号了，但是我用 Chrome 测了一下发现能跑，就没管 _（伏笔了家人们）_
- `TaggedTemplateExpression` `` tag`...` `` 标签处可能引入括号
- `ChainExpression`：MDN 明确写了它在成员链中出现必须要加括号，那只需要判断一下顶层就可以了

最终的代码就长成这样了：

```ts
function validUnparenthesizedNewOperand(node: MemberLikeExpression): boolean {
  if (node.type === "ChainExpression") {
    return false;
  }
  let cur = node;
  while (true) {
    if (cur.type === "CallExpression") return false;
    // if (cur.type === "ImportExpression") return false;
    if (cur.type === "TSNonNullExpression") {
      cur = cur.expression;
      continue;
    }
    if (cur.type === "MemberExpression") {
      cur = cur.object;
      continue;
    }
    if (cur.type === "TaggedTemplateExpression") {
      cur = cur.tag;
      continue;
    }
    return true;
  }
}
```

写完 espolar 后我回头检查了 Svelte 的 `esrap`，发现有两个遗漏：`TaggedTemplateExpression` 和 `MemberExpression`。比如下面代码：

```js
const foo = () => (args) => class A {};
new (foo()`bar`)();

const baz = () => ({ qux: class A {} });
new (baz()?.qux)();
```

本质是合法的，实例化 `` foo()`bar` `` 和 `baz()?.qux` 指代的类，但 `esrap` 会打印成：

```js
const foo = () => (args) => class A {};
new foo()`bar`();

const baz = () => ({ qux: class A {} });
new baz()?.qux();
```

这个语义就明显变化了，变成实例化类 `foo` 和 `baz` 了。

但我的好奇心没有止步于此。如果说 Svelte 相对年轻的工具（esrap 是 2025 年的项目）有遗漏还情有可原，那更成熟的工具呢？

我一个一个地试。

---

## 5. 地毯式排查

在接下来的两天里，我用刚刚那个测试用例检验了几乎所有主流 JavaScript/TypeScript 代码生成工具：

结果令人震惊：除了 Prettier 和 Webpack，在 `TaggedTemplateExpression` 的用例中**全部中招**。

| 工具                 | Issue                                                        | 截止撰文时状态                                                       |
| -------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| Svelte Compiler 本尊 | --                                                           | [Open](https://github.com/sveltejs/esrap/pull/134)                   |
| `@babel/generator`   | [babel#18045](https://github.com/babel/babel/issues/18045)   | [✅ 当天修复](https://github.com/babel/babel/pull/18046)             |
| esbuild              | [esbuild#4477](https://github.com/evanw/esbuild/issues/4477) | Open                                                                 |
| SWC                  | [swc#11921](https://github.com/swc-project/swc/issues/11921) | [✅ 一天后修复](https://github.com/swc-project/swc/pull/11922)       |
| oxc                  | [oxc#22961](https://github.com/oxc-project/oxc/issues/22961) | [✅ 两天后修复](https://github.com/oxc-project/oxc/pull/22997)       |
| Terser               | [terser#1691](https://github.com/terser/terser/issues/1691)  | Open                                                                 |
| Bun                  | [bun#31812](https://github.com/oven-sh/bun/issues/31812)     | [Open 经典 Claude 这一块](https://github.com/oven-sh/bun/pull/31813) |

Babel 的反应最快——[@JLHwung](https://github.com/JLHwung) 在 issue 提交几小时内就打开了 [PR #18046](https://github.com/babel/babel/pull/18046)，当天合并。修复的核心改动是：将 `needsParens` 中遍历 new callee 链的逻辑从原来的只检查 `CallExpression`，扩展为同时覆盖 `TaggedTemplateExpression` 和 `TSNonNullExpression`。

更有趣的是，这个 PR 的修复还*反向暴露*了 Babel generator 的另一处 bug：`(f?.g!).h` 被错误打印为 `f?.g!.h`（可选链覆盖范围被改变）。修复一个 bug 的过程中发现了另一个 bug——这件事本身就说明这段逻辑有多容易被写错。

已经没有人类的 Bun 的那个 PR 同理，Claude 同时也发现了 new 表达式解析中一堆由于迁移到 Rust 导致的 regression，在此不过多赘述（各位可以围观 Jarred 是怎么使唤 AI 的）。

除了打印程序的问题，在编写 `espolar` 时我还发现了很多 `acorn-typescript` 解析 TypeScript 的 bug：

| Issue                                                                         | 描述                                |
| ----------------------------------------------------------------------------- | ----------------------------------- |
| [acorn-typescript#45](https://github.com/sveltejs/acorn-typescript/issues/45) | `0 as number ** 1` 被错误拒绝       |
| [acorn-typescript#46](https://github.com/sveltejs/acorn-typescript/issues/46) | 装饰器中不支持类型参数              |
| [acorn-typescript#47](https://github.com/sveltejs/acorn-typescript/issues/47) | `new (A<T>)()` 中类型参数被错误归类 |

最后我又考察了 Vue 的语言解析器，作为 Volar.js 的鼻祖是否也有类似的问题呢？好消息是 Vue 的转译器基本不碰 AST 所以没有这种严重的 bug；坏消息是仅有的一处对 AST 的操作——为了支持 Reactive Destructuring Props——依然引入了意外的 bug。我顺手也提了 Issue [vue#14932](https://github.com/vuejs/core/issues/14932)，很快他们第二天就[修了](https://github.com/vuejs/core/pull/14933)。

---

## 6. 为什么藏了十年

Tagged Template Literal 是 ES6 / ES2015 引入的语法，距今恰好十年左右。但这句话不是重点——重点在于为什么这个 bug 能在几乎所有工具中同时存在而不被发现。

在 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence) 的优先级表格中：

| 优先级 | 语法形式                                        |
| ------ | ----------------------------------------------- |
| 17     | Member access `a.b`, `a[b]`, `` a`b` ``, `a(b)` |
| 17     | Optional chaining `a?.b`                        |
| 17     | `new` without argument list                     |
| 16     | `new` with argument list                        |

`TaggedTemplateExpression`（`` foo`bar` ``）的优先级和 `a.b` `a(b)` `new a(b)` 完全相同（都是成员访问级别，17）。但这也不重要，大多数转译器都正确处理了嵌套 `CallExpression` 的括号问题；关键的问题是，**几乎从来没有人会写 ``new (foo()`bar`)()`` 这样的代码**。在真实世界的代码中，tagged template 通常用于 DSL（如 `` gql`query` `` 或 `` html`...` ``），而 `new` 通常用于实例化类。将 tagged template 的结果作为 `new` 的参数是可以想见的，但将 tagged template 的调用结果作为 `new` 的 callee（即用 `new` 实例化 tagged template 返回的类）就非常罕见了。因此，几乎所有 AST 打印程序的 `needsParens` 或等价逻辑在遍历 new callee 链时，只认识 `CallExpression` 和 `MemberExpression`。它们的实现大体沿袭自 2015 年前后 `escodegen` 和 Babel 一众第一批 JavaScript 转译工具（那时 tagged template 刚刚进入标准），代码路径从未被更新。后续的每个新工具——esbuild、SWC、OXC、Bun、Terser——都在独立实现时复制了同样的盲区。

这不是某一个开发者的疏忽，而是整个领域对于一个"显然不存在"的边缘情况达成了惊人的一致忽视。

> 上面这句话 AI 味儿大无需多言，我也懒得改了

---

## 7. 尾声

从写一个游戏模拟器开始，到为 DSL 造 AST 打印程序，再到发现整个前端工具链共有的陈年 bug——这种"意外"是开源开发中最有意思的体验。

这次经历让我意识到几件事：

1. **边缘情况测试是稀缺品。** 大多数工具的核心测试用例来自日常开发中常见的代码模式，`` new (foo()`bar`)() `` 这种"理论上合法但几乎没人写"的代码，永远不会出现在测试集中。
2. **制造工具的人最懂工具的盲区。** 因为我在*实现*一个正确性要求极高的打印程序，我不得不穷举所有可能的 AST 节点组合。在这个场景下，任何一个"漏网之鱼"都会立刻暴露。
3. **开源协作的速度可以很快。** Babel 从 issue 到合并 fix PR 只用了几个小时。当你带着清晰的重现步骤和精准的技术分析提交 issue 时，维护者通常非常乐意快速响应。
4. **代码生成的正确性是安全基石。** 如果一个 minifier 或 bundler 在优化时错误地移除了括号，它修改的不只是代码风格——它改变了程序语义。这种 bug 在生产环境中极难排查，因为它不会报错，只是默默地执行了错误逻辑。

如果你也维护着一个 JavaScript parser 或 code generator——不妨去检查一下你的 `needsParens` 逻辑有没有覆盖 `TaggedTemplateExpression` 和 `ChainExpression`。

---

## X. 安可

等等，为什么 Prettier 没有中招呢？我又去看了一眼，发现七年前他们就已经考虑到了这种情形。但与此同时，诞生了新发现：

Prettier 的维护者 [@fisker](https://github.com/fisker) 提交了一个 PR [prettier#19295](https://github.com/prettier/prettier/pull/19295)，说这是受 Babel 修复的*启发*发现的 bug。是什么呢？说他们在判断括号的时候漏掉了 `ImportExpression`，也就是说

```js
new import("x").y();
```

的括号应该得到保留。可是我在 Chrome 和 Node.js 上试了一下

```js
new import("data:text/javascript,0").__proto__.constructor((r) => r());
```

发现可以正常输出 `Promise <fulfilled>`。Acorn 也能正常解析。诶……？我赶紧又去翻了一下 ECMA-262 的标准，发现这个语法确实是不被允许的。难道说？

难道说！**是的，V8 也有 bug**，导致遗漏掉了这个特殊情形的报错。我让 AI blame 了一下 V8 的源码，发现 Chengzhong Wu 在一年前为 V8 加入 `import.source` 的支持时调整了 `new` 表达式的解析。

原先是检测这里出现了连续的 `import` 和 `(` 词法标记报错，为了使 `new import.source('mod')` 也报错，他改成了读取 `import` 后先尽可能读一个属性链，然后判断结尾是不是 `(` 调用。这样就能覆盖 `import('mod')`、`import.source('mod')` 和即将进入标准的 `import.defer('mod')` 了——很不错！但是忘记了 `new import('mod').prop` 也是非法的。

这个 bug 就这样静静躺了一年没人发现（尽管这样的代码路径如上例所见是可达的）。那也顺手报告一个 bug 吧，[chromium#520350517](https://issues.chromium.org/issues/520350517)。至于谷歌这个体量的大公司愿不愿意修就看运气了喵。
