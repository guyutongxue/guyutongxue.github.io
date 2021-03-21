<!-- Pseudocode JS -->
<script src="https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/katex.min.js""></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css">
<script src="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.js"></script>
<!-- end -->
<!-- JQuery -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
<script src="../js/markdown.js"></script>

<style>
    em {
        font-style: normal !important;
        font-family: 方正楷体简体, 华文楷体, 楷体, 楷体GB2312
    }
    cite {
        font-style: normal;
        color: darkgrey;
    }
    summary {
        color: darkgrey;
    }
    .fixed {
        width: min(calc(100vw - 2em),42em);
        position: fixed;
        top: 0;
        background: white;
        z-index: 999;
    }
</style>

# 多项式复杂度内的素性检测算法 <br> <small><b>PRIMES</b> is in <b>P</b></small>

<p align="right">
原作者：Manindra Agrawal, Neeraj Kayal, Nitin Saxena<br>  
译：谷雨同学
</p>

## 摘要

在此文中，我们给出了一个无条件的、确定性的多项式时间复杂度算法，它可用于检测一个输入的整数是素数还是合数。

## 1. 概述

素数是数学和数论中最为基础的重要部分，所以人们抱有很大的兴趣去研究素数的性质。其中一个性质就是如何去高效地判断一个整数是否为素数。这样高效的检测将在实践中非常有用：密码学的协议需要用到大素数来完成。

记 $\bf{PRIMES}$ 为所有素数的集合。素数的定义告诉我们如何决定一个数 $n$ 是否属于 $\bf{PRIMES}$：尝试用每一个<cite>（大于 $1$ 的）</cite>整数 $m\leqslant\sqrt n$ 去除 $n$ ——如果存在一个 $m$ 整除 $n$，那么 $n$ 就是合数，否则 $n$ 就是素数。这种测试方法在古希腊时代就已经被发现，是*埃拉托斯特尼*（约公元前 240）*筛法*（一种生成小于 $n$ 的素数集的算法）的一个特殊情形。但这种测试方法是低效率的：它需要 $\varOmega(\sqrt n)$ 的步骤来决定 $n$ 是否为素数。一个高效的测试方法应当至多需要多项式时间（指输入规模为 $\lceil\log n\rceil$ 时）步骤完成。费马小定理*几乎*给出了这样的一个高效测试方法。费马小定理是说：对于任何质数 $p$，任何不整除于 $p$ 的数 $a$，都有 $a^{p-1}\equiv1\pmod p$。

<details><summary>费马小定理的证明</summary>
  
> **引理 1.1** $\forall a,b,c\in\mathbb Z$，$m\in\mathbb N^+$，且 $(m,c)\xlongequal{\text{def}}\operatorname{GCD}(m,c)=1$，则当 $ac\equiv bc\pmod m$ 时，$a\equiv b\pmod m$。  
>> 证明：条件$\rArr ac-bc\equiv0\pmod m\rArr (a-b)c\equiv 0\pmod m$。因 $m,c$ 互素，故可约去 $c$，得 $a-b\equiv0\pmod m$。即得。  
>
> **引理 1.2** $\mathbb Z\ni m>1$，$b\in\mathbb Z$，$(m,b)=1$。若 $a_1,a_2,\cdots,a_m$ 是模 $m$ 的一个完全剩余系，则 $ba_1,ba_2,\cdots,ba_m$ 也是模 $m$ 的一个完全剩余系。  
>> 完全剩余系：在模 $m$ 的剩余类中各取一个元素，这 $m$ 个数构成了模 $m$ 的完全剩余系。
>>> 剩余类：根据整数 $a\in\mathbb Z$ 除以 $n$ 得到的余数将 $\mathbb Z$ 划分为 $n$ 个等价类，$a$ 所在的等价类记作 $[a]$。又称同余类。
>>
>> 证明：反设存在 $1\leqslant i<j\leqslant m$ 满足 $ba_i\equiv ba_j\pmod m$，则根据**引理 1.1**得 $a_i\equiv a_j\pmod m$。这不满足 $a[i],a[j]$ 构成模 $m$ 的完全剩余系，矛盾。故对于 $\forall 1\leqslant i<j\leqslant m$，$ba_i\not\equiv b_aj\pmod m$，即它们构成完全剩余系。
>
> 证明：对于素数 $p$，构造模 $p$ 的完全剩余系
> $$P=\{1,2,\cdots,p-1\}$$
> 因为 $(a,p)=1$ （$p$ 是素数，$a$ 不是 $p$ 的倍数，故两者互素），由**引理 1.2**得
> $$A=\{a,2a,\cdots,(p-1)a\}$$
> 也是模 $p$ 的完全剩余系。由完全剩余系的性质：
> $$1\cdot2\cdots(p-1)\equiv a\cdot2a\cdots(p-1)a\pmod p$$
> 即 $(p-1)!\equiv(p-1)!\cdot a^{p-1}\pmod p$。
> 显然 $((p-1)!,p)=1$。两侧约去 $(p-1)!$，即得
> $$a^{p-1}\equiv1\pmod p$$

</details>

给出一个 $a$ 和 $n$，然后使用“快速幂”算法高效地检查 $a^{n-1}=1\pmod n$ 是否满足即可。但这并不是一个正确的算法，因为许多合数 $n$ 对于某些 $a$ （被称为 $n$ 的卡迈克尔数 [Car]）也满足这个等式。虽然如此，费马小定理仍然是许多素性检测算法的基础。

