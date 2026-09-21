import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { Robot, Sparkle, Check } from "@phosphor-icons/react";
import { merchants, type RiskTier, type Merchant } from "../data/merchants";
import { MerchantCard } from "../components/MerchantCard";

const CATEGORIES = ["特色餐飲", "選物店", "生活品牌"];

const riskOptions: { value: RiskTier; label: string; desc: string }[] = [
  { value: "low", label: "穩健優先", desc: "偏好營收穩定、波動小的商家" },
  { value: "medium", label: "均衡成長", desc: "可接受成長期商家的營收波動" },
  { value: "elevated", label: "積極型", desc: "願意承擔較高波動，換取更高潛力" },
];

type ReturnPref = "steady" | "balanced" | "growth";

const returnOptions: { value: ReturnPref; label: string; desc: string; min: number; max: number }[] = [
  { value: "steady", label: "穩定優先", desc: "期望年化 8–11%", min: 0, max: 11 },
  { value: "balanced", label: "均衡成長", desc: "期望年化 11–15%", min: 10, max: 15 },
  { value: "growth", label: "積極追求", desc: "期望年化 15% 以上", min: 14, max: 100 },
];

interface Recommendation {
  merchant: Merchant;
  score: number;
  reasons: string[];
}

function buildRecommendations(
  riskPref: RiskTier | null,
  returnPref: ReturnPref | null,
  categoryPrefs: string[],
): Recommendation[] {
  const returnTier = returnOptions.find((r) => r.value === returnPref);

  return merchants
    .map((merchant) => {
      const reasons: string[] = [];
      let score = merchant.rrs / 100; // 以可靠度做最終排序的 tie-breaker

      if (riskPref && merchant.riskTier === riskPref) {
        score += 2;
        reasons.push("符合你的風險偏好");
      }
      if (categoryPrefs.length > 0 && categoryPrefs.includes(merchant.category)) {
        score += 2;
        reasons.push(`商家性質：${merchant.category}`);
      }
      if (returnTier) {
        const [lo, hi] = merchant.financing.expectedAnnualReturn;
        const overlaps = hi >= returnTier.min && lo <= returnTier.max;
        if (overlaps) {
          score += 2;
          reasons.push(`預估年化 ${lo}–${hi}%，符合你的報酬期待`);
        }
      }

      return { merchant, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

export function AgentMatch() {
  const [riskPref, setRiskPref] = useState<RiskTier | null>(null);
  const [returnPref, setReturnPref] = useState<ReturnPref | null>(null);
  const [categoryPrefs, setCategoryPrefs] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleCategory = (c: string) => {
    setCategoryPrefs((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const recommendations = useMemo(
    () => buildRecommendations(riskPref, returnPref, categoryPrefs),
    [riskPref, returnPref, categoryPrefs],
  );

  const topPicks = recommendations.slice(0, 3);
  const rest = recommendations.slice(3);
  const hasAnyPref = riskPref !== null || returnPref !== null || categoryPrefs.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
          <Robot size={24} weight="duotone" />
        </div>
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">Agent 客製化推薦</h1>
          <p className="text-sm text-ink-secondary">回答風險、獲利、商家性質偏好，讓 Agent 主動幫你篩出符合的商家</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-hairline bg-surface p-6">
        {/* 風險偏好 */}
        <div>
          <p className="text-sm font-medium text-ink">風險偏好</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {riskOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRiskPref((prev) => (prev === opt.value ? null : opt.value))}
                className={clsx(
                  "flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-colors",
                  riskPref === opt.value
                    ? "border-accent-400 bg-accent-50"
                    : "border-hairline bg-plane hover:border-accent-300",
                )}
              >
                <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                  {riskPref === opt.value && <Check size={14} weight="bold" className="text-accent-700" />}
                  {opt.label}
                </span>
                <span className="text-xs text-ink-muted">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 獲利期望 */}
        <div>
          <p className="text-sm font-medium text-ink">獲利期望</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {returnOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setReturnPref((prev) => (prev === opt.value ? null : opt.value))}
                className={clsx(
                  "flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-colors",
                  returnPref === opt.value
                    ? "border-accent-400 bg-accent-50"
                    : "border-hairline bg-plane hover:border-accent-300",
                )}
              >
                <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                  {returnPref === opt.value && <Check size={14} weight="bold" className="text-accent-700" />}
                  {opt.label}
                </span>
                <span className="text-xs text-ink-muted">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 商家性質偏好 */}
        <div>
          <p className="text-sm font-medium text-ink">商家性質偏好</p>
          <p className="mt-0.5 text-xs text-ink-muted">不選代表不限商家性質</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  categoryPrefs.includes(c)
                    ? "bg-accent-600 text-white"
                    : "border border-hairline bg-plane text-ink-secondary hover:text-ink",
                )}
              >
                {categoryPrefs.includes(c) && <Check size={13} weight="bold" />}
                {c}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-accent-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-accent-900/10 transition-all hover:bg-accent-700 active:scale-[0.98]"
        >
          <Sparkle size={16} weight="fill" />
          取得 Agent 推薦
        </button>
      </div>

      {submitted && (
        <div className="mt-10">
          <div className="flex items-center gap-2">
            <Sparkle size={18} weight="duotone" className="text-accent-600" />
            <h2 className="text-lg font-medium text-ink">Agent 為你推薦</h2>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
            {hasAnyPref
              ? "依你的偏好排序，分數愈高代表愈符合條件。"
              : "你沒有設定任何偏好，以下依商家可靠度（RRS）排序。"}
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topPicks.map(({ merchant, reasons }, i) => (
              <div key={merchant.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-medium text-accent-700">
                    <Sparkle size={11} weight="fill" />
                    Agent 首選 #{i + 1}
                  </span>
                </div>
                <MerchantCard merchant={merchant} />
                {reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {reasons.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center rounded-full border border-hairline bg-plane px-2.5 py-1 text-xs text-ink-secondary"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {rest.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-medium text-ink-secondary">其他商家</p>
              <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map(({ merchant }) => (
                  <MerchantCard key={merchant.id} merchant={merchant} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link to="/marketplace" className="text-sm font-medium text-accent-700 hover:text-accent-800">
              不篩選，瀏覽全部商家 →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
