<!-- title: PRIMES is in P -->

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
        font-family: "Georgia", 方正楷体简体, 华文楷体, 楷体, 楷体GB2312
    }
    cite {
        font-style: normal;
        color: darkgrey;
    }
    summary {
        color: darkgrey;
    }
    #algoWrapper {
        position: relative;
    }
    #algoWrapper #fixCheck {
        position:absolute;
        top:3px;
        right:0;
        z-index:999;
    }
    #algoWrapper.fixed {
        width: min(calc(100vw - 2em),42em);
        position: fixed;
        top: 0;
        background: white;
        z-index: 599;
    }
    #algoWrapper.fixed #fixCheck {
        position:absolute;
        top:15px;
        right:0;
        z-index:999;
    }
</style>

# 多项式复杂度内的素性检测算法 <br> <small><b>PRIMES</b> is in <b>P</b></small>

<p align="right">
发表于 <i>Annals of Mathematics</i> <b>160</b> (2004), 781-793<br>
原作者：Manindra Agrawal, Neeraj Kayal, Nitin Saxena<br>  
译：谷雨同学
</p>

## 摘要

在此文中，我们给出了一个无条件的、确定性的多项式时间复杂度算法，它可用于检测一个输入的整数是素数还是合数。

## 1. 概述

素数是数学和数论中最为基础的重要部分，所以人们抱有很大的兴趣去研究素数的性质。其中一个性质就是如何去高效地判断一个整数是否为素数。这样高效的检测将在实践中非常有用：密码学的协议需要用到大素数来完成。

记 $\bf{PRIMES}$ 为所有素数的集合。素数的定义告诉我们如何决定一个数 $n$ 是否属于 $\bf{PRIMES}$：尝试用每一个<cite>（大于 $1$ 的）</cite>整数 $m\leqslant\sqrt n$ 去除 $n$ ——如果存在一个 $m$ 整除 $n$，那么 $n$ 就是合数，否则 $n$ 就是素数。这种测试方法在古希腊时代就已经被发现，是*埃拉托斯特尼*（约公元前 240）*筛法*（一种生成小于 $n$ 的素数集的算法）的一个特殊情形。但这种测试方法是低效率的：它需要 $\varOmega(\sqrt n)$ 的步骤来决定 $n$ 是否为素数。一个高效的测试方法应当至多需要多项式时间（指输入规模为 $\lceil\log n\rceil$ 时）步骤完成。费马小定理*几乎*给出了这样的一个高效测试方法。费马小定理是说：对于任何质数 $p$，任何不整除于 $p$ 的数 $a$，都有 $a^{p-1}\equiv1\pmod p$。

<details><summary>费马小定理的证明</summary>
  
> **引理 1.1** *$\forall a,b,c\in\mathbb Z$，$m\in\mathbb N^+$，且 $(m,c)\xlongequal{\text{def}}\operatorname{GCD}(m,c)=1$，则当 $ac\equiv bc\pmod m$ 时，$a\equiv b\pmod m$。*
>> *证明*：条件$\rArr ac-bc\equiv0\pmod m\rArr (a-b)c\equiv 0\pmod m$。因 $m,c$ 互素，故可约去 $c$，得 $a-b\equiv0\pmod m$。即得。  
>
> **引理 1.2** *$\mathbb Z\ni m>1$，$b\in\mathbb Z$，$(m,b)=1$。若 $a_1,a_2,\cdots,a_m$ 是模 $m$ 的一个完全剩余系，则 $ba_1,ba_2,\cdots,ba_m$ 也是模 $m$ 的一个完全剩余系。*
>> 完全剩余系：在模 $m$ 的剩余类中各取一个元素，这 $m$ 个数构成了模 $m$ 的完全剩余系。
>>> 剩余类：根据整数 $a\in\mathbb Z$ 除以 $n$ 得到的余数将 $\mathbb Z$ 划分为 $n$ 个等价类，$a$ 所在的等价类记作 $[a]$。又称同余类。
>>
>> *证明*：反设存在 $1\leqslant i<j\leqslant m$ 满足 $ba_i\equiv ba_j\pmod m$，则根据**引理 1.1** 得 $a_i\equiv a_j\pmod m$。这不满足 $a[i],a[j]$ 构成模 $m$ 的完全剩余系，矛盾。故对于 $\forall 1\leqslant i<j\leqslant m$，$ba_i\not\equiv ba_j\pmod m$，即它们构成完全剩余系。
>
> *证明*：对于素数 $p$，构造模 $p$ 的完全剩余系
> $$P=\{1,2,\cdots,p-1\}$$
> 因为 $(a,p)=1$ （$p$ 是素数，$a$ 不是 $p$ 的倍数，故两者互素），由**引理 1.2** 得
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

*证明*：当 $0<i<n$ 时，$((X+a)^n-(X^n+a))$ 中 $X^i$ 项的系数为 $\binom nia^{n-i}$<cite>（二项式定理）</cite>。

假设 $n$ 是素数。则 $\binom ni\equiv0\pmod n$ 且多项式所有的系数皆为 $0$。

<details><summary>解释</summary>

> 这是因为：
> 
> **引理 2.1.1** *$\forall a,b\in\mathbb Z$，$a$ 是 $b$ 的整倍数，若 $b\equiv1\pmod p$，则$\dfrac ab\equiv a\pmod p$。*
>> *证明*：设 $a=tb,\ b=sp+1$。则 $\dfrac ab\equiv t\equiv tsp+t\equiv a\pmod p$。
> 
> **引理 2.1.2** *$\forall a,b\in\mathbb Z$，$a$ 是 $b$ 的整倍数，$p$ 是素数且 $(p,b)=1$，则 $\dfrac ab\equiv ab^{p-2}\pmod p$。*
>> *证明*：由费马小定理得 $b^{p-1}\equiv1\pmod p$。故 $\dfrac ab=\dfrac{ab^{p-2}}{b^{p-1}}$。由 **引理 2.1.2** 得 $\dfrac{ab^{p-2}}{b^{p-1}}\equiv ab^{p-2}\pmod p$。
> 
> 则由**引理 2.1.2** 得 $\displaystyle\binom ni\operatorname{mod}n=\frac{n(n-1)\cdots(n-i+1)}{i!}\operatorname{mod}n=n(n-1)\cdots(n-i+1)\cdot(i!)^{n-2}\operatorname{mod}n=0$。

</details>

假设 $n$ 是合数。考虑 $n$ 的一个素因子 $q$。取最大的整数 $k$ 满足 $q^k\mid n$ <cite>（原文使用 $\parallel$ 记号（exact division symbol））</cite>。则 $q^k$ 不整除 $\binom nq$，且它 $a^{n-q}$ 互素。因此 $X^q$ 项的系数在模 $n$ 的意义下非零。所以多项式 $((X+a)^n-(X^n+a))$ 在 $\mathbb Z_n$ 上不恒等于 $0$。$\blacksquare$

<details><summary>解释</summary>