自从计算复杂性理论在二十世纪60年代诞生，其相关的记号被正式化、相关的复杂性类被定义，这个问题（指*素性检测*问题）得到深入的研究。平凡地，这个问题是 $\text{co-\bf NP}$ 类的<cite>（即补问题属于 $\bf{NP}$ 集）</cite>：如果 $n$ 非素数，则它有一个<cite>（多项式时间内）</cite>可判定答案（即其非平凡因子）正确性的方法。1974 年，Pratt 证明了这个问题也属于 $\bf{NP}$ 类 [Pra]（即该问题属于 $\bf NP\cap\text{co-\bf NP}$）。

在 1975 年，Miller [Mil] 使用了基于费马小定理的一个性质，使得在假设扩展黎曼猜想（Extended Riemann Hypothesis, ERH）成立的前提下，给出了多项式时间复杂度内的素性检测算法。不久之后，它的算法被 Rabin [Rab] 改进为无条件、但随机化的多项式时间复杂度算法。同时，Solovay 和 Strassen [SS] 在 1974 年给出一个不同的随机多项式时间算法，它使用了这样的性质：对于素数 $n$，$\left(\frac an\right)\equiv a^{\frac{n-1}2}\pmod n$ 对于任意 $a$ 成立（其中 $\left(\frac\ \ \right)$ 是雅可比符号）。它们的算法在 ERH 成立的情形下依然是确定性的。从此，一系列基于许多不同性质的随机化的多项式时间复杂度的算法被提出。

<details><summary>扩展黎曼猜想</summary>

> 设 $K$ 为数域，$\mathcal O_k$ 为 $K$ 的整数环，$a$ 为 $\mathcal O_k$ 的一个理想，$N_a$ 为非零理想的绝对范数，$K$ 上的戴德金 $\zeta$ 函数
> $$\zeta_K(s)=\sum_a\frac1{(N_a)^s}$$
> 其中 $s$ 为实部大于 $1$ 的所有复数，求和运算对所有非零理想 $a$ 进行，猜想 $\zeta_K(s)$ 的所有非平凡零点的实部都为 $\dfrac12$。  
> 当数域 $K$ 取 $\mathbb Q$，$\mathcal O_k$ 取 $\mathbb Z$ 时记为黎曼猜想。

</details>

<details><summary>雅可比符号</summary>

> 整数 $a,m$ 互素，$m$ 的因式分解式为 $m=p_1p_2\cdots p_r$，则定义
> $$\left(\frac am\right)=\left(\frac a{p_1}\right)\left(\frac a{p_2}\right)\cdots\left(\frac a{p_r}\right)$$
> 其中 $\left(\dfrac a{p_i}\right)$ 是勒让德符号：
> $$\left(\frac ap\right)=\begin{cases}
0,&a\equiv0\pmod p\\
1,&a\not\equiv0\pmod p\wedge \exists x\in\mathbb Z, x^2\equiv a\pmod p\\
-1,&\neg(\exists x\in\mathbb Z,x^2\equiv a\pmod p)\\
\end{cases}$$

</details>

1983 年，Adleman, Pomerance 和 Rumely 实现了一个重大突破：他们给出了一个确定性的素性检测算法，且只需要 $(\log n)^{O(\log\log\log n)}$ 的时间（此前的所有确定性算法都需要指数级时间完成）。他们的算法（一定程度上）是 Miller 思路的推广，并使用了更高次的互反律。1986 年，Goldwasser 和 Kilian [GK] 提出了一个基于椭圆曲线的、期望时间复杂度为多项式的随机化算法，它在几乎全部的输入（在某个猜想下成立的*全部*输入）下提供了一种简单的素数判定方法（之前的所有随机算法只提供合数判定。）基于他们的想法，Atkin [Atk]提出了一个类似的算法。Adleman 和 Huang [AH] 改进了 Goldwasser-Kilian 算法，使之成为一个可接受所有输入，并在多项式时间复杂度内完成的随机化算法。

这条研究主线的终极目标就是找到一个无条件的、确定性的多项式时间复杂度的素性测试算法。不论之前的研究进展多么令人印象深刻，这个目标仍然难以企及。但在这篇论文中，我们实现了它。我们给出了一个确定性的，时间复杂度为 $\tilde O(\log^\frac{15}2 n)$ 的素性检测算法。启发式地，我们的算法可以做到更好：基于索菲·热尔曼素数（指素数 $p$ 满足 $2p+1$ 也是素数）的一个普遍认同的猜想，这个算法只需要 $\tilde O(\log^6 n)$ 的时间。我们的算法基于费马小定理在有限域上多项式环上的推广。特别地，我们算法正确性的证明只需要代数上非常简单的工具（除了一个筛法理论上关于素数密度的结果：对于素数 $p$，$p-1$ 会存在一个较大的素因子；但在不需要这个结果时也可将算法的时间复杂度控制在 $\tilde O(\log^\frac{21}2 n)$ 内）。相比来看，之前的素数判定方法 [APR] [GK] [Atk] 显得过于复杂。

<details><summary>Õ 记号的含义</summary>

> $\tilde O(g(n))$ 指 $O(g(n)\log^k(n)),\forall k\in\mathbb N$。第 3 节中给出了严格的定义。

</details>

在第 2 节中，我们总结了算法背后的基本思路。在第 3 节中，我们修正了使用的记号。在第 4 节中，我们给出了算法及其正确性证明。在第 5 节中，我们给出了算法运行时间的<cite>（渐进的）</cite>界。在第 6 节中，我们给出了一些优化算法时间复杂度的方法。

## 2. 思路

我们的测试方法基于以下关于素数的恒等式，它是费马小定理的推广。这个等式也是 [AB] 中的随机化算法的基础：

