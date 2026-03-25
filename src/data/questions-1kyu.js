// 1級の統計学問題データ
// 10問：測度論と漸近理論に関する高度な問題

export const questions1kyu = [
  // Measure theory - 5問
  {
    id: 201,
    topic: "measure_theory",
    type: "choice",
    question: "測度空間（Ω, F, P）においてσ-加法族Fの定義として正しいものはどれか？",
    options: [
      "有限個の集合の和で閉じている",
      "可算無限個の集合の和と補集合で閉じている",
      "共通部分で閉じている",
      "すべての部分集合を含む"
    ],
    correctIndex: 1,
    explanation: "σ-加法族Fの定義：①∅ ∈ F、②A ∈ F ⇒ Aᶜ ∈ F、③{Aₙ}∈F（可算）⇒ ∪Aₙ ∈ F。可算無限個の和と補集合で閉じた最小族で、測度論の基礎です。"
  },
  {
    id: 202,
    topic: "measure_theory",
    type: "choice",
    question: "可測関数f：Ω→ℝの定義として正しいものはどれか？",
    options: [
      "すべての x∈ℝ に対して {ω：f(ω)=x} ∈ F",
      "すべての a∈ℝ に対して {ω：f(ω) ≤ a} ∈ F",
      "すべての開区間 (a,b) に対して f⁻¹((a,b)) ∈ F",
      "f が連続である"
    ],
    correctIndex: 1,
    explanation: "可測関数の定義：すべての a∈ℝ に対して f⁻¹((-∞, a]) = {ω：f(ω) ≤ a} が可測集合（∈F）であること。連続関数は可測ですが、可測関数は連続とは限りません。"
  },
  {
    id: 203,
    topic: "measure_theory",
    type: "choice",
    question: "ルベーグ積分∫f dμ が存在するための必要十分条件はどれか？",
    options: [
      "f が有界である",
      "f が連続である",
      "f が可測で ∫|f| dμ < ∞",
      "f が単調増加である"
    ],
    correctIndex: 2,
    explanation: "ルベーグ積分が存在するには、f が可測関数であり、かつ ∫|f| dμ < ∞（絶対可積分）である必要があります。これにより、積分値の存在と一意性が保証されます。"
  },
  {
    id: 204,
    topic: "measure_theory",
    type: "written",
    question: "優関数定理（Dominated Convergence Theorem）を述べ、その統計的意義を説明せよ。",
    sampleAnswer: "fₙ→f a.e.かつ |fₙ|≤g a.e.（gはμ-可積分）ならば、lim ∫fₙ dμ = ∫f dμ。これにより、極限と積分の順序交換が保証され、推定量の漸近性質の導出が可能になる。",
    keywords: ["極限", "積分順序交換", "推定量", "漸近性質"],
    explanation: "優関数定理は解析学の重要な定理で、統計学では極限と期待値の交換を正当化します。確率変数列の期待値の極限値が、極限確率変数の期待値に等しいことを保証します。推定量の漸近分布の導出に不可欠です。"
  },
  {
    id: 205,
    topic: "measure_theory",
    type: "written",
    question: "測度論的確率論において、独立性と条件付き期待値の関係を説明せよ。",
    sampleAnswer: "イベントAとBが独立 ⇔ P(A∩B) = P(A)P(B)。σ-加法族の観点では、σ(A)とσ(B)が独立 ⇔ すべてのA'∈σ(A), B'∈σ(B)に対してP(A'∩B')=P(A')P(B')。条件付き期待値E[X|G]は G に関する可測な最良予測子。",
    keywords: ["独立性", "σ-加法族", "条件付き期待値", "可測性"],
    explanation: "測度論的確率論では、独立性はσ-加法族の独立として定式化され、条件付き期待値 E[X|G] は G に関して可測で、∫_G E[X|G] dP = ∫_G X dP を満たす一意な関数です。これは射影定理と関連し、関数空間内の直交分解を意味します。"
  },

  // Asymptotic theory - 5問
  {
    id: 206,
    topic: "asymptotic",
    type: "choice",
    question: "確率変数列 Xₙ が X に確率収束する（Xₙ →ᵖ X）の定義として正しいものはどれか？",
    options: [
      "すべての ε > 0 に対して lim P(|Xₙ - X| > ε) = 0",
      "すべての ε > 0 に対して P(|Xₙ - X| > ε) = 0",
      "E[|Xₙ - X|] = 0",
      "Xₙ(ω) → X(ω) for all ω"
    ],
    correctIndex: 0,
    explanation: "確率収束：∀ε > 0, lim_{n→∞} P(|Xₙ - X| > ε) = 0。これは大数の法則が成り立つための収束概念です。分布収束より強く、ほぼ確実な収束より弱い収束です。"
  },
  {
    id: 207,
    topic: "asymptotic",
    type: "choice",
    question: "確率変数列 Xₙ が X に分布収束する（Xₙ →ᵈ X）と Xₙ →ᵖ X の関係として正しいものはどれか？",
    options: [
      "Xₙ →ᵖ X ⇒ Xₙ →ᵈ X",
      "Xₙ →ᵈ X ⇒ Xₙ →ᵖ X",
      "両者は同値である",
      "前者と後者は関連性がない"
    ],
    correctIndex: 0,
    explanation: "確率収束は分布収束を含意します：Xₙ →ᵖ X ⇒ Xₙ →ᵈ X。逆は成立しません。分布収束は最も弱い収束で、経験分布関数と真の分布関数の収束に利用されます。"
  },
  {
    id: 208,
    topic: "asymptotic",
    type: "choice",
    question: "中心極限定理（Central Limit Theorem）の標準的な形式はどれか？",
    options: [
      "√n(X̄ₙ - μ) →ᵖ 0",
      "√n(X̄ₙ - μ)/σ →ᵈ N(0,1)",
      "(X̄ₙ - μ) →ᵈ N(0,1)",
      "nX̄ₙ →ᵈ N(nμ, nσ²)"
    ],
    correctIndex: 1,
    explanation: "リンデベルク・レヴィの中心極限定理：iid確率変数 X₁,...,Xₙ で E[Xᵢ]=μ, V[Xᵢ]=σ² のとき、√n(X̄ₙ - μ)/σ →ᵈ N(0,1)。漸近正規性の基本定理で、統計推測の基盤です。"
  },
  {
    id: 209,
    topic: "asymptotic",
    type: "written",
    question: "デルタ方法（Delta Method）の内容を述べ、非線形推定量の漸近分布導出への応用を説明せよ。",
    sampleAnswer: "g(X̄ₙ)で、√n(X̄ₙ - μ) →ᵈ N(0,σ²)なら、√n(g(X̄ₙ) - g(μ)) →ᵈ N(0, σ²(g'(μ))²)。テイラー展開により、非線形関数g(X̄ₙ)の漸近正規性が導かれる。",
    keywords: ["テイラー展開", "非線形関数", "漸近正規性", "導関数"],
    explanation: "デルタ方法は、滑らかな関数g(·)に対して、g(X̄ₙ)の漸近分布を g'(μ) を利用して導きます。例えば、分散の最大尤度推定量σ̂²の漸近分布は、この方法で計算できます。信頼区間や検定統計量の構築に不可欠です。"
  },
  {
    id: 210,
    topic: "asymptotic",
    type: "written",
    question: "最大尤度推定量の漸近性質をまとめよ。フィッシャー情報行列との関係も述べよ。",
    sampleAnswer: "iid確率変数の最尤推定量θ̂ₙは、一致性：θ̂ₙ →ᵖ θ₀、漸近正規性：√n(θ̂ₙ - θ₀) →ᵈ N(0, I(θ₀)⁻¹)を満たす。I(θ₀)はフィッシャー情報行列で、漸近分散の下限となる。",
    keywords: ["一致性", "漸近正規性", "フィッシャー情報", "漸近分散"],
    explanation: "最尤推定量の漸近性質は統計推測の基礎です。Iₙ(θ₀)⁻¹がクラメール・ラオ下限となり、不偏推定量の分散の下限です。また、最尤推定量の漸近効率性（asymptotic efficiency）により、大標本での最適性が保証されます。推定量の比較や信頼区間構築に利用されます。"
  }
];