> 设 $n=tq^k$ 其中 $q\nmid t$，则 $\displaystyle\binom nq=\frac{n(n-1)\cdots(n-q+1)}{q!}=tq^{k-1}\frac{(n-1)\cdots(n-q+1)}{(q-1)!}=tq^{k-1}\binom {n-1}{q-1}$。由 **引理 2.1.2** 知，$\displaystyle\binom{n-1}{q-1}\equiv\big((n-1)\cdots(n-q+1)\big)\big((q-1)!\big)^{q-2}\pmod q$，而右侧两个因子都不整除于 $q$（前者不含 $q$ 的整倍数，后者都小于 $q$）。所以 $\displaystyle q\nmid\binom{n-1}{q-1}$。所以 $q\nmid t\displaystyle\binom{n-1}{q-1}$。所以 $q^k\nmid\displaystyle\binom nq$。
> 
> 由于 $a$ 和 $n$ 互素，故 $a$ 和 $q^k$ 也互素。进而 $a^{n-q}$ 和 $q^k$ 也互素。
>
> 这里要证明多项式 $((X+a)^n-(X^n+a))$ 的 $X^q$ 项系数不整除于 $n$，从而证明同余式不成立。已知这一项的系数为 $\binom nqa^{n-q}$，刚刚证明了 $\binom nq$ 不整除于 $n$；又因为 $n,a$ 互素，所以 $a^{n-q}$ 也不整除于 $n$。由于这两者互素，所以它们的乘积——即整个系数也不整除于 $n$。

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

> **引理 3.0.1** *若 $x\equiv1\pmod r$，则对于 $\forall n\in\mathbb N$，$x^n\equiv1\pmod r$。*
>> *证明*：设 $x=pr+1$，$p\in\mathbb Z$。则
>> $$(pr+1)^n=\sum_{i=0}^n\binom ni(pr)^i$$
>> 对于 $\forall i>0$，显然 $r\mid(pr)^i$，此时 $\binom ni(pr)^i$ 这些项都整除 $r$。当 $i=0$ 时，$\binom ni(pr)^i=1$。所以 $x^n=(pr+1)^n\equiv1\pmod r$。
>
> **引理 3.0.2（费马-欧拉定理）** *$a^{\varphi(r)}\equiv1\pmod{r}$ 对任意满足 $(a,r)=1$ 的 $a$ 和 $r$ 成立。*
>> *证明*：设 $x_1,x_2,\cdots,x_{\varphi(r)}$ 为小于 $r$ 的与 $r$ 互素的正整数。考虑集合 $\{ax_1,\cdots, ax_{\varphi(r)}\}$，其满足如下性质：
>> - 每个元素关于 $r$ 的模互不相等。否则，$\exists i,j$ 使得 $ax_i\equiv ax_j\pmod r$，则 $r\mid(ax_i-ax_j)$；另一方面由 $a,r$ 互素、$|x_i-x_j|<r$ 得到 $r\nmid a(x_i-x_j)$，矛盾。
>> - $(ax_i\operatorname{mod}r,r)=1$ 对于 $\forall i$ 成立。这可由最大公约数的积性得出：$(a,r)=1\wedge(x_i,r)=1\rArr(ax_i,r)=1\rArr(ax_i\operatorname{mod}r,r)=1$。
>> 
>> 从而 $\{ax_i\operatorname{mod}r\mid 1\leqslant i\leqslant\varphi(i)\}$ 是小于 $r$ 且与 $r$ 互质的正整数。这和 $\{x_1,x_2,\cdots,x_{\varphi(r)}\}$ 的定义相同，这两个集合相等。从而
>> $$ax_1\cdot ax_2\cdots ax_{\varphi(r)}\equiv x_1\cdot x_2\cdots ax_{\varphi(r)}\pmod r$$
>> 显然 $x_1x_2\cdots x_{\varphi(r)}$ 与 $r$ 互素，可以消去，于是得到：
>> $$a^{\varphi(r)}\equiv1\pmod r$$
>
> *证明*：设 $\varphi(n)=k\mathrm o_r(a)+p$，$k\in\mathbb Z,1<p<n$。则 $a^{\varphi(n)}=(a^{\mathrm o_r(a)})^k\cdot a^p$。即 $a^p=\dfrac{a^{\varphi n}}{(a^{\mathrm o_r(a)})^k}$。由于 $a^{\mathrm o_r(a)}\equiv1\pmod r$，由**引理 3.0.1** 知 $(a^{\mathrm o_r(a)})^k\equiv1\pmod r$。再由**引理 2.1.1** 和**引理3.0.2** 知 $a^p\equiv a^{\varphi(r)}\equiv1\pmod r$。即 $p<\mathrm o_r(a)$ 也满足 $a^p\equiv1\pmod r$，与 $\mathrm o_r(a)$ 的定义矛盾。所以 $p=0$，$\mathrm o_r(a)\mid\varphi(r)$。 


</details>

我们需要知道以下关于前 $m$ 个<cite>（正整）</cite>数的最小公倍数的简单事实：

**引理 3.1** *记 $\operatorname{LCM}(m)$ 为前 $m$ 个<cite>（正整）</cite>数的最小公倍数。当 $m\geqslant7$ 时，*
$$\operatorname{LCM}(m)\geqslant 2^m$$

<details><summary>引理 3.1 的证明</summary>

> **引理 3.1.1** *函数*
> $$\tag{2.1}F(m,n)=\sum_{i=0}^{n-m}\frac{(-1)^i\binom{n-m}i}{m+i}$$
> *在 $m,n\in\mathbb N,1\leqslant m\leqslant n$ 上定义，则有恒等式*
> $$\tag{2.2}F(m,n)=\begin{cases}\dfrac1{m\binom nm},&m>0\\0,&m=0\end{cases}$$
>> *证明*：用数学归纳法对 $n-m$ 做归纳。
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
> *证明*：注意到**引理 3.1.1** 的式 $(2.1)$ 右侧分母只有 $m,(m+1),\cdots,n$，所以约分之后 $F(m,n)$ 的最简形式分母也只能是 $\{m,(m+1),\cdots,n\}$ 的子集的积。所以它必然整除 $\operatorname{LCM}(n)$。运用式 $(2.2)$ 即得：
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


<div id="anchor"></div>
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
<span id="fixCheck"><input type="checkbox">悬浮显示</span>
<script>
    const fixed = false;
    pseudocode.renderElement(document.getElementById("aksAlgorithm"), {
        lineNumber: true,
        noEnd: true
    });
    function listener(e) {
        if ($(document).scrollTop() > $("#anchor").offset().top) {
            $("#algoWrapper").addClass("fixed");
        } else {
            $("#algoWrapper").removeClass("fixed");
        }
    }
    if (fixed) {
        $(document).on("scroll", listener);
        $('#fixCechk input').attr('checked');
    }
    $('#fixCheck').change(function(){
        $(document).off("scroll");
        if ($('#fixCheck input').is(":checked")) {
            $(document).on("scroll", listener);
        } else {
            $("#algoWrapper").removeClass("fixed");
        }
    });
</script>
</div>

<cite>（此处的伪代码做了排版上的调整，后文将使用行号而非原文的步骤序号来描述。）</cite>

