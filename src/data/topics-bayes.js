import { Brain } from 'lucide-react';
export const topicBayes = {
  id: 'bayes',
  name: 'ベイズ法',
  icon: Brain,
  description: '事前分布と尤度から事後分布を導出する統計推論とMCMC法の実装',
  sections: [
    {
      title: 'ベイズ推論の基礎',
      content: `**ベイズの定理**
母数 $\\theta$、データ $X$ の尤度関数 $L(\\theta|X)$ と事前分布 $\\pi(\\theta)$ から、事後分布 $\\pi(\\theta|X)$ を計算します：

$$\\pi(\\theta|X) = \\frac{L(\\theta|X) \\cdot \\pi(\\theta)}{\\int L(\\theta|X) \\cdot \\pi(\\theta) \\, d\\theta} \\propto L(\\theta|X) \\cdot \\pi(\\theta)$$

分母 $p(X) = \\int L(\\theta|X) \\cdot \\pi(\\theta) \\, d\\theta$ を周辺尤度（エビデンス）と呼びます。

**比例形式での表現**
計算上、正規化定数は不要なことが多いため：

$$\\pi(\\theta|X) \\propto L(\\theta|X) \\cdot \\pi(\\theta)$$

すなわち「事後分布 $\\propto$ 尤度関数 $\\times$ 事前分布」です。

**確率密度の解釈**
- $\\pi(\\theta)$：事前分布。データ観察前の母数に対する信念
- $L(\\theta|X)$：尤度関数。データを観察した下での母数の相対的尤度
- $\\pi(\\theta|X)$：事後分布。データを観察した後の母数の更新された信念

【例題】コイントスの偏りの推定
表が出る確率 $\\theta$ について：
- 事前信念：$\\pi(\\theta) = \\text{Beta}(1,1)$（無情報事前分布）
- データ：$n=10$ 回中、表が $7$ 回
- 尤度：$L(\\theta|X) \\propto \\theta^7(1-\\theta)^3$

【解答】
事後分布は：

$$\\pi(\\theta|X) \\propto \\theta^7(1-\\theta)^3 \\times 1 = \\theta^7(1-\\theta)^3$$

これは $\\text{Beta}(8, 4)$ に相当する。
【/解答】

**逐次的な更新**
ベイズ推論は逐次的に行える（オンラインラーニング）：
- 新しいデータが得られたら、旧事後分布を新事前分布として利用
- 新データの尤度と掛け合わせて新事後分布を得る

$$\\pi_{\\text{new}}(\\theta|X_1,X_2) \\propto L(\\theta|X_2) \\cdot \\pi_{\\text{old}}(\\theta|X_1)$$

【例題】疾病検査の事後確率
ある疾病の有病率 $5\\%$ です。検査精度は感度 $99\\%$、特異度 $95\\%$。陽性反応が出た場合、実際に患者である確率は？

【解答】
ベイズの定理より：

$$P(\\text{病気}|\\text{陽性}) = \\frac{P(\\text{陽性}|\\text{病気}) \\cdot P(\\text{病気})}{P(\\text{陽性}|\\text{病気}) \\cdot P(\\text{病気}) + P(\\text{陽性}|\\text{健康}) \\cdot P(\\text{健康})}$$

$$= \\frac{0.99 \\times 0.05}{0.99 \\times 0.05 + 0.05 \\times 0.95} = \\frac{0.0495}{0.0495 + 0.0475} \\approx 0.510$$

（注：特異度 $95\\%$ より $P(\\text{陽性}|\\text{健康}) = 0.05$）
実際に患者である確率は約 $51\\%$ である。
【/解答】`
    },
    {
      title: '共役事前分布',
      content: `**共役性の定義**
事前分布 $\\pi(\\theta)$ と尤度 $L(\\theta|X)$ が「共役」であるとは、事後分布 $\\pi(\\theta|X)$ が事前分布と同じ分布族に属することです。

利点：
- 事後分布の解析的形式が得られる（計算効率化）
- パラメータの更新ルールが単純
- 逐次学習が容易

**Beta-Binomial共役性**
事前分布：$\\pi(p) = \\text{Beta}(\\alpha, \\beta)$
尤度：$L(p|X) = p^k(1-p)^{n-k}$（$n$ 回中 $k$ 回成功）
事後分布：

$$\\pi(p|X) = \\text{Beta}(\\alpha+k, \\; \\beta+n-k)$$

解釈：
- $\\alpha, \\beta$ は事前の「擬似観測」を表す
- $\\alpha$ 個の「成功」と $\\beta$ 個の「失敗」を事前に観測したと解釈
- データ $k$ 成功、$(n-k)$ 失敗が加わり、新パラメータ $(\\alpha+k, \\; \\beta+n-k)$ が得られる

**Normal-Normal共役性（既知分散）**
事前分布：$\\pi(\\mu) = N(\\mu_0, \\sigma_0^2)$
尤度：$L(\\mu|X) \\propto \\exp\\left(-\\frac{\\sum(X_i - \\mu)^2}{2\\sigma^2}\\right)$（既知分散 $\\sigma^2$）
事後分布：$\\pi(\\mu|X) = N(\\mu_1, \\sigma_1^2)$

ここで：

$$\\frac{1}{\\sigma_1^2} = \\frac{1}{\\sigma_0^2} + \\frac{n}{\\sigma^2}$$

$$\\mu_1 = \\sigma_1^2 \\left(\\frac{\\mu_0}{\\sigma_0^2} + \\frac{n\\bar{X}}{\\sigma^2}\\right)$$

または重み付け表示：

$$\\mu_1 = w \\cdot \\bar{X} + (1-w) \\cdot \\mu_0, \\quad w = \\frac{n/\\sigma^2}{1/\\sigma_0^2 + n/\\sigma^2}$$

**Gamma-Poisson共役性**
事前分布：$\\pi(\\lambda) = \\text{Gamma}(\\alpha, \\beta)$
尤度：$L(\\lambda|X) = \\lambda^{\\sum x_i} e^{-n\\lambda}$（Poissonサンプル）
事後分布：

$$\\pi(\\lambda|X) = \\text{Gamma}(\\alpha + \\textstyle\\sum x_i, \\; \\beta + n)$$

**共役事前分布の表**
| 尤度分布 | 共役事前分布 | 事後分布パラメータ |
|---|---|---|
| $\\text{Binomial}(p)$ | $\\text{Beta}(\\alpha,\\beta)$ | $\\text{Beta}(\\alpha+k, \\; \\beta+n-k)$ |
| $\\text{Poisson}(\\lambda)$ | $\\text{Gamma}(\\alpha,\\beta)$ | $\\text{Gamma}(\\alpha+\\sum x_i, \\; \\beta+n)$ |
| $N(\\mu,\\sigma^2)$ | $N(\\mu_0,\\sigma_0^2)$ | $N(\\mu_1, \\sigma_1^2)$ |
| $\\text{Exp}(\\lambda)$ | $\\text{Gamma}(\\alpha,\\beta)$ | $\\text{Gamma}(\\alpha+n, \\; \\beta+\\sum x_i)$ |

【例題】Beta-Binomial逐次更新
事前：$\\text{Beta}(1,1)$、実験1：3成功7失敗、実験2：5成功5失敗。最終事後分布は？

【解答】
実験1後：$\\text{Beta}(1+3, \\; 1+7) = \\text{Beta}(4, 8)$

実験2後：$\\text{Beta}(4+5, \\; 8+5) = \\text{Beta}(9, 13)$
【/解答】`
    },
    {
      title: 'ベイズ推定',
      content: `**点推定法（Point Estimation）**
事後分布から単一の値を推定する方法：

1. **最大事後推定量（MAP: Maximum A Posteriori）**

$$\\hat{\\theta}_{\\text{MAP}} = \\arg\\max_{\\theta} \\pi(\\theta|X)$$

事後分布の最頻値。
利点：計算が比較的簡単
欠点：非対称な分布では中心傾向が不十分

2. **事後平均（Posterior Mean）**

$$\\hat{\\theta}_{\\text{mean}} = E[\\theta|X] = \\int \\theta \\cdot \\pi(\\theta|X) \\, d\\theta$$

事後分布の期待値。
利点：二乗誤差損失の下で最適
欠点：計算がやや複雑

3. **事後中央値（Posterior Median）**

$$\\hat{\\theta}_{\\text{median}} : \\; P(\\theta < \\hat{\\theta}_{\\text{median}} | X) = 0.5$$

絶対誤差損失の下で最適。外れ値に強い。

**信用区間（Credible Interval）**
事後分布から $100(1-\\alpha)\\%$ 信用区間を構成：

$$P(\\theta_L < \\theta < \\theta_U | X) = 1 - \\alpha$$

**最高密度領域（HPD: Highest Posterior Density）**

$$\\theta_L = \\inf\\{\\theta : \\pi(\\theta|X) \\geq c\\}, \\quad \\theta_U = \\sup\\{\\theta : \\pi(\\theta|X) \\geq c\\}$$

で定義される区間で、最短の信用区間。
対称事後分布では等尾信用区間と一致。

【例題】Betaの推定
事後分布 $\\pi(p|X) = \\text{Beta}(9, 5)$ の場合の点推定量と信用区間を求めよ。

【解答】
$$\\text{MAP} = \\frac{9-1}{9+5-2} = \\frac{8}{12} = \\frac{2}{3}$$

$$E[p|X] = \\frac{9}{9+5} = \\frac{9}{14} \\approx 0.643$$

$90\\%$ 信用区間 $= [0.42, 0.83]$（Beta分布の分位点から）
【/解答】

**予測分布（Predictive Distribution）**
将来のデータ $y_{\\text{future}}$ の分布：

$$p(y_{\\text{future}}|X) = \\int p(y_{\\text{future}}|\\theta) \\cdot \\pi(\\theta|X) \\, d\\theta$$

事後分布で尤度を積分。パラメータの不確実性を組み込む。
例：Poisson-Gamma の場合、予測分布は負の二項分布になります。

【例題】信用区間の計算
事後分布 $\\text{Beta}(4, 8)$ から $90\\%$ 信用区間を求めてください。

【解答】
$\\text{Beta}(4,8)$ の $0.05$ 分位数 $\\approx 0.17$、$0.95$ 分位数 $\\approx 0.48$。

$90\\%$ 信用区間 $= [0.17, 0.48]$
【/解答】`
    },
    {
      title: 'MCMC法',
      content: `**概要**
解析的に積分が計算できない高次元問題の事後分布からサンプリングする手法。マルコフ連鎖モンテカルロ（Markov Chain Monte Carlo）です。

**Metropolis-Hastings法**
提案分布 $q(\\theta^*|\\theta)$ から候補を生成し、確率で受理/棄却して、事後分布に従うサンプルを得ます。

アルゴリズム（反復 $t$）：
1. 現在値 $\\theta^{(t)}$ から提案分布 $q(\\theta^*|\\theta^{(t)})$ で候補 $\\theta^*$ を生成
2. 受理確率を計算：

$$\\alpha = \\min\\left(1, \\; \\frac{\\pi(\\theta^*|X)}{\\pi(\\theta^{(t)}|X)} \\cdot \\frac{q(\\theta^{(t)}|\\theta^*)}{q(\\theta^*|\\theta^{(t)})}\\right)$$

3. $U \\sim \\text{Uniform}(0,1)$ として：
   - $U < \\alpha$ のとき、$\\theta^{(t+1)} = \\theta^*$（受理）
   - $U \\geq \\alpha$ のとき、$\\theta^{(t+1)} = \\theta^{(t)}$（棄却、値を繰り返す）

特殊な場合：対称提案分布 $q(\\theta^*|\\theta) = q(\\theta|\\theta^*)$ のとき、

$$\\alpha = \\min\\left(1, \\; \\frac{\\pi(\\theta^*|X)}{\\pi(\\theta^{(t)}|X)}\\right)$$

**Gibbs抽出法**
多変量問題で $\\theta = (\\theta_1, \\theta_2, \\ldots, \\theta_p)$ の場合、条件付き分布から順番にサンプリング：

アルゴリズム：
1. $\\theta_1^{(t+1)} \\sim \\pi(\\theta_1 | \\theta_2^{(t)}, \\ldots, \\theta_p^{(t)}, X)$
2. $\\theta_2^{(t+1)} \\sim \\pi(\\theta_2 | \\theta_1^{(t+1)}, \\theta_3^{(t)}, \\ldots, \\theta_p^{(t)}, X)$
3. ... （各成分をこの順で更新）
4. $\\theta_p^{(t+1)} \\sim \\pi(\\theta_p | \\theta_1^{(t+1)}, \\ldots, \\theta_{p-1}^{(t+1)}, X)$

利点：複雑な高次元問題に効果的、受理棄却がない

**収束診断（Convergence Diagnostics）**
MCMC出力の有効性を確認：

1. **トレースプロット**：反復図。安定し、水平に見える
2. **自己相関関数（ACF）**：ラグが小さいほど効率的
3. **Gelman-Rubin統計量（$\\hat{R}$）**：複数チェーンで $\\hat{R} < 1.1$ が目安

$$\\hat{R} = \\sqrt{\\frac{(n-1) + B/(nW)}{B}} < 1.1 \\text{ で収束と判定}$$

（$B$：チェーン間分散、$W$：チェーン内分散）

**バーンイン期間（Burn-in）**
初期値の影響を除去するため、最初の反復を捨てます。
- 通常、全体の $10\\%$〜$50\\%$ をバーンインとして指定
- トレースプロットで安定後のサンプルを使用

【例題】ベイズロジスティック回帰
応答変数 $Y$、説明変数 $X$、パラメータ $\\beta$ に対するMCMCの手順を示せ。

【解答】
1. 提案分布で $\\beta^*$ を生成
2. 受理確率計算：

$$\\alpha = \\min\\left(1, \\; \\frac{L(\\beta^*|Y,X)\\pi(\\beta^*)}{L(\\beta^{(t)}|Y,X)\\pi(\\beta^{(t)})}\\right)$$

3. サンプルを蓄積して事後分布を推定
【/解答】

【例題】簡単なMH法の実行
1次元問題で現在値 $\\theta=2$、提案値 $\\theta^*=2.5$、事後比 $\\pi(\\theta^*|X)/\\pi(\\theta^{(t)}|X)=0.8$ の場合、受理確率と次の値を決定してください。

【解答】
$\\alpha = \\min(1, 0.8) = 0.8$

$U \\sim U(0,1)$ で、$U < 0.8$ なら受理（$\\theta^{(t+1)} = 2.5$）、$U \\geq 0.8$ なら棄却（$\\theta^{(t+1)} = 2$）
【/解答】`
    },
    {
      title: '演習問題',
      content: `**問題1：ベイズの定理の計算**
製造過程で、不良品率 $\\theta$ の2つの仮説：
- $H_1$：$\\theta=0.01$（良好）、事前確率 $P(H_1)=0.9$
- $H_2$：$\\theta=0.1$（不調）、事前確率 $P(H_2)=0.1$

サンプル100個中不良品2個が発見。各仮説の事後確率を計算してください。

**問題2：共役事前分布**
$\\text{Poisson}(\\lambda)$ データに対し、事前分布 $\\text{Gamma}(2, 0.5)$ を設定。
データ：$n=10$, $\\sum x_i = 15$

(1) 事後分布のパラメータは？
(2) 事後平均 $E[\\lambda|X]$ は？
(3) 次の観測値 $Y_{\\text{future}}$ の予測分布は何か？

**問題3：Beta-Binomial逐次更新**
無情報事前分布 $\\text{Beta}(1,1)$ から開始。
- 実験1：20回中14回成功
- 実験2：15回中12回成功

各段階での事後分布を求め、成功確率 $p$ の点推定（MAP、平均）を計算してください。

**問題4：信用区間の構成**
事後分布 $N(\\mu=75, \\; \\sigma^2=4)$（データから平均と分散を推定）

(1) $95\\%$ 信用区間を求めてください。
(2) 頻度主義の信頼区間とベイズ信用区間の違いを説明してください。

**問題5：予測分布**
事後分布が $\\text{Beta}(8, 4)$ のとき、

(1) 次の1回の観測 $Y_{\\text{future}}=1$（成功）の確率は？
(2) Beta-Binomial予測分布の平均と分散は？

**問題6：MCMC診断**
Metropolis-Hastings法を1000反復実行後、トレースプロットで：
- 最初の100反復で不安定な変動
- 100反復以降、安定して特定値の周辺で変動
- ACFで $\\text{lag}=50$ で自己相関 $\\approx 0.1$

(1) バーンイン期間はいくつが適切ですか？
(2) 実効サンプルサイズ（ESS）は何を示していますか？

**問題7：Gibbs抽出**
二変量正規分布で条件付き分布が既知の場合、Gibbs法のアルゴリズムを記述してください。
Metropolis-Hastings法との利点・欠点を比較してください。

【例題】ベータ-二項モデルの事後分布を求めよ
ある製品の不良品率 $p$ に対し、事前分布 $\\text{Beta}(2, 5)$ を仮定する。$n=20$ 個を検査して $k=3$ 個の不良品が見つかった。事後分布を求め、$p$ の事後平均とMAPを計算せよ。

【解答】
事後分布は共役性より：

$$\\pi(p|X) = \\text{Beta}(2+3, \\; 5+20-3) = \\text{Beta}(5, 22)$$

事後平均：

$$E[p|X] = \\frac{5}{5+22} = \\frac{5}{27} \\approx 0.185$$

MAP推定値：

$$\\hat{p}_{\\text{MAP}} = \\frac{5-1}{5+22-2} = \\frac{4}{25} = 0.16$$
【/解答】

【例題】正規分布の共役事前分布を用いたベイズ推定
正規分布 $N(\\mu, \\sigma^2)$（$\\sigma^2 = 4$ 既知）からのデータ $n=9$ 個の標本平均が $\\bar{X}=12$ であった。事前分布 $\\mu \\sim N(10, 9)$ のとき、$\\mu$ の事後分布を求め、$95\\%$ 信用区間を計算せよ。

【解答】
事後精度：

$$\\frac{1}{\\sigma_1^2} = \\frac{1}{9} + \\frac{9}{4} = \\frac{4 + 81}{36} = \\frac{85}{36}$$

$$\\sigma_1^2 = \\frac{36}{85} \\approx 0.424$$

事後平均：

$$\\mu_1 = \\sigma_1^2 \\left(\\frac{10}{9} + \\frac{9 \\times 12}{4}\\right) = \\frac{36}{85}\\left(\\frac{10}{9} + 27\\right) = \\frac{36}{85} \\times \\frac{253}{9} = \\frac{36 \\times 253}{85 \\times 9} = \\frac{1012}{85} \\approx 11.91$$

事後分布：$\\mu | X \\sim N(11.91, \\; 0.424)$

$95\\%$ 信用区間：

$$11.91 \\pm 1.96\\sqrt{0.424} = 11.91 \\pm 1.276 = [10.63, \\; 13.19]$$
【/解答】

【例題】ベイズ因子を計算し、モデル選択を行え
コインの公正さを検定する。$H_0: p = 0.5$（公正）、$H_1: p \\sim \\text{Beta}(1,1)$（不公正）とする。$n=20$ 回投げて $k=14$ 回表が出た。ベイズ因子 $B_{01}$ を計算し、どちらのモデルが支持されるか判断せよ。

【解答】
$H_0$ の下での周辺尤度：

$$p(X|H_0) = \\binom{20}{14} (0.5)^{20}$$

$H_1$ の下での周辺尤度（Beta-Binomial）：

$$p(X|H_1) = \\binom{20}{14} \\frac{B(14+1, \\; 6+1)}{B(1,1)} = \\binom{20}{14} \\frac{B(15, 7)}{1} = \\binom{20}{14} \\frac{\\Gamma(15)\\Gamma(7)}{\\Gamma(22)}$$

ベイズ因子：

$$B_{01} = \\frac{p(X|H_0)}{p(X|H_1)} = \\frac{(0.5)^{20}}{B(15,7)/B(1,1)} = \\frac{(0.5)^{20} \\cdot 21!}{14! \\cdot 6!}$$

$B(15,7) = \\frac{14! \\cdot 6!}{21!} \\approx 2.17 \\times 10^{-6}$

$(0.5)^{20} \\approx 9.54 \\times 10^{-7}$

$$B_{01} = \\frac{9.54 \\times 10^{-7}}{2.17 \\times 10^{-6}} \\approx 0.44$$

$B_{01} < 1$ であるため、$H_1$（不公正）が支持される。$B_{10} = 1/B_{01} \\approx 2.27$ であり、$H_1$ に弱い証拠がある（Jeffreysの基準で $1 < B_{10} < 3$）。
【/解答】`
    }
  ]
};