**引理 2.1** *令 $a\in\mathbb Z, n\in\mathbb N, n\geqslant 2$，且 $(a,n)=1$。则 $n$ 是一个素数当且仅当：*
$$\tag{1}(X+a)^n\equiv X^n+a\pmod n$$

<cite>（此处指左右两个多项式的每一项系数关于 $n$ 同余；或者说对于 $\forall X$ 同余式总成立。）</cite>

证明：当 $0<i<n$ 时，$((X+a)^n-(X^n+a))$ 中 $X^i$ 项的系数为 $\binom nia^{n-i}$<cite>（二项式定理）</cite>。

假设 $n$ 是素数。则 $\binom ni\equiv0\pmod n$ 且多项式所有的系数皆为 $0$。

<details><summary>解释</summary>

> 这是因为：
> 
> **引理 2.1.1** $\forall a,b\in\mathbb Z$，$a$ 是 $b$ 的整倍数，若 $b\equiv1\pmod p$，则$\dfrac ab\equiv a\pmod p$。
>> 证明：设 $a=tb,\ b=sp+1$。则 $\dfrac ab\equiv t\equiv tsp+t\equiv a\pmod p$。
> 
> **引理 2.1.2** $\forall a,b\in\mathbb Z$，$a$ 是 $b$ 的整倍数，$p$ 是素数且 $(p,b)=1$，则 $\dfrac ab\equiv ab^{p-2}\pmod p$。
>> 证明：由费马小定理得 $b^{p-1}\equiv1\pmod p$。故 $\dfrac ab=\dfrac{ab^{p-2}}{b^{p-1}}$。由 **引理 2.1.2** 得 $\dfrac{ab^{p-2}}{b^{p-1}}\equiv ab^{p-2}\pmod p$。
> 
> 则由**引理 2.1.2**得 $\displaystyle\binom ni\operatorname{mod}n=\frac{n(n-1)\cdots(n-i+1)}{i!}\operatorname{mod}n=n(n-1)\cdots(n-i+1)\cdot(i!)^{n-2}\operatorname{mod}n=0$。

</details>

假设 $n$ 是合数。考虑 $n$ 的一个素因子 $q$。取最大的整数 $k$ 满足 $q^k\mid n$ <cite>（原文使用 $\parallel$ 记号（exact division symbol））</cite>。则 $q^k$ 不整除 $\binom nq$。又因为 $a^{n-q}$ 互素，因此 $X^q$ 项的系数在模 $n$ 的意义下非零。所以多项式 $((X+a)^n-(x^n+a))$ 在 $\mathbb Z_n$ 上不恒等于 $0$。$\blacksquare$

<details><summary>解释</summary>

> 这是因为：设 $n=tq^k$ 其中 $q\nmid t$，则 $\displaystyle\binom nq=\frac{n(n-1)\cdots(n-q+1)}{q!}=tq^{k-1}\frac{(n-1)\cdots(n-q+1)}{(q-1)!}=tq^{k-1}\binom {n-1}{q-1}$。由 **引理 2.1.2** 知，$\displaystyle\binom{n-1}{q-1}\equiv\big((n-1)\cdots(n-q+1)\big)\big((q-1)!\big)^{q-2}\pmod q$，而右侧两个因子都不整除于 $q$（前者不含 $q$ 的整倍数，后者都小于 $q$）。所以 $\displaystyle q\nmid\binom{n-1}{q-1}$。所以 $q\nmid t\displaystyle\binom{n-1}{q-1}$。所以 $q^k\nmid\displaystyle\binom nq$。
>
> 这里要证明多项式 $((X+a)^n-(X^n+a))$ 的 $X^q$ 项系数不整除于 $n$，从而证明同余式不成立。已知这一项的系数为 $\binom nqa^{n-q}$，刚刚证明了 $\binom nq$ 不整除于 $n$；又因为 $n,a$ 互素，所以 $a^{n-q}$ 也不整除于 $n$，所以整个系数不整除于 $n$。

</details>

上述恒等式的证明引出了一个简单的素性测试方法：对于输入 $n$，选择任意一个 $a$ 并测试同余式 $(1)$ 是否成立。但是这将消耗高达 $\varOmega(n)$ 的时间，因为在最坏情况下我们需要求值左侧的 $n$ 个系数。一个简单的减少系数求值的方法是，取一个合适的较小的 $r$，并在 $(1)$ 式左右两侧取关于 $X^r-1$ 的模。换句话说，检查下式是否满足：
$$\tag{2}(X+a)^n\equiv X^n+a\pmod{X^r-1,n}$$

<details><summary>上式含义的解释</summary>

> 这里 $\operatorname{mod} X^r-1,n$ 的含义是这样的（在第 3 节中给出了严格的定义，这里只是形象的解释）：
> 1. $\operatorname{mod} n$ 是指对同余式两侧的多项式的每一个系数取关于 $n$ 的模，两侧各得到一个多项式，但其次数不变；
> 2. $\operatorname{mod} X^r-1$ 是指对同余式两侧的多项式做带余除法。比如左侧多项式为 $f(x)$，则找到 $\partial(r(x))<\partial(f(x))$ 满足 $f(x)=p(x)g(x)+r(x)$，$r(x)$ 即为左侧的“余数”。对右侧做一样的操作，如果两侧带余除法得到的 $r(x)$ 相同，则同余式成立。
>
> 可以验证，带余除法的“除数”为 $X^r-1$ 时，实际上是简单地将 $a_iX^i$ 这一项运算到 $a_iX^{i\operatorname{mod}r}$，也就是在指数层面上做模运算，消除了大于等于 $r$ 的项。运算完成后，对于 $\forall 0\leqslant i<r$，$X^i$ 项的系数即为 $\displaystyle\sum_{j\equiv i\pmod r}a_j$。
> 
> 求和运算不影响模运算的结果。所以后文说，由 $(1)$ 式可以推出对于任意的 $r$，$(2)$ 式都成立。