**定理 4.1** *算法 1 返回 $\tt PRIME$ 当且仅当 $n$ 是素数。*

在本节的余下部分，我们将通过一系列引理来证明这个定理。

**引理 4.2** *如果 $n$ 是素数，则算法 1 返回 $\tt PRIME$。*

*证明*：如果 $n$ 是素数，则行 2 和行 5 条件不会被满足，故前 6 行不会返回 $\tt COMPOSITE$。根据**引理 2.1**，行 10 的条件也不会满足，故 11 行返回 $\tt COMPOSITE$ 也不会执行。所以，算法必然会在行 8 或者行 12 返回 $\tt PRIME$。

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

*证明*：当 $n=2$ 时证明是平凡的，只需取 $r=3$ 即可使命题满足。下假设 $n>2$，此时 $\lceil\log^5n\rceil>10$ 从而可以使用**引理 3.1**。观察到满足 $m^k\leqslant B=\lceil\log^5n\rceil\ ,m\geqslant2$ 的最大的 $k$ 为 $\lfloor\log B\rfloor$。先考虑令 $s$ 为最小的不整除
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

> 引理 4.3 表明 $r\leqslant\lceil\log^5 n\rceil$，所以行 7 的判断只在 $n\leqslant5690034$ 时必须。 

<details><summary>解释</summary>

> 上面证明了 $n^i\not\equiv1\pmod r$ 对于任意 $1\leqslant i\leqslant\lfloor\log^2n\rfloor$ 都成立。根据 $\mathrm o_r(n)$ 的定义，则 $\mathrm o_r(n)$ 必然大于 $\log^2n$。

</details>

因为 $\mathrm o_r(n)>1$，则必然存在 $n$ 的素因子 $p$ 使得 $\mathrm o_r(p)>1$。现在，假定 $p>r$（否则算法在行 8 及之前就能够判断 $n$ 的素性）。因为 $(n,r)=1$（否则算法在行 8 及之前就能正确地判断 $n$ 的素性），$p,n\in\mathbb Z^*_r$，数 $p$ 和 $r$ 的值将在这一节余下的部分为定值。此时，令 $l=\lfloor\sqrt{\varphi(r)}\log n\rfloor$。

<details><summary>ℤ* 记号的含义</summary>

> $\mathbb Z^*_r$ 表示 $\mathbb Z_r$ 中所有（模 $r$ 的）乘法可逆元构成的集合。

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

> 这是因为 $p$ 是素数，将 $p$ 带入**引理 2.1** 的结论即得。

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

