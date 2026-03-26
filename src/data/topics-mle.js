import { Target } from 'lucide-react';

export const topicMle = {
  id: "mle",
  name: "最尤法",
  icon: Target,
  description: "観測データの尤度を最大化するパラメータ推定法。フィッシャー情報量やクラメール・ラオ不等式についても学びます。",
  sections: [
    {
      title: "対数関数の微分（数学的補足）",
      content: `対数関数の微分は最尤法の計算で頻出するため、まず復習しておきます。

指数関数 $y = e^x$ の逆関数が対数関数 $x = \\log y$ です。

**対数関数の微分公式**
$$\\frac{d}{dy} (\\log y) = \\frac{1}{y}$$

これは逆関数の微分法から導けます。$y = e^x$ の両辺を $x$ で微分すると $\\frac{dy}{dx} = e^x = y$ なので、逆関数の微分は $\\frac{dx}{dy} = \\frac{1}{y}$ となります。

**対数の性質（計算でよく使う）**
- $\\log(ab) = \\log a + \\log b$
- $\\log(a^n) = n \\log a$
- $\\log(a/b) = \\log a - \\log b$

これらの性質を使うと、積の微分を和の微分に変換できるため、尤度関数の微分が大幅に簡単になります。

**自然対数と常用対数**
最尤法では自然対数（自然定数 $e$ を底）を使うことがほとんど。常用対数（底10）も形式は同じですが、統計学では自然対数が標準。

**微分の例**
$$\\frac{d}{dx} (\\log x) = \\frac{1}{x}$$
$$\\frac{d}{dx} (\\log(1-x)) = -\\frac{1}{1-x}$$
$$\\frac{d}{dx} (\\log(x(1-x)^n)) = \\frac{d}{dx} (\\log x + n \\log(1-x)) = \\frac{1}{x} - \\frac{n}{1-x}$$`
    },
    {
      title: "最尤法とは",
      content: `最尤法（Maximum Likelihood Estimation, MLE）は、観測データが得られる「もっともらしさ」を最大化するパラメータ推定法です。20世紀前半にロナルド・フィッシャーによって体系化されました。

**尤度の考え方**
2級では母数が既知の状態での確率計算が中心でしたが、実際には母数は未知です。最尤法は「このデータが得られやすいのは、母数がいくつのときか」を考える方法です。

**コイン投げの例**
コインを6回投げて「裏, 表, 裏, 裏, 表, 裏」が出たとします。表の出る確率を $p$ とすると：
$$P(\\text{データ}) = p^2(1-p)^4$$

$p=0.2$ のとき約0.0164、$p=1/3$ のとき約0.0219（最大）、$p=0.4$ のとき約0.0207

このように、$p$ を変化させて同時確率が最大になる $p$ の値を求めるのが最尤法です。

**尤度関数**
独立な観測値 $x_1, x_2, \\ldots, x_n$ に対し、母数 $\\theta$ の尤度関数は
$$L(\\theta) = \\prod_{i=1}^{n} f(x_i; \\theta)$$

これはデータを固定し、$\\theta$ の関数として見たものです。確率（データが固定されたもの）とは異なり、尤度は $\\theta$ のスケール感覚が異なります。

**対数尤度関数**
$$\\ell(\\theta) = \\log L(\\theta) = \\sum_{i=1}^{n} \\log f(x_i; \\theta)$$

対数関数は単調増加なので、$L(\\theta)$ を最大にする $\\theta$ と $\\ell(\\theta)$ を最大にする $\\theta$ は一致します。積の微分より和の微分のほうが計算しやすいため、対数尤度を使います。

**最尤推定値の求め方**
スコア方程式 $\\frac{d\\ell}{d\\theta} = 0$ を解きます。

複数のパラメータがある場合（例：$\\mu$ と $\\sigma^2$）は、各パラメータで偏微分します：
$$\\frac{\\partial \\ell}{\\partial \\mu} = 0, \\quad \\frac{\\partial \\ell}{\\partial \\sigma^2} = 0$$

**2階微分で確認**
$\\frac{d^2\\ell}{d\\theta^2} < 0$ ならば極大値（最大値）です。`
    },
    {
      title: "ベルヌーイ分布の最尤推定",
      content: `成功確率 $p$ のベルヌーイ試行を $n$ 回行い、成功回数を $y$ 回とします。

各試行で成功なら1、失敗なら0をとる確率変数 $X_i$ について
$$P(X_i = x_i) = p^{x_i}(1-p)^{1-x_i}$$

**尤度関数**
$n$ 回の試行で成功が $y$ 回、失敗が $n-y$ 回観測された場合：
$$L(p) = p^y (1-p)^{n-y}$$

**対数尤度関数**
$$\\ell(p) = \\log L(p) = y \\log p + (n-y) \\log(1-p)$$

**微分して0とおく**
$$\\frac{d\\ell}{dp} = \\frac{y}{p} - \\frac{n-y}{1-p} = 0$$

整理すると
$$y(1-p) = (n-y)p \\implies y - yp = np - yp \\implies y = np$$

**最尤推定量**
$$\\hat{p} = \\frac{y}{n} = \\frac{\\sum x_i}{n}$$
（成功の割合）

これは直感的にも納得できる結果です。確率 $p$ の最尤推定値は、単に成功の比率です。

**2階微分による確認**
$$\\frac{d^2\\ell}{dp^2} = -\\frac{y}{p^2} - \\frac{n-y}{(1-p)^2} < 0$$

よって $\\hat{p} = y/n$ で極大（最大）。

**推定量の性質**
$\\hat{p}$ は不偏推定量（$E[\\hat{p}] = p$）かつ一致推定量（$n \\to \\infty$ で $p$ に確率収束）です。`
    },
    {
      title: "正規分布の最尤推定",
      content: `正規母集団 $N(\\mu, \\sigma^2)$ から大きさ $n$ の無作為標本を得た場合。

尤度関数：
$$L(\\mu, \\sigma^2) = \\prod_{i=1}^{n} \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\left(-\\frac{(x_i-\\mu)^2}{2\\sigma^2}\\right) = (2\\pi\\sigma^2)^{-n/2} \\exp\\left(-\\frac{\\sum_{i=1}^{n}(x_i-\\mu)^2}{2\\sigma^2}\\right)$$

**対数尤度関数**
$$\\ell(\\mu, \\sigma^2) = -\\frac{n}{2} \\log(2\\pi) - \\frac{n}{2} \\log(\\sigma^2) - \\frac{1}{2\\sigma^2} \\sum_{i=1}^{n}(x_i - \\mu)^2$$

**$\\mu$ の最尤推定量**
$\\frac{\\partial \\ell}{\\partial \\mu} = \\frac{1}{\\sigma^2}\\sum_{i=1}^{n}(x_i - \\mu) = 0$ を解くと
$$\\sum_{i=1}^{n} x_i = n\\mu$$
$$\\hat{\\mu} = \\frac{1}{n}\\sum_{i=1}^{n} x_i = \\bar{x} \\quad \\text{（標本平均）}$$

**$\\sigma^2$ の最尤推定量**
$\\frac{\\partial \\ell}{\\partial (\\sigma^2)} = -\\frac{n}{2\\sigma^2} + \\frac{1}{2\\sigma^4}\\sum_{i=1}^{n}(x_i - \\mu)^2 = 0$ を解くと
$$\\hat{\\sigma}^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2 \\quad \\text{（標本分散）}$$

注意：$n$ で割るため、この分散推定量は不偏分散ではなく、$E[\\hat{\\sigma}^2] = \\frac{n-1}{n} \\sigma^2$ です。最尤推定量は必ずしも不偏推定量にはなりません。

**バイアスの修正**
不偏分散 $s^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}(x_i - \\bar{x})^2$ を使えば、$E[s^2] = \\sigma^2$ となります。

標本が大きいとき（$n$ が大きい）、最尤推定量と不偏推定量の差は無視できます。`
    },
    {
      title: "最尤推定量の性質",
      content: `**一致性（consistency）**
標本サイズ $n \\to \\infty$ で、最尤推定量は真の値に確率収束します。
$$\\hat{\\theta}_n \\xrightarrow{p} \\theta_0$$

**漸近正規性（asymptotic normality）**
$n$ が十分大きいとき
$$\\sqrt{n}(\\hat{\\theta} - \\theta_0) \\xrightarrow{d} N(0, I(\\theta_0)^{-1})$$

ここで $I(\\theta)$ はフィッシャー情報量（Fisher information）です。

実務的には：大標本で $\\hat{\\theta} \\approx N\\left(\\theta_0, \\frac{I(\\theta_0)^{-1}}{n}\\right)$

**漸近有効性（asymptotic efficiency）**
最尤推定量はクラメール・ラオ不等式で与えられる下限を漸近的に達成します。つまり、大標本では他のどんな推定量よりも分散が小さい（最良）です。

**不変性（invariance property）（CBTで頻出！）**
$\\theta$ の最尤推定量が $\\hat{\\theta}$ のとき、$g(\\theta)$ の最尤推定量は $g(\\hat{\\theta})$ です。

例えば：
- 母分散 $\\sigma^2$ の最尤推定量が標本分散ならば、母標準偏差 $\\sigma$ の最尤推定量は $\\sqrt{\\hat{\\sigma}^2}$
- 母平均 $\\mu$ の最尤推定量が $\\bar{x}$ ならば、$\\mu^2$ の最尤推定量は $\\bar{x}^2$
- ベルヌーイ分布で $\\hat{p} = y/n$ なら、オッズ $\\frac{p}{1-p}$ の最尤推定量は $\\frac{\\hat{p}}{1-\\hat{p}}$

注意：不偏性にはこの性質はありません。不偏分散の正の平方根は母標準偏差の不偏推定量ではありません（イェンセンの不等式）。

**フィッシャー情報量**
$$I(\\theta) = -E\\left[\\frac{d^2\\ell}{d\\theta^2}\\right] = E\\left[\\left(\\frac{d\\ell}{d\\theta}\\right)^2\\right]$$

情報量が大きい ← 尤度関数が急峻 ← 推定値が正確

**クラメール・ラオ不等式**
任意の不偏推定量 $\\hat{\\theta}$ に対して
$$\\text{Var}(\\hat{\\theta}) \\geq \\frac{1}{nI(\\theta)}$$

が成り立ちます。この下限をCRLB（Cramér-Rao lower bound）と言います。`
    },
    {
      title: "十分統計量 (Sufficient Statistics)",
      content: `十分統計量は、データからパラメータに関する情報を余すことなく抽出する統計量です。推定や検定において、データ全体ではなく十分統計量だけを見れば十分であるという強力な概念です。

**十分統計量の定義**
統計量 $T(X)$ がパラメータ $\\theta$ の十分統計量であるとは、$T(X)$ が与えられたときの $X$ の条件付き分布が $\\theta$ に依存しないことです。

$$T(X) \\text{ が } \\theta \\text{ の十分統計量} \\iff P(X \\mid T(X) = t) \\text{ が } \\theta \\text{ に依存しない}$$

つまり、$T(X)$ の値を知れば、元のデータ $X$ からはもう $\\theta$ についての追加情報は得られません。

**ネイマン・フィッシャーの分解定理（Neyman-Fisher Factorization Theorem）**
$T(X)$ が $\\theta$ の十分統計量であるための必要十分条件は、尤度関数が以下のように分解できることです：

$$f(x; \\theta) = g(T(x), \\theta) \\times h(x)$$

ここで：
- $g(T(x), \\theta)$：$T(x)$ と $\\theta$ のみに依存する関数
- $h(x)$：$\\theta$ に依存しない関数

この定理により、十分統計量の判定が格段に容易になります。

**例1：正規分布 $N(\\mu, \\sigma^2)$ における十分統計量**

$\\mu$ と $\\sigma^2$ がともに未知の場合：
$$f(x; \\mu, \\sigma^2) = (2\\pi\\sigma^2)^{-n/2} \\exp\\left(-\\frac{\\sum_{i=1}^{n}(x_i-\\mu)^2}{2\\sigma^2}\\right)$$

$\\sum(x_i-\\mu)^2 = \\sum x_i^2 - 2\\mu\\sum x_i + n\\mu^2$ と展開すると、尤度が $(\\sum x_i, \\sum x_i^2)$ と $(\\mu, \\sigma^2)$ のみで書けることがわかります。

したがって $T(X) = \\left(\\sum x_i, \\sum x_i^2\\right)$ が $(\\mu, \\sigma^2)$ の十分統計量です。
等価的に $T(X) = \\left(\\bar{X}, \\sum(X_i - \\bar{X})^2\\right)$ も十分統計量です。

**例2：ポアソン分布 $\\text{Poi}(\\lambda)$ における十分統計量**
$$f(x; \\lambda) = \\prod_{i=1}^{n} \\frac{e^{-\\lambda} \\lambda^{x_i}}{x_i!} = e^{-n\\lambda} \\lambda^{\\sum x_i} \\cdot \\frac{1}{\\prod x_i!}$$

これは $g(\\sum x_i, \\lambda) = e^{-n\\lambda} \\lambda^{\\sum x_i}$ と $h(x) = \\frac{1}{\\prod x_i!}$ に分解できるので、
$T(X) = \\sum x_i$ が $\\lambda$ の十分統計量です。

**指数型分布族と十分統計量**
指数型分布族（exponential family）とは、確率密度関数が
$$f(x; \\theta) = c(\\theta) \\, h(x) \\, \\exp\\left(\\sum_{j=1}^{k} \\eta_j(\\theta) \\, T_j(x)\\right)$$

の形に書ける分布族です。正規分布、ポアソン分布、二項分布、ガンマ分布など多くの基本的な分布が指数型分布族に属します。

指数型分布族では、$T(X) = (T_1(X), \\ldots, T_k(X))$ が自然に十分統計量となります。これはネイマン・フィッシャーの分解定理から直ちにわかります。

**最小十分統計量（Minimal Sufficient Statistic）**
十分統計量は一意ではありません（例えばデータ $X$ 自体も常に十分統計量）。その中で最も情報を「圧縮」したものが最小十分統計量です。

定義：十分統計量 $T(X)$ が最小十分統計量であるとは、任意の十分統計量 $U(X)$ に対して $T$ が $U$ の関数として書けることです。

判定法：尤度比を使って判定できます。
$$\\frac{f(x; \\theta)}{f(y; \\theta)} \\text{ が } \\theta \\text{ に依存しない} \\iff T(x) = T(y)$$

となるような $T$ が最小十分統計量です。

**十分統計量と最尤推定の関係**
最尤推定量は十分統計量の関数として書けます。これは尤度関数がネイマン・フィッシャー分解を通じて十分統計量のみに依存するためです。

例：正規分布の最尤推定量 $\\hat{\\mu} = \\bar{X}$ は十分統計量 $\\sum X_i$ の関数です。`
    },
    {
      title: "演習問題：遺伝子型の最尤推定",
      content: `【例題】ある生物の遺伝子型AA, Aa, aaが、$0 < \\theta < 1$ として、それぞれ確率 $\\theta^2$, $2\\theta(1-\\theta)$, $(1-\\theta)^2$ で観察されるとする。6個体を独立に観測し、Aa, AA, Aa, aa, Aa, AA という結果を得た。$\\theta$ の最尤推定値を求めよ。

【解答】
まず観測度数をまとめます：
- AA が2個体
- Aa が3個体
- aa が1個体
- 合計 6個体

同時確率（尤度関数）：
$$L(\\theta) = [2\\theta(1-\\theta)]^3 \\times [\\theta^2]^2 \\times [(1-\\theta)^2]^1 = 8\\theta^7(1-\\theta)^5$$

対数尤度：
$$\\ell(\\theta) = \\log 8 + 7 \\log \\theta + 5 \\log(1-\\theta)$$

スコア方程式：
$$\\frac{d\\ell}{d\\theta} = \\frac{7}{\\theta} - \\frac{5}{1-\\theta} = 0$$

$$7(1-\\theta) = 5\\theta \\implies 7 = 12\\theta \\implies \\theta = \\frac{7}{12}$$

2階微分で確認：
$$\\frac{d^2\\ell}{d\\theta^2} = -\\frac{7}{\\theta^2} - \\frac{5}{(1-\\theta)^2} < 0$$

よって確かに最大値。

**答え：$\\hat{\\theta} = \\frac{7}{12} \\approx 0.583$**

これは遺伝子 A の頻度が約58.3%であることを意味します。

**別解：直接計算**
遺伝子Aの個数を数えても同じ：
- AA は A遺伝子2個
- Aa は A遺伝子1個
- aa は A遺伝子0個

総A遺伝子数 $= 2 \\times 2 + 3 \\times 1 + 1 \\times 0 = 7$
総遺伝子数 $= 6 \\times 2 = 12$

$\\hat{\\theta} = 7/12$

**補問：信頼区間**
フィッシャー情報量：
$$I(\\theta) = \\frac{7}{\\theta^2} + \\frac{5}{(1-\\theta)^2} \\bigg|_{\\theta=7/12} = \\frac{7}{49/144} + \\frac{5}{25/144} = \\frac{7 \\times 144}{49} + \\frac{5 \\times 144}{25} \\approx 20.57 + 28.8 = 49.37$$

$\\hat{\\theta}$ の分散（大標本近似）：
$$\\text{Var}(\\hat{\\theta}) \\approx \\frac{1}{nI(\\theta)} = \\frac{1}{6 \\times 49.37} \\approx 0.00337, \\quad \\sigma \\approx 0.058$$

95%信頼区間：
$$\\hat{\\theta} \\pm 1.96\\sigma = \\frac{7}{12} \\pm 1.96 \\times 0.058 \\approx (0.47, 0.70)$$
【/解答】

---

【例題】指数分布 $f(x; \\lambda) = \\lambda e^{-\\lambda x}$ （$x \\geq 0$）からの無作為標本 $x_1, x_2, \\ldots, x_n$ に基づいて、$\\lambda$ の最尤推定量を求めよ。

【解答】
尤度関数：
$$L(\\lambda) = \\prod_{i=1}^{n} \\lambda e^{-\\lambda x_i} = \\lambda^n \\exp\\left(-\\lambda \\sum_{i=1}^{n} x_i\\right)$$

対数尤度関数：
$$\\ell(\\lambda) = n \\log \\lambda - \\lambda \\sum_{i=1}^{n} x_i$$

スコア方程式：
$$\\frac{d\\ell}{d\\lambda} = \\frac{n}{\\lambda} - \\sum_{i=1}^{n} x_i = 0$$

$$\\lambda = \\frac{n}{\\sum_{i=1}^{n} x_i} = \\frac{1}{\\bar{x}}$$

2階微分で確認：
$$\\frac{d^2\\ell}{d\\lambda^2} = -\\frac{n}{\\lambda^2} < 0$$

よって確かに最大値。

**答え：$\\hat{\\lambda} = \\frac{1}{\\bar{x}}$**

これは標本平均の逆数です。指数分布の期待値が $E[X] = 1/\\lambda$ であることと整合しています。不変性の性質から、平均寿命 $1/\\lambda$ の最尤推定量は $\\bar{x}$ です。
【/解答】

---

【例題】ポアソン分布 $P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$ の十分統計量を示し、$\\lambda$ の最尤推定量を求めよ。

【解答】
**十分統計量の証明**
無作為標本 $x_1, \\ldots, x_n$ の同時確率関数：
$$f(x; \\lambda) = \\prod_{i=1}^{n} \\frac{\\lambda^{x_i} e^{-\\lambda}}{x_i!} = e^{-n\\lambda} \\lambda^{\\sum x_i} \\cdot \\frac{1}{\\prod x_i!}$$

ネイマン・フィッシャーの分解定理より、$g(T, \\lambda) = e^{-n\\lambda} \\lambda^{\\sum x_i}$、$h(x) = \\frac{1}{\\prod x_i!}$ と分解できるので、$T(X) = \\sum_{i=1}^{n} X_i$ が $\\lambda$ の十分統計量です。

**最尤推定量の導出**
対数尤度関数：
$$\\ell(\\lambda) = -n\\lambda + \\left(\\sum_{i=1}^{n} x_i\\right) \\log \\lambda - \\sum_{i=1}^{n} \\log(x_i!)$$

スコア方程式：
$$\\frac{d\\ell}{d\\lambda} = -n + \\frac{\\sum x_i}{\\lambda} = 0$$

$$\\hat{\\lambda} = \\frac{\\sum_{i=1}^{n} x_i}{n} = \\bar{x}$$

2階微分で確認：$\\frac{d^2\\ell}{d\\lambda^2} = -\\frac{\\sum x_i}{\\lambda^2} < 0$

**答え：$\\hat{\\lambda} = \\bar{x}$（標本平均）**

最尤推定量 $\\hat{\\lambda} = \\bar{x}$ は十分統計量 $\\sum X_i$ の関数であり、ポアソン分布の期待値が $E[X] = \\lambda$ であることと整合しています。
【/解答】

---

【例題】正規分布 $N(\\mu, \\sigma^2)$（$\\sigma^2$ 既知）からの無作為標本 $x_1, \\ldots, x_n$ について、$\\mu$ のフィッシャー情報量を求め、クラメール・ラオ下限（CRLB）を計算せよ。また、標本平均 $\\bar{X}$ がCRLBを達成することを示せ。

【解答】
**フィッシャー情報量の計算**
1標本あたりの対数尤度：
$$\\log f(x; \\mu) = -\\frac{1}{2}\\log(2\\pi\\sigma^2) - \\frac{(x - \\mu)^2}{2\\sigma^2}$$

1階微分（スコア関数）：
$$\\frac{\\partial}{\\partial \\mu} \\log f(x; \\mu) = \\frac{x - \\mu}{\\sigma^2}$$

2階微分：
$$\\frac{\\partial^2}{\\partial \\mu^2} \\log f(x; \\mu) = -\\frac{1}{\\sigma^2}$$

フィッシャー情報量：
$$I(\\mu) = -E\\left[\\frac{\\partial^2}{\\partial \\mu^2} \\log f(x; \\mu)\\right] = \\frac{1}{\\sigma^2}$$

**クラメール・ラオ下限**
$\\mu$ の任意の不偏推定量 $\\hat{\\mu}$ に対して：
$$\\text{Var}(\\hat{\\mu}) \\geq \\frac{1}{nI(\\mu)} = \\frac{\\sigma^2}{n}$$

**標本平均がCRLBを達成することの確認**
$$\\text{Var}(\\bar{X}) = \\text{Var}\\left(\\frac{1}{n}\\sum_{i=1}^{n} X_i\\right) = \\frac{\\sigma^2}{n}$$

これはCRLBに一致するので、$\\bar{X}$ は一様最小分散不偏推定量（UMVUE）です。
【/解答】

---

【例題】一様分布 $U(0, \\theta)$（$\\theta > 0$）からの無作為標本 $x_1, x_2, \\ldots, x_n$ に基づいて、$\\theta$ の最尤推定量を求めよ。

【解答】
一様分布の確率密度関数は
$$f(x; \\theta) = \\frac{1}{\\theta} \\quad (0 \\leq x \\leq \\theta)$$

尤度関数：
$$L(\\theta) = \\prod_{i=1}^{n} \\frac{1}{\\theta} \\cdot I(0 \\leq x_i \\leq \\theta) = \\frac{1}{\\theta^n} \\cdot I(x_{(n)} \\leq \\theta)$$

ここで $x_{(n)} = \\max(x_1, \\ldots, x_n)$ は最大順序統計量、$I(\\cdot)$ は指示関数です。

$\\theta \\geq x_{(n)}$ の範囲で $L(\\theta) = 1/\\theta^n$ は $\\theta$ の減少関数であるため、$L(\\theta)$ は $\\theta = x_{(n)}$ で最大となります。

$$\\hat{\\theta} = x_{(n)} = \\max(x_1, x_2, \\ldots, x_n)$$

**注意：** この推定量は微分によるスコア方程式では求まりません。尤度関数が $\\theta$ について微分不可能な点で最大値を取るからです。これは正則条件を満たさない例として重要です。

**バイアスの確認：**
$x_{(n)}$ の分布関数は $F_{x_{(n)}}(t) = (t/\\theta)^n$（$0 \\leq t \\leq \\theta$）より
$$E[x_{(n)}] = \\int_0^\\theta t \\cdot \\frac{n t^{n-1}}{\\theta^n} dt = \\frac{n}{n+1} \\theta$$

よって $\\hat{\\theta} = x_{(n)}$ は不偏推定量ではなく、不偏修正すると $\\hat{\\theta}_{\\text{unbiased}} = \\frac{n+1}{n} x_{(n)}$ となります。
【/解答】

---

【例題】正規分布 $N(\\mu, \\sigma^2)$ からの無作為標本 $x_1, \\ldots, x_n$ に対し、対数尤度関数を導出し、$\\mu$ と $\\sigma^2$ の最尤推定量を求める過程を詳細に示せ。

【解答】
確率密度関数：
$$f(x_i; \\mu, \\sigma^2) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\left(-\\frac{(x_i - \\mu)^2}{2\\sigma^2}\\right)$$

尤度関数：
$$L(\\mu, \\sigma^2) = \\prod_{i=1}^{n} \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\left(-\\frac{(x_i - \\mu)^2}{2\\sigma^2}\\right)$$

対数尤度関数の導出（対数の性質 $\\log(ab) = \\log a + \\log b$ を利用）：
$$\\ell(\\mu, \\sigma^2) = -\\frac{n}{2}\\log(2\\pi) - \\frac{n}{2}\\log(\\sigma^2) - \\frac{1}{2\\sigma^2}\\sum_{i=1}^{n}(x_i - \\mu)^2$$

$\\mu$ に関する偏微分：
$$\\frac{\\partial \\ell}{\\partial \\mu} = \\frac{1}{\\sigma^2}\\sum_{i=1}^{n}(x_i - \\mu) = 0$$
$$\\sum_{i=1}^{n} x_i - n\\mu = 0 \\implies \\hat{\\mu} = \\bar{x}$$

$\\sigma^2$ に関する偏微分（$\\tau = \\sigma^2$ とおく）：
$$\\frac{\\partial \\ell}{\\partial \\tau} = -\\frac{n}{2\\tau} + \\frac{1}{2\\tau^2}\\sum_{i=1}^{n}(x_i - \\mu)^2 = 0$$

$\\hat{\\mu} = \\bar{x}$ を代入して整理すると：
$$\\hat{\\sigma}^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2$$

**答え：$\\hat{\\mu} = \\bar{x}$、$\\hat{\\sigma}^2 = \\frac{1}{n}\\sum(x_i - \\bar{x})^2$**

$\\hat{\\sigma}^2$ は $n$ で割るため不偏推定量ではない（$E[\\hat{\\sigma}^2] = \\frac{n-1}{n}\\sigma^2$）。
【/解答】

---

【例題】ポアソン分布 $\\text{Poi}(\\lambda)$ のフィッシャー情報量を求め、$\\bar{X}$ がクラメール・ラオ下限を達成することを示せ。

【解答】
ポアソン分布の確率関数：$P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$

対数尤度（1標本）：
$$\\log f(x; \\lambda) = x \\log \\lambda - \\lambda - \\log(x!)$$

スコア関数：
$$\\frac{\\partial}{\\partial \\lambda} \\log f(x; \\lambda) = \\frac{x}{\\lambda} - 1$$

フィッシャー情報量（定義 $I(\\lambda) = E\\left[\\left(\\frac{\\partial \\log f}{\\partial \\lambda}\\right)^2\\right]$）：
$$I(\\lambda) = E\\left[\\left(\\frac{X}{\\lambda} - 1\\right)^2\\right] = \\frac{1}{\\lambda^2} E[(X - \\lambda)^2] = \\frac{1}{\\lambda^2} \\cdot \\text{Var}(X) = \\frac{1}{\\lambda^2} \\cdot \\lambda = \\frac{1}{\\lambda}$$

別解（2階微分から）：
$$\\frac{\\partial^2}{\\partial \\lambda^2} \\log f(x; \\lambda) = -\\frac{x}{\\lambda^2}$$
$$I(\\lambda) = -E\\left[-\\frac{X}{\\lambda^2}\\right] = \\frac{E[X]}{\\lambda^2} = \\frac{\\lambda}{\\lambda^2} = \\frac{1}{\\lambda}$$

**クラメール・ラオ下限：**
$$\\text{Var}(\\hat{\\lambda}) \\geq \\frac{1}{nI(\\lambda)} = \\frac{\\lambda}{n}$$

$\\hat{\\lambda} = \\bar{X}$ の分散は $\\text{Var}(\\bar{X}) = \\frac{\\lambda}{n}$ であり、CRLBに一致します。よって $\\bar{X}$ は有効推定量（UMVUE）です。
【/解答】

---

【例題】指数型分布族 $f(x; \\theta) = c(\\theta) \\, h(x) \\, \\exp(\\eta(\\theta) \\, T(x))$ の十分統計量が $T(X) = \\sum_{i=1}^{n} T(x_i)$ であることを、ネイマン・フィッシャーの分解定理を用いて一般的に導出せよ。

【解答】
無作為標本 $x_1, \\ldots, x_n$ の同時密度関数：
$$f(x_1, \\ldots, x_n; \\theta) = \\prod_{i=1}^{n} c(\\theta) \\, h(x_i) \\, \\exp(\\eta(\\theta) \\, T(x_i))$$

整理すると：
$$= [c(\\theta)]^n \\exp\\left(\\eta(\\theta) \\sum_{i=1}^{n} T(x_i)\\right) \\cdot \\prod_{i=1}^{n} h(x_i)$$

ネイマン・フィッシャーの分解定理の形に対応させると：
$$g\\left(\\sum_{i=1}^{n} T(x_i),\\; \\theta\\right) = [c(\\theta)]^n \\exp\\left(\\eta(\\theta) \\sum_{i=1}^{n} T(x_i)\\right)$$
$$h(x_1, \\ldots, x_n) = \\prod_{i=1}^{n} h(x_i)$$

$g$ は $\\sum T(x_i)$ と $\\theta$ のみに依存し、$h$ は $\\theta$ に依存しないので、分解定理より $\\sum_{i=1}^{n} T(x_i)$ は $\\theta$ の十分統計量です。

**具体例での確認：**
- 正規分布（$\\mu$ 未知、$\\sigma^2$ 既知）：$T(x) = x$、十分統計量は $\\sum x_i$
- ポアソン分布：$T(x) = x$、十分統計量は $\\sum x_i$
- 指数分布：$T(x) = x$、十分統計量は $\\sum x_i$
- ベルヌーイ分布：$T(x) = x$、十分統計量は $\\sum x_i$（成功回数）
【/解答】

---

【例題】スコア関数 $S(\\theta) = \\frac{\\partial}{\\partial \\theta} \\log f(X; \\theta)$ の期待値が0であること、すなわち $E[S(\\theta)] = 0$ を証明せよ。

【解答】
$f(x; \\theta)$ は確率密度関数なので：
$$\\int f(x; \\theta) \\, dx = 1$$

両辺を $\\theta$ で微分します（微分と積分の交換が許される正則条件を仮定）：
$$\\frac{\\partial}{\\partial \\theta} \\int f(x; \\theta) \\, dx = \\frac{\\partial}{\\partial \\theta} 1 = 0$$

$$\\int \\frac{\\partial f(x; \\theta)}{\\partial \\theta} \\, dx = 0$$

ここで、対数微分の公式 $\\frac{\\partial \\log f}{\\partial \\theta} = \\frac{1}{f} \\cdot \\frac{\\partial f}{\\partial \\theta}$ より：
$$\\frac{\\partial f}{\\partial \\theta} = f \\cdot \\frac{\\partial \\log f}{\\partial \\theta}$$

代入すると：
$$\\int f(x; \\theta) \\cdot \\frac{\\partial \\log f(x; \\theta)}{\\partial \\theta} \\, dx = 0$$

$$E\\left[\\frac{\\partial \\log f(X; \\theta)}{\\partial \\theta}\\right] = E[S(\\theta)] = 0$$

**この結果の意義：** スコア関数の期待値が0であることから、フィッシャー情報量は $I(\\theta) = \\text{Var}(S(\\theta)) = E[S(\\theta)^2]$ と書けます。また、この性質はクラメール・ラオ不等式の証明の出発点となります。
【/解答】

---

【例題】ニュートン・ラフソン法を用いて、ガンマ分布 $\\text{Gamma}(\\alpha, \\beta)$ の形状パラメータ $\\alpha$ の最尤推定値を数値的に求める方法を説明せよ。観測データの標本平均を $\\bar{x} = 3.2$、$\\overline{\\log x} = 0.95$ とし、初期値 $\\alpha_0 = 2$ から2回の反復を行え。ただし $\\beta$ は $\\hat{\\beta} = \\bar{x}/\\alpha$ で置き換えるものとする。

【解答】
ガンマ分布の対数尤度関数（$\\beta = \\bar{x}/\\alpha$ を代入後）を $\\alpha$ について整理すると、スコア方程式は：
$$g(\\alpha) = \\log \\alpha - \\psi(\\alpha) - \\log \\bar{x} + \\overline{\\log x} = 0$$

ここで $\\psi(\\alpha) = \\frac{d}{d\\alpha} \\log \\Gamma(\\alpha)$（ディガンマ関数）です。

ニュートン・ラフソン法の更新式：
$$\\alpha_{k+1} = \\alpha_k - \\frac{g(\\alpha_k)}{g'(\\alpha_k)}$$

$g'(\\alpha) = \\frac{1}{\\alpha} - \\psi'(\\alpha)$（$\\psi'$ はトリガンマ関数）

**数値計算：**
ディガンマ関数とトリガンマ関数の近似値を用います。

第1反復（$\\alpha_0 = 2$）：
$\\psi(2) \\approx 0.4228$、$\\psi'(2) \\approx 0.6449$

$$g(2) = \\log 2 - 0.4228 - \\log 3.2 + 0.95 = 0.6931 - 0.4228 - 1.1632 + 0.95 = 0.0571$$

$$g'(2) = \\frac{1}{2} - 0.6449 = -0.1449$$

$$\\alpha_1 = 2 - \\frac{0.0571}{-0.1449} = 2 + 0.394 = 2.394$$

第2反復（$\\alpha_1 = 2.394$）：
$\\psi(2.394) \\approx 0.6283$、$\\psi'(2.394) \\approx 0.5089$

$$g(2.394) = \\log 2.394 - 0.6283 - 1.1632 + 0.95 = 0.8734 - 0.6283 - 1.1632 + 0.95 = 0.0319$$

$$g'(2.394) = \\frac{1}{2.394} - 0.5089 = 0.4177 - 0.5089 = -0.0912$$

$$\\alpha_2 = 2.394 - \\frac{0.0319}{-0.0912} = 2.394 + 0.350 = 2.744$$

反復を続けると $\\hat{\\alpha} \\approx 3.0$ 付近に収束します。対応する $\\hat{\\beta} = 3.2/\\hat{\\alpha}$ も求まります。

**ニュートン・ラフソン法の利点：** 尤度方程式に閉じた形の解がない場合でも、数値的にMLEを求められます。2次収束するため、良い初期値からは少ない反復で精度の高い推定値が得られます。
【/解答】`
    }
  ]
};