</details>

由**引理 2.1**，可以显然得出对于任意素数 $n$，任意 $a,r$ 的取值都可以满足 $(2)$ 式。现在的问题是，对于一些合数 $n$，某些特殊的 $a$ 和 $r$ 取值也可能满足 $(2)$ 式。但是，我们几乎可以还原这一特性<cite>（指 $(1)$ 式为充要条件）</cite>：我们指出对于恰当选择的 $r$，如果 $(2)$ 式对于一些 $a$ 满足，则 $n$ 必定为素数的幂。$a$ 和 $r$ 的取值数量都被 $\log n$ 构成的多项式所限制。这样，我们得到了一个多项式时间复杂的的素性测试算法。

## 3. 记号与准备

类 $\bf P$ 指图灵机可在多项式时间复杂度内求解的问题 [Lee]；关于 $\bf NP$、$\text{co-\bf NP}$ 等类的定义可查阅 [Lee]。

$\mathbb Z_n$ 指模 $n$ 的整数环<cite>（剩余类环）</cite>，$\mathbb F_p$ 指有 $p$ 个元素的有限域，其中 $p$ 是素数。回忆这样的事实：如果 $p$ 是素数，且 $h(X)$ 是一个次数为 $d$ 的多项式，并在域 $\mathbb F_p$ 下不可约，则 $\mathbb F_p[X]/(h(X))$ 是 $p^d$ 阶的有限域。我们用记号 $f(X)\equiv g(X)\pmod h(X, n)$ 来表示 $f(x)=g(x)$ 在环 $\mathbb Z_n[X]/(h(X))$ 上成立。

<details><summary>补充说明</summary>

> 这里：
> - $\mathbb F[X]$ 指多项式环，其中元素具有形式 $a_nX^n+\cdots+a_1X_1+a_0$，其中 $a_i\in\mathbb F$。
> - 有限域的阶就是其元素个数。
> - $/$ 是商环的记号。这里，商环的构造是由 $h(X)$ 的同余关系导出的。

</details>

我们使用 $\tilde O(t(n))$ 记号表示 $O(t(n)\cdot\operatorname{poly}(\log t(n)))$，其中 $t(n)$ 是任意关于 $n$ 的函数。比如，$\tilde O(\log^k n)=O(\log^kn\cdot\operatorname{poly}(\log\log n))=O(\log^{k+\varepsilon}n)$ 对任意 $\varepsilon>0$ 成立。我们用 $\log$ 表示以 $2$ 为底的对数函数，用 $\ln$ 表示自然对数函数。

<details><summary>补充说明</summary>

> 这里 $\operatorname{poly}(f(n))$ 指以 $f(n)$ 为变元的多项式。

</details>

$\mathbb N$ 和 $\mathbb Z$ 分别表示自然数集和整数集。对于给定的 $r\in\mathbb N,a\in\mathbb Z$ 满足 $(a,r)=1$，则称满足同余式 $a^k\equiv1\pmod r$ 最小的 $k$ 为 *$a$ 模 $r$ 的阶*，记作 $\mathrm o_r(a)$。对于任意 $r\in\mathbb N$，欧拉函数 $\varphi(r)$ 指比 $r$ 小且与 $r$ 互质的<cite>（正整）</cite>数的个数。容易看出，$\mathrm o_r(a)\mid\varphi(r)$ 对任意满足 $(a,r)=1$ 的 $a$ 成立。

<details><summary>“容易看出”的证明</summary>

> **引理 3.0.1** 若 $x\equiv1\pmod r$，则对于 $\forall n\in\mathbb N$，$x^n\equiv1\pmod r$。
>> 证明：设 $x=pr+1$，$p\in\mathbb Z$。则
>> $$(pr+1)^n=\sum_{i=0}^n\binom ni(pr)^i$$
>> 对于 $\forall i>0$，显然 $r\mid(pr)^i$，此时 $\binom ni(pr)^i$ 这些项都整除 $r$。当 $i=0$ 时，$\binom ni(pr)^i=1$。所以 $x^n=(pr+1)^n\equiv1\pmod r$。
>
> **引理 3.0.2（费马-欧拉定理）** $a^{\varphi(r)}\equiv1\pmod{r}$ 对任意满足 $(a,r)=1$ 的 $a$ 和 $r$ 成立。
>> 证明：设 $x_1,x_2,\cdots,x_{\varphi(r)}$ 为小于 $r$ 的与 $r$ 互素的正整数。考虑集合 $\{ax_1,\cdots, ax_{\varphi(r)}\}$，其满足如下性质：
>> - 每个元素关于 $r$ 的模互不相等。否则，$\exists i,j$ 使得 $ax_i\equiv ax_j\pmod r$，则 $r\mid(ax_i-ax_j)$；另一方面由 $a,r$ 互素、$|x_i-x_j|<r$ 得到 $r\nmid a(x_i-x_j)$，矛盾。
>> - $(ax_i\operatorname{mod}r,r)=1$ 对于 $\forall i$ 成立。这可由最大公约数的积性得出：$(a,r)=1\wedge(x_i,r)=1\rArr(ax_i,r)=1\rArr(ax_i\operatorname{mod}r,r)=1$。
>> 
>> 从而 $\{ax_i\operatorname{mod}r\mid 1\leqslant ilqslant\varphi(i)\}$ 是小于 $r$ 且与 $r$ 互质的正整数。这和 $\{x_1,x_2,\cdots,x_{\varphi(r)}\}$ 的定义相同，这两个集合相等。从而
>> $$ax_1\cdot ax_2\cdots ax_{\varphi(r)}\equiv x_1\cdot x_2\cdots ax_{\varphi(r)}\pmod r$$
>> 显然 $x_1x_2\cdots x_{\varphi(r)}$ 与 $r$ 互素，可以消去，于是得到：
>> $$a^{\varphi(r)}\equiv1\pmod r$$
>
> 证明：设 $\varphi(n)=k\mathrm o_r(a)+p$，$k\in\mathbb Z,1<p<n$。则 $a^{\varphi(n)}=(a^{\mathrm o_r(a)})^k\cdot a^p$。即 $a^p=\dfrac{a^{\varphi n}}{(a^{\mathrm o_r(a)})^k}$。由于 $a^{\mathrm o_r(a)}\equiv1\pmod r$，由**引理 3.0.1**知 $(a^{\mathrm o_r(a)})^k\equiv1\pmod r$。再由**引理 2.1.1**和**引理3.0.2**知 $a^p\equiv a^{\varphi(r)}\equiv1\pmod r$。即 $p<\mathrm o_r(a)$ 也满足 $a^p\equiv1\pmod r$，与 $\mathrm o_r(a)$ 的定义矛盾。所以 $p=0$，$\mathrm o_r(a)\mid\varphi(r)$。 