*证明*：因为 $m$ 关于 $f(X)$ 内省，故有：
$$(f(X))^{m\cdot m'}\equiv (f(X^m))^{m'}\pmod{X^r-1,p}$$
同样地，因为 $m'$ 是关于 $f(X)$ 内省的，在 $f(X)$ 中用 $X^m$ 替换 $X$ 后得到：
$$\begin{aligned}
(f(X^m))^{m'}&\equiv f(X^{m\cdot m'})&&\pmod{X^{mr}-1,p}\\
&\equiv f(X^{m\cdot m'})&&\pmod{X^r-1,p}
\end{aligned}$$
（最后一步是因为 $X^r-1$ 整除 $X^{mr}-1$。）将这两个等式结合我们可以得到：
$$(f(X))^{m\cdot m'}\equiv f(X^{m\cdot m'})\pmod{X^r-1,p}\ \blacksquare$$

对于正整数 $m$，$m$ 关于其内省的函数构成的集合在乘法下也是封闭的：

**引理 4.6** *若 $m$ 关于 $f(X)$ 和 $g(X)$ 内省，则它关于 $f(X)\cdot g(X)$ 也是内省的。*

*证明*：我们有：
$$\begin{aligned}
(f(X)\cdot g(X))^m&=(f(X))^m\cdot(g(X))^m\\
&\equiv f(X^m)\cdot g(X^m)\pmod{X^r-1,p}\ \blacksquare
\end{aligned}$$

以上两个引理共同表明了集合 $I=\displaystyle\left\{\left(\frac np\right)^i\cdot p^j\ \middle|\ i,j\geqslant 0\right\}$ 中的每一个数关于集合 $P=\displaystyle\left\{\prod_{a=0}^l(X+a)^{e_a}\ \middle|\ e_a\geqslant0\right\}$ 中的每一个多项式都是内省的。我们现在基于这些集合定义两个群；它们将在接下来的证明中起到重要的作用。

第一个群是 $I$ 中所有数模 $r$ 的剩余<cite>（余数）</cite>构成的集合。由于之前所观察到的，$(n,r)=(p,r)=1$，所以这是 $\mathbb Z_r^*$ 的一个子群。记这个群为 $G$，记 $|G|=t$。$G$ 是通过 $n$ 和 $p$ 模 $r$ 生成的，因为 $\mathrm o_r(n)>\log^2 n$，故得到 $t>\log^2 n$。

<details><summary>解释</summary>


> $(n,r)=1$ 是之前的假设（否则算法提前结束）。$(p,r)=1$ 是因为 $p$ 是素数。
> 
> $G$ 是 $\mathbb Z_r^*$ 的子群是因为：
> - 乘法运算满足结合律；
> - $G$ 中含有单位元 $1$；
> - $G$ 中的每个元素都有逆元：对于 $\forall x\in G$，总有 $(x,r)=1$。（这是因为 $(p,r)=1$ 和 $(\frac np,r)=1$ 总是成立，若干个它们乘起来也与 $r$ 互素。）于是，$\exists a,b\in\mathbb Z$ 使得 $ax+br=1$。两侧对 $r$ 取模，得到 $ax\equiv1\pmod r$，此时 $a$ 即为 $x$ 的逆元。
> 
> $t>\log^2 n$的解释：
> - 首先，$1,n,n^2,\cdots,n^{\mathrm o_r(n)-1}$ 都是 $I$ 的元素，而且它们 $n$ 个元素模 $r$ 的值两两不同。否则，$\exists i,j<\mathrm o_r(n)$ 使得 $n^i\equiv n^j\pmod r$，那么 $0\equiv n^j-n^i=n^i(n^{j-i}-1)\pmod r$。如之前所述，$n^i\not\equiv0\pmod r$，所以 $n^{j-i}\equiv1\pmod r$。而 $j-i<\mathrm o_r(n)$，与 $\mathrm o_r(n)$ 定义矛盾。
> - 将这些数模 $r$ 后得到了互异的 $G$ 的元素，所以 $G$ 的大小（阶）$t\geqslant\mathrm o_r(n)$。又由**引理 4.3** 的 $\mathrm o_r(n)>\log^2 n$，就得到了 $t>\log^2 n$。

</details>

为了定义第二个群，我们需要了解一些关于有限域上分圆多项式的基本事实。令 $Q_r(X)$ 为 $\mathbb F_p$ 上的 $r$ 阶分圆多项式。多项式 $Q_r(X)$ 整除 $X^r-1$，并且可以被分解为次数为 $\mathrm o_r(p)$ 的不可约多项式 [LN]。令 $h(X)$ 是其中一个不可约多项式。由于 $\mathrm o_r(p)>1$，$h(X)$ 的次数大于一。第二个群是所有 $P$ 中多项式模 $p$ 和 $h(X)$ 的剩余<cite>（余式）</cite>。记这个群为 $\mathcal G$，它是由域 $\mathbb F=\mathbb F_p[X]/(h(X))$ 中的元素 $X,X+1,X+2,\cdots,X+l$ 生成的。$\mathcal G$ 是 $\mathbb F$ 的子群。

<details><summary>粗糙的解释</summary>

> 分圆多项式：$n$ 次分圆多项式是指多项式 $X^n-1$ 因式分解中的一个特定多项式 $f(X)$。$f(X)$ 满足这样的性质：对于 $\forall k<n$，$f(X)=0$ 的解总不是 $X^k-1=0$ 的解。
> 
> 感性地理解分圆多项式：在复数域上，$X^n-1$ 的根（被称为*单位根*）总是出现在复平面的单位圆上。（这与复数乘法的几何含义——长度（模）相乘、角度相加——相吻合）所以，$X^n-1$ 的解多项式总是这些等分单位圆的半径所代表的复数的积。而这些复数中，总有一些也是 $X^k-1\ (k<n)$ 的解。比如 $X^3-1$ 的三个根 $X_1=1,X_2=\frac{-1-\sqrt3\mathrm i}2,X_3=\frac{-1+\sqrt3\mathrm i}2$ 中，$X_1$ 显然也是 $X^1-1$ 的解。所以，只有 $(X-X_2)(X-X_3)$ 这个多项式满足分圆多项式的含义。（$X_2,X_3$ 被称为三次的*本原单位根*。）类似地：
> - 四次分圆多项式是“上面的”根和“下面的”根的“乘积”（“左面的”根满足二次的解，“右面的”根满足一次的解）；
> - 五次分圆多项式就是除了 $1$ 的剩下四个的“乘积”；
> - 六次分圆多项式就是除了 $1,-1,\frac{-1-\sqrt3\mathrm i}2,\frac{-1+\sqrt3\mathrm i}2$ 这四个根之后剩下的“右上”“右下”这两个根的“乘积”。
>
> （上文“乘积”的意思就是 $\displaystyle\prod_i(X-X_i)$，其中 $X_i$ 就是“根”。）
> 
> 下面考察 $n$ 次分圆多项式的次数。显然，这取决于它是多少个“根”乘起来的——或者说 $n$ 次本原单位根有多少个。$n$ 次单位根有 $n$ 个是显然的，所以只需要去掉那些是单位根但不是本原单位根的就可以了。考虑第 $i$ 个单位根，它距离 $x$ 正半轴的角度为 $\frac in\cdot2\pi$。但如果 $(i,n)\neq1$ 的话，那么它还可以写成 $\frac {i/(i,n)}{n/(i,n)}\cdot2\pi$。也就是说，这个根同样是 $X^\frac n{(i,n)}-1=0$ 的第 $\frac i{(i,n)}$ 个根，这就不满足本原单位根的定义了。所以，如果第 $i$ 个根是本原单位根，那么它就需要满足 $(i,n)=1$。所以 $n$ 次本原单位根的个数就是比 $n$ 小的、与 $n$ 互素的正整数的个数。这个值恰好就是 $\varphi(n)$。也就是说：$n$ 次分圆多项式的次数为 $\varphi(n)$；或者说，$n$ 次分圆多项式在复数域上可以分解成 $\varphi(n)$ 个一次不可约多项式。
>
> 此外，高斯证明了一个不太平凡的结论，如果 $n$ 次分圆多项式定义在整数环上，则它是不可约的。对于 $n$ 是素数的情形可以通过艾森斯坦判别法来做，但对于其他情形则略显复杂。
> 
> 但是原文中的多项式并不是定义在整数环 $\mathbb Z$ 上的，而是整数模 $p$ 的域 $\mathbb F_p$ 上。不过可以证明，此时的 $n$ 次分圆多项式可以被分解为 $\frac{\varphi(n)}{\mathrm o_n(p)}$ 个不可约多项式的乘积，其中每个不可约多项式都是 $\mathrm o_n(p)$ 次的。（相关的证明在 [LN] 的定理 2.47 中给出。）这个 $\mathrm o_n(p)$ 次的多项式就是后文所述的 $h(X)$。
> 
> 群 $\mathcal G$ 是定义在有限域 $\mathbb F=\mathbb F_p[X]/(h(X))$ 下的，也就是 $\mathbb F_p[X]$ 关于次数为 $\mathrm o_r(p)$ 的多项式 $h(X)$ 取模得到的多项式域。在这个域中，有多项式 $X,X+1,\cdots,X+l$ 这 $l+1$ 个元素，它们之间互相做乘法就得到了 $\mathcal G$。
> 
> $h(X)$ 的不可约性保证了这个群的乘法是良定义的，如同 $\mathbb Z_r$ 中的 $r$ 也必须为素数的幂才能保证其乘法的良定义。

</details>

下面的引理给出了群 $\mathcal G$ 大小的下界。这是由 Hendrik Lenstra Jr. [Len] 给出的，它相比本论文较早的版本 [AKS] 在结论上有一些微小的改进。

> Macaj [Mac] 也独立地证明了此引理。

**引理 4.7**（Hendrik Lenstra Jr.）*$|\mathcal G|\geqslant\displaystyle\binom{t+l}{t-1}$。*

*证明*：首先注意到因为 $h(X)$ 是分圆多项式 $Q_r(X)$ 的因式，所以 $X$ 是 $\mathbb F$ 的 $r$ 次本原单位根<cite>（？）</cite>。

我们将要证明 $P$ 中次数小于 $t$ 的任意两个不同的多项式会映射到 $\mathcal G$ 中的不同元素。令 $f(X)$ 和 $g(X)$ 是 $P$ 中的这样两个多项式。假设在 $\mathbb F$ 中 $f(X)=g(X)$。<cite>（即 $f(X)\equiv g(X)\pmod{h(X),p}$。）</cite>令 $m\in I$。我们同样有在 $\mathbb F$ 中 $(f(X))^m=(g(X))^m$。因为 $m$ 关于 $f$ 和 $g$ 内省，而且 $h(X)$ 整除 $X^r-1$，所以我们得到了在 $\mathbb F$ 上：
$$f(X^m)=g(X^m)$$

<details><summary>解释</summary>

> $\mathbb F$ 中 $(f(X))^m=(g(X))^m$，或者说 $(f(X))^m\equiv(g(X))^m\pmod{h(X),p}$ 是同余式的性质，之前（$(3) (4)$ 式引出内省定义时）已经用过一次了。
> 
> 内省的定义是指 $(f(X))^m\equiv f(X^m)\pmod{X^r-1,p}$。而因为 $h(X)\mid X^r-1$，所以有 $(f(X))^m\equiv f(X^m)\pmod{h(X),p}$。类似地对 $g(X)$ 也这样做，就能得到 $f(X^m)\equiv g(X^m)\pmod{h(X),p}$，或者是原文中的 $\mathbb F$ 上 $f(X^m)=g(X^m$)。

</details>

这表明对于任意的 $m\in G$，$X^m$ 是多项式 $Q(Y)=f(Y)-g(Y)$ 的根。由于 $(m,r)=1$ （因为 $G$ 是 $\mathbb Z_r^*$ 的子群），任何一个这样的 $X^m$ 都是 $r$ 次本原单位根<cite>（？）</cite>。因此这里 $Q(Y)$ 在 $\mathbb F$ 上会有 $|G|=t$ 个不同的根。但是，根据 $f$ 和 $g$ 的选择，$Q(Y)$ 的次数小于 $t$，这导致了矛盾。所以，$\mathbb F$ 中有 $f(X)\neq g(X)$。

<details><summary>解释</summary>

> $(m,r)=1$ 是因为 $G$ 中的元素是由与 $r$ 互素的 $p$ 和 $\frac np$ 组成的。
>
> $(m,r)=1$ 表明对于不同的 $m$，其模 $r$ 的结果是不同的；或者说，$X^m$ 在模 $X^r-1$ 时得到的结果是不同的。而 $m$ 的取值共有 $|G|=t$ 个选择，$X^m$ 也有 $t$ 个，模 $X^r-1$ 之后还是 $t$ 个，所以在 $\mathbb F$ 中能够找到 $t$ 个满足 $Q(Y)=0$ 的解。但是，$Q(Y)$ 的次数小于 $t$，代数基本定理表明方程 $Q(Y)=0$ 解的个数不可能大于等于 $t$。所以这就导致矛盾，假设 $f(X)\equiv g(X)\pmod{X^r-1,p}$ 是错误的。 

</details>

因为 $l=\lfloor\sqrt{\varphi(r)}\log n\rfloor<\sqrt r\log n<r$，同时 $p>r$，所以对于任意 $i,j,\ 1\leqslant i<j\leqslant l$，在 $\mathrm F_p$ 中总有 $i\neq j$。<cite>（即 $i\not\equiv j\pmod p$。）</cite>所以元素 $X,X+1,X+2,\cdots,X+l$ 是 $\mathbb F$ 中互异的元素。此外，由于 $h(X)$ 的次数大于一，故对于任意 $a,\ 0\leqslant a\leqslant l$，总有在 $\mathbb F$ 中 $X+a\neq0$。所以 $\mathcal G$ 中至少存在 $l+1$ 个互异的一次多项式。因此，$\mathcal G$ 中至少存在 $\binom{t+l}{t-1}$ 个互异的次数小于 $t$ 的多项式。$\blacksquare$

<details><summary>解释</summary>

> 由欧拉函数的定义知 $\varphi(r)<r$，所以 $l<\sqrt r\log n$。而之前证明了 $\log^2n<t$，从而 $\log n<\sqrt t$；由群 $G$ 的构造方法（对 $r$ 取模）知 $t<r$，从而 $\log n<\sqrt r$。综上，得到了 $l<r<p$（后一个不等号是之前的假设）。
>
> 通过证明 $l<p$，表明 $i$ 本身在模 $p$ 的含义下两两不同。又因为次数小于 $t$ 的互异多项式模运算之后仍然互异，所以互异的 $X+i\ (0\leqslant i\leqslant l)$ 在模完之后仍然下两两不同。
> 
> $X+i$ 不是零多项式的原因是：只有当 $X+i$ 整除以 $h(X)$ 时才会被模到 $0$，但 $\partial(h(X))>1$ 且 $\partial(X+i)=1$，故不可能有 $h(X)\mid X+i$，所以 $X+i$ 总不是零多项式。
> 
> 关于多项式数量：$i$ 次多项式相当于从 $l+1$ 个一次多项式中可重复地取出 $i$ 个，即 $\displaystyle\left(\!\!\binom {l+1}i\!\!\right)=\binom{l+1+i-1}{i}=\binom{l+i}i$。
>> 重复组合：从 $n$ 个元素中取出 $r$ 个元素，但这 $r$ 个元素可以重复出现，则组合数量即为 $H_n^r$，也记作 $\displaystyle\left(\!\!\binom nr\!\!\right)$。其中，$H_n^r=C_{n+r-1}^r$。
>
> 那么，小于 $t$ 次的多项式总数至少为：
> $$\begin{aligned}
> \sum_{i=0}^{t-1}\binom{l+i}i&=1+\sum_{i=1}^{t-1}\left(\binom{l+i+1}i-\binom{l+i}{i-1}\right)\\
>&=1+\binom{l+2}1-\binom{l+1}0+\binom{l+3}2\\
>&\qquad\qquad-\binom{l+2}1+\cdots+\binom{l+t}{t-1}-\binom{l+t-1}{t-2}\\
> &=\binom{l+t}{t-1}
> \end{aligned}$$

</details>

对于 $n$ 不是 $p$ 的整数次幂的情形，$\mathcal G$ 的大小也可以有上界：

**引理 4.8** *如果 $n$ 不是 $p$ 的整数次幂，则 $|G|\leqslant n^{\sqrt t}$。*

*证明*：考虑 $I$ 的如下子集：
$$\hat I=\left\{\left(\frac np\right)^i\cdot p^j\ \middle|\ 0\leqslant i,j\leqslant\lfloor\sqrt t\rfloor\right\}$$

如果 $n$ 不是 $p$ 的整数次幂，则集合 $\hat I$ 拥有 $(\lfloor\sqrt t\rfloor+1)^2>t$ 个互异的数。因为 $|G|=t$，所以 $\hat I$ 中至少存在两个数在模 $r$ 后得到了相同的值。记这两个数为 $m_1$ 和 $m_2$，不妨设 $m_1>m_2$。现在我们有：
$$X^{m_1}\equiv X^{m_2}\pmod{X_r-1}$$

令 $f(X)\in P$。则
$$\begin{aligned}
(f(X))^{m_1}&\equiv f(X^{m_1})&&\pmod{X^r-1,p}\\
&\equiv f(X^{m_2})&&\pmod{X^r-1,p}\\
&\equiv (f(X))^{m_2}&&\pmod{X^r-1,p}
\end{aligned}$$

这表明在域 $\mathbb F$ 中，
$$(f(X))^{m_1}=(f(X))^{m_2}$$

因此，$f(X)\in\mathcal G$ 是多项式 $Q'(Y)=Y^{m_1}-Y^{m_2}$ 在域 $\mathbb F$ 中的一个根。由于 $f(X)$ 是 $\mathcal G$ 的任意元素，故 $Q'(Y)$ 在 $\mathbb F$ 中至少有 $|\mathcal G|$ 个根。所以 $Q'(Y)$ 的次数为 $m_1\leqslant(\frac np\cdot p)^{\lfloor\sqrt t\rfloor}\leqslant n^{\sqrt t}$。这表明 $|\mathcal G|\leqslant n^{\sqrt t}$。$\blacksquare$

<details><summary>解释</summary>

> 由于 $m_1$ 是 $\hat I$ 的元素，而依定义 $\hat I$ 的最大值为 $(\frac np)^{\lceil\sqrt t\rceil}\cdot p^{\lceil\sqrt t\rceil}$，所以 $m_1\leqslant n^{\lceil\sqrt t\rceil}\leqslant n^{\sqrt t}$。
>
> 由代数基本定理，$Q'(Y)=0$ 在 $\mathbb F$ 上的根的数量不大于 $\partial(Q'(Y))=m_1$。而任意 $f(X)\in\mathcal G$ 都可以成为 $Q'(Y)=0$ 在 $\mathbb F$ 上的一个根。所以 $|\mathcal G|\leqslant\text{根的数量}\leqslant\partial(Q'(Y))=m_1\leqslant n^{\sqrt t}$。

