import { Sigma } from 'lucide-react';
export const topicMgf = {
  id: 'mgf',
  name: '積率母関数',
  icon: Sigma,
  description: '確率分布の特性化と確率変数の性質を統一的に分析する重要な道具',
  sections: [
    {
      title: '積率母関数の定義',
      content: `**定義**
確率変数 $X$ の積率母関数（Moment Generating Function, MGF）$M(t)$ は：

$$M(t) = E[e^{tX}] \\quad (|t| < h, \\; h > 0 \\text{ のある近傍で})$$

ここで $t$ は実数パラメータです。

離散分布の場合：

$$M(t) = \\sum_x e^{tx} P(X=x)$$

連続分布の場合：

$$M(t) = \\int_{-\\infty}^{\\infty} e^{tx} f(x) \\, dx$$

**積率の抽出**
MGFから積率を求める方法が「積率母関数」という名前の由来となっています。
MGFを $t$ で微分し、$t=0$ を代入すると：

$$M^{(n)}(0) = \\left.\\frac{d^n M(t)}{dt^n}\\right|_{t=0} = E[X^n]$$

特に：
- $M'(0) = E[X]$（第1次モーメント、期待値）
- $M''(0) = E[X^2]$
- $\\text{Var}(X) = M''(0) - (M'(0))^2$

【例題】$M(t) = (1 + 0.5e^t)^2$ という形で与えられた場合、$E[X]$ を求めよ。

【解答】
$$M'(t) = 2(1 + 0.5e^t) \\cdot 0.5e^t$$

$$M'(0) = 2 \\times (1 + 0.5) \\times 0.5 = 2 \\times 1.5 \\times 0.5 = 1.5 = E[X]$$
【/解答】

**収束と一意性**
もしMGFが存在すれば（$t$ の近傍で）、分布を一意に決定します（一意性定理）。つまり、同じMGFを持つ2つの分布は同じです。ただし、MGFは常に存在するわけではなく（例：Cauchy分布）、その場合は特性関数を用います。

【例題】$X \\sim \\text{Exp}(\\lambda)$ のとき、$E[X]$ と $\\text{Var}(X)$ をMGFから求めてください。

【解答】
指数分布のMGF：$M(t) = \\frac{\\lambda}{\\lambda - t} \\quad (t < \\lambda)$

$$M'(t) = \\frac{\\lambda}{(\\lambda-t)^2}, \\quad M'(0) = \\frac{1}{\\lambda} = E[X]$$

$$M''(t) = \\frac{2\\lambda}{(\\lambda-t)^3}, \\quad M''(0) = \\frac{2}{\\lambda^2}$$

$$\\text{Var}(X) = M''(0) - (M'(0))^2 = \\frac{2}{\\lambda^2} - \\frac{1}{\\lambda^2} = \\frac{1}{\\lambda^2}$$
【/解答】`
    },
    {
      title: '代表的な分布のMGF',
      content: `**正規分布 $N(\\mu, \\sigma^2)$**

$$M(t) = \\exp\\left(\\mu t + \\frac{\\sigma^2 t^2}{2}\\right)$$

特に標準正規分布 $N(0,1)$ では：

$$M(t) = \\exp\\left(\\frac{t^2}{2}\\right)$$

**ポアソン分布 $\\text{Poisson}(\\lambda)$**

$$M(t) = \\exp(\\lambda(e^t - 1))$$

期待値と分散：$E[X] = \\lambda$, $\\text{Var}(X) = \\lambda$

**指数分布 $\\text{Exp}(\\lambda)$**

$$M(t) = \\frac{\\lambda}{\\lambda - t} \\quad (t < \\lambda)$$

期待値と分散：$E[X] = 1/\\lambda$, $\\text{Var}(X) = 1/\\lambda^2$

**カイ二乗分布 $\\chi^2_k$（$k$ 自由度）**

$$M(t) = (1 - 2t)^{-k/2} \\quad (t < 1/2)$$

$\\chi^2_k = \\sum_{i=1}^k Z_i^2$, $Z_i \\sim N(0,1)$

期待値と分散：$E[X] = k$, $\\text{Var}(X) = 2k$

**ガンマ分布 $\\text{Gamma}(\\alpha, \\beta)$**

$$M(t) = (1 - \\beta t)^{-\\alpha} \\quad (t < 1/\\beta)$$

ここで $\\alpha$ は形状パラメータ、$\\beta$ はスケールパラメータ。

期待値と分散：$E[X] = \\alpha\\beta$, $\\text{Var}(X) = \\alpha\\beta^2$

**二項分布 $\\text{Binomial}(n, p)$**

$$M(t) = (1 - p + pe^t)^n = (q + pe^t)^n \\quad (q = 1-p)$$

期待値と分散：$E[X] = np$, $\\text{Var}(X) = np(1-p)$

**参照表：MGFと積率の関係**
| 分布 | MGF形式 | $E[X]$ | $\\text{Var}(X)$ |
|------|---------|--------|------------|
| $N(\\mu,\\sigma^2)$ | $\\exp(\\mu t + \\sigma^2 t^2/2)$ | $\\mu$ | $\\sigma^2$ |
| $\\text{Poisson}(\\lambda)$ | $\\exp(\\lambda(e^t-1))$ | $\\lambda$ | $\\lambda$ |
| $\\text{Exp}(\\lambda)$ | $\\lambda/(\\lambda-t)$ | $1/\\lambda$ | $1/\\lambda^2$ |
| $\\chi^2_k$ | $(1-2t)^{-k/2}$ | $k$ | $2k$ |
| $\\text{Gamma}(\\alpha,\\beta)$ | $(1-\\beta t)^{-\\alpha}$ | $\\alpha\\beta$ | $\\alpha\\beta^2$ |
| $\\text{Binomial}(n,p)$ | $(q+pe^t)^n$ | $np$ | $np(1-p)$ |

【例題】$\\text{Gamma}(2, 1)$ 分布のMGFから期待値と分散を求めてください。

【解答】
$$M(t) = (1-t)^{-2}$$

$$M'(t) = 2(1-t)^{-3}, \\quad M'(0) = 2 = E[X]$$

$$M''(t) = 6(1-t)^{-4}, \\quad M''(0) = 6$$

$$\\text{Var}(X) = M''(0) - (M'(0))^2 = 6 - 4 = 2$$
【/解答】`
    },
    {
      title: '積率母関数の応用',
      content: `**1. 分布の一意性の証明**
2つの確率変数 $X$ と $Y$ が同じMGFを持つ場合、同じ分布に従います。これを利用して：
- 標本分散 $S^2$ の分布が $(n-1)\\sigma^2/\\sigma^2 \\times \\chi^2_{n-1}$ であることを証明
- 回帰係数の分布の導出

**2. 独立確率変数の和の分布**
$X$ と $Y$ が独立で、MGFがそれぞれ $M_X(t)$ と $M_Y(t)$ の場合：

$$M_{X+Y}(t) = M_X(t) \\times M_Y(t)$$

例：$X_i \\sim N(\\mu_i, \\sigma_i^2)$ が独立のとき、$\\sum X_i$ の分布：

$$M(t) = \\prod_i \\exp\\left(\\mu_i t + \\frac{\\sigma_i^2 t^2}{2}\\right) = \\exp\\left(\\sum\\mu_i \\cdot t + \\frac{\\sum\\sigma_i^2 \\cdot t^2}{2}\\right)$$

したがって $\\sum X_i \\sim N(\\sum\\mu_i, \\sum\\sigma_i^2)$

**3. 中心極限定理の証明スケッチ**
標本平均 $\\bar{X}_n = \\frac{1}{n}\\sum X_i$ の標準化版 $Z_n = \\frac{\\sqrt{n}(\\bar{X}_n - \\mu)}{\\sigma}$ を考えます。

$X_i$ の標準化版を $W_i = \\frac{X_i - \\mu}{\\sigma}$ とすると：

$$M_{Z_n}(t) = \\left[M_{W_1}\\left(\\frac{t}{\\sqrt{n}}\\right)\\right]^n$$

高階展開：$M_{W_1}(s) = 1 + 0 \\cdot s + \\frac{s^2}{2} + O(s^3)$

$n \\to \\infty$ のとき：

$$M_{Z_n}(t) = \\left[1 + \\frac{t^2}{2n} + O(n^{-3/2})\\right]^n \\to \\exp\\left(\\frac{t^2}{2}\\right)$$

これは標準正規分布のMGFであり、$Z_n \\xrightarrow{d} N(0,1)$ が証明されます。

**4. モーメントの計算効率**
直接計算：$E[X^n] = \\int x^n f(x) \\, dx$（複雑な積分）
MGF利用：$E[X^n] = M^{(n)}(0)$（微分で容易に計算）

例：ポアソン分布 $M(t) = \\exp(\\lambda(e^t - 1))$

$$M'(t) = \\lambda e^t \\exp(\\lambda(e^t - 1)) \\quad \\Rightarrow \\quad E[X] = \\lambda$$

$$M''(t) = \\lambda e^t \\exp(\\cdots) + \\lambda^2 e^{2t} \\exp(\\cdots) \\quad \\Rightarrow \\quad E[X^2] = \\lambda + \\lambda^2$$

**5. 確率分布の変換**
$Y = aX + b$ の場合のMGF：

$$M_Y(t) = e^{bt} M_X(at)$$

これにより、スケーリングと平行移動後の分布を直ちに得られます。

【例題】$X \\sim \\text{Poisson}(\\lambda_1)$, $Y \\sim \\text{Poisson}(\\lambda_2)$ が独立のとき、$X+Y$ の分布を求めてください。

【解答】
$$M_{X+Y}(t) = \\exp(\\lambda_1(e^t-1)) \\times \\exp(\\lambda_2(e^t-1)) = \\exp((\\lambda_1+\\lambda_2)(e^t-1))$$

これは $\\text{Poisson}(\\lambda_1+\\lambda_2)$ のMGFです。したがって $X+Y \\sim \\text{Poisson}(\\lambda_1+\\lambda_2)$。
【/解答】`
    },
    {
      title: '確率母関数',
      content: `**確率母関数の定義**
確率母関数（Probability Generating Function, PGF）は、非負整数値を取る離散確率変数 $X$ に対して定義される母関数です：

$$G(s) = E[s^X] = \\sum_{k=0}^{\\infty} p_k s^k$$

ここで $p_k = P(X = k)$ です。$|s| \\le 1$ の範囲で定義されます。

**PGFとMGFの関係**
確率母関数と積率母関数には以下の関係があります：

$$M(t) = E[e^{tX}] = E[(e^t)^X] = G(e^t)$$

すなわち、PGFに $s = e^t$ を代入するとMGFが得られます。逆に、MGFに $t = \\log s$ を代入するとPGFが得られます。

**代表的な離散分布のPGF**

ベルヌーイ分布 $\\text{Bernoulli}(p)$：

$$G(s) = 1 - p + ps = q + ps \\quad (q = 1 - p)$$

二項分布 $\\text{Binomial}(n, p)$：

$$G(s) = (q + ps)^n$$

ポアソン分布 $\\text{Poisson}(\\lambda)$：

$$G(s) = \\exp(\\lambda(s - 1))$$

幾何分布 $\\text{Geometric}(p)$（$X = 1, 2, \\ldots$ で定義）：

$$G(s) = \\frac{ps}{1 - qs} \\quad (q = 1 - p)$$

負の二項分布 $\\text{NegBin}(r, p)$：

$$G(s) = \\left(\\frac{p}{1 - qs}\\right)^r$$

**PGFの性質**

基本的な性質：
- $G(1) = \\sum p_k = 1$（確率の総和）
- $G(0) = p_0 = P(X = 0)$

モーメントの抽出：
- $G'(1) = E[X]$
- $G''(1) = E[X(X - 1)]$（階乗モーメント）
- $\\text{Var}(X) = G''(1) + G'(1) - (G'(1))^2$

一般に、$G^{(k)}(1) = E[X(X-1)\\cdots(X-k+1)]$ が第 $k$ 次階乗モーメントです。

**独立な確率変数の和のPGF**
$X$ と $Y$ が独立な非負整数値確率変数のとき：

$$G_{X+Y}(s) = G_X(s) \\times G_Y(s)$$

すなわち、独立な確率変数の和のPGFは各PGFの積となります。
例：$X \\sim \\text{Poisson}(\\lambda_1)$, $Y \\sim \\text{Poisson}(\\lambda_2)$ が独立なら

$$G_{X+Y}(s) = \\exp(\\lambda_1(s-1)) \\times \\exp(\\lambda_2(s-1)) = \\exp((\\lambda_1+\\lambda_2)(s-1))$$

したがって $X + Y \\sim \\text{Poisson}(\\lambda_1 + \\lambda_2)$

**キュムラント母関数**
キュムラント母関数（Cumulant Generating Function）はMGFの対数として定義されます：

$$K(t) = \\log M(t) = \\log E[e^{tX}]$$

$K(t)$ をテイラー展開すると：

$$K(t) = \\kappa_1 t + \\frac{\\kappa_2 t^2}{2!} + \\frac{\\kappa_3 t^3}{3!} + \\cdots$$

ここで $\\kappa_n$ を第 $n$ 次キュムラントと呼びます：
- $\\kappa_1 = E[X]$（平均）
- $\\kappa_2 = \\text{Var}(X)$（分散）
- $\\kappa_3 = E[(X-\\mu)^3]$（第3次中心モーメント、歪度に関連）

キュムラントの重要な性質として、独立な確率変数の和のキュムラントは各キュムラントの和になります：

$$\\kappa_n(X + Y) = \\kappa_n(X) + \\kappa_n(Y) \\quad (X, Y \\text{ 独立})$$

正規分布では $\\kappa_1 = \\mu$, $\\kappa_2 = \\sigma^2$ で、$\\kappa_3$ 以降はすべて0です。この性質は正規分布を特徴づけます。`
    },
    {
      title: '演習問題',
      content: `**問題1：MGFから統計量の計算**
確率変数 $X$ のMGFが $M(t) = (1-2t)^{-3}$ $(t < 1/2)$ で与えられています。

(1) この分布は何分布ですか？
(2) 期待値 $E[X]$ を求めてください。
(3) 分散 $\\text{Var}(X)$ を求めてください。
(4) $P(X \\le 3)$ の近似値は？（使用できる分布の確率表があれば）

**問題2：MGFの微分**
二項分布 $X \\sim \\text{Binomial}(n=5, p=0.4)$ について、

(1) $M(t) = (0.6 + 0.4e^t)^5$ を確認してください。
(2) $M'(t)$ を求めて、$E[X]$ を計算してください。
(3) $M''(t)$ を求めて、$\\text{Var}(X)$ を計算してください。

**問題3：独立な確率変数の和**
$X_1 \\sim N(2, 1)$, $X_2 \\sim N(1, 4)$, $X_3 \\sim N(-1, 1)$ が独立のとき、

(1) $Y = X_1 + X_2 + X_3$ の分布を求めてください。
(2) $P(Y \\le 5)$ を計算してください。

**問題4：MGFと分布の特定**
ある確率変数のMGFが $M(t) = \\exp(3t + 2t^2)$ で与えられています。

(1) この確率変数の分布は？
(2) 期待値と分散は？
(3) $P(5 < X \\le 7)$ を計算してください。

**問題5：スケーリング後のMGF**
$X \\sim \\text{Gamma}(2, 3)$ の場合、
$Y = 2X - 1$ のMGFを求め、$E[Y]$ と $\\text{Var}(Y)$ を計算してください。

**問題6：中心極限定理とMGF**
i.i.d確率変数 $X_1, \\ldots, X_{10}$ が $\\text{Exp}(1)$ に従うとき、

(1) 標本平均 $\\bar{X}_{10}$ の期待値と分散は？
(2) $Z = \\sqrt{10}(\\bar{X}_{10} - 1)$ が近似的に従う分布は？
(3) $P(Z \\le 0.5)$ の近似値は？

**問題7：正規分布の積率母関数から期待値と分散を導出せよ**
【例題】正規分布 $X \\sim N(\\mu, \\sigma^2)$ のMGFが $M(t) = \\exp\\left(\\mu t + \\frac{\\sigma^2 t^2}{2}\\right)$ であることを利用して、MGFの微分により $E[X]$ と $\\text{Var}(X)$ を導出せよ。

【解答】
$$M(t) = \\exp\\left(\\mu t + \\frac{\\sigma^2 t^2}{2}\\right)$$

$M'(t)$ を求める：

$$M'(t) = (\\mu + \\sigma^2 t) \\exp\\left(\\mu t + \\frac{\\sigma^2 t^2}{2}\\right)$$

$$E[X] = M'(0) = (\\mu + 0) \\cdot \\exp(0) = \\mu$$

$M''(t)$ を求める：

$$M''(t) = \\sigma^2 \\exp\\left(\\mu t + \\frac{\\sigma^2 t^2}{2}\\right) + (\\mu + \\sigma^2 t)^2 \\exp\\left(\\mu t + \\frac{\\sigma^2 t^2}{2}\\right)$$

$$E[X^2] = M''(0) = \\sigma^2 \\cdot 1 + \\mu^2 \\cdot 1 = \\sigma^2 + \\mu^2$$

$$\\text{Var}(X) = E[X^2] - (E[X])^2 = (\\sigma^2 + \\mu^2) - \\mu^2 = \\sigma^2$$
【/解答】

**問題8：ポアソン分布のPGFを求め、$E[X]$ と $\\text{Var}(X)$ を計算せよ**
【例題】$X \\sim \\text{Poisson}(\\lambda)$ の確率母関数 $G(s) = E[s^X]$ を導出し、PGFの微分から $E[X]$ と $\\text{Var}(X)$ を求めよ。

【解答】
ポアソン分布の確率関数：$P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$

$$G(s) = E[s^X] = \\sum_{k=0}^{\\infty} s^k \\frac{\\lambda^k e^{-\\lambda}}{k!} = e^{-\\lambda} \\sum_{k=0}^{\\infty} \\frac{(\\lambda s)^k}{k!} = e^{-\\lambda} \\cdot e^{\\lambda s} = \\exp(\\lambda(s-1))$$

$G'(s)$ を求める：

$$G'(s) = \\lambda \\exp(\\lambda(s-1))$$

$$E[X] = G'(1) = \\lambda \\exp(0) = \\lambda$$

$G''(s)$ を求める：

$$G''(s) = \\lambda^2 \\exp(\\lambda(s-1))$$

$$E[X(X-1)] = G''(1) = \\lambda^2$$

$$\\text{Var}(X) = G''(1) + G'(1) - (G'(1))^2 = \\lambda^2 + \\lambda - \\lambda^2 = \\lambda$$
【/解答】

**問題9：独立な確率変数の和のMGFから分布を特定せよ**
【例題】$X_1 \\sim \\chi^2_{m}$, $X_2 \\sim \\chi^2_{n}$ が独立であるとき、$Y = X_1 + X_2$ のMGFを求め、$Y$ の分布を特定せよ。さらに、$m=3, n=5$ のとき $E[Y]$ と $\\text{Var}(Y)$ を求めよ。

【解答】
$\\chi^2_k$ のMGFは $M(t) = (1-2t)^{-k/2}$ である。

独立性より：

$$M_Y(t) = M_{X_1}(t) \\cdot M_{X_2}(t) = (1-2t)^{-m/2} \\cdot (1-2t)^{-n/2} = (1-2t)^{-(m+n)/2}$$

これは自由度 $m+n$ の $\\chi^2$ 分布のMGFである。したがって $Y \\sim \\chi^2_{m+n}$。

$m=3, n=5$ のとき $Y \\sim \\chi^2_8$ であり：

$$E[Y] = m + n = 8$$

$$\\text{Var}(Y) = 2(m+n) = 16$$
【/解答】

---

【例題】二項分布 $X \\sim \\text{Binomial}(n, p)$ のMGFを用いて、$n \\to \\infty$, $p \\to 0$, $np = \\lambda$（一定）のとき、$X$ の分布がポアソン分布 $\\text{Poisson}(\\lambda)$ に収束することを示せ。

【解答】
二項分布のMGF：
$$M_X(t) = (1 - p + pe^t)^n = (1 + p(e^t - 1))^n$$

$p = \\lambda/n$ を代入する：
$$M_X(t) = \\left(1 + \\frac{\\lambda(e^t - 1)}{n}\\right)^n$$

$n \\to \\infty$ のとき、$(1 + a/n)^n \\to e^a$ の公式を用いる。ここで $a = \\lambda(e^t - 1)$ であるから：

$$\\lim_{n \\to \\infty} M_X(t) = \\exp(\\lambda(e^t - 1))$$

これはポアソン分布 $\\text{Poisson}(\\lambda)$ のMGFに他ならない。

MGFの一意性定理により、分布の収束が示された：
$$\\text{Binomial}(n, \\lambda/n) \\xrightarrow{d} \\text{Poisson}(\\lambda) \\quad (n \\to \\infty)$$

これがポアソン近似の理論的根拠であり、$n$ が大きく $p$ が小さい「稀な事象」のモデリングにポアソン分布が用いられる理由である。
【/解答】

---

【例題】$X_1 \\sim \\text{Gamma}(\\alpha_1, \\beta)$ と $X_2 \\sim \\text{Gamma}(\\alpha_2, \\beta)$ が独立であるとき、MGFを用いて $Y = X_1 + X_2$ の分布を求めよ（再生性の証明）。さらに、$\\alpha_1 = 3, \\alpha_2 = 5, \\beta = 2$ のとき $E[Y]$ と $\\text{Var}(Y)$ を求めよ。

【解答】
ガンマ分布 $\\text{Gamma}(\\alpha, \\beta)$ のMGFは：
$$M(t) = (1 - \\beta t)^{-\\alpha} \\quad (t < 1/\\beta)$$

独立性より $Y = X_1 + X_2$ のMGFは：
$$M_Y(t) = M_{X_1}(t) \\cdot M_{X_2}(t) = (1 - \\beta t)^{-\\alpha_1} \\cdot (1 - \\beta t)^{-\\alpha_2} = (1 - \\beta t)^{-(\\alpha_1 + \\alpha_2)}$$

これは $\\text{Gamma}(\\alpha_1 + \\alpha_2, \\beta)$ のMGFである。

MGFの一意性定理より：
$$Y = X_1 + X_2 \\sim \\text{Gamma}(\\alpha_1 + \\alpha_2, \\beta)$$

これがガンマ分布の再生性であり、スケールパラメータ $\\beta$ が共通のとき、形状パラメータが加法的となる。

$\\alpha_1 = 3, \\alpha_2 = 5, \\beta = 2$ のとき $Y \\sim \\text{Gamma}(8, 2)$ であり：

$$E[Y] = (\\alpha_1 + \\alpha_2)\\beta = 8 \\times 2 = 16$$

$$\\text{Var}(Y) = (\\alpha_1 + \\alpha_2)\\beta^2 = 8 \\times 4 = 32$$

なお、$\\chi^2_k = \\text{Gamma}(k/2, 2)$ であるから、カイ二乗分布の再生性（$\\chi^2_m + \\chi^2_n = \\chi^2_{m+n}$）はガンマ分布の再生性の特殊ケースである。
【/解答】

---

【例題】特性関数 $\\varphi(t) = E[e^{itX}]$ とMGF $M(t) = E[e^{tX}]$ の関係を述べ、コーシー分布 $f(x) = \\frac{1}{\\pi(1+x^2)}$ の特性関数を求めよ。また、MGFが存在しないことを示せ。

【解答】
**特性関数とMGFの関係：**
MGF $M(t)$ は $t$ を虚数 $it$ に置き換えると特性関数 $\\varphi(t)$ になる：
$$\\varphi(t) = M(it) = E[e^{itX}]$$

MGFは $E[e^{tX}] < \\infty$ のときのみ存在するが、特性関数はすべての分布に対して存在する（$|e^{itX}| = 1$ であるため）。

**コーシー分布の特性関数：**
$$\\varphi(t) = \\int_{-\\infty}^{\\infty} e^{itx} \\cdot \\frac{1}{\\pi(1+x^2)} \\, dx$$

留数定理を用いて計算する。$t > 0$ の場合、上半平面の極 $x = i$ における留数を用いると：
$$\\varphi(t) = e^{-|t|}$$

（$t < 0$ の場合は下半平面を用い、同じ結果が得られる。）

したがって、コーシー分布の特性関数は $\\varphi(t) = e^{-|t|}$ である。

**MGFが存在しないことの証明：**
$$M(t) = E[e^{tX}] = \\int_{-\\infty}^{\\infty} \\frac{e^{tx}}{\\pi(1+x^2)} \\, dx$$

$t > 0$ のとき、$x \\to \\infty$ で $e^{tx}/(1+x^2) \\to \\infty$ であり、被積分関数の減衰が $1/x^2$ 程度なのに対し $e^{tx}$ の増大が指数的であるため、積分は発散する：
$$\\int_0^{\\infty} \\frac{e^{tx}}{\\pi(1+x^2)} \\, dx = \\infty \\quad (t > 0)$$

同様に $t < 0$ でも $x \\to -\\infty$ の方向で発散する。したがって $t \\neq 0$ で $M(t) = \\infty$ となり、MGFは存在しない。

これはコーシー分布が期待値すら持たない（$E[|X|] = \\infty$）ことに起因する。このような分布の解析には、常に存在する特性関数が不可欠である。
【/解答】`
    }
  ]
};