</details>

我们需要知道以下关于前 $m$ 个<cite>（正整）</cite>数的最小公倍数的简单事实：

**引理 3.1** *记 $\operatorname{LCM}(m)$ 为前 $m$ 个<cite>（正整）</cite>数的最小公倍数。当 $m\geqslant7$ 时，*
$$\operatorname{LCM}(m)\geqslant 2^m$$

<details><summary>引理 3.1 的证明</summary>

> **引理 3.1.1** 函数
> $$\tag{2.1}F(m,n)=\sum_{i=0}^{n-m}\frac{(-1)^i\binom{n-m}i}{m+i}$$
> 在 $m,n\in\mathbb N,1\leqslant m\leqslant n$ 上定义，则有恒等式
> $$\tag{2.2}F(m,n)=\begin{cases}\dfrac1{m\binom nm},&m>0\\0,&m=0\end{cases}$$
>> 证明：用数学归纳法对 $n-m$ 做归纳。
>> 当 $n-m=0$ 时，$F(m,n)=0$ 是显然的。
>> 假设 $n-m=r$ 时引理成立。考虑 $n-m=r+1$ 的情形：
>> $$\begin{aligned}
>> F(m,n)&=F(m,m+r+1)\\
>> &=\sum_{i=0}^{r+1}\frac{(-1)^i\binom{r+1}i}{m+i}\\
>> &=\sum_{i=0}^{r+1}\frac{(-1)^i\left(\binom ri+\binom r {i-1}\right)}{m+i}\\
>> &=\sum_{i=0}^{r+1}\frac{(-1)^i\binom ri}{m+i}+\sum_{i=0}^{r+1}\frac{(-1)^i\binom r{i-1}}{m+i}\\
>> &=\sum_{i=0}^r\frac{(-1)^i\binom ri}{m+i}+\sum_{i=1}^r\frac{(-1)^i\binom r{i-1}}{m+i}\\
>> &=\sum_{i=0}^r\frac{(-1)^i\binom ri}{m+i}-\sum_{i=0}^r\frac{(-1)^i\binom ri}{m+i+1}\\
>> &=F(m,m+r)-F(m+1,m+1+r)\\
>> &=\frac1{m\binom{m+r}m}-\frac1{(m+1)\binom{m+r+1}{m+1}}\\
>> &=\frac{m!}{m\cdot(m+r)\cdots(r+1)}-\frac{(m+1)!}{(m+1)\cdot(m+r+1)\cdots(r+1)}\\
>> &=\frac{(m+1)!(r+1)}{m(m+1)\cdot(m+r+1)\cdots(r+1)}\\
>> &=\frac{m!}{m\cdot(m+r+1)\cdots(r+2)}\\
>> &=\frac1{m\binom{m+r+1}{m}}
>> \end{aligned}$$
>> 这就证明了等式 $(2.2)$ 的正确性。
>
> 证明：注意到**引理 3.1.1** 的式 $(2.1)$ 右侧分母只有 $m,(m+1),\cdots,n$，所以约分之后 $F(m,n)$ 的最简形式分母也只能是 $\{m,(m+1),\cdots,n\}$ 的子集的积。所以它必然整除 $\operatorname{LCM}(n)$。运用式 $(2.2)$ 即得：
> $$\left.m\binom nm\middle|\operatorname{LCM}(n)\right.$$
> 由于 $\operatorname{LCM}(2n)\mid\operatorname{LCM}(2n+1)$，故有
> $$\tag{2.3}\left.n\binom{2n}n\middle|\operatorname{LCM}(2n+1)\right.$$
> 又因为 $\displaystyle(2n+1)\binom{2n}n=(n+1)\binom{2n+1}{n+1}$，又有
> $$\tag{2.4}\left.(2n+1)\binom{2n}n\middle|\operatorname{LCM}(2n+1)\right.$$
> 式 $(2.3)\ (2.4)$ 中 $(n,2n+1)=1$，所以
> $$\left.n(2n+1)\binom{2n}n\middle|\operatorname{LCM}(2n+1)\right.$$
> 考虑 $(1+x)^{2n}$ 的二项式展开中，$\binom{2n}n$ 是最大的系数，故有不等式：
> $$(1+x)^{2n}=\sum_{i=0}^{2n}\binom{2n}ix^i\leqslant\sum_{i=0}^{2n}\binom{2n}nx^i$$
> 两侧带入 $x=1$，得到：
> $$2^{2n}\leqslant(2n+1)\cdot\binom{2n}n\cdot1$$
> 当 $n\geqslant4$ 时，
> $$n(2n+1)\binom{2n}n\geqslant n\cdot2^{2n}\geqslant 2^{2n+2}$$
> 由于左侧整除 $\operatorname{LCM}(2n+1)$，所以 $n\geqslant4$ 时
> $$\operatorname{LCM}(2n+2)\geqslant\operatorname{LCM}(2n+1)\geqslant n(2n+1)\binom{2n}n\geqslant 2^{2n+2}$$
> 即 $m\geqslant10$ 时，$\operatorname{LCM}(m)\geqslant 2^m$。可单独验证 $m=7,8,9$ 时不等式依然成立。