</details>

> 上述论点的表述是由 Adam Kalai, Amit Sahai 和 Madhu Sudan [KSS] 给出的。

控制了 $\mathcal G$ 的大小之后，我们终于做好了证明算法正确性的准备：

**引理 4.9** *如果算法返回 $\tt PRIME$，则 $n$ 是素数。*

*证明*：假设算法返回了 $\tt PRIME$。记 $t=|G|,\ l=\lceil\sqrt{\varphi(r)}\log n\rceil$，那么**引理 4.7** 表明：
$$\begin{aligned}
|\mathcal G|&\geqslant\binom{t+l}{t-1}\\
&\geqslant\binom{l+1+\lfloor\sqrt t\log n\rfloor}{\lfloor\sqrt t\log n\rfloor}&&\text{（由于 $t>\sqrt t\log n$）}\\
&\geqslant\binom{2\lfloor\sqrt t\log n\rfloor+1}{\lfloor\sqrt t\log n\rfloor}&&\text{（由于 $l=\lfloor\sqrt{\varphi(r)}\log n\rfloor\geqslant\lfloor\sqrt t\log n\rfloor$）}\\
&>2^{\lfloor\sqrt t\log n\rfloor+1}&&\text{（由于 $\lfloor\sqrt t\log n\rfloor>\lfloor\log^2n\rfloor\geqslant1$）}\\
&\geqslant n^{\sqrt t}
\end{aligned}$$

