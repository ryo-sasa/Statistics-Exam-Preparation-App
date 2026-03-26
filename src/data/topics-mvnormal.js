import { Boxes } from 'lucide-react';

export const topicMvnormal = {
  id: 'mvnormal',
  name: '多変量正規分布',
  icon: Boxes,
  description: 'p次元正規分布の性質と応用',
  sections: [
    {
      title: '多変量正規分布の定義',
      content: `**確率密度関数**
$p$ 次元のランダムベクトル $\\mathbf{X} = (X_1, \\ldots, X_p)^\\top$ が多変量正規分布に従うとき、確率密度関数は以下のように定義されます：

$$f(\\mathbf{x}) = (2\\pi)^{-p/2} |\\boldsymbol{\\Sigma}|^{-1/2} \\exp\\left(-\\frac{1}{2} (\\mathbf{x}-\\boldsymbol{\\mu})^\\top \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x}-\\boldsymbol{\\mu})\\right)$$

ここで $\\boldsymbol{\\mu} = (\\mu_1, \\ldots, \\mu_p)^\\top$ は平均ベクトル、$\\boldsymbol{\\Sigma}$ は $p \\times p$ の共分散行列です。

**表記と意味**
- $\\mathbf{X} \\sim N_p(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$：$p$ 次元正規分布
- $\\boldsymbol{\\mu} = E[\\mathbf{X}]$：平均ベクトル
- $\\boldsymbol{\\Sigma} = \\text{Cov}(\\mathbf{X})$：共分散行列
- $|\\boldsymbol{\\Sigma}|$：共分散行列の行列式
- $\\boldsymbol{\\Sigma}^{-1}$：精密度行列（precision matrix）

**実例**：2変量正規分布 $N_2(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$ では、

$$\\boldsymbol{\\mu} = \\begin{pmatrix} \\mu_1 \\\\ \\mu_2 \\end{pmatrix}, \\quad \\boldsymbol{\\Sigma} = \\begin{pmatrix} \\sigma_1^2 & \\rho\\sigma_1\\sigma_2 \\\\ \\rho\\sigma_1\\sigma_2 & \\sigma_2^2 \\end{pmatrix}$$`
    },
    {
      title: '多変量正規分布の性質',
      content: `**周辺分布は正規分布**
$\\mathbf{X} \\sim N_p(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$ のとき、任意の部分ベクトル（例：$\\mathbf{X}_1 = (X_1, \\ldots, X_k)^\\top$）の周辺分布も正規分布に従います：

$$\\mathbf{X}_1 \\sim N_k(\\boldsymbol{\\mu}_1, \\boldsymbol{\\Sigma}_{11})$$

**条件付き分布は正規分布**
$\\mathbf{X}$ を $(\\mathbf{X}_1, \\mathbf{X}_2)$ に分割したとき、$\\mathbf{X}_2 = \\mathbf{x}_2$ が与えられたときの $\\mathbf{X}_1$ の条件付き分布も正規分布です。

**線形変換**
$\\mathbf{Y} = \\mathbf{A}\\mathbf{X} + \\mathbf{b}$（$\\mathbf{A}$ は $m \\times p$ 行列）のとき：

$$\\mathbf{Y} \\sim N_m(\\mathbf{A}\\boldsymbol{\\mu} + \\mathbf{b}, \\; \\mathbf{A}\\boldsymbol{\\Sigma}\\mathbf{A}^\\top)$$

**無相関と独立の同値性**
多変量正規分布に従う確率変数では、無相関と独立が同値です。即ち：

$$\\text{Cov}(X_i, X_j) = 0 \\iff X_i \\text{ と } X_j \\text{ は独立}$$

**例**：$(X_1, X_2)^\\top \\sim N_2(\\mathbf{0}, \\mathbf{I}_2)$ のとき、共分散が $0$ なので $X_1$ と $X_2$ は独立です。`
    },
    {
      title: '条件付き分布の公式',
      content: `**設定**
$\\mathbf{X} \\sim N_p(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$ を $(\\mathbf{X}_1, \\mathbf{X}_2)$ に分割します。ここで $\\mathbf{X}_1 \\in \\mathbb{R}^k$, $\\mathbf{X}_2 \\in \\mathbb{R}^{p-k}$ です。

**平均と共分散行列の分割**

$$\\boldsymbol{\\mu} = \\begin{pmatrix} \\boldsymbol{\\mu}_1 \\\\ \\boldsymbol{\\mu}_2 \\end{pmatrix}, \\quad \\boldsymbol{\\Sigma} = \\begin{pmatrix} \\boldsymbol{\\Sigma}_{11} & \\boldsymbol{\\Sigma}_{12} \\\\ \\boldsymbol{\\Sigma}_{21} & \\boldsymbol{\\Sigma}_{22} \\end{pmatrix}$$

**条件付き分布**
$\\mathbf{X}_2 = \\mathbf{x}_2$ が与えられたときの $\\mathbf{X}_1$ の条件付き分布は：

$$\\mathbf{X}_1 | \\mathbf{X}_2 = \\mathbf{x}_2 \\sim N_k(\\boldsymbol{\\mu}_{1|2}, \\; \\boldsymbol{\\Sigma}_{1|2})$$

**条件付き平均（回帰平面）**

$$E[\\mathbf{X}_1 | \\mathbf{X}_2 = \\mathbf{x}_2] = \\boldsymbol{\\mu}_1 + \\boldsymbol{\\Sigma}_{12} \\boldsymbol{\\Sigma}_{22}^{-1} (\\mathbf{x}_2 - \\boldsymbol{\\mu}_2)$$

**条件付き共分散**

$$\\text{Cov}(\\mathbf{X}_1 | \\mathbf{X}_2 = \\mathbf{x}_2) = \\boldsymbol{\\Sigma}_{11} - \\boldsymbol{\\Sigma}_{12} \\boldsymbol{\\Sigma}_{22}^{-1} \\boldsymbol{\\Sigma}_{21}$$

これは $\\mathbf{X}_2$ の値に依存しない定数行列です（同分散性）。$\\boldsymbol{\\Sigma}_{12} \\boldsymbol{\\Sigma}_{22}^{-1}$ は回帰係数行列です。`
    },
    {
      title: 'マハラノビス距離とカイ二乗分布',
      content: `**マハラノビス距離の定義**
データ点 $\\mathbf{x}$ と平均 $\\boldsymbol{\\mu}$ の間のマハラノビス距離の二乗は：

$$D^2 = (\\mathbf{x} - \\boldsymbol{\\mu})^\\top \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x} - \\boldsymbol{\\mu})$$

これはユークリッド距離と異なり、共分散構造を考慮した距離です。分散が大きい方向の差異は小さく、分散が小さい方向の差異は大きく評価されます。

**カイ二乗分布との関係**
$\\mathbf{X} \\sim N_p(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$ のとき、マハラノビス距離の二乗は自由度 $p$ のカイ二乗分布に従います：

$$D^2 \\sim \\chi^2(p)$$

この性質により、異常値検出や仮説検定に利用できます。例えば、$D^2 > \\chi^2_{0.95}(p)$ であれば $\\alpha=0.05$ 有意水準で異常値とみなされます。

**実例**
2次元の場合、共分散行列 $\\boldsymbol{\\Sigma} = \\mathbf{I}_2$（単位行列）のとき、マハラノビス距離はユークリッド距離に一致し、$D^2 \\sim \\chi^2(2)$ となります。これは原点からの二乗距離の分布です。`
    },
    {
      title: 'ホテリングのT²検定',
      content: `**多変量平均ベクトルの検定**
ホテリングの $T^2$ 検定は、多変量正規分布に従う母集団の平均ベクトルに関する検定です。1変量のt検定を多変量に拡張したものであり、$p$ 個の変数を同時に考慮して検定を行います。

**1標本問題**
帰無仮説 $H_0: \\boldsymbol{\\mu} = \\boldsymbol{\\mu}_0$ を検定します。
$n$ 個の観測ベクトル $\\mathbf{x}_1, \\ldots, \\mathbf{x}_n$ が $N_p(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$ から得られたとき、検定統計量は：

$$T^2 = n(\\bar{\\mathbf{x}} - \\boldsymbol{\\mu}_0)^\\top \\mathbf{S}^{-1} (\\bar{\\mathbf{x}} - \\boldsymbol{\\mu}_0)$$

ここで $\\bar{\\mathbf{x}} = \\frac{1}{n}\\sum \\mathbf{x}_i$ は標本平均ベクトル、$\\mathbf{S}$ は標本共分散行列です。

**F分布との関係**
$T^2$ 統計量は以下の変換によりF分布に従います：

$$F = \\frac{T^2 (n - p)}{p(n - 1)} \\sim F(p, \\; n - p)$$

ここで $p$ は変数の次元数、$n$ は標本サイズです。有意水準 $\\alpha$ で $F > F_\\alpha(p, n-p)$ のとき $H_0$ を棄却します。

**2標本問題への拡張**
2つの母集団 $N_p(\\boldsymbol{\\mu}_1, \\boldsymbol{\\Sigma})$ と $N_p(\\boldsymbol{\\mu}_2, \\boldsymbol{\\Sigma})$（共分散行列が等しいと仮定）の平均ベクトルの差を検定します。
帰無仮説 $H_0: \\boldsymbol{\\mu}_1 = \\boldsymbol{\\mu}_2$ に対する検定統計量は：

$$T^2 = \\frac{n_1 n_2}{n_1 + n_2} (\\bar{\\mathbf{x}}_1 - \\bar{\\mathbf{x}}_2)^\\top \\mathbf{S}_p^{-1} (\\bar{\\mathbf{x}}_1 - \\bar{\\mathbf{x}}_2)$$

ここで $\\mathbf{S}_p$ はプール共分散行列です。対応するF統計量は：

$$F = \\frac{T^2 (n_1 + n_2 - p - 1)}{p(n_1 + n_2 - 2)} \\sim F(p, \\; n_1 + n_2 - p - 1)$$

**同時信頼領域**
$T^2$ 検定に基づく平均ベクトル $\\boldsymbol{\\mu}$ の同時信頼領域は、$p$ 次元楕円体として表されます：

$$\\left\\{\\boldsymbol{\\mu} : n(\\bar{\\mathbf{x}} - \\boldsymbol{\\mu})^\\top \\mathbf{S}^{-1} (\\bar{\\mathbf{x}} - \\boldsymbol{\\mu}) \\leq \\frac{p(n-1)}{n-p} F_\\alpha(p, n-p)\\right\\}$$

この楕円体は $\\bar{\\mathbf{x}}$ を中心とし、$\\mathbf{S}$ の固有値・固有ベクトルにより軸の方向と長さが決まります。

**1変量t検定との関係（$p=1$ のとき）**
$p=1$ の場合、$T^2 = t^2$ となります。すなわち：

$$T^2 = \\frac{n(\\bar{x} - \\mu_0)^2}{s^2} = t^2$$

このとき $F = T^2 \\cdot \\frac{n-1}{n-1} = t^2$ であり、$F(1, n-1)$ 分布は自由度 $n-1$ のt分布の二乗に一致します。したがって、ホテリングの $T^2$ 検定は1変量t検定の自然な多変量拡張です。`
    },
    {
      title: '演習問題',
      content: `**問題1**：$(X_1, X_2)^\\top \\sim N_2\\left(\\mathbf{0}, \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}\\right)$ のとき、$X_2 = 1$ が与えられたときの $X_1$ の条件付き分布を求めてください。

**問題2**：$\\mathbf{X} = (X_1, X_2, X_3)^\\top \\sim N_3(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$ において、$\\boldsymbol{\\mu} = (0, 0, 0)^\\top$, $\\boldsymbol{\\Sigma} = \\mathbf{I}_3$ のとき、$P(D^2 \\leq 3.84)$ を求めてください。ここで $D^2$ は原点からのマハラノビス距離の二乗です。

**問題3**：線形変換 $Y_1 = X_1 + X_2$, $Y_2 = X_1 - X_2$ を考えます。$(X_1, X_2)^\\top \\sim N_2(\\mathbf{0}, \\mathbf{I}_2)$ のとき、$(Y_1, Y_2)^\\top$ の分布を求めてください。

**問題4**：多変量正規分布において無相関と独立が同値であることを説明し、実例を示してください。

【例題】多変量正規分布の条件付き分布の平均と分散を求めよ
$(X_1, X_2)^\\top$ が以下の2変量正規分布に従うとする。

$$\\boldsymbol{\\mu} = \\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix}, \\quad \\boldsymbol{\\Sigma} = \\begin{pmatrix} 4 & 2 \\\\ 2 & 3 \\end{pmatrix}$$

$X_2 = 2$ が与えられたときの $X_1$ の条件付き分布を求めよ。

【解答】
条件付き平均：

$$E[X_1 | X_2 = 2] = \\mu_1 + \\Sigma_{12}\\Sigma_{22}^{-1}(x_2 - \\mu_2) = 3 + \\frac{2}{3}(2 - 1) = 3 + \\frac{2}{3} = \\frac{11}{3} \\approx 3.667$$

条件付き分散：

$$\\text{Var}(X_1 | X_2 = 2) = \\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21} = 4 - \\frac{2 \\cdot 2}{3} = 4 - \\frac{4}{3} = \\frac{8}{3} \\approx 2.667$$

したがって：

$$X_1 | X_2 = 2 \\sim N\\left(\\frac{11}{3}, \\; \\frac{8}{3}\\right)$$
【/解答】

【例題】マハラノビス距離を計算し外れ値を判定せよ
2変量正規分布 $N_2(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$ で $\\boldsymbol{\\mu} = (5, 10)^\\top$、$\\boldsymbol{\\Sigma} = \\begin{pmatrix} 4 & 1 \\\\ 1 & 9 \\end{pmatrix}$ のとき、データ点 $\\mathbf{x} = (10, 15)^\\top$ が外れ値かどうかを有意水準 $\\alpha = 0.05$ で判定せよ。

【解答】
まず逆行列を計算する。$|\\boldsymbol{\\Sigma}| = 4 \\times 9 - 1 \\times 1 = 35$ より：

$$\\boldsymbol{\\Sigma}^{-1} = \\frac{1}{35}\\begin{pmatrix} 9 & -1 \\\\ -1 & 4 \\end{pmatrix}$$

$\\mathbf{x} - \\boldsymbol{\\mu} = (5, 5)^\\top$ より：

$$D^2 = (5, 5) \\cdot \\frac{1}{35}\\begin{pmatrix} 9 & -1 \\\\ -1 & 4 \\end{pmatrix} \\begin{pmatrix} 5 \\\\ 5 \\end{pmatrix} = \\frac{1}{35}(5, 5)\\begin{pmatrix} 40 \\\\ 15 \\end{pmatrix} = \\frac{200 + 75}{35} = \\frac{275}{35} \\approx 7.857$$

$\\chi^2_{0.95}(2) = 5.991$ であるから、$D^2 = 7.857 > 5.991$ より、有意水準 $5\\%$ でこのデータ点は外れ値と判定される。
【/解答】

【例題】ホテリングの $T^2$ 検定を実行せよ
ある2変量データ（$p=2$）について $n=25$ の標本から以下が得られた。

$$\\bar{\\mathbf{x}} = \\begin{pmatrix} 52 \\\\ 48 \\end{pmatrix}, \\quad \\mathbf{S} = \\begin{pmatrix} 16 & 4 \\\\ 4 & 9 \\end{pmatrix}$$

帰無仮説 $H_0: \\boldsymbol{\\mu} = (50, 50)^\\top$ を有意水準 $\\alpha = 0.05$ で検定せよ。

【解答】
$\\mathbf{S}^{-1}$ を計算する。$|\\mathbf{S}| = 16 \\times 9 - 16 = 128$ より：

$$\\mathbf{S}^{-1} = \\frac{1}{128}\\begin{pmatrix} 9 & -4 \\\\ -4 & 16 \\end{pmatrix}$$

$\\bar{\\mathbf{x}} - \\boldsymbol{\\mu}_0 = (2, -2)^\\top$ より：

$$T^2 = 25 \\cdot (2, -2) \\cdot \\frac{1}{128}\\begin{pmatrix} 9 & -4 \\\\ -4 & 16 \\end{pmatrix}\\begin{pmatrix} 2 \\\\ -2 \\end{pmatrix}$$

$$= 25 \\cdot \\frac{1}{128}(2, -2)\\begin{pmatrix} 26 \\\\ -40 \\end{pmatrix} = 25 \\cdot \\frac{52 + 80}{128} = 25 \\cdot \\frac{132}{128} = 25 \\cdot 1.03125 = 25.78$$

F統計量に変換：

$$F = \\frac{T^2(n-p)}{p(n-1)} = \\frac{25.78 \\times 23}{2 \\times 24} = \\frac{592.94}{48} \\approx 12.35$$

$F_{0.05}(2, 23) \\approx 3.42$ であるから、$F = 12.35 > 3.42$ より、$H_0$ を棄却する。平均ベクトルは $(50, 50)^\\top$ と有意に異なる。
【/解答】

【例題】多変量正規分布の周辺分布を導出せよ。
3変量正規分布 $\\mathbf{X} = (X_1, X_2, X_3)^\\top \\sim N_3(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$ で、

$$\\boldsymbol{\\mu} = \\begin{pmatrix} 1 \\\\ 3 \\\\ 5 \\end{pmatrix}, \\quad \\boldsymbol{\\Sigma} = \\begin{pmatrix} 4 & 2 & 1 \\\\ 2 & 9 & 3 \\\\ 1 & 3 & 16 \\end{pmatrix}$$

のとき、$(X_1, X_3)^\\top$ の周辺分布を求めよ。

【解答】
多変量正規分布の任意の部分ベクトルの周辺分布も正規分布に従う。$(X_1, X_3)^\\top$ を取り出すには、対応する平均の成分と共分散行列の該当行・列を抽出すればよい。

インデックス $\\{1, 3\\}$ に対応する平均ベクトル：

$$\\boldsymbol{\\mu}_{(1,3)} = \\begin{pmatrix} \\mu_1 \\\\ \\mu_3 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 5 \\end{pmatrix}$$

共分散行列の $(1,1), (1,3), (3,1), (3,3)$ 成分を抽出：

$$\\boldsymbol{\\Sigma}_{(1,3)} = \\begin{pmatrix} \\Sigma_{11} & \\Sigma_{13} \\\\ \\Sigma_{31} & \\Sigma_{33} \\end{pmatrix} = \\begin{pmatrix} 4 & 1 \\\\ 1 & 16 \\end{pmatrix}$$

したがって：

$$(X_1, X_3)^\\top \\sim N_2\\left(\\begin{pmatrix} 1 \\\\ 5 \\end{pmatrix}, \\begin{pmatrix} 4 & 1 \\\\ 1 & 16 \\end{pmatrix}\\right)$$

相関係数は $\\rho_{13} = \\frac{1}{\\sqrt{4 \\times 16}} = \\frac{1}{8} = 0.125$ であり、$X_1$ と $X_3$ の線形関係は弱い。なお、$X_2$ を除去しても周辺分布の形は変わらず、$X_2$ の情報は不要である。
【/解答】

【例題】条件付き分布の期待値と分散を3変量正規分布で計算せよ。
$\\mathbf{X} = (X_1, X_2, X_3)^\\top \\sim N_3(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$ で、

$$\\boldsymbol{\\mu} = \\begin{pmatrix} 0 \\\\ 0 \\\\ 0 \\end{pmatrix}, \\quad \\boldsymbol{\\Sigma} = \\begin{pmatrix} 1 & 0.5 & 0.3 \\\\ 0.5 & 1 & 0.4 \\\\ 0.3 & 0.4 & 1 \\end{pmatrix}$$

$(X_2, X_3) = (1, 2)$ が与えられたときの $X_1$ の条件付き分布を求めよ。

【解答】
$\\mathbf{X}_1 = X_1$, $\\mathbf{X}_2 = (X_2, X_3)^\\top$ と分割する。条件付き分布の公式より：

$$E[X_1 | \\mathbf{X}_2 = \\mathbf{x}_2] = \\mu_1 + \\boldsymbol{\\Sigma}_{12}\\boldsymbol{\\Sigma}_{22}^{-1}(\\mathbf{x}_2 - \\boldsymbol{\\mu}_2)$$

$$\\text{Var}(X_1 | \\mathbf{X}_2) = \\Sigma_{11} - \\boldsymbol{\\Sigma}_{12}\\boldsymbol{\\Sigma}_{22}^{-1}\\boldsymbol{\\Sigma}_{21}$$

各成分を特定する：

$$\\boldsymbol{\\Sigma}_{12} = (0.5, 0.3), \\quad \\boldsymbol{\\Sigma}_{22} = \\begin{pmatrix} 1 & 0.4 \\\\ 0.4 & 1 \\end{pmatrix}$$

$\\boldsymbol{\\Sigma}_{22}^{-1}$ を計算する。$|\\boldsymbol{\\Sigma}_{22}| = 1 - 0.16 = 0.84$ より：

$$\\boldsymbol{\\Sigma}_{22}^{-1} = \\frac{1}{0.84}\\begin{pmatrix} 1 & -0.4 \\\\ -0.4 & 1 \\end{pmatrix} = \\begin{pmatrix} 1.190 & -0.476 \\\\ -0.476 & 1.190 \\end{pmatrix}$$

条件付き期待値（$\\mathbf{x}_2 = (1, 2)^\\top$, $\\boldsymbol{\\mu}_2 = \\mathbf{0}$）：

$$\\boldsymbol{\\Sigma}_{12}\\boldsymbol{\\Sigma}_{22}^{-1} = (0.5, 0.3)\\begin{pmatrix} 1.190 & -0.476 \\\\ -0.476 & 1.190 \\end{pmatrix} = (0.452, 0.119)$$

$$E[X_1 | X_2=1, X_3=2] = 0 + (0.452, 0.119)\\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix} = 0.452 + 0.238 = 0.690$$

条件付き分散：

$$\\text{Var}(X_1 | \\mathbf{X}_2) = 1 - (0.452, 0.119)\\begin{pmatrix} 0.5 \\\\ 0.3 \\end{pmatrix} = 1 - (0.226 + 0.036) = 0.738$$

したがって $X_1 | (X_2=1, X_3=2) \\sim N(0.690, 0.738)$ である。
【/解答】

【例題】マハラノビス距離を用いて複数のデータ点から外れ値を検出せよ。
3変量正規分布 $N_3(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$ で $\\boldsymbol{\\mu} = (10, 20, 30)^\\top$, $\\boldsymbol{\\Sigma} = \\mathbf{I}_3$（単位行列）のとき、以下の3つのデータ点のマハラノビス距離を計算し、有意水準 $\\alpha = 0.05$ で外れ値を判定せよ。

(a) $\\mathbf{x}_1 = (11, 21, 31)^\\top$
(b) $\\mathbf{x}_2 = (12, 22, 33)^\\top$
(c) $\\mathbf{x}_3 = (13, 23, 34)^\\top$

【解答】
$\\boldsymbol{\\Sigma} = \\mathbf{I}_3$ のとき $\\boldsymbol{\\Sigma}^{-1} = \\mathbf{I}_3$ なので、マハラノビス距離はユークリッド距離に一致する。

$$D^2 = (\\mathbf{x} - \\boldsymbol{\\mu})^\\top(\\mathbf{x} - \\boldsymbol{\\mu}) = \\sum_{j=1}^3 (x_j - \\mu_j)^2$$

(a) $\\mathbf{x}_1 - \\boldsymbol{\\mu} = (1, 1, 1)^\\top$：$D_1^2 = 1 + 1 + 1 = 3$

(b) $\\mathbf{x}_2 - \\boldsymbol{\\mu} = (2, 2, 3)^\\top$：$D_2^2 = 4 + 4 + 9 = 17$

(c) $\\mathbf{x}_3 - \\boldsymbol{\\mu} = (3, 3, 4)^\\top$：$D_3^2 = 9 + 9 + 16 = 34$

$D^2 \\sim \\chi^2(3)$ であり、$\\chi^2_{0.95}(3) = 7.815$ と比較する。

- (a) $D_1^2 = 3 < 7.815$：外れ値ではない
- (b) $D_2^2 = 17 > 7.815$：外れ値と判定
- (c) $D_3^2 = 34 > 7.815$：外れ値と判定

データ点 (b) と (c) が有意水準5%で外れ値と判定される。特に (c) はカイ二乗分布の $p$ 値が極めて小さく、強い外れ値である。
【/解答】

【例題】ホテリングの $T^2$ 検定を2標本問題で実行せよ。
2変量データ（$p=2$）の2群について、以下の統計量が得られた。$n_1 = 20$, $n_2 = 15$。

$$\\bar{\\mathbf{x}}_1 = \\begin{pmatrix} 10 \\\\ 15 \\end{pmatrix}, \\quad \\bar{\\mathbf{x}}_2 = \\begin{pmatrix} 12 \\\\ 18 \\end{pmatrix}, \\quad \\mathbf{S}_p = \\begin{pmatrix} 4 & 1 \\\\ 1 & 9 \\end{pmatrix}$$

帰無仮説 $H_0: \\boldsymbol{\\mu}_1 = \\boldsymbol{\\mu}_2$ を有意水準 $\\alpha = 0.05$ で検定せよ。

【解答】
2標本ホテリングの $T^2$ 統計量は：

$$T^2 = \\frac{n_1 n_2}{n_1 + n_2}(\\bar{\\mathbf{x}}_1 - \\bar{\\mathbf{x}}_2)^\\top \\mathbf{S}_p^{-1}(\\bar{\\mathbf{x}}_1 - \\bar{\\mathbf{x}}_2)$$

$\\bar{\\mathbf{x}}_1 - \\bar{\\mathbf{x}}_2 = (-2, -3)^\\top$、$\\frac{n_1 n_2}{n_1 + n_2} = \\frac{20 \\times 15}{35} = \\frac{300}{35} \\approx 8.571$ を計算する。

$\\mathbf{S}_p^{-1}$ を求める。$|\\mathbf{S}_p| = 36 - 1 = 35$ より：

$$\\mathbf{S}_p^{-1} = \\frac{1}{35}\\begin{pmatrix} 9 & -1 \\\\ -1 & 4 \\end{pmatrix}$$

二次形式を計算する：

$$(-2, -3)\\frac{1}{35}\\begin{pmatrix} 9 & -1 \\\\ -1 & 4 \\end{pmatrix}\\begin{pmatrix} -2 \\\\ -3 \\end{pmatrix} = \\frac{1}{35}(-2, -3)\\begin{pmatrix} -15 \\\\ -10 \\end{pmatrix} = \\frac{30 + 30}{35} = \\frac{60}{35} = 1.714$$

$$T^2 = 8.571 \\times 1.714 = 14.69$$

F統計量に変換する：

$$F = \\frac{T^2(n_1 + n_2 - p - 1)}{p(n_1 + n_2 - 2)} = \\frac{14.69 \\times 32}{2 \\times 33} = \\frac{470.1}{66} \\approx 7.12$$

$F_{0.05}(2, 32) \\approx 3.30$ であるから、$F = 7.12 > 3.30$ より $H_0$ を棄却する。2群の平均ベクトルは有意に異なる。
【/解答】

【例題】ウィシャート分布と標本共分散行列の性質を確認せよ。
$\\mathbf{X}_1, \\ldots, \\mathbf{X}_n$ が $N_p(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$ から独立に抽出されたとき、標本共分散行列 $\\mathbf{S} = \\frac{1}{n-1}\\sum_{i=1}^n (\\mathbf{X}_i - \\bar{\\mathbf{X}})(\\mathbf{X}_i - \\bar{\\mathbf{X}})^\\top$ について、$(n-1)\\mathbf{S}$ の分布を述べよ。また $p = 2$, $n = 10$, $\\boldsymbol{\\Sigma} = \\begin{pmatrix} 4 & 2 \\\\ 2 & 9 \\end{pmatrix}$ のとき、$E[(n-1)S_{11}]$ と $\\text{Var}((n-1)S_{11})$ を求めよ。

【解答】
$(n-1)\\mathbf{S}$ はウィシャート分布に従う：

$$(n-1)\\mathbf{S} \\sim W_p(n-1, \\boldsymbol{\\Sigma})$$

ここで $W_p(m, \\boldsymbol{\\Sigma})$ は自由度 $m$、スケール行列 $\\boldsymbol{\\Sigma}$ の $p$ 次元ウィシャート分布である。

ウィシャート分布の性質より、$\\mathbf{W} \\sim W_p(m, \\boldsymbol{\\Sigma})$ のとき：

$$E[W_{ij}] = m \\Sigma_{ij}$$

$$\\text{Var}(W_{ij}) = m(\\Sigma_{ij}^2 + \\Sigma_{ii}\\Sigma_{jj})$$

$p = 2$, $n = 10$（自由度 $m = 9$）, $\\Sigma_{11} = 4$ のとき：

$$E[(n-1)S_{11}] = m \\Sigma_{11} = 9 \\times 4 = 36$$

$$\\text{Var}((n-1)S_{11}) = m(\\Sigma_{11}^2 + \\Sigma_{11}^2) = 9(16 + 16) = 9 \\times 32 = 288$$

これは $(n-1)S_{11}/\\Sigma_{11} \\sim \\chi^2(n-1)$ と整合する。実際 $(n-1)S_{11}/4 \\sim \\chi^2(9)$ であり、$E[\\chi^2(9)] = 9$, $\\text{Var}(\\chi^2(9)) = 18$ なので、$E[(n-1)S_{11}] = 4 \\times 9 = 36$, $\\text{Var}((n-1)S_{11}) = 16 \\times 18 = 288$ と一致する。
【/解答】

【例題】多変量正規分布の尤度比検定を実行せよ。
2変量正規分布 $N_2(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$ から $n = 30$ の標本が得られた。帰無仮説 $H_0: \\boldsymbol{\\mu} = \\mathbf{0}$ かつ $\\boldsymbol{\\Sigma} = \\mathbf{I}_2$（完全に指定された分布）を検定する。標本から以下が計算された。

$$\\bar{\\mathbf{x}} = \\begin{pmatrix} 0.3 \\\\ -0.2 \\end{pmatrix}, \\quad \\mathbf{S} = \\begin{pmatrix} 1.2 & 0.3 \\\\ 0.3 & 0.9 \\end{pmatrix}$$

尤度比検定統計量 $-2\\log\\Lambda$ を計算し、有意水準 $\\alpha = 0.05$ で検定せよ。

【解答】
帰無仮説 $H_0: \\boldsymbol{\\mu} = \\boldsymbol{\\mu}_0, \\boldsymbol{\\Sigma} = \\boldsymbol{\\Sigma}_0$ に対する尤度比統計量は：

$$-2\\log\\Lambda = n\\left[\\text{tr}(\\boldsymbol{\\Sigma}_0^{-1}\\mathbf{S}) + (\\bar{\\mathbf{x}} - \\boldsymbol{\\mu}_0)^\\top\\boldsymbol{\\Sigma}_0^{-1}(\\bar{\\mathbf{x}} - \\boldsymbol{\\mu}_0) - p - \\log|\\boldsymbol{\\Sigma}_0^{-1}\\mathbf{S}|\\right]$$

$\\boldsymbol{\\Sigma}_0 = \\mathbf{I}_2$, $\\boldsymbol{\\mu}_0 = \\mathbf{0}$ のとき：

$$\\text{tr}(\\mathbf{S}) = 1.2 + 0.9 = 2.1$$

$$\\bar{\\mathbf{x}}^\\top\\bar{\\mathbf{x}} = 0.3^2 + (-0.2)^2 = 0.09 + 0.04 = 0.13$$

$$|\\mathbf{S}| = 1.2 \\times 0.9 - 0.3^2 = 1.08 - 0.09 = 0.99$$

$$\\log|\\mathbf{S}| = \\log(0.99) \\approx -0.01005$$

$$-2\\log\\Lambda = 30\\left[2.1 + 0.13 - 2 - (-0.01005)\\right] = 30 \\times 0.24005 = 7.20$$

帰無仮説のもとで $-2\\log\\Lambda$ は漸近的に $\\chi^2(p + p(p+1)/2) = \\chi^2(2 + 3) = \\chi^2(5)$ に従う（平均ベクトルのパラメータ2個と共分散行列のパラメータ3個）。

$\\chi^2_{0.05}(5) = 11.07$ であるから、$-2\\log\\Lambda = 7.20 < 11.07$ より帰無仮説を棄却できない。データは $N_2(\\mathbf{0}, \\mathbf{I}_2)$ と矛盾しない。
【/解答】

【例題】共分散行列の等値検定（ボックスのM検定）を実施せよ。
3群（$g = 1, 2, 3$）の2変量データから各群の標本共分散行列が以下のとおり得られた。標本サイズは $n_1 = 20$, $n_2 = 25$, $n_3 = 15$ である。

$$\\mathbf{S}_1 = \\begin{pmatrix} 4 & 1 \\\\ 1 & 3 \\end{pmatrix}, \\quad \\mathbf{S}_2 = \\begin{pmatrix} 5 & 2 \\\\ 2 & 4 \\end{pmatrix}, \\quad \\mathbf{S}_3 = \\begin{pmatrix} 3 & 0.5 \\\\ 0.5 & 2 \\end{pmatrix}$$

帰無仮説 $H_0: \\boldsymbol{\\Sigma}_1 = \\boldsymbol{\\Sigma}_2 = \\boldsymbol{\\Sigma}_3$ を有意水準 $\\alpha = 0.05$ で検定せよ。

【解答】
ボックスのM検定を用いる。まずプール共分散行列を計算する。$\\nu_g = n_g - 1$ として $\\nu_1 = 19$, $\\nu_2 = 24$, $\\nu_3 = 14$, $\\nu = \\nu_1 + \\nu_2 + \\nu_3 = 57$ である。

$$\\mathbf{S}_p = \\frac{1}{\\nu}\\sum_{g=1}^3 \\nu_g \\mathbf{S}_g = \\frac{1}{57}\\left(19\\mathbf{S}_1 + 24\\mathbf{S}_2 + 14\\mathbf{S}_3\\right)$$

$$= \\frac{1}{57}\\left(\\begin{pmatrix} 76 & 19 \\\\ 19 & 57 \\end{pmatrix} + \\begin{pmatrix} 120 & 48 \\\\ 48 & 96 \\end{pmatrix} + \\begin{pmatrix} 42 & 7 \\\\ 7 & 28 \\end{pmatrix}\\right) = \\frac{1}{57}\\begin{pmatrix} 238 & 74 \\\\ 74 & 181 \\end{pmatrix} = \\begin{pmatrix} 4.175 & 1.298 \\\\ 1.298 & 3.175 \\end{pmatrix}$$

ボックスのM統計量：

$$M = \\nu \\log|\\mathbf{S}_p| - \\sum_{g=1}^3 \\nu_g \\log|\\mathbf{S}_g|$$

各行列式を計算する：
$|\\mathbf{S}_1| = 12 - 1 = 11$, $|\\mathbf{S}_2| = 20 - 4 = 16$, $|\\mathbf{S}_3| = 6 - 0.25 = 5.75$
$|\\mathbf{S}_p| = 4.175 \\times 3.175 - 1.298^2 = 13.256 - 1.685 = 11.571$

$$M = 57\\log 11.571 - (19\\log 11 + 24\\log 16 + 14\\log 5.75)$$

$$= 57(2.448) - (19(2.398) + 24(2.773) + 14(1.749))$$

$$= 139.54 - (45.56 + 66.55 + 24.49) = 139.54 - 136.60 = 2.94$$

補正係数 $C$ を計算する：

$$C = 1 - \\frac{2p^2 + 3p - 1}{6(p+1)(k-1)}\\left(\\sum_{g=1}^3 \\frac{1}{\\nu_g} - \\frac{1}{\\nu}\\right)$$

$p = 2$, $k = 3$ より：

$$C = 1 - \\frac{8 + 6 - 1}{6 \\times 3 \\times 2}\\left(\\frac{1}{19} + \\frac{1}{24} + \\frac{1}{14} - \\frac{1}{57}\\right) = 1 - \\frac{13}{36}(0.0526 + 0.0417 + 0.0714 - 0.0175)$$

$$= 1 - 0.361 \\times 0.1482 = 1 - 0.0535 = 0.9465$$

修正統計量 $M^* = CM = 0.9465 \\times 2.94 \\approx 2.78$ は自由度 $\\frac{p(p+1)(k-1)}{2} = \\frac{2 \\times 3 \\times 2}{2} = 6$ のカイ二乗分布に近似的に従う。

$\\chi^2_{0.05}(6) = 12.59$ であるから、$M^* = 2.78 < 12.59$ より帰無仮説を棄却できない。3群の共分散行列は等しいと判断でき、LDA（等分散仮定）の適用が妥当である。
【/解答】`
    }
  ]
};