</details>
<p></p>

## 4. 算法及其正确性


<div id="anchor">
<div id="algoWrapper">
<pre id="aksAlgorithm">
    \begin{algorithm}
    \caption{AKS 素性检测}
    \begin{algorithmic}
    \PROCEDURE{AksPrimalityTesting}{$n$}
        \IF{存在 $a\in\mathbb N, b>1$, s.t. $n=a^b$}
            \RETURN {$\tt COMPOSITE$}
        \ENDIF
        \STATE $r$ $\larr$ 满足 $\mathrm o_r(n)>\log^2n$ 的最小的 $r$
        \IF{存在 $a\leqslant r$, s.t. $1<(a,n)< r$}
            \RETURN {$\tt COMPOSITE$}
        \ENDIF
        \IF{$n\leqslant r$}
            \RETURN {$\tt PRIME$}
        \ENDIF
        \FOR{$a \larr 1$ \TO $\lfloor\sqrt{\varphi(r)}\log n\rfloor$}
            \IF{$(X+a)^n\not\equiv X^n+a\pmod{X^r-1.n}$}
                \RETURN {$\tt COMPOSITE$}
            \ENDIF
        \ENDFOR
        \RETURN {$\tt PRIME$}
    \ENDPROCEDURE
    \end{algorithmic}
    \end{algorithm}
</pre>
<script>
    pseudocode.renderElement(document.getElementById("aksAlgorithm"), {
        lineNumber: true,
        noEnd: true
    });
    if (false) {
        $(document).on("scroll", function(e) {
            if ($(document).scrollTop() > $("#anchor").offset().top) {
                $("#algoWrapper").addClass("fixed");
            } else {
                $("#algoWrapper").removeClass("fixed");
            }
        });
    }
</script>
</div>

<cite>（此处的伪代码做了排版上的调整，后文将使用行号而非原文的步骤序号来描述。）</cite>

**定理 4.1** *算法 1 返回 $\tt PRIME$ 当且仅当 $n$ 是素数。*

在本节的余下部分，我们将通过一系列引理来证明这个定理。

**引理 4.2** *如果 $n$ 是素数，则算法 1 返回 $\tt PRIME$。*

证明：如果 $n$ 是素数，则行 2 和行 5 条件不会被满足，故前 6 行不会返回 $\tt COMPOSITE$。根据**引理 2.1**，行 10 的条件也不会满足，故 11 行返回 $\tt COMPOSITE$ 也不会执行。所以，算法必然会在行 8 或者行 12 返回 $\tt PRIME$。

<details><summary>解释</summary>

> 行 2 条件不满足的原因很明显：素数不可能是某个因子的高次幂。行 5 条件不满足的原因是，素数 $n$ 和任意比它小的数 $a$ 都互素，所以 $(a,n)=1$ 恒成立，条件不满足。
> 
> 行 10 的条件就是**引理 2.1** 的否。当 $n$ 是素数时，同余式总是相等的。

</details>

但上述引理的逆命题的证明需要花费一些力气。如果算法在行 8 返回 $\tt PRIME$，那么 $n$ 必然是素数。否则，一个合数在行 5 处就能找到一个非平凡因子。所以唯一剩下的情形就是算法在行 12 返回 $\tt PRIME$。为了便于后续分析，我们只讨论这一种情形。

<details><summary>解释</summary>

> 这里反设法假设：$n$ 是合数，但算法执行到了行 8，也就是行 7 条件 $n\leqslant r$ 成立。那么，在行 5 的条件判断中，对于 $n$ 的任意一个非平凡因子 $a$，$(a,n)=a$ 满足 $1<(a,n)<n\leqslant r$ 的条件，所以算法只会执行到行 6。于是推出矛盾，得到结论：如果算法在行 8 返回 $\tt PRIME$，那么 $n$ 必是素数。

</details>

整个算法分为两个大步骤：行 4 找到合适的 $r$ ，以及行 9 到行 11 对 $(2)$ 式带入一系列 $a$ 的值后的验证。我们先把目光放在找到合适 $r$ 这一步。

**引理 4.3** *存在 $r\leqslant\max\{3,\lceil\log^5n\rceil\}$ 使得 $\mathrm o_r(n)>\log^2n$。*

<cite>（原文的证明被认为是错误的。以下证明取自 <i>Errata: PRIMES is in P</i>。）</cite>