<details><summary>解释</summary>

> 第一个不等号是**引理 4.7** 的结论。
> 
> 第二个不等号是因为：之前证明了 $t>\log^2n$，所以 $t=\sqrt t\cdot\sqrt t>\sqrt t\cdot\sqrt{\log^2n}=\sqrt t\log n$。又因为 $t$ 是整数，所以 $t\geqslant\sqrt t\log n+1$。又根据组合恒等式 $\binom nk+\binom n{k+1}=\binom{n+1}{k+1}$，$n$ 和 $k$ 同时缩小同样的大小时整个组合式也变小，于是得到原不等式。
> 
> 第三个不等号是因为：$G$ 的定义指出任意 $G$ 的元素 $x$ 都比 $r$ 小且与 $r$ 互质。而比 $r$ 小且与 $r$ 互质的元素至多为 $\varphi(r)$ 个，所以 $t\leqslant\varphi(r)$。所以 $l\geqslant\lfloor\sqrt t\log n\rfloor$。由于 $\binom{n+1}{k+1}>\binom n{k+1}$，故原不等式成立。
>
> 第四个不等号是因为：
> 
> **引理 4.9.1** *设 $A>1$，则 $\displaystyle\binom{2A+1}A>2^{A+1}$。*
>> *证明*：使用归纳法。当 $A=2$ 时，命题 $10>8$ 显然成立。下设 $A=k-1$ 时命题成立，则
>> $$\begin{aligned}
>> \binom{2k+1}k&=\binom{2k}k+\binom{2k}{k-1}\\
>> &=\binom{2k-1}k+2\binom{2k-1}{k-1}+\binom{2k-1}{k-2}\\
>> &>2\binom{2k-1}{k-1}\\
>> &\geqslant2\cdot 2^k\\
>> &=2^{k+1}
>> \end{aligned}$$
>> 于是原命题得证。
>
> 记 $A=\lfloor\sqrt t\log n\rfloor$。按照原文的说明（和第二个不等号同理）可得 $A>1$，于是运用**引理 4.9.1**即可得到原不等式。
> 
> 第五个不等式是因为：$2^{\lfloor t\log n\rfloor+1}>2^{\sqrt t\log n}>(2^{\log n})^{\sqrt t}=n^{\sqrt t}$。

</details>

由**引理 4.8**，当 $n$ 不是 $p$ 的整数次幂时，$|\mathcal G|\leqslant n^{\sqrt t}$。因此，$n=p^k$，其中 $k>0$。如果 $k>1$，则算法将提前于行 2 结束并返回 $\tt COMPOSITE$。所以，$n=p$。$\blacksquare$

<details><summary>解释</summary>

> 如果算法进行到行 $12$，说明 $(X+a)^n\equiv X^n+a\pmod{X^r-1,p}$ 总是成立的（$p$ 是 $n$ 的因子，所以模运算中可以替换）。用之前构造的两个群来说，就是 $G$ 中元素关于 $\mathcal G$ 中的所有元素内省。所以**引理 4.5\~4.9** 的结论可以使用。
> 
> 那么，由于**引理 4.9** 得到了 $|G|>n^{\sqrt t}$，根据**引理 4.8** 的逆否，得知 $n$ 必然为 $p$ 的整数次幂。然而，如果 $n$ 是 $p$ 的二次及以上的幂。那么算法在行 2 就提前结束了。所以，$n$ 只能是 $p$ 的一次幂，即 $n=p$。根据之前的构造，$p$ 是 $n$ 的素因子，所以 $n$ 是素数。

</details>

这就完成了**定理 4.1** 的证明。

## 5. 时间复杂度分析与改进

计算此算法的时间复杂度是直接的。在计算的过程中，我们使用了如下的事实：二进制长度为 $m$ 位的整数的加法、乘法和除法可以在 $\tilde O(m)$ 的时间内完成 [vzGG]。类似地，对于两个次数为 $d$ 的多项式——它们的每个系数的二进制长度也都是 $m$ 位——的类似运算可以在 $\tilde O(d\cdot m)$ 的时间内完成 [vzGG]。

**定理 5.1** *此算法的渐进时间复杂度为 $\tilde O(\log^\frac{21}2n)$。*

*证明*：行 2 的判断所需要的渐进时间复杂度为 $\tilde O(\log^3 n)$ [vzGG]。

<details><summary>解释</summary>

> 如果 $n=a^b$，则 $b<\log n+1$。顺序检查每个 $b$，在 $[1,n]$ 中二分查找一个 $a$ 使得 $a^b=n$。使用快速幂算法，检查的时间复杂度为 $\tilde O(\log n)$，查找 $b$ 和 $a$ 各需要 $O(\log n)$，故总的时间为 $\tilde O(\log^3n)$。

</details>

