import { Activity } from 'lucide-react';

export const topicBrownian = {
  id: "brownian",
  name: "ブラウン運動",
  icon: Activity,
  description: "ランダムウォークの連続極限として得られる確率過程。独立増分性、正規増分性、自己相似性などの性質を学びます。",
  sections: [
    {
      title: "ランダムウォーク",
      content: `ブラウン運動を理解するために、まずランダムウォークから始めます。

**単純対称ランダムウォーク**
初期位置を $S_0 = 0$ とし、各ステップでコインを投げます：
- 表が出たら $+1$ 移動（確率 $1/2$）
- 裏が出たら $-1$ 移動（確率 $1/2$）

$n$ 回ステップ後の位置を $S_n = X_1 + X_2 + \\cdots + X_n$ とします。各 $X_i$ は独立同分布で、$P(X_i = +1) = P(X_i = -1) = 1/2$ です。

**ランダムウォークの性質**

期待値：
$$E[S_n] = E\\left[\\sum_{i=1}^{n} X_i\\right] = \\sum_{i=1}^{n} E[X_i] = 0$$

したがって、平均的には原点付近で推移します。

分散：
$$\\text{Var}(S_n) = \\text{Var}\\left(\\sum_{i=1}^{n} X_i\\right) = \\sum_{i=1}^{n} \\text{Var}(X_i) \\quad \\text{（独立性より）}$$
$$\\text{Var}(X_i) = E[X_i^2] - (E[X_i])^2 = 1 - 0 = 1$$
$$\\text{Var}(S_n) = n$$

標準偏差は $\\sqrt{n}$ です。つまり、$n$ 回ステップ後、位置のばらつきは $\\sqrt{n}$ に比例します。

**再帰性と一時性**
ランダムウォークが1次元や2次元では、いつか原点に戻る確率が100%（再帰的）です。しかし、3次元以上では戻らない確率がある（一時的）という驚くべき性質があります。

**大数の法則**
$S_n/n$ は $n \\to \\infty$ で確率0に収束します（大数の法則）。

**中心極限定理の適用**
$S_n = \\sum X_i$ は $n$ が十分大きいとき、正規分布 $N(0, n)$ で近似できます。
$$\\frac{S_n}{\\sqrt{n}} \\xrightarrow{d} N(0, 1)$$`
    },
    {
      title: "ブラウン運動の構成",
      content: `ランダムウォークを時間軸で連続化すると、ブラウン運動が得られます。

**スケーリング極限**
ランダムウォークをより細かいステップで何度も繰り返し、時間を連続化した場合を考えます。

$\\Delta t = 1/n$ の間隔でステップを踏み、$n \\to \\infty$ の極限をとります。その結果が標準ブラウン運動 $B_t$ です。

**数学的な構成**
時間区間 $[0, T]$ を $n$ 分割し、各分割で独立に確率 $1/2$ で $\\pm\\sqrt{\\Delta t}$ の値を取る確率変数を足し合わせます。
$$S_n(t) = \\sum_{i=1}^{\\lfloor nt \\rfloor} \\varepsilon_i \\sqrt{\\Delta t}$$

ここで $\\varepsilon_i$ は $\\pm 1$ を等確率で取ります。

$\\Delta t = 1/n$ として $n \\to \\infty$ の時、$\\text{Var}(S_n(t)) = \\lfloor nt \\rfloor \\times \\Delta t \\to t$ となり、$S_n(t)$ は標準ブラウン運動 $B_t$ に分布収束します。

**標準ブラウン運動の定義**
$B_t$ を標準ブラウン運動とは、以下を満たすプロセスです：
1. $B_0 = 0$（原点から開始）
2. $B_t$ は連続な経路を持つ
3. 増分が独立：任意の $0 \\leq s < t$ に対し、$B_t - B_s$ は $B_u$ ($u \\leq s$) と独立
4. 増分は定常：$B_t - B_s$ の分布は $t - s$ のみに依存
5. 正規性：$B_t - B_s \\sim N(0, t-s)$

**関連プロセス**
一般的なブラウン運動は
$$X_t = \\mu t + \\sigma B_t$$

ここで $\\mu$ はドリフト（平均の傾向）、$\\sigma$ は拡散係数（変動性）です。`
    },
    {
      title: "ブラウン運動の性質",
      content: `ブラウン運動は以下の重要な性質を持ちます。

**基本的な性質**

1. 初期値：$B_0 = 0$

2. 独立増分性：$0 \\leq s_1 < t_1 \\leq s_2 < t_2$ のとき、$[s_1, t_1]$ と $[s_2, t_2]$ での増分は独立

3. 定常増分性：$B_t - B_s$ の分布は $t - s$ に依存（時刻に無関係）

4. 正規増分性：任意の $0 \\leq s < t$ に対し
$$B_t - B_s \\sim N(0, t-s)$$

5. 連続性：ブラウン運動のパスは確率1で連続（微分不可能だが）

**期待値と分散**
$$E[B_t] = 0 \\quad \\text{（すべての } t \\text{）}$$
$$\\text{Var}(B_t) = E[B_t^2] = t$$

標準偏差：$\\sigma(B_t) = \\sqrt{t}$

したがって、時間がたつほどブラウン運動の値は大きくばらつきます。

**共分散構造**
$0 \\leq s \\leq t$ のとき
$$\\text{Cov}(B_s, B_t) = E[B_s B_t]$$
$$= E[B_s(B_s + (B_t - B_s))]$$
$$= E[B_s^2] + E[B_s] \\cdot E[B_t - B_s] \\quad \\text{（独立増分）}$$
$$= s + 0 = s$$

つまり $\\text{Cov}(B_s, B_t) = \\min(s, t)$

**自己相似性**
ブラウン運動は自己相似性を持ちます：
$$\\left\\{\\frac{B_{ct}}{\\sqrt{c}} : t \\geq 0\\right\\} \\overset{d}{=} \\{B_t : t \\geq 0\\}$$

つまり、時間を $c$ 倍に拡大して値を $\\sqrt{c}$ で除すると、統計的には元と同じプロセスになります。

**2次変分**
ブラウン運動は1次変分は無限大ですが、2次変分は有限です：
$$\\sum_i (B_{t_{i+1}} - B_{t_i})^2 \\to t \\quad \\text{（確率的に）}$$

これが確率微分方程式を定義する上で重要です。

**反射原理**
ブラウン運動がレベル $a > 0$ に達する確率は1です。また、レベル $a$ に達したときの最大値分布は特定の性質を持ち、反射原理により計算できます。`
    },
    {
      title: "パラメータ推定",
      content: `ドリフト付きブラウン運動 $X_t = \\mu t + \\sigma B_t$ のパラメータ $\\mu$ と $\\sigma$ を観測データから推定します。

**モーメント推定法**

時刻 $t = 1$ で観測値を $n$ 回取得したデータ $x_1, x_2, \\ldots, x_n$ があるとします。

理論的な性質：
$$E[X(1)] = \\mu, \\quad \\text{Var}(X(1)) = \\sigma^2$$

モーメント推定量：
$$\\hat{\\mu} = \\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$$
$$\\hat{\\sigma}^2 = s^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2 \\quad \\text{（標本分散）}$$

**時系列観測での推定**
より一般には、複数の時点 $t_1, t_2, \\ldots, t_m$ で観測するかもしれません。

$X(t_j) = \\mu t_j + \\sigma B_{t_j}$ が観測され、各時点を $n$ 回繰り返した場合：

最小二乗推定では、$X(t_j) = \\beta t_j + \\varepsilon$ を線形回帰し $\\hat{\\beta} = \\hat{\\mu}$

残差のばらつきから $\\hat{\\sigma}^2 = \\sum(\\text{残差})^2 / \\text{自由度}$

**尤度推定**
ブラウン運動の標本パスの離散観測では、隣接する観測値の差
$$\\Delta X_i = X(t_i) - X(t_{i-1}) \\sim N(\\mu \\Delta t_i, \\sigma^2 \\Delta t_i)$$

等間隔（$\\Delta t_i = \\Delta t$）なら、
$$\\hat{\\mu} = \\frac{\\sum \\Delta X_i}{n \\Delta t}$$
$$\\hat{\\sigma}^2 = \\frac{\\sum(\\Delta X_i)^2}{n \\Delta t} - \\frac{(\\sum \\Delta X_i)^2}{n(n \\Delta t)^2}$$

**実例：株価モデル**
ブラウン運動で株価をモデル化する際（幾何ブラウン運動）、
$$dS_t = \\mu S_t \\, dt + \\sigma S_t \\, dB_t$$

対数収益率 $\\log(S_{t+1}/S_t) \\approx (\\mu - \\sigma^2/2)\\Delta t + \\sigma\\sqrt{\\Delta t} \\, Z$（$Z \\sim N(0,1)$）

ここから、収益率系列から $\\hat{\\mu}$ と $\\hat{\\sigma}$ を推定できます。`
    },
    {
      title: "伊藤の公式",
      content: `**伊藤の補題の定義**
伊藤の公式（Itô's Formula）は、確率解析における最も重要な公式の一つです。ブラウン運動の関数がどのように変化するかを記述し、通常の微積分におけるチェインルール（連鎖律）に対応するものです。ただし、ブラウン運動の2次変分が非零であるため、通常の微分とは異なる補正項が現れます。

**ブラウン運動の関数に対する伊藤の公式**
$f(x)$ が2回連続微分可能な関数で、$B_t$ が標準ブラウン運動のとき：

$$df(B_t) = f'(B_t) \\, dB_t + \\frac{1}{2} f''(B_t) \\, dt$$

積分形で書くと：
$$f(B_t) - f(B_0) = \\int_0^t f'(B_s) \\, dB_s + \\frac{1}{2} \\int_0^t f''(B_s) \\, ds$$

第1項は確率積分（伊藤積分）、第2項が通常の微分にはない伊藤補正項です。この補正項は $(dB_t)^2 = dt$ という関係に由来します。

**一般の伊藤過程に対する公式**
伊藤過程 $dX_t = \\mu(t, X_t) \\, dt + \\sigma(t, X_t) \\, dB_t$ に対し、$f(t, x)$ が十分滑らかなとき：

$$df(t, X_t) = \\left[\\frac{\\partial f}{\\partial t} + \\mu \\frac{\\partial f}{\\partial x} + \\frac{1}{2} \\sigma^2 \\frac{\\partial^2 f}{\\partial x^2}\\right] dt + \\sigma \\frac{\\partial f}{\\partial x} \\, dB_t$$

これは伊藤の公式の最も一般的な形です。

**応用例：幾何ブラウン運動**
株価モデルなどで用いられる幾何ブラウン運動は以下の確率微分方程式で記述されます：

$$dS_t = \\mu S_t \\, dt + \\sigma S_t \\, dB_t$$

この方程式の解を求めるために、$Y_t = \\log S_t$ とおき、伊藤の公式を適用します。
$f(x) = \\log x$ とすると、$f'(x) = 1/x$, $f''(x) = -1/x^2$ より：

$$d(\\log S_t) = \\frac{1}{S_t} dS_t + \\frac{1}{2}\\left(-\\frac{1}{S_t^2}\\right)(\\sigma S_t)^2 \\, dt$$
$$= \\frac{1}{S_t}(\\mu S_t \\, dt + \\sigma S_t \\, dB_t) - \\frac{1}{2} \\sigma^2 \\, dt$$
$$= \\left(\\mu - \\frac{\\sigma^2}{2}\\right) dt + \\sigma \\, dB_t$$

**$S_t$ の解の導出**
$d(\\log S_t) = (\\mu - \\sigma^2/2) \\, dt + \\sigma \\, dB_t$ を $[0, t]$ で積分すると：

$$\\log S_t - \\log S_0 = \\left(\\mu - \\frac{\\sigma^2}{2}\\right)t + \\sigma B_t$$

したがって：
$$S_t = S_0 \\exp\\left(\\left(\\mu - \\frac{\\sigma^2}{2}\\right)t + \\sigma B_t\\right)$$

ここで $\\mu - \\sigma^2/2$ の項に注目してください。ドリフトが $\\mu$ ではなく $\\mu - \\sigma^2/2$ となるのは、伊藤の補正項の効果です。これは対数収益率の期待値に直接影響します。

**ブラック・ショールズ方程式との関連**
幾何ブラウン運動をもとにしたオプション価格理論では、オプション価格 $V(t, S)$ に伊藤の公式を適用することで、以下のブラック・ショールズ偏微分方程式が導かれます：

$$\\frac{\\partial V}{\\partial t} + \\frac{1}{2} \\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS \\frac{\\partial V}{\\partial S} - rV = 0$$

ここで $r$ はリスクフリーレートです。この方程式はリスク中立測度のもとでのヘッジ戦略から導出され、デリバティブの価格付けの基礎となります。`
    },
    {
      title: "演習問題：ランダムウォークからブラウン運動へ",
      content: `【例題】コインを100回投げ、表が出たら $+1$、裏が出たら $-1$ を足します。
(1) 100回後の位置 $S_{100}$ の期待値と分散を求めよ。
(2) $S_{100}$ が $-5$ と $+15$ の間にある確率を求めよ（正規近似）。

【解答】
(1)
$$E[S_{100}] = 0 \\quad \\text{（各ステップの期待値が0）}$$
$$\\text{Var}(S_{100}) = 100 \\times \\text{Var}(X) = 100 \\times 1 = 100$$

標準偏差：$\\sqrt{100} = 10$

(2) 正規近似：$S_{100} \\approx N(0, 100)$

$Z$ スコア：
$$Z_1 = \\frac{-5 - 0}{10} = -0.5, \\quad Z_2 = \\frac{15 - 0}{10} = 1.5$$

$$P(-5 \\leq S_{100} \\leq 15) = P(-0.5 \\leq Z \\leq 1.5) = \\Phi(1.5) - \\Phi(-0.5) = 0.9332 - 0.3085 = 0.6247$$

およそ62.5%の確率で、$-5$ から $+15$ の間に位置します。
【/解答】

---

【例題】$X_t = 2t + 3B_t$ を考えます。
(1) $E[X_1]$, $\\text{Var}(X_1)$ を求めよ。
(2) $X_{0.5}$ と $X_1$ の相関係数を求めよ。
(3) $X_1 - X_{0.5}$ の分布を求めよ。

【解答】
(1)
$$E[X_1] = 2 \\times 1 + 3 \\cdot E[B_1] = 2 + 0 = 2$$
$$\\text{Var}(X_1) = 9 \\cdot \\text{Var}(B_1) = 9 \\times 1 = 9$$

(2)
$$\\text{Cov}(X_{0.5}, X_1) = \\text{Cov}(2 \\times 0.5 + 3B_{0.5}, \\; 2 \\times 1 + 3B_1) = 9 \\cdot \\text{Cov}(B_{0.5}, B_1)$$
$$= 9 \\times \\min(0.5, 1) = 4.5$$

$$\\text{Var}(X_{0.5}) = 9 \\times 0.5 = 4.5, \\quad \\text{Var}(X_1) = 9$$

$$\\rho = \\frac{4.5}{\\sqrt{4.5 \\times 9}} = \\frac{4.5}{\\sqrt{40.5}} \\approx 0.707$$

(3)
$$X_1 - X_{0.5} = (2 + 3B_1) - (1 + 3B_{0.5}) = 1 + 3(B_1 - B_{0.5})$$

$B_1 - B_{0.5} \\sim N(0, 0.5)$ より
$$X_1 - X_{0.5} \\sim N(1, 9 \\times 0.5) = N(1, 4.5)$$
【/解答】

---

【例題】ブラウン運動の共分散 $\\text{Cov}(B_s, B_t)$ を定義から導出せよ。ただし $0 \\leq s \\leq t$ とする。

【解答】
$B_t = B_s + (B_t - B_s)$ と分解します。ここで $B_s$ と $B_t - B_s$ は独立増分性により独立です。

$$\\text{Cov}(B_s, B_t) = E[B_s \\cdot B_t] - E[B_s] \\cdot E[B_t]$$

$E[B_s] = E[B_t] = 0$ なので、
$$\\text{Cov}(B_s, B_t) = E[B_s \\cdot B_t]$$

$B_t = B_s + (B_t - B_s)$ を代入：
$$E[B_s \\cdot B_t] = E[B_s \\cdot (B_s + (B_t - B_s))]$$
$$= E[B_s^2] + E[B_s \\cdot (B_t - B_s)]$$

独立増分性より $B_s$ と $B_t - B_s$ は独立なので：
$$E[B_s \\cdot (B_t - B_s)] = E[B_s] \\cdot E[B_t - B_s] = 0 \\times 0 = 0$$

よって：
$$\\text{Cov}(B_s, B_t) = E[B_s^2] = \\text{Var}(B_s) = s$$

一般に $0 \\leq s, t$ のとき：
$$\\boxed{\\text{Cov}(B_s, B_t) = \\min(s, t)}$$
【/解答】

---

【例題】伊藤の公式を用いて $d(B_t^2)$ を計算せよ。

【解答】
$f(x) = x^2$ とおきます。$f'(x) = 2x$、$f''(x) = 2$ です。

伊藤の公式 $df(B_t) = f'(B_t) \\, dB_t + \\frac{1}{2} f''(B_t) \\, dt$ より：

$$d(B_t^2) = 2B_t \\, dB_t + \\frac{1}{2} \\cdot 2 \\, dt = 2B_t \\, dB_t + dt$$

積分形で書くと：
$$B_t^2 = 2\\int_0^t B_s \\, dB_s + t$$

すなわち：
$$\\int_0^t B_s \\, dB_s = \\frac{1}{2}(B_t^2 - t)$$

通常の微分では $d(x^2) = 2x \\, dx$ ですが、伊藤の公式では追加の項 $dt$ が現れます。これは $(dB_t)^2 = dt$ という伊藤の公式の核心的な性質に由来します。

この結果は伊藤積分 $\\int_0^t B_s \\, dB_s$ の明示的な表現を与える重要な例です。
【/解答】

---

【例題】幾何ブラウン運動 $dS_t = \\mu S_t \\, dt + \\sigma S_t \\, dB_t$ の解を導出せよ。

【解答】
$Y_t = \\log S_t$ とおき、伊藤の公式を適用します。

$f(x) = \\log x$ に対して $f'(x) = \\frac{1}{x}$、$f''(x) = -\\frac{1}{x^2}$ なので：

$$dY_t = d(\\log S_t) = \\frac{1}{S_t} dS_t + \\frac{1}{2}\\left(-\\frac{1}{S_t^2}\\right)(\\sigma S_t)^2 dt$$

$dS_t = \\mu S_t \\, dt + \\sigma S_t \\, dB_t$ を代入：

$$dY_t = \\frac{1}{S_t}(\\mu S_t \\, dt + \\sigma S_t \\, dB_t) - \\frac{\\sigma^2}{2} dt$$
$$= \\mu \\, dt + \\sigma \\, dB_t - \\frac{\\sigma^2}{2} dt$$
$$= \\left(\\mu - \\frac{\\sigma^2}{2}\\right) dt + \\sigma \\, dB_t$$

$[0, t]$ で積分すると：
$$Y_t - Y_0 = \\left(\\mu - \\frac{\\sigma^2}{2}\\right)t + \\sigma B_t$$

$$\\log S_t - \\log S_0 = \\left(\\mu - \\frac{\\sigma^2}{2}\\right)t + \\sigma B_t$$

両辺の指数をとると：
$$\\boxed{S_t = S_0 \\exp\\left(\\left(\\mu - \\frac{\\sigma^2}{2}\\right)t + \\sigma B_t\\right)}$$

**解の性質：**
- $\\log S_t \\sim N\\left(\\log S_0 + (\\mu - \\sigma^2/2)t, \\; \\sigma^2 t\\right)$ なので、$S_t$ は対数正規分布に従います
- $E[S_t] = S_0 e^{\\mu t}$（ドリフト $\\mu$ で指数的に成長）
- $\\text{Var}(S_t) = S_0^2 e^{2\\mu t}(e^{\\sigma^2 t} - 1)$
【/解答】

---

【例題】標準ブラウン運動 $B_t$ の増分の独立性を利用して、$\\text{Var}(B_t - B_s + B_u - B_v)$ を計算せよ。ただし $0 < v < u < s < t$ とする。

【解答】
増分を整理すると：
$$B_t - B_s + B_u - B_v = (B_t - B_s) + (B_u - B_v)$$

$0 < v < u \\leq s < t$ より、区間 $[v, u]$ と $[s, t]$ は重複しないため、増分 $B_u - B_v$ と $B_t - B_s$ は独立です。

独立増分の分散の加法性より：
$$\\text{Var}(B_t - B_s + B_u - B_v) = \\text{Var}(B_t - B_s) + \\text{Var}(B_u - B_v)$$

ブラウン運動の正規増分性より：
$$\\text{Var}(B_t - B_s) = t - s, \\quad \\text{Var}(B_u - B_v) = u - v$$

$$\\boxed{\\text{Var}(B_t - B_s + B_u - B_v) = (t - s) + (u - v)}$$

**補足：** もし区間が重複する場合（例えば $\\text{Var}(B_t - B_s + B_s - B_v) = \\text{Var}(B_t - B_v) = t - v$）は、増分が結合するため単純な加算にはなりません。
【/解答】

---

【例題】標準ブラウン運動 $B_t$ について、$E[B_t^3]$ を計算せよ。

【解答】
$B_t \\sim N(0, t)$ であるから、$B_t = \\sqrt{t} \\, Z$（$Z \\sim N(0,1)$）と書けます。

$$E[B_t^3] = E[(\\sqrt{t} \\, Z)^3] = t^{3/2} \\, E[Z^3]$$

標準正規分布 $Z \\sim N(0,1)$ は原点に関して対称な分布であるため、奇数次モーメントはすべて0です。

実際に計算すると：
$$E[Z^3] = \\int_{-\\infty}^{\\infty} z^3 \\cdot \\frac{1}{\\sqrt{2\\pi}} e^{-z^2/2} \\, dz$$

被積分関数 $z^3 e^{-z^2/2}$ は奇関数（$z$ の奇数乗と偶関数の積）なので：
$$E[Z^3] = 0$$

$$\\boxed{E[B_t^3] = 0}$$

**一般化：** 標準正規分布の $n$ 次モーメントは、$n$ が奇数なら $E[Z^n] = 0$、$n$ が偶数なら $E[Z^n] = (n-1)!!$（二重階乗）です。例えば $E[B_t^4] = t^2 \\cdot E[Z^4] = t^2 \\cdot 3 = 3t^2$。
【/解答】

---

【例題】標準ブラウン運動の最大値に関する反射原理を用いて、$P\\left(\\max_{0 \\leq s \\leq t} B_s \\geq a\\right)$ を求めよ（$a > 0$）。

【解答】
$M_t = \\max_{0 \\leq s \\leq t} B_s$ とおきます。

**反射原理の論法：**
ブラウン運動が時刻 $t$ までに水準 $a > 0$ に到達する事象を考えます。$\\tau_a = \\inf\\{s \\geq 0 : B_s = a\\}$ を初到達時刻とすると：

$$P(M_t \\geq a) = P(\\tau_a \\leq t)$$

$\\tau_a \\leq t$ が起こった場合、時刻 $\\tau_a$ 以降のブラウン運動の対称性（反射原理）により、$B_t > a$ となる確率と $B_t < a$ となる確率は等しいです。

したがって：
$$P(B_t \\geq a) = P(M_t \\geq a \\text{ かつ } B_t \\geq a) = \\frac{1}{2} P(M_t \\geq a)$$

$$P(M_t \\geq a) = 2 P(B_t \\geq a) = 2\\left(1 - \\Phi\\left(\\frac{a}{\\sqrt{t}}\\right)\\right)$$

$$\\boxed{P\\left(\\max_{0 \\leq s \\leq t} B_s \\geq a\\right) = 2\\left(1 - \\Phi\\left(\\frac{a}{\\sqrt{t}}\\right)\\right) = \\text{erfc}\\left(\\frac{a}{\\sqrt{2t}}\\right)}$$

**数値例：** $t = 1$, $a = 1$ のとき
$$P(M_1 \\geq 1) = 2(1 - \\Phi(1)) = 2 \\times 0.1587 = 0.3174$$

約31.7%の確率で、時刻1までにブラウン運動は水準1に到達します。
【/解答】

---

【例題】ドリフト付きブラウン運動 $X_t = \\mu t + \\sigma B_t$ について、$E[X_t]$、$\\text{Var}(X_t)$、および $\\text{Cov}(X_s, X_t)$（$s \\leq t$）を求めよ。

【解答】
**期待値：**
$$E[X_t] = E[\\mu t + \\sigma B_t] = \\mu t + \\sigma E[B_t] = \\mu t$$

ドリフト $\\mu$ により、平均的には時間に比例して移動します。

**分散：**
$$\\text{Var}(X_t) = \\text{Var}(\\mu t + \\sigma B_t) = \\sigma^2 \\text{Var}(B_t) = \\sigma^2 t$$

$\\mu t$ は定数なので分散に寄与しません。

**共分散（$s \\leq t$）：**
$$\\text{Cov}(X_s, X_t) = \\text{Cov}(\\mu s + \\sigma B_s, \\; \\mu t + \\sigma B_t)$$

定数項は共分散に寄与しないので：
$$= \\sigma^2 \\text{Cov}(B_s, B_t) = \\sigma^2 \\min(s, t) = \\sigma^2 s$$

**相関係数：**
$$\\rho(X_s, X_t) = \\frac{\\sigma^2 s}{\\sqrt{\\sigma^2 s \\cdot \\sigma^2 t}} = \\frac{s}{\\sqrt{st}} = \\sqrt{\\frac{s}{t}}$$

**答え：** $E[X_t] = \\mu t$、$\\text{Var}(X_t) = \\sigma^2 t$、$\\text{Cov}(X_s, X_t) = \\sigma^2 \\min(s, t)$
【/解答】

---

【例題】伊藤積分 $\\int_0^t B_s \\, dB_s$ の値を伊藤の公式を用いて求めよ。また、この積分の期待値と分散を計算せよ。

【解答】
**伊藤積分の計算：**
$f(x) = \\frac{1}{2}x^2$ とおくと、$f'(x) = x$、$f''(x) = 1$ です。

伊藤の公式より：
$$d\\left(\\frac{1}{2}B_t^2\\right) = B_t \\, dB_t + \\frac{1}{2} \\cdot 1 \\cdot dt$$

積分形にすると：
$$\\frac{1}{2}B_t^2 - \\frac{1}{2}B_0^2 = \\int_0^t B_s \\, dB_s + \\frac{1}{2}t$$

$B_0 = 0$ より：
$$\\boxed{\\int_0^t B_s \\, dB_s = \\frac{1}{2}(B_t^2 - t)}$$

通常の微積分では $\\int_0^t x \\, dx = \\frac{1}{2}t^2$ ですが、確率積分では $-t/2$ の補正項が現れます。

**期待値：**
$$E\\left[\\int_0^t B_s \\, dB_s\\right] = \\frac{1}{2}E[B_t^2 - t] = \\frac{1}{2}(t - t) = 0$$

これは伊藤積分の一般的な性質（マルチンゲール性）と整合しています。

**分散：**
$$\\text{Var}\\left(\\int_0^t B_s \\, dB_s\\right) = \\frac{1}{4}\\text{Var}(B_t^2 - t) = \\frac{1}{4}\\text{Var}(B_t^2)$$

$B_t \\sim N(0, t)$ より $B_t^2/t \\sim \\chi^2(1)$ であるから $\\text{Var}(B_t^2) = 2t^2$（カイ二乗分布の分散）。

$$\\text{Var}\\left(\\int_0^t B_s \\, dB_s\\right) = \\frac{1}{4} \\cdot 2t^2 = \\frac{t^2}{2}$$

**伊藤の等長性による別解：**
$$E\\left[\\left(\\int_0^t B_s \\, dB_s\\right)^2\\right] = \\int_0^t E[B_s^2] \\, ds = \\int_0^t s \\, ds = \\frac{t^2}{2}$$
【/解答】`
    }
  ]
};