当 $n=2$ 时证明是平凡的，只需取 $r=3$ 即可使命题满足。下假设 $n>2$，此时 $\lceil\log^5n\rceil>10$ 从而可以使用**引理 3.1**。观察到满足 $m^k\leqslant B=\lceil\log^5n\rceil\ ,m\geqslant2$ 的最大的 $k$ 为 $\lfloor\log B\rfloor$。先考虑令 $s$ 为最小的不整除
$$n^{\lfloor\log B\rfloor}\cdot\prod_{i=1}^{\lfloor\log^2n\rfloor}(n^i-1)$$
的正整数。那么 $s$ 有多小呢？注意到：
$$n^{\lfloor\log B\rfloor}\cdot\prod_{i=1}^{\lfloor\log^2n\rfloor}(n^i-1)<n^{\lfloor\log B\rfloor+\frac12\log^2n\cdot(\log^2n+1)}\leqslant n^{\log^4n}\leqslant2^{\log^5n}\leqslant2^B$$

<details><summary>不等式的细节</summary>

> 第一个不等式的细节：
> $$\begin{aligned}
> &n^{\lfloor\log B\rfloor}\cdot\prod_{i=1}^{\lfloor\log^2n\rfloor}(n^i-1)\\
> <&n^{\lfloor\log B\rfloor}\cdot\prod_{i=1}^{\lfloor\log^2n\rfloor}n^i\\
> =&n^{\lfloor\log B\rfloor+\sum_{i=1}^{\lfloor\log^2n\rfloor}i}\\
> \leqslant&n^{\lfloor\log B\rfloor+\frac12\lfloor\log^2n\rfloor\cdot(\lfloor\log^2n\rfloor+1)}\\
> \end{aligned}$$
> 第二个不等式的细节：
> $$x^4>\lfloor\log(\lceil x^5\rceil)\rfloor+\frac12\lfloor x^2\rfloor(\lfloor x^2\rfloor+1)$$
> 上式在 $n\geqslant4$ 时成立，而 $n=2,3$ 的情形也可验证原式成立。
> 
> 第三个不等式是显然的。第四个不等式是取整符号的性质。

</details>

（第二个不等式对于任意 $n\geqslant2$ 成立。）由**引理 3.1**，前 $B$ 个正整数的最小公倍数最少为 $2^B$。于是，$s\leqslant B$。所以结果是，$s$ 中与 $n$ 互素的因子为 $\dfrac{s}{(s,n^{\lfloor\log B\rfloor})}$，记其为 $r$。更进一步，根据 $s$ 的选择我们已经有 $r$ 不整除
$$\sum_{i=1}^{\lfloor\log^2n\rfloor}(n^i-1)$$

<details><summary>解释</summary>

> $s\leqslant B$ 的解释：这里使用反证法：否则 $s>B$，则由 $s$ 的定义，小于 $s$ 的所有正整数皆整除 $\displaystyle n^{\lfloor\log B\rfloor}\cdot\prod_{i=1}^{\lfloor\log^2n\rfloor}(n^i-1)$。所以它们的最小公倍数也有 $\left.\operatorname{LCM}(s)\middle|\displaystyle n^{\lfloor\log B\rfloor}\cdot\prod_{i=1}^{\lfloor\log^2n\rfloor}(n^i-1)\right.$，即 $\operatorname{LCM}(s)\leqslant\displaystyle n^{\lfloor\log B\rfloor}\cdot\prod_{i=1}^{\lfloor\log^2n\rfloor}(n^i-1)<2^B$。这与**引理 3.1** 矛盾。
>
> “$s$ 中与 $n$ 互素的因子”的解释：这里形象地讲，求 $s$ 中与 $n$ 互素的因子是将 $n$ 的因子全部从 $s$ 中除去。而证明最初提到的 $k\leqslant\lfloor\log B\rfloor$ 以及现在 $s\leqslant B$ 限制了 $n$ 的因子重复的个数最多不超过 $\lfloor\log B\rfloor$ 个。所以 $s$ 中和 $n$ 相同因子的部分为 $(s,n^{\lfloor\log B\rfloor})$，用 $s$ 除以它即得到 $s$ 中互素的部分。
> 
> “$r$ 不整除”的解释：反设 $r\mid\displaystyle\prod_{i=1}^{\lfloor\log^2n\rfloor}(n^i-1)$，则 $r\mid n^{\lfloor\log B\rfloor}\cdot\displaystyle\prod_{i=1}^{\lfloor\log^2n\rfloor}(n^i-1)$。由于 $r,n^{\lfloor\log B\rfloor}$ 互素，且后者也整除这个数，所以 $rn^{\lfloor\log B\rfloor}$ 也整除这个数。但 $s$ 是 $rn^{\lfloor\log B\rfloor}$ 的因子，这与 $s$ 不整除矛盾。
> 
</details>

于是（与 $n$ 互素的）$r$ 也不整除任意 $n^i-1$，其中 $1\leqslant i\leqslant\lfloor\log^2n\rfloor$，表明 $\mathrm o_r(n)>\log^2n$。$\blacksquare$

<details><summary>解释</summary>

> 上面证明了 $n^i\not\equiv1\pmod r$ 对于任意 $1\leqslant i\leqslant\lfloor\log^2n\rfloor$ 都成立。根据 $\mathrm o_r(n)$ 的定义，则 $\mathrm o_r(n)$ 必然大于 $\log^2n$。

</details>

因为 $\mathrm o_r(n)>1$，则必然存在 $n$ 的素因子 $p$ 使得 $\mathrm o_r(p)>1$。现在，假定 $p>r$（否则算法在行 8 及之前就能够判断 $n$ 的素性）。因为 $(n,r)=1$（否则算法在行 8 及之前就能正确地判断 $n$ 的素性），$p,n\in\mathbb Z^*_r$，数 $p$ 和 $r$ 的值将在这一节余下的部分为定值。此时，令 $l=\lfloor\sqrt{\varphi(r)}\log n\rfloor$。

<details><summary>ℤ* 记号的含义</summary>