行 4 的赋值需要找到一个 $r$ 满足 $\mathrm o_r(n)>\log^2 n$。这可以通过连续地尝试 $r$ 的值并检查 $n^k\equiv1\pmod r$ 对于每个 $k\leqslant\log^2n$ 是否成立。对于一个给定的 $r$，这最多需要 $O(\log^2n)$ 次带模乘法，因此需要 $\tilde O(\log^2n\log r)$ 的时间。由**引理 4.3** 我们知道只有 $O(\log^5n)$ 个 $r$ 需要尝试。所以这一步赋值总的时间复杂度为 $\tilde O(\log^7n)$。

行 5 的判断需要计算 $r$ 个数的最大公约数。每次最大公约数的求解都需要 $O(\log n)$ 的时间 [vzGG]，所以总的时间复杂度为 $O(r\log n)=O(\log^6n)$。行 7 的判断只需要 $O(\log n)$ 即可完成。

行 9 开始的循环需要验证 $\lfloor\sqrt{\varphi(r)}\log n\rfloor$ 个同余式。每一个同余式需要 $O(\log n)$ 次 $r$ 次多项式的乘法，且多项式的系数为 $O(\log n)$ 级别的。所以每个同余式的验证可在 $\tilde O(r\log^2n)$ 的时间内完成。所以整个循环的时间复杂度为 $\tilde O(r\sqrt{\varphi(r)}\log^3n)=\tilde O(r^\frac32\log^3n)=\tilde O(\log^\frac{21}2n)$。这个时间复杂度的级别超过了其它步骤的时间复杂度，所以它也是整个算法的时间复杂度。$\blacksquare$

此算法的时间复杂度可以通过提高对 $r$ 的估计来优化（如**引理 4.3**所做的那样）。当然，最好的方案是 $r=O(\log^2n)$，在这种情形下整个算法的时间复杂度将为 $\tilde O(\log^6n)$。事实上，通过以两个猜想作为前提，存在找到一个这样的 $r$ 的可能性：（下文中的 $\ln$ 为自然对数）

*阿庭猜想（<i>Artin's conjecture</i>）* 对于任何给定的非完全平方的数 $n\in\mathbb N$，满足 $q<m$ 且 $\mathrm o_q(n)=q-1$ 的素数 $q$ 的个数在渐进意义上由 $A(n)\cdot\frac m{\ln m}$ 个，其中 $A(n)$ 为阿庭常数，$A(n)>0.35$。

*苏菲-热尔曼素数密度猜想（<i>Sophie-Germain Prime Density Conjecture</i>）* 若素数 $q$ 满足 $q\leqslant m$ 且 $2q+1$ 也是素数，则称它为苏菲-热尔曼素数。苏菲-热尔曼素数在渐进意义上有 $\frac{2C_2m}{\ln^2m}$ 个，其中 $C_2$ 是孪生素数常数（大约地估计为 $0.66$）。

阿庭猜想如果在 $m=O(\log^2n)$ 时成立，则立即可推出满足性质的 $r=O(\log^2n)$。目前在证明阿庭猜想方面已经有许多进展 [GM]，[GMM]，[HB]，而且已经被*证明*：如果广义黎曼猜想成立则其成立。

如果第二个猜想成立，则我们可以得到 $r=\tilde O(\log^2n)$。

> 根据苏菲-热尔曼素数的密度，存在一个合适的常数 $c$ 使得在 $8\log^2n$ 和 $c\log^2n(\log\log n)^2$ 之间至少存在 $\log^2$ 个素数。对于任意这样的素数 $q$，要么 $\mathrm o_q(n)\leqslant2$，要么 $\mathrm o_q(n)\geqslant\frac{q-1}2$。对于任意 $q$ 满足 $\mathrm o_q(n)\leqslant2$，$q$ 必然整除 $n^2-1$ 且这样的 $q$ 的数量被 $O(\log n)$ 所限制。这表明必然存在素数 $r=\tilde O(\log^2 n)$ 满足 $\mathrm o_r(n)>\log^2n$。这样的 $r$ 可以导出一个时间复杂度为 $\tilde O(\log^6n)$ 的算法。

同样，目前在证明这个猜想方面也有进展。记 $P(m)$ 为正整数 $m$ 的最大素因子，Goldfeld [Gol] 证明素数 $q$ 满足 $P(q-1)>q^{\frac12+c},\ c\approx\frac1{12}$ 以<cite>（渐进）</cite>正的密度出现。在此基础上，Fouvry 给出：

**引理 5.2**（[Fou]） *存在常数 $c>0$ 和 $n_0$ 满足对于任意 $x\geqslant n_0$：*
$$|\{q\mid q\text{是素数},\ q\leqslant x\wedge P(q-1)>q^\frac23\}|\geqslant c\frac x{\ln x}$$

现在已知上述引理对于指数高达 $0.6683$ 的情形下是成立的 [BH]。通过使用上述引理，我们可以改进此算法的时间复杂度分析：

**定理 5.3** *此算法的渐进时间复杂度为 $\tilde O(\log^\frac{15}2n)$。*

*证明*：正如之前所陈述的，满足 $P(q-1)>q^\frac23$ 的素数 $q$ 的高密度表明行 4 会找到一个 $r=O(\log^3 n)$ 的满足要求的 $r$。这使得整个算法的时间复杂度下降至 $\tilde O(\log^\frac{15}2n)$。$\blacksquare$

最近，Hendrik Lenstra 和 Carl Pomerance [LP1] 提出了我们的算法的改进版本，它的时间复杂度可以被证明为 $\tilde O(\log^6 n)$。

## 6. 展望

在我们的算法中，行 9 的循环需要 $\lfloor\sqrt{\varphi(r)}\log n\rfloor$ 的时间去确定群 $\mathcal G$ 的大小足够大。如果我们能够证明存在更小的 $(X+a)$ 集合来生成满足要求大小的群，那么这个循环的迭代次数可以被减少，这看上去是有可能做到的。

如果下述猜想成立，则可以改进算法时间复杂度到 $\tilde O(\log^3 n)$。这个猜想在 [BP] 中给出，并在 [KS] 中验证了在 $r\leqslant100$ 和 $n\leqslant10^{10}$ 的情形下成立：

**猜想 6.1** *如果 $r$ 是素数，不整除 $n$，且*
$$\tag{6}(X-1)^n\equiv X^n-1\pmod{X^r-1,n}$$
*则 $n$ 要么是素数，要么 $n^2\equiv1\pmod r$。*

如果猜想成立，则我们可以略微改进算法来找到第一个不整除 $n^2-1$ 的 $r$。这样的 $r$ 可以被确定落在区间 $[2, 4\log n]$ 中。这是因为小于 $x$ 的素数的乘积至少为 $\mathrm e^x$（参见 [Apo]）。之后，我们可以测试同余式 $(6)$ 是否成立。验证同余式所需的时间为 $\tilde O(r\log^2n)$。这使得整个算法的时间复杂度为 $\tilde O(\log^3n)$。

最近，Hendrik Lenstra 和 Carl Pomerance [LP2] 给出了一个启发式的论点——上述猜想可能是假命题。但是，这个猜想的某些变体可能已然是真的（比如，强制令 $r>\log n$）。