$\mathbb Z^*_r$ 表示 $\mathbb Z_r$ 中所有（模 $r$ 的）乘法可逆元构成的集合。

</details>

<details><summary>解释</summary>

> $p=r$ 是不可能的（否则 $\mathrm o_r(p)$ 不存在）。如果 $p<r$，则 $n$ 是素数时 $p=n$，行 7 的条件为真，素性得到判断；$n$ 是合数时 $1<(p,n)=p<r$ ，行 5 的条件为真，素性得到判断。
> 
> $(n,r)=r$ 是不可能的（否则 $\mathrm o_r(p)$ 不存在）。如果 $(n,r)\neq1$，则 $n>r$ 时取 $a=r$，满足行 5 条件，素性得到判断；$n\leqslant r$ 时满足行 7 条件，素性得到判断。

</details>

算法的第 9 行开始在求解有关 $l$ 的等式。由于这一步算法不输出 $\tt COMPOSITE$，所以我们有
$$(X+a)^n\equiv X^n+a\pmod{X^r-1,n}$$
对任意 $a,\ 0\leqslant a\leqslant l$ 成立（其中 $a=0$ 的情形是平凡地满足的）。这表明
$$\tag{3}(X+a)^n\equiv X^n+a\pmod{X^r-1,p}$$

<details><summary>解释</summary>

> 这是因为 $p$ 是 $n$ 的素因子，所以模 $n$ 的同余式对模 $p$ 同样成立。

</details>

对于 $0\leqslant a\leqslant l$ 成立。由**引理 2.1**，我们有
$$\tag{4}(X+a)^p\equiv X^p+a\pmod{X^r-1,p}$$

<details><summary>解释</summary>

> 这是因为 $p$ 是素数，将 $p$ 带入**引理 2.1**的结论即得。

</details>

从 $(3)$ 式和 $(4)$ 式中可以推出
$$(X+a)^\frac np\equiv X^\frac np+a\pmod{X^r-1,p}$$

<details><summary>解释</summary>

> 将 $(3)$ 式写成如下的形式：
> $$\tag{3.1}((X+a)^p)^\frac np\equiv X^n+a\pmod{X^r-1,p}$$
> 由 $(4)$ 式和同余保持幂运算的性质得：
> $$\tag{4.1}((X+a)^p)^\frac np\equiv(X^p+a)^\frac np\pmod{X^r-1,p}$$
> 结合 $(3.1),(4.1)$ 式得到：
> $$(X^p+a)^\frac np\equiv X^n+a\pmod{X^r-1,p}$$
> 最后用 $X$ 替代上式的 $X^p$，得到：
> $$(X+a)^\frac np\equiv X^\frac np+a\pmod{X^r-1,p}$$
> 注：模 $X^r-1$ 可保持原样，因为它并不影响同余性。

</details>

对于 $0\leqslant a\leqslant l$ 成立。这样， $n$ 和 $\frac np$ 在上述式子中都表现出和 $p$ 一样的性质。我们为这种性质起一个名字：

**定义 4.4** 对于多项式 $f(X)$ 和正整数 $m\in\mathbb N$，若
$$(f(X))^m\equiv f(X^m)\pmod{X^r-1,p}$$
则称 $m$ 是关于 $f(X)$ *内省的*。

很清晰地可以看出，$(5)$ 式和 $(4)$ 式中当 $0\leqslant a\leqslant l$ 时 $\frac np$ 和 $p$ 都关于 $X+a$ 内省。

下面的引理给出内省的正整数是对乘法封闭的。

**引理 4.5** *如果 $m$ 和 $m'$ 是关于 $f(X)$ 内省的，则 $mm'$ 也关于它内省。*

证明：因为 $m$ 关于 $f(X)$ 内省，故有：
$$(f(X))^{m\cdot m'}\equiv (f(X^m))^{m'}\pmod{X^r-1,p}$$
同样地，因为 $m'$ 是关于 $f(X)$ 内省的，在 $f(X)$ 中用 $X^m$ 替换 $X$ 后得到：
$$\begin{aligned}
(f(X^m))^{m'}&\equiv f(X^{m\cdot m'})&\pmod{X^{mr}-1,p}\\
&\equiv f(X^{m\cdot m'})&\pmod{X^r-1,p}
\end{aligned}$$
（最后一步是因为 $X^r-1$ 整除 $X^{mr}-1$。）将这两个等式结合我们可以得到：
$$(f(X))^{m\cdot m'}\equiv f(X^{m\cdot m'})\pmod{X^r-1,p}\ \blacksquare$$

对于正整数 $m$，$m$ 关于其内省的函数构成的集合在乘法下也是封闭的：

**引理 4.6** *若 $m$ 关于 $f(X)$ 和 $g(X)$ 内省，则它关于 $f(X)\cdot g(X)$ 也是内省的。*

证明：我们有：
$$\begin{aligned}
(f(X)\cdot g(X))^m&=(f(X))^m\cdot(g(X))^m\\
&\equiv f(X^m)\cdot g(X^m)\pmod{X^r-1,p}\ \blacksquare
\end{aligned}$$

以上两个引理共同表明了集合 $I=\displaystyle\left\{\left(\frac np\right)^i\cdot p^j\ \middle|\ i,j\geqslant 0\right\}$ 中的每一个数关于集合 $P=\displaystyle\left\{\prod_{a=0}^l(X+a)^{e_a}\ \middle|\ e_a\geqslant0\right\}$ 中的每一个多项式都是内省的。我们现在基于这些集合定义两个群；它们将在接下来的证明中起到重要的作用。

第一个群是 $I$ 中所有数模 $r$ 的剩余构成的集合