## 鸣谢

*鸣谢* 我们感谢 Hendrik Lenstra Jr. 允许我们使用它在群 $\mathcal G$ 大小的下界上的发现。这使得整个证明过程变得初等（我们之前的版本需要用到**引理 5.2** 给出的密度的界），简化了证明*并且*优化了时间复杂度！

我们同样感谢 Adam Kalai，Amit Sahai 和 Madhu Sudan 允许我们使用他们关于**引理 4.8** 的证明。这使得关于群 $\mathcal G$ 上界和下界的证明过程相似（它们现在都基于一个域中定义的多项式的根的数量相关的结论）。

我们感谢 Somenath Biswas，Rajat Bhattacharjce，Jaikumar Radhakrishman 和 V. Vinay 给出了有用的讨论。

我们感谢 Erich Bach，Abhijit Das，G. Harman，Roger Heath-Brown，Pieter Moree，Richard Pinch 和 Carl Pomerance 给出了有用的参考文献。

自从我们的预印本出现，一系列的研究者克服诸多困难指出了本文的疏漏。我们对他们表示一并的感谢。我们已经尝试将他们的建议融合在本文中；如果我们仍有遗漏，请您谅解。

最终，我们感谢本文的匿名审稿人，他们给出的观察和建议也是非常有作用的。

印度理工学院计算机科学与工程部  
坎布尔，印度  
电子邮件地址：
- `manindracse.iitk.ac.in`
- `nitinsa@cse.iitk.ac.in`
- `kayaln@cse.iitk.ac.in`

## 参考文献

```
[AH]	L. M. Adleman and M.-D. Huang, Primality Testing and Abelian Varieties overFinite Fields, Lecture Notes in Math.1512, Springer-Verlag, New York, 1992.
[APR]	L. M. Adleman, C. Pomerance, and R. S. Rumely, On distinguishing prime numbersfrom composite numbers, Ann. of Math.117(1983), 173–206.
[AB]	M. Agrawal and S. Biswas, Primality and identity testing via Chinese remaindering, Journal of the ACM50(2003), 429–443.
[AKS]	M. Agrawal, N. Kayal, and N. Saxena, PRIMES is in P, preprint(http://www.cse.iitk.ac.in/news/primality.ps), August 2002.
[Apo]	T. M. Apostol, Introduction to Analytic Number Theory, Springer-Verlag, NewYork, 1997.
[Atk]	A. O. L. Atkin, Lecture notes of a conference, Boulder (Colorado), Manuscript, August 1986.
[BH]	R. C. Baker and G. Harman, The Brun-Titchmarsh Theorem on average, in An-alytic Number Theory,Volume I (Allerton Park,  IL, 1995), Progr. Math.138,39–103, Birkhäuser Boston, Boston, MA, 1996.
[BP]	R. Bhattacharjee and P. Pandey, Primality testing, Technical report, IIT Kanpur, 2001; available at http://www.cse.iitk.ac.in/research/btp2001/primality.html.
[Car]	R. D. Carmichael, Note on a number theory function,Bull. Amer. Math. Soc.16(1910), 232–238.
[Fou]	E. Fouvry,Théorème de Brun-Titchmarsh; application au théorème de Fermat, Invent. Math.79(1985), 383–407.
[GK]	S. Goldwasser and J. Kilian, Almost all primes can be quickly certified, inProc. Annual ACM Symposium on the Theory of Computing, 316–329, 1986.
[GM]	R. Gupta and M. Ram Murty, A remark on Artin’s conjecture,Invent. Math.78(1984), 127–130.
[GMM]	R. Gupta, V. Kumar Murty, and M. Ram Murty, The Euclidian algorithm for S-integers, Number Theory(Montreal, Que., 1985), CMS Conf. Proc.7(1987), 189–202.
[Gol]	M. Goldfeld, On the number of primespfor which p+a has a large prime factor, Mathematika 16(1969), 23–27.
[HB]	D. R. Heath-Brown, Artin’s conjecture for primitive roots, Quart. J. Math. Oxford37(1986), 27–38.
[KS]	N. Kayal and N. Saxena, Towards a deterministic  polynomial-time test, Technical report, IIT Kanpur,2002; available at http://www.cse.iitk.ac.in/research/btp2002/primality.html.
[KSS]	A. Kalai, A. Sahai, and M. Sudan, Notes on primality test and analysis of AKS, Private communication, August 2002.
[Lee]	J. V. Leeuwen(ed.), Handbook of Theoretical Computer Science, Volume A, MITPress, Cambridge, MA, 1990.
[Len]	H. W. Lenstra, Jr., Primality testing with cyclotomic rings, unpublished (see http://cr.yp.to/papers.html#aks for an exposition of Lenstra’s argument), August 2002.
[LN]	R. Lidl and H. Niederreiter, Introduction to Finite Fields and their Applications, Cambridge Univ. Press, Cambridge, 1986.
[LP1]	H. W. Lenstra, Jr. and C. Pomerance, Primality testing with gaussian periods, Private communication, March 2003.
[LP2]	———, Remarks on Agrawal’s conjecture, unpublished (http://www.aimath.org/WWN/primesinp/articles/html/50a/), March 2003.
[Mac]	M. Macaj, Some remarks and questions about the AKS algorithm and related con-jecture, unpublished (http://thales.doa.fmph.uniba.sk/macaj/aksremarks.pdf), December 2002.
[Mil]	G. L. Miller, Riemann’s hypothesis and tests for primality,J. Comput. Sys. Sci.13(1976), 300–317.
[Nai]	M. Nair, On Chebyshev-type inequalities for primes,Amer. Math. Monthly89(1982), 126–129.
[Pra]	V. Pratt, Every prime has a succinct certificate,SIAM Journal on Computing4(1975), 214–220.
[Rab]	M. O. Rabin, Probabilistic algorithm for testing primality, J. Number Theory12(1980), 128–138.
[SS]	R. SolovayandV. Strassen, A fast Monte-Carlo test for primality, SIAM Journalon Computing6(1977), 84–86.
[vzGG]	J. von zur Gathen and J. Gerhard, Modern Computer Algebra, Cambridge Univ.Press, Cambridge, 1999.
```

<br>
<center>（于 2003 年 1 月 24 日收稿）</center>
<br>

## 译跋

参考资料：
- https://blog.csdn.net/weixin_39800875/article/details/111708866
- https://blog.csdn.net/qq_43488473/article/details/106317566
- https://blog.csdn.net/weixin_43902708/article/details/89854566
- https://blog.csdn.net/Mysterium/article/details/7916139
- Agrawal Manindra,Kayal Neeraj,Saxena Nitin. Errata: PRIMES is in P[J]. Annals of Mathematics,2019,189(1).

鸣谢：
- 郭嘉睿同学给予的知识层面的讲解与补充

原文链接：https://annals.math.princeton.edu/wp-content/uploads/annals-v160-n2-p12.pdf

译者不为原文部分的任何内容负责。译者不保证补充部分的内容正确，其仅做参考作用。

译者电子邮件：`guyutongxue@163.com`
